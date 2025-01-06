import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";

interface CDPProps {
  cdp: {
    id: number;
    ilk?: string;
    collateral?: string | number;
    debt?: string | number;
  };
  colType: string;
}

export const CDP: React.FC<CDPProps> = ({ cdp, colType }) => {
  return (
    <Box sx={{ minWidth: 275 }} key={cdp.id}>
      <Card variant="outlined">
        <CardContent>
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 14 }}
          >
            {cdp.ilk}
          </Typography>
          <Typography variant="h5" component="div">
            {cdp.id}
          </Typography>
          <Typography variant="body2">Collateral: {cdp.collateral}</Typography>
          <Typography variant="body2">Debt: {cdp.debt}</Typography>
        </CardContent>
        <CardActions>
          <Link href={`/${colType}/cdp/${cdp.id}`}>
            <Button size="small">Learn More</Button>
          </Link>
        </CardActions>
      </Card>
    </Box>
  );
};
