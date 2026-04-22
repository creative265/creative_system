import dynamic from 'next/dynamic';
import spotsData from '../public/nago_spots.json'; // JSON形式を想定

const MapWidget = dynamic(() => import('@/components/MapWidget'), { 
  ssr: false,
  loading: () => <p>Map Loading...</p>
});

export default function Home() {
  return (
    <main>
      <MapWidget spots={spotsData} />
    </main>
  );
}
