import { Box, CardMedia, Typography } from "@mui/material";
import colors from "../../assets/images/colors.png";

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
          EcoGestor
        </Typography>
      </Box>
      <Box className="bounce-in-top" height="50%" width="100%" display="flex" justifyContent="center" alignItems="flex-end">
        <CardMedia
          component="img"
          height="300"
          image={colors}
          alt="Carrinhos de reciclagem"
          sx={{ objectFit: 'contain' }}
        />
      </Box>
    </Box>
  );
};

export default Background;
