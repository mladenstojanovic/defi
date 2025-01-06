import { useCallback, useEffect, useMemo, useState } from "react";
import { Web3 } from "web3";
import { getCDPWithVAT } from "../queries";
import {
  VAT_ABI,
  VAT_ADDRESS,
  VAULT_INFO_ABI,
  VAULT_INFO_ADDRESS,
} from "../constants";
import { CDP } from "../types";

export const useQueryNearbyCDP = (
  web3: Web3 | null,
  searchTerm: string,
  collateralType: string,
  maxResults: number = 20,
  maxConcurrentQueries: number = 5
) => {
  const [matchingCdps, setMatchingCdps] = useState<CDP[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const vaultInfo = useMemo(
    () =>
      web3 ? new web3.eth.Contract(VAULT_INFO_ABI, VAULT_INFO_ADDRESS) : null,
    [web3]
  );

  const vat = useMemo(
    () => (web3 ? new web3.eth.Contract(VAT_ABI, VAT_ADDRESS) : null),
    [web3]
  );

  const queryNearbyCDP = useCallback(
    (id: number, collateralType: string) =>
      getCDPWithVAT(id, collateralType, vaultInfo, vat),
    [vaultInfo, vat]
  );

  useEffect(() => {
    if (!web3 || !searchTerm || !collateralType || !vaultInfo || !vat) return;

    const searchCDPs = async () => {
      setIsLoading(true);
      setProgress(0);
      setMatchingCdps([]);

      const targetId = parseInt(searchTerm);
      const results: CDP[] = [];
      let validResultsCount = 0;
      let offset = 0;

      const getNextId = () => {
        const id =
          offset === 0
            ? targetId
            : offset % 2 === 0
            ? targetId + offset / 2
            : targetId - (offset + 1) / 2;
        offset++;
        return id;
      };

      try {
        const activeQueries = new Set<Promise<CDP>>();

        while (validResultsCount < maxResults) {
          while (activeQueries.size < maxConcurrentQueries) {
            const id = getNextId();
            if (id < 0) {
              break;
            }
            const queryPromise = queryNearbyCDP(id, collateralType).then(
              (cdp) => {
                activeQueries.delete(queryPromise);
                if (cdp.success && validResultsCount < maxResults) {
                  validResultsCount++;
                  results.push(cdp);
                  setMatchingCdps(results);
                }
                setProgress((validResultsCount / maxResults) * 100);
                return cdp;
              }
            );
            activeQueries.add(queryPromise);
          }

          await Promise.race(Array.from(activeQueries));
        }

        const sortedResults = [...new Set(results)].sort(
          (a, b) => Math.abs(a.id - targetId) - Math.abs(b.id - targetId)
        );
        setMatchingCdps(sortedResults);
      } catch (error) {
        setError("Error processing queue");
        console.error("Error processing queue:", error);
      }

      setIsLoading(false);
    };

    searchCDPs();
  }, [
    web3,
    searchTerm,
    collateralType,
    maxResults,
    maxConcurrentQueries,
    vaultInfo,
    vat,
    queryNearbyCDP,
  ]);

  return { matchingCdps, isLoading, progress, error };
};
