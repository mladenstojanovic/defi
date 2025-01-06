"use client";
import {
  Box,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent } from "react";
import { CDP, Error, NotConnected } from "./components";
import { collateralTypes } from "./constants";
import { useSearchInput, useWeb3 } from "./context";
import { useQueryNearbyCDP } from "./hooks";
import styles from "./page.module.css";
import { useDebounce } from "./utils";

export default function Home() {
  const { searchTerm, setSearchTerm, collateralType, setCollateralType } =
    useSearchInput();

  const debouncedSearchTerm = useDebounce<string>(searchTerm, 600);

  const { web3, isConnected, initError } = useWeb3();

  const { matchingCdps, isLoading, progress, error } = useQueryNearbyCDP(
    web3,
    debouncedSearchTerm,
    collateralType
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setCollateralType(event.target.value as string);
  };

  if (!isConnected) {
    return <NotConnected />;
  }

  if (error || initError) {
    return <Error />;
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl sx={{ maxWidth: 100 }}>
            <InputLabel id="collateral-type-label">Type</InputLabel>
            <Select
              labelId="collateral-type-label"
              id="collateral-type-select"
              value={collateralType}
              label="Collateral Type"
              onChange={handleSelectChange}
              disabled={isLoading}
            >
              {collateralTypes.map((collateralType) => (
                <MenuItem
                  value={collateralType.value}
                  key={collateralType.value}
                >
                  {collateralType.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ flex: "1 0 auto" }}>
            <TextField
              id="cdp-id"
              label="CDP ID"
              variant="standard"
              value={searchTerm}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </FormControl>
        </Box>
        <Box>
          {isLoading ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ width: "100%", mr: 1 }}>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
              <Box sx={{ minWidth: 35 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                >{`${Math.round(progress)}%`}</Typography>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {matchingCdps.map((cdp) => (
                <CDP cdp={cdp} key={cdp.id} colType={collateralType} />
              ))}
            </Box>
          )}
        </Box>
      </main>
    </div>
  );
}
