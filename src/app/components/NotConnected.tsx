import { Box, Typography } from "@mui/material";

export const NotConnected = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <Typography variant="h6">Please connect your wallet</Typography>
    </Box>
  );
};
