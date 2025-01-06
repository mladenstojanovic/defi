import { CircularProgress } from "@mui/material";

export const Loading = () => {
  return (
    <div className="container flex justify-center items-center h-100 w-100">
      <CircularProgress />
    </div>
  );
};
