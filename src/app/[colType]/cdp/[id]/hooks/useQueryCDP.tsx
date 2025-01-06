import { useCallback, useEffect, useMemo, useState } from "react";
import { Web3 } from "web3";
import { getCDPWithVAT } from "../../../../queries";
import {
  VAT_ABI,
  VAT_ADDRESS,
  VAULT_INFO_ABI,
  VAULT_INFO_ADDRESS,
} from "../../../../constants";
import { CDP } from "../../../../types";

export const useQueryCDP = (
  web3: Web3 | null,
  id: string,
  collateralType: string
) => {
  const [cdp, setCdp] = useState<CDP | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const queryCDP = useCallback(
    (id: number, collateralType: string) =>
      getCDPWithVAT(id, collateralType, vaultInfo, vat),
    [vaultInfo, vat]
  );

  useEffect(() => {
    if (!web3 || !id || !collateralType || !vaultInfo || !vat) return;

    const searchCDP = async () => {
      setIsLoading(true);

      const targetId = parseInt(id);

      const cdp = await queryCDP(targetId, collateralType);

      if (!cdp.success) {
        setError("Error fetching CDP");
      } else {
        setCdp(cdp);
      }

      setIsLoading(false);
    };

    searchCDP();
  }, [web3, id, collateralType, vaultInfo, vat, queryCDP]);

  return { cdp, isLoading, error };
};
