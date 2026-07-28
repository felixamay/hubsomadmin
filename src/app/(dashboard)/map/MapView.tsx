"use client";

import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import type { Driver, Delivery } from "@/domain/entities";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <Box sx={{ height: "100%", minHeight: 280, display: "grid", placeItems: "center", color: "text.secondary" }}>
      Loading map…
    </Box>
  ),
});

export function MapView({
  drivers,
  deliveries,
}: {
  drivers: Driver[];
  deliveries: Delivery[];
}) {
  return (
    <Box sx={{ height: "100%", width: "100%", minHeight: 280 }}>
      <LeafletMap drivers={drivers} deliveries={deliveries} />
    </Box>
  );
}
