import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { powerLines, substations } from '../data/mockData';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapProps {
  onLineClick: (lineId: string) => void;
  selectedLineId: string | null;
}

export default function PowerMap({ onLineClick, selectedLineId }: MapProps) {
  const position: [number, number] = [43.2100, 76.9200];

  return (
    <MapContainer center={position} zoom={13} className="absolute inset-0 z-0" attributionControl={false}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {substations.map(sub => (
        <Marker key={sub.id} position={[sub.lat, sub.lng]}>
          <Popup>
            <div className="font-bold text-gray-900">{sub.name}</div>
          </Popup>
        </Marker>
      ))}

      {powerLines.map(line => {
        let color = '#22c55e'; // green - normal
        let weight = 4;
        let dashArray = undefined;

        if (line.state === 'warning') {
          color = '#eab308'; // yellow
          weight = 6;
        } else if (line.state === 'critical') {
          color = '#ef4444'; // red
          weight = 8;
          dashArray = '5, 10'; // to make it look active or we can rely on standard rendering
        }

        const isSelected = selectedLineId === line.id;
        if (isSelected) {
          weight += 4;
          color = line.state === 'critical' ? '#b91c1c' : color;
        }

        return (
          <Polyline
            key={line.id}
            positions={line.path}
            color={color}
            weight={weight}
            dashArray={dashArray}
            pathOptions={line.state === 'critical' ? { className: 'animate-pulse' } : undefined}
            eventHandlers={{
              click: () => onLineClick(line.id)
            }}
          >
            <Popup>
              <div className="font-bold text-gray-900">{line.name} ({line.fiderCode})</div>
              <div className="text-gray-700 font-medium">Состояние: {line.state === 'critical' ? 'КРИТИЧЕСКОЕ' : line.state === 'warning' ? 'ПРЕДУПРЕЖДЕНИЕ' : 'НОРМА'}</div>
              <div className="text-xs text-gray-500 mt-1">Кликните по линии для детального анализа</div>
            </Popup>
          </Polyline>
        );
      })}
    </MapContainer>
  );
}
