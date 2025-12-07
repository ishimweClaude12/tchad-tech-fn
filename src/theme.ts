import { createTheme } from "@mui/material/styles";

// Chad Tech Hub Brand Colors
const chadColors = {
  blue: "#1e40af",
  gold: "#f59e0b",
  green: "#059669",
};

const theme = createTheme({
  palette: {
    primary: {
      main: chadColors.blue,
    },
    secondary: {
      main: chadColors.gold,
    },
    success: {
      main: chadColors.green,
    },
  },
  typography: {
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
    h1: {
      fontSize: "3.2em",
      lineHeight: 1.1,
      fontWeight: 700,
    },
    button: {
      textTransform: "none", // Removes uppercase transformation
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "0.6em 1.2em",
        },
      },
    },
  },
});

export default theme;
