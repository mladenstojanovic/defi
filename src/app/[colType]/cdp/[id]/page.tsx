"use client";

import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { use, useState } from "react";
import { Error, NotConnected } from "../../../components";
import { useWeb3 } from "../../../context";
import { CDPDetails } from "./components/CDPDetails";
import { COL_TYPES } from "./constants";
import { useQueryCDP } from "./hooks/useQueryCDP";
import {
  getCollateralizationRatio,
  getLiquidationRatio,
  getMaximumAdditionalDebt,
  getMaximumCollateralWithdrawal,
} from "./utils";
import Link from "next/link";

export default function CDPPage({
  params,
}: {
  params: Promise<{ id: string; colType: string }>;
}) {
  const id = use(params).id;
  const colType = use(params).colType;
  const [signature, setSignature] = useState<string>("");

  const { web3, isConnected, initError, account } = useWeb3();

  const signMessage = async () => {
    if (!web3 || !account) return;

    try {
      const signature = await web3.eth.personal.sign(
        "This is my CDP",
        account,
        ""
      );
      setSignature(signature);
    } catch (error) {
      console.error("Error signing message:", error);
    }
  };

  const { cdp, isLoading, error } = useQueryCDP(web3, id, colType);

  if (!isConnected) {
    return <NotConnected />;
  }

  if (initError || error) {
    return <Error />;
  }

  if (isLoading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        CDP Details - ID: {cdp?.id}
      </Typography>

      <Box sx={{ mb: 4, display: "flex", gap: 2 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Back</Button>
        </Link>
        {account && (
          <Button
            variant="contained"
            color="success"
            onClick={signMessage}
            disabled={!!signature}
          >
            Sign Message
          </Button>
        )}
      </Box>
      {signature && (
        <Paper sx={{ p: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Signature:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              wordBreak: "break-all",
              bgcolor: "grey.100",
              p: 2,
              borderRadius: 1,
            }}
          >
            {signature}
          </Typography>
        </Paper>
      )}
      {cdp?.collateral && cdp?.debt && (
        <CDPDetails
          collateral={
            cdp?.collateral + " " + COL_TYPES[colType as keyof typeof COL_TYPES]
          }
          debt={cdp?.debt + " DAI"}
          collateralizationRatio={getCollateralizationRatio(
            cdp?.collateral,
            cdp?.debt,
            colType
          )}
          liqudationRatio={getLiquidationRatio(colType)}
          maxCollateralWithdrawal={getMaximumCollateralWithdrawal(
            cdp?.collateral,
            cdp?.debt,
            colType
          )}
          maxAdditionalDebt={getMaximumAdditionalDebt(
            cdp?.collateral,
            cdp?.debt,
            colType
          )}
        />
      )}
    </Box>
  );
}
