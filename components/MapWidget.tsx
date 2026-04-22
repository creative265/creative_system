'use client';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// マーカーアイコン設定（スマホでも見やすいサイズに調整）
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [30, 48], // 少し大きく
  iconAnchor: [15, 48],
});

export default function MapWidget({ spots }: { spots: any[] }) {
  return (
    <div style={{ height: '100dvh', width: '100vw', position: 'relative' }}>
      <MapContainer 
        center={[26.5915, 127.9775]} 
        zoom={14} 
        zoomControl={false} // デフォルトのボタンを消して右下に配置し直すのが一般的
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ZoomControl position="bottomright" /> 
        
        {spots.map((spot, idx) => (
          <Marker key={idx} position={[spot.lat, spot.lng]} icon={DefaultIcon}>
            <Popup autoPanPadding={[50, 50]}>
              <div className="text-black">
                <h3 className="font-bold">{spot.name}</h3>
                <p className="text-sm">{spot.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
