"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import type { Driver, Delivery } from "@/domain/entities";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

export function MapView({
  drivers,
  deliveries,
}: {
  drivers: Driver[];
  deliveries: Delivery[];
}) {
  return <LeafletMap drivers={drivers} deliveries={deliveries} />;
}
