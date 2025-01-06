import { COL_TYPES, LIQUIDATION_RATIOS, PRICES } from "../constants";

export const getCollateralizationRatio = (
  collateral: string | number,
  debt: string | number,
  colType: string
): string => {
  const collateralizationRatio =
    (Number(collateral) * PRICES[colType as keyof typeof PRICES]) /
    Number(debt);

  if (isNaN(collateralizationRatio)) {
    return "—";
  }

  return collateralizationRatio.toFixed(4) + "%";
};

export const getLiquidationRatio = (colType: string): string => {
  return (
    LIQUIDATION_RATIOS[colType as keyof typeof LIQUIDATION_RATIOS] * 100
  ).toFixed(0);
};

export const getMaximumCollateralWithdrawal = (
  collateral: string | number,
  debt: string | number,
  colType: string
): string => {
  return (
    (
      Number(collateral) -
      (Number(debt) *
        LIQUIDATION_RATIOS[colType as keyof typeof LIQUIDATION_RATIOS]) /
        PRICES[colType as keyof typeof PRICES]
    ).toFixed(4) + ` ${COL_TYPES[colType as keyof typeof COL_TYPES]}`
  );
};

export const getMaximumAdditionalDebt = (
  collateral: string | number,
  debt: string | number,
  colType: string
): string => {
  return (
    (
      (Number(collateral) * PRICES[colType as keyof typeof PRICES]) /
        LIQUIDATION_RATIOS[colType as keyof typeof LIQUIDATION_RATIOS] -
      Number(debt)
    ).toFixed(4) + " DAI"
  );
};
