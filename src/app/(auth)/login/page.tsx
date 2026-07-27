"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaRequired, setMfaRequired] = useState(false);
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
          setError(data.error ?? "Invalid credentials");
          setLoading(false);
          return;
        }
        if (data.mfaRequired) {
          setMfaRequired(true);
          setError("Two-factor authentication required. Enter your authenticator code.");
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
        setError(mfaRequired ? "Invalid MFA code." : "Unable to sign in.");
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
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: 4,
        background:
          "radial-gradient(900px 500px at 10% 0%, rgba(0,174,239,0.22), transparent 55%), radial-gradient(800px 480px at 90% 10%, rgba(243,111,33,0.18), transparent 50%), linear-gradient(160deg,#06121f 0%,#0a3d5c 48%,#0d5278 100%)",
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 440,
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.2)",
          animation: "rise 480ms ease",
          "@keyframes rise": {
            from: { opacity: 0, transform: "translateY(12px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <Box sx={{ px: 3, pt: 3, pb: 1.5, background: "linear-gradient(135deg,#0a3d5c,#14618a)" }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                background: "linear-gradient(135deg,#00aeef,#f36f21)",
                display: "grid",
                placeItems: "center",
                color: "#fff",
                fontWeight: 900,
                fontSize: 20,
              }}
            >
              H
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} color="#fff">
                Hubsom Admin
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)" }}>
                Secure access · Marketplace & Huber
              </Typography>
            </Box>
          </Stack>
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip size="small" icon={<LockOutlinedIcon />} label="RBAC" />
            <Chip size="small" icon={<ShieldOutlinedIcon />} label="MFA ready" color="secondary" />
          </Stack>

          {error && (
            <Alert
              severity={mfaRequired && !error.toLowerCase().includes("invalid") ? "info" : "error"}
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setMfaRequired(false);
                }}
                required
                fullWidth
                autoComplete="username"
                disabled={mfaRequired}
                autoFocus
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setMfaRequired(false);
                }}
                required
                fullWidth
                autoComplete="current-password"
                disabled={mfaRequired}
              />
              {mfaRequired && (
                <TextField
                  label="Authenticator code"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  required
                  fullWidth
                  autoFocus
                  placeholder="6-digit code"
                  inputProps={{ maxLength: 8, inputMode: "numeric" }}
                />
              )}
              <Button type="submit" variant="contained" size="large" disabled={loading} fullWidth>
                {loading ? "Signing in…" : mfaRequired ? "Verify & continue" : "Sign in"}
              </Button>
              {mfaRequired && (
                <Button
                  variant="text"
                  onClick={() => {
                    setMfaRequired(false);
                    setMfaCode("");
                    setError(null);
                  }}
                >
                  Use a different account
                </Button>
              )}
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
