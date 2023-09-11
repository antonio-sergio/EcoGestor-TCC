import { Box, Typography } from "@mui/material";

const Background = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Box height="50%" width="100%" display="flex" justifyContent="center" alignItems="center">
        <Typography fontSize={100} color="#27AB6E" fontFamily="Belanosima" className="tracking-out-expand-fwd">
        </Typography>
      </Box>
      
    </Box>
  );
};

export default Background;
