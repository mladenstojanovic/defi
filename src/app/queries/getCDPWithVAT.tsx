import { Contract, AbiFragment } from "web3";
import { utils } from "@defisaver/tokens";
import { CDP, CDPInfo } from "../types";
import { formatWad } from "../utils";

const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds
const CACHE_KEY = "cdp-cache-v1";

interface CacheEntry {
  d: CDP | null;
  e: number;
  n: boolean;
}

interface CacheStore {
  [key: string]: CacheEntry;
}

const getCache = (): CacheStore => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
};

const getCachedCDP = (id: number, collateralType: string): CDP | null => {
  const cache = getCache();
  const cacheKey = `${id}-${collateralType}`;
  const entry = cache[cacheKey];

  if (!entry) return null;

  if (Date.now() > entry.e) {
    delete cache[cacheKey];
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    return null;
  }

  if (entry.n) {
    return { id, success: false, collateral: "0", debt: "0" };
  }

  return entry.d;
};

const setCachedCDP = (
  id: number,
  collateralType: string,
  data: CDP,
  nonMatching = false
) => {
  const cache = getCache();
  const cacheKey = `${id}-${collateralType}`;

  if (Math.random() < 0.01) {
    const now = Date.now();
    Object.keys(cache).forEach((key) => {
      if (cache[key].e < now) {
        delete cache[key];
      }
    });
  }

  cache[cacheKey] = {
    d: nonMatching ? null : data,
    e: Date.now() + CACHE_EXPIRY,
    n: nonMatching,
  };

  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};

export const getCDPWithVAT = async (
  id: number,
  collateralType: string,
  vaultInfo: Contract<AbiFragment[]> | null,
  vat: Contract<AbiFragment[]> | null,
  maxRetries = 3
): Promise<CDP> => {
  const cached = getCachedCDP(id, collateralType);
  if (cached) return cached;

  if (!vaultInfo || !vat) {
    return { id, success: false, collateral: "0", debt: "0" };
  }

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const cdpInfo: CDPInfo = await vaultInfo.methods.getCdpInfo(id).call();

      const ilkString = utils.bytesToString(cdpInfo.ilk);

      if (ilkString !== `${collateralType.toUpperCase()}-A`) {
        setCachedCDP(
          id,
          collateralType,
          { id, success: false, collateral: "0", debt: "0" },
          true
        );
        return { id, success: false, collateral: "0", debt: "0" };
      }

      if (cdpInfo.owner === "0x0000000000000000000000000000000000000000") {
        setCachedCDP(
          id,
          collateralType,
          { id, success: false, collateral: "0", debt: "0" },
          true
        );
        return { id, success: false, collateral: "0", debt: "0" };
      }

      const ilkInfo: { rate: string } = await vat.methods
        .ilks(cdpInfo.ilk)
        .call();
      const actualDebt =
        (BigInt(cdpInfo.debt) * BigInt(ilkInfo.rate)) / BigInt(1e27);

      const result = {
        id,
        ilk: ilkString,
        success: true,
        collateral: formatWad(cdpInfo.collateral),
        debt: formatWad(actualDebt),
      };

      setCachedCDP(id, collateralType, result);
      return result;
    } catch (error) {
      if (attempt === maxRetries - 1) {
        console.error(`Final retry failed for CDP ${id}:`, error);
        return { id, success: false, collateral: "0", debt: "0" };
      }
      console.warn(`Retry ${attempt + 1}/${maxRetries} for CDP ${id}:`, error);
      await delay(Math.pow(2, attempt) * 1000);
    }
  }

  return { id, success: false, collateral: "0", debt: "0" };
};
