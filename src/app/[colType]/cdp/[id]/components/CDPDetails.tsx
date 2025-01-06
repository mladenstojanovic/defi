import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

export const CDPDetails = ({
  collateralizationRatio,
  liqudationRatio,
  maxCollateralWithdrawal,
  maxAdditionalDebt,
  collateral,
  debt,
}: {
  collateralizationRatio: string;
  liqudationRatio: string;
  maxCollateralWithdrawal: string;
  maxAdditionalDebt: string;
  collateral: string | number;
  debt: string | number;
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell component="th">Collateral</TableCell>
            <TableCell>{collateral}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">Debt</TableCell>
            <TableCell>{debt}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">Collateralization ratio</TableCell>
            <TableCell>{collateralizationRatio}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">Liquidation ratio</TableCell>
            <TableCell>{liqudationRatio}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">Maximum collateral withdrawal</TableCell>
            <TableCell>{maxCollateralWithdrawal}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">Maximum additional debt</TableCell>
            <TableCell>{maxAdditionalDebt}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
