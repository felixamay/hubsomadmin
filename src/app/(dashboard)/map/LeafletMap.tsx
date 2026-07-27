"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Driver, Delivery } from "@/domain/entities";

const STATUS_COLORS: Record<string, string> = {
  online: "#7cbf2c",
  on_delivery: "#f36f21",
  busy: "#f7941d",
  offline: "#9e9e9e",
};

const DELIVERY_COLORS: Record<string, string> = {
  en_route_to_customer: "#00aeef",
  picked_up: "#0a3d5c",
  accepted: "#7cbf2c",
  en_route_to_pickup: "#f7941d",
  delivered: "#4caf50",
  failed: "#f44336",
  cancelled: "#9e9e9e",
};

export default function LeafletMap({
  drivers,
  deliveries,
}: {
  drivers: Driver[];
  deliveries: Delivery[];
}) {
  const ACCRA_CENTER: [number, number] = [5.6037, -0.187];

  return (
    <MapContainer
      center={ACCRA_CENTER}
      zoom={12}
      style={{ height: "520px", width: "100%", borderRadius: 8 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {drivers
        .filter((d) => d.currentLocation)
        .map((driver) => (
          <CircleMarker
            key={driver.id}
            center={[driver.currentLocation!.latitude, driver.currentLocation!.longitude]}
            radius={8}
            pathOptions={{
              color: STATUS_COLORS[driver.status] ?? "#9e9e9e",
              fillColor: STATUS_COLORS[driver.status] ?? "#9e9e9e",
              fillOpacity: 0.85,
            }}
          >
            <Popup>
              <strong>{driver.fullName}</strong>
              <br />
              {driver.vehicleType} · {driver.vehiclePlate ?? "—"}
              <br />
              Status: <strong>{driver.status}</strong>
              <br />
              Rating: {driver.rating.toFixed(1)} ★
            </Popup>
          </CircleMarker>
        ))}

      {deliveries
        .filter((d) => d.pickup && !["delivered", "cancelled", "failed"].includes(d.status))
        .map((delivery) => (
          <CircleMarker
            key={delivery.id}
            center={[delivery.pickup.latitude, delivery.pickup.longitude]}
            radius={6}
            pathOptions={{
              color: DELIVERY_COLORS[delivery.status] ?? "#00aeef",
              fillColor: DELIVERY_COLORS[delivery.status] ?? "#00aeef",
              fillOpacity: 0.7,
              dashArray: "4",
            }}
          >
            <Popup>
              <strong>Delivery {delivery.id}</strong>
              <br />
              Driver: {delivery.driverName ?? "Unassigned"}
              <br />
              Customer: {delivery.customerName}
              <br />
              Status: <strong>{delivery.status.replaceAll("_", " ")}</strong>
            </Popup>
          </CircleMarker>
        ))}
    </MapContainer>
  );
}
