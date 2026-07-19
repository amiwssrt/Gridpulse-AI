import { useState } from 'react';
import PowerMap from './components/Map';
import Sidebar from './components/Sidebar';

export default function App() {
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);

  return (
    <div className="flex w-full h-screen bg-gray-950 overflow-hidden font-sans">
      <div className="flex-1 relative z-0">
        <PowerMap 
          onLineClick={setSelectedLineId} 
          selectedLineId={selectedLineId} 
        />
      </div>
      <Sidebar selectedLineId={selectedLineId} />
    </div>
  );
}
