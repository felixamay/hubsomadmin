"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  AppBar,
  Avatar,
  Chip,
  useMediaQuery,
  useTheme,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import StorefrontIcon from "@mui/icons-material/Storefront";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import BadgeIcon from "@mui/icons-material/Badge";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MapIcon from "@mui/icons-material/Map";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import GavelIcon from "@mui/icons-material/Gavel";
import InventoryIcon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import ReportIcon from "@mui/icons-material/Report";
import ReviewsIcon from "@mui/icons-material/Reviews";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SecurityIcon from "@mui/icons-material/Security";
import PolicyIcon from "@mui/icons-material/Policy";
import SettingsIcon from "@mui/icons-material/Settings";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useMemo, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { ROLE_LABELS } from "@/domain/permissions";
import type { AdminRole } from "@/domain/enums";
import Button from "@mui/material/Button";

const DRAWER_WIDTH = 288;

const NAV = [
  { href: "/", label: "Dashboard", icon: <DashboardIcon />, short: "Home" },
  { href: "/users", label: "Users", icon: <PeopleIcon /> },
  { href: "/sellers", label: "Sellers", icon: <StorefrontIcon /> },
  { href: "/drivers", label: "Drivers (Huber)", icon: <TwoWheelerIcon />, short: "Drivers" },
  { href: "/verification", label: "Document Verification", icon: <BadgeIcon /> },
  { href: "/payments", label: "Payments", icon: <PaymentsIcon /> },
  { href: "/payouts", label: "Payouts", icon: <AccountBalanceWalletIcon /> },
  { href: "/orders", label: "Orders", icon: <ReceiptLongIcon />, short: "Orders" },
  { href: "/deliveries", label: "Deliveries", icon: <LocalShippingIcon /> },
  { href: "/map", label: "Map Dashboard", icon: <MapIcon />, short: "Map" },
  { href: "/streams", label: "Live Streams", icon: <LiveTvIcon /> },
  { href: "/auctions", label: "Live Auctions", icon: <GavelIcon /> },
  { href: "/products", label: "Products", icon: <InventoryIcon /> },
  { href: "/categories", label: "Categories", icon: <CategoryIcon /> },
  { href: "/moderation", label: "Content Moderation", icon: <ReportIcon /> },
  { href: "/reviews", label: "Reviews", icon: <ReviewsIcon /> },
  { href: "/support", label: "Support Center", icon: <SupportAgentIcon /> },
  { href: "/promotions", label: "Promotions", icon: <LocalOfferIcon /> },
  { href: "/notifications", label: "Notifications", icon: <NotificationsIcon /> },
  { href: "/analytics", label: "Analytics", icon: <AnalyticsIcon /> },
  { href: "/fraud", label: "Fraud Management", icon: <PolicyIcon /> },
  { href: "/security", label: "Security", icon: <SecurityIcon /> },
  { href: "/settings", label: "Settings", icon: <SettingsIcon /> },
];

const BOTTOM_TABS = [
  { href: "/", label: "Home", icon: <DashboardIcon /> },
  { href: "/drivers", label: "Drivers", icon: <TwoWheelerIcon /> },
  { href: "/orders", label: "Orders", icon: <ReceiptLongIcon /> },
  { href: "/map", label: "Map", icon: <MapIcon /> },
];

function currentTitle(pathname: string) {
  if (pathname === "/") return "Dashboard";
  const match = NAV.find((n) => n.href !== "/" && pathname.startsWith(n.href));
  return match?.short ?? match?.label ?? "Hubsom Admin";
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), { noSsr: true });
  const [open, setOpen] = useState(false);
  const { data } = useSession();
  const role = data?.user?.role as AdminRole | undefined;

  const bottomValue = useMemo(() => {
    const tab = BOTTOM_TABS.find((t) =>
      t.href === "/" ? pathname === "/" : pathname.startsWith(t.href),
    );
    return tab?.href ?? "more";
  }, [pathname]);

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg,#06121f 0%,#0a3d5c 55%,#0d4f73 100%)",
        color: "#fff",
        pt: "var(--safe-top)",
      }}
    >
      <Toolbar sx={{ gap: 1.5, py: 1.5, minHeight: { xs: 56, sm: 64 } }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: "linear-gradient(135deg,#00aeef,#f36f21)",
            display: "grid",
            placeItems: "center",
            fontWeight: 900,
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          H
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" fontWeight={800} lineHeight={1.1} noWrap>
            Hubsom Admin
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.75 }}>
            Marketplace · Huber
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={() => setOpen(false)} sx={{ color: "#fff" }} aria-label="Close menu">
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
      <List sx={{ flex: 1, overflow: "auto", px: 1, py: 1, WebkitOverflowScrolling: "touch" }}>
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              onClick={() => setOpen(false)}
              selected={active}
              sx={{
                borderRadius: 2,
                mb: 0.4,
                minHeight: 48,
                color: "rgba(255,255,255,0.88)",
                "&.Mui-selected": {
                  bgcolor: "rgba(0,174,239,0.22)",
                  color: "#fff",
                  "& .MuiListItemIcon-root": { color: "#7dd3f5" },
                },
                "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              <ListItemIcon sx={{ color: "rgba(255,255,255,0.7)", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 700 : 550 }}
              />
            </ListItemButton>
          );
        })}
      </List>
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid rgba(255,255,255,0.12)",
          pb: "calc(16px + var(--safe-bottom))",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1.5 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: "#f36f21" }}>
            {data?.user?.name?.[0] ?? "A"}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={700} noWrap>
              {data?.user?.name ?? "Admin"}
            </Typography>
            {role && (
              <Chip
                size="small"
                label={ROLE_LABELS[role]}
                sx={{ height: 20, fontSize: 11, bgcolor: "rgba(247,148,29,0.2)", color: "#ffd59a" }}
              />
            )}
          </Box>
        </Box>
        <Button
          fullWidth
          variant="outlined"
          size="small"
          onClick={() => signOut({ callbackUrl: "/login" })}
          sx={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff", minHeight: 44 }}
        >
          Sign out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh", width: "100%", overflowX: "hidden" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: "rgba(255,255,255,0.86)",
          backdropFilter: "blur(14px)",
          color: "text.primary",
          borderBottom: "1px solid rgba(10,61,92,0.08)",
          pt: "var(--safe-top)",
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 56, sm: 64 },
            gap: 1,
            px: { xs: 1.5, sm: 2 },
          }}
        >
          <IconButton
            edge="start"
            onClick={() => setOpen(true)}
            sx={{ display: { md: "none" }, mr: 0.5 }}
            aria-label="Open menu"
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              fontWeight={780}
              noWrap
              sx={{ fontSize: { xs: "1rem", sm: "1.15rem" } }}
            >
              {isMobile ? currentTitle(pathname) : "Hubsom Admin Portal"}
            </Typography>
          </Box>
          <Chip
            label="GHS"
            size="small"
            color="info"
            variant="outlined"
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
          />
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "#f36f21",
              fontSize: 14,
              display: { xs: "flex", md: "none" },
            }}
          >
            {data?.user?.name?.[0] ?? "A"}
          </Avatar>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: { xs: "min(100vw, 320px)", sm: DRAWER_WIDTH },
              boxSizing: "border-box",
              border: 0,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box", border: 0 },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: "100dvh",
          minWidth: 0,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, pt: "var(--safe-top)" }} />
        <Box
          sx={{
            p: { xs: 1.5, sm: 2, md: 3 },
            pb: {
              xs: "calc(var(--mobile-nav-h) + var(--safe-bottom) + 16px)",
              md: 3,
            },
            maxWidth: "100%",
          }}
        >
          {children}
        </Box>
      </Box>

      {isMobile && (
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: (t) => t.zIndex.appBar,
            borderRadius: 0,
            borderTop: "1px solid rgba(10,61,92,0.1)",
            pb: "var(--safe-bottom)",
          }}
        >
          <BottomNavigation
            showLabels
            value={bottomValue}
            sx={{
              height: "var(--mobile-nav-h)",
              "& .MuiBottomNavigationAction-root": {
                minWidth: 0,
                px: 0.5,
                color: "#5a7386",
                "&.Mui-selected": { color: "#0a3d5c" },
              },
              "& .MuiBottomNavigationAction-label": {
                fontSize: "0.65rem",
                "&.Mui-selected": { fontSize: "0.7rem", fontWeight: 700 },
              },
            }}
          >
            {BOTTOM_TABS.map((tab) => (
              <BottomNavigationAction
                key={tab.href}
                component={Link}
                href={tab.href}
                value={tab.href}
                label={tab.label}
                icon={tab.icon}
              />
            ))}
            <BottomNavigationAction
              value="more"
              label="More"
              icon={<MoreHorizIcon />}
              onClick={() => setOpen(true)}
            />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}
