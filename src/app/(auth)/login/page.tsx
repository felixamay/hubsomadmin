"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaRequired, setMfaRequired] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!mfaRequired) {
        const pre = await fetch("/api/auth/precheck", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await pre.json();
        if (!pre.ok || !data.ok) {
          setError(data.error ?? "Invalid email or password");
          setLoading(false);
          return;
        }
        if (data.mfaRequired) {
          setMfaRequired(true);
          setError(null);
          setLoading(false);
          return;
        }
      }

      const res = await signIn("credentials", {
        email,
        password,
        mfaCode: mfaRequired ? mfaCode : "",
        redirect: false,
      });

      if (res?.error) {
        setError(mfaRequired ? "Invalid authentication code." : "Unable to sign in.");
        setLoading(false);
        return;
      }

      if (res?.ok) {
        router.push("/");
        router.refresh();
        return;
      }

      setError("Unable to sign in.");
    } catch {
      setError("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
        fontFamily: 'var(--font-plus-jakarta), "Plus Jakarta Sans", system-ui, sans-serif',
      }}
    >
      {/* Brand panel */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          p: { md: 6, lg: 8 },
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(165deg, #06121f 0%, #0a3d5c 42%, #0d5278 78%, #0a3d5c 100%)",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(720px 420px at 12% 18%, rgba(0,174,239,0.28), transparent 60%), radial-gradient(640px 380px at 88% 82%, rgba(243,111,33,0.22), transparent 55%)",
            pointerEvents: "none",
          },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 1.5,
              background: "linear-gradient(135deg,#00aeef,#f36f21)",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: "-0.04em",
            }}
          >
            H
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Hubsom
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", opacity: 0.7, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Admin
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ position: "relative", zIndex: 1, maxWidth: 440 }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { md: "2.4rem", lg: "2.85rem" },
              letterSpacing: "-0.04em",
              lineHeight: 1.12,
              mb: 2,
            }}
          >
            Operate Hubsom & Huber from one secure console.
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: "1.05rem", lineHeight: 1.6, maxWidth: 400 }}>
            Marketplace, deliveries, payouts, live streams, and verification — controlled with role-based access.
          </Typography>
        </Box>

        <Typography sx={{ position: "relative", zIndex: 1, fontSize: "0.8rem", color: "rgba(255,255,255,0.45)" }}>
          © {new Date().getFullYear()} Hubsom · Confidential
        </Typography>
      </Box>

      {/* Form panel */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, sm: 4 },
          py: { xs: 4, sm: 6 },
          pt: { xs: "calc(32px + var(--safe-top))", md: 6 },
          pb: { xs: "calc(32px + var(--safe-bottom))", md: 6 },
          background: {
            xs: "linear-gradient(180deg, #06121f 0%, #0a3d5c 38%, #eef7fc 38%)",
            md: "#f7fbfd",
          },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 420 }}>
          {/* Mobile brand */}
          <Stack
            direction="row"
            spacing={1.25}
            alignItems="center"
            sx={{ display: { xs: "flex", md: "none" }, mb: 3, color: "#fff" }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                background: "linear-gradient(135deg,#00aeef,#f36f21)",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              H
            </Box>
            <Typography sx={{ fontWeight: 800, letterSpacing: "-0.03em" }}>Hubsom Admin</Typography>
          </Stack>

          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: 3,
              border: "1px solid rgba(10,61,92,0.08)",
              boxShadow: {
                xs: "0 18px 50px rgba(6,18,31,0.18)",
                md: "0 12px 40px rgba(10,61,92,0.06)",
              },
              px: { xs: 2.5, sm: 3.5 },
              py: { xs: 3, sm: 4 },
            }}
          >
            <Stack spacing={0.75} sx={{ mb: 3 }}>
              <Typography
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.5rem", sm: "1.75rem" },
                  letterSpacing: "-0.03em",
                  color: "#06121f",
                }}
              >
                {mfaRequired ? "Verify identity" : "Sign in"}
              </Typography>
              <Typography sx={{ color: "#5a7386", fontSize: "0.925rem", lineHeight: 1.5 }}>
                {mfaRequired
                  ? "Enter the 6-digit code from your authenticator app to continue."
                  : "Use your administrator credentials to access the Hubsom control center."}
              </Typography>
            </Stack>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2.5,
                  borderRadius: 2,
                  "& .MuiAlert-message": { fontFamily: "inherit" },
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={onSubmit} noValidate>
              <Stack spacing={2.25}>
                {!mfaRequired ? (
                  <>
                    <TextField
                      label="Work email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      fullWidth
                      autoComplete="username"
                      autoFocus
                      placeholder="you@company.com"
                      InputLabelProps={{ shrink: true }}
                      sx={fieldSx}
                    />
                    <TextField
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      fullWidth
                      autoComplete="current-password"
                      InputLabelProps={{ shrink: true }}
                      sx={fieldSx}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={showPassword ? "Hide password" : "Show password"}
                              onClick={() => setShowPassword((v) => !v)}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </>
                ) : (
                  <TextField
                    label="Authentication code"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    fullWidth
                    autoFocus
                    placeholder="••••••"
                    inputProps={{
                      maxLength: 6,
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      style: {
                        letterSpacing: "0.35em",
                        fontWeight: 700,
                        fontSize: "1.25rem",
                        textAlign: "center",
                      },
                    }}
                    InputLabelProps={{ shrink: true }}
                    sx={fieldSx}
                  />
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading || (!mfaRequired && (!email || !password)) || (mfaRequired && mfaCode.length < 6)}
                  fullWidth
                  sx={{
                    mt: 0.5,
                    py: 1.4,
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    letterSpacing: "-0.01em",
                    bgcolor: "#0a3d5c",
                    "&:hover": { bgcolor: "#072f47" },
                    "&.Mui-disabled": { bgcolor: "rgba(10,61,92,0.35)", color: "#fff" },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={22} sx={{ color: "#fff" }} />
                  ) : mfaRequired ? (
                    "Continue"
                  ) : (
                    "Sign in to Admin"
                  )}
                </Button>

                {mfaRequired && (
                  <Button
                    variant="text"
                    onClick={() => {
                      setMfaRequired(false);
                      setMfaCode("");
                      setError(null);
                    }}
                    sx={{ color: "#5a7386", fontWeight: 600 }}
                  >
                    Back to email & password
                  </Button>
                )}
              </Stack>
            </Box>

            <Divider sx={{ my: 3, borderColor: "rgba(10,61,92,0.08)" }} />

            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              <LockOutlinedIcon sx={{ fontSize: 16, color: "#8aa0b2" }} />
              <Typography sx={{ fontSize: "0.75rem", color: "#8aa0b2", textAlign: "center" }}>
                Encrypted session · Role-based access · Audit logged
              </Typography>
            </Stack>
          </Box>

          <Typography
            sx={{
              mt: 2.5,
              textAlign: "center",
              fontSize: "0.75rem",
              color: { xs: "rgba(10,61,92,0.55)", md: "#8aa0b2" },
            }}
          >
            Authorized personnel only. All access is monitored.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "#fbfcfd",
    fontFamily: 'var(--font-plus-jakarta), "Plus Jakarta Sans", system-ui, sans-serif',
    "& fieldset": { borderColor: "rgba(10,61,92,0.14)" },
    "&:hover fieldset": { borderColor: "rgba(10,61,92,0.28)" },
    "&.Mui-focused fieldset": { borderColor: "#0a3d5c", borderWidth: 1.5 },
  },
  "& .MuiInputLabel-root": {
    fontFamily: 'var(--font-plus-jakarta), "Plus Jakarta Sans", system-ui, sans-serif',
    fontWeight: 600,
  },
  "& .MuiInputBase-input": {
    fontFamily: 'inherit',
    py: 1.35,
  },
};
