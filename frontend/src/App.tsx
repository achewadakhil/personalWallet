import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  IconButton,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Fade,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import * as bip39 from "bip39";
import { Buffer } from "buffer";
window.Buffer = Buffer;

export default function App() {
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [showMainPage, setShowMainPage] = useState(false);
  const [mnemonic, setMnemonic] = useState("");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === "dark" ? "#121212" : "#f5f5f5",
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                transition: "background-color 0.5s ease, color 0.5s ease",
              },
              "#root": {
                transition: "background-color 0.5s ease, color 0.5s ease",
              },
            },
          },
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleCreateWallet = () => {
    const newMnemonic = bip39.generateMnemonic();
    console.log("Generated Mnemonic:", newMnemonic);
    setMnemonic(newMnemonic);
    setShowMnemonic(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          transition: "background-color 0.5s ease, color 0.5s ease",
        }}
      >
        {/* Toggle Theme Button */}
        <IconButton
          onClick={toggleTheme}
          sx={{ position: "absolute", top: 16, right: 16 }}
          color="inherit"
        >
          {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        {/* Fade between welcome screen and mnemonic */}
        <Fade in={!showMnemonic && !showMainPage} timeout={500} unmountOnExit>
          <Paper
            elevation={6}
            sx={{
              p: 5,
              minWidth: 300,
              maxWidth: 400,
              borderRadius: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Welcome to HD Wallet
            </Typography>

            <Stack spacing={2} mt={3}>
              <Button variant="contained" fullWidth onClick={handleCreateWallet}>
                  Create Wallet
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                >
                  Import via Mnemonic
              </Button> 
            </Stack>
          </Paper>
        </Fade>

        {/* Mnemonic screen */}
        <Fade in={showMnemonic} timeout={500} unmountOnExit>
          <Paper
            elevation={6}
            sx={{
              p: 5,
              minWidth: 300,
              maxWidth: 600,
              borderRadius: 3,
              textAlign: "center",
              bgcolor: mode === "dark" ? "#1e1e1e" : "#ffffff",
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Your Mnemonic Phrase
            </Typography>

            {/* Mnemonic words arranged in 3 per row */}
            <Box
              mt={3}
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
                bgcolor: mode === "dark" ? "#2c2c2c" : "#f0f0f0",
                p: 2,
                borderRadius: 2,
                wordBreak: "break-word",
              }}
            >
              {mnemonic.split(" ").map((word, idx) => (
                <Typography
                  key={idx}
                  sx={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: mode === "dark" ? "#ffffff" : "#000000",
                  }}
                >
                  {idx + 1}. {word}
                </Typography>
              ))}
            </Box>

            <Button
              variant="contained"
              sx={{ mt: 4 }}
              onClick={() => {
                setShowMnemonic(false);
                setShowMainPage(true);
              }}
            >
              I have noted my mnemonic
            </Button>

          </Paper>
        </Fade>
        <Fade in={showMainPage} timeout={500} unmountOnExit>
          <Paper
            elevation={6}
            sx={{
              p: 5,
              minWidth: 300,
              maxWidth: 600,
              borderRadius: 3,
              textAlign: "center",
              bgcolor: mode === "dark" ? "#1e1e1e" : "#ffffff",
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Your Accounts
            </Typography>

            <Stack spacing={2} mt={3}>
              <Typography>Account 0 - Ethereum</Typography>
              <Typography>Account 1 - Solana</Typography>
              <Typography>Account 2 - Empty</Typography>
              {/* You can replace this with actual derived accounts later */}
            </Stack>
          </Paper>
        </Fade>

      </Box>
    </ThemeProvider>
  );
}
