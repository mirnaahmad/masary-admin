// src/components/MapView.jsx
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const cx = (...a) => a.filter(Boolean).join(" ");
const ROUTE = [
  [34.718, 36.7],
  [34.725, 36.706],
  [34.73, 36.715],
  [34.735, 36.72],
  [34.742, 36.726],
];

export function MapView({ className, route = ROUTE, buses = [] }) {
  return (
    <div className={cx("isolate overflow-hidden rounded-xl", className)}>
      <MapContainer
        center={route[2]}
        zoom={14}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ minHeight: 260 }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline
          positions={route}
          pathOptions={{ color: "#5BC41F", weight: 5 }}
        />
        {route.map((p, i) => (
          <CircleMarker
            key={i}
            center={p}
            radius={6}
            pathOptions={{
              color: "#fff",
              fillColor: "#0E1F3B",
              fillOpacity: 1,
              weight: 2,
            }}
          />
        ))}
        {buses.map((b) => (
          <CircleMarker
            key={b.id}
            center={b.pos}
            radius={10}
            pathOptions={{
              color: "#fff",
              fillColor: b.on ? "#7CF03A" : "#EF4444",
              fillOpacity: 1,
              weight: 2,
            }}
          >
            <Tooltip permanent direction="top">
              {b.id}
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
