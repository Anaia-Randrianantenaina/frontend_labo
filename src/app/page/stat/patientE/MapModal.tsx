import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';


interface MapModalProps {
  show: boolean;
  onClose: () => void;
  data: { adresseE: string; }[];
}

const MapModal: React.FC<MapModalProps> = ({ show, onClose, data }) => {
  const [markers, setMarkers] = useState<{ lat: number; lon: number; }[]>([]);

  useEffect(() => {
    const fetchCoordinates = async (address: string) => {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
      try {
        const response = await fetch(url);
        const result = await response.json();
        if (result.length > 0) {
          return {
            lat: parseFloat(result[0].lat),
            lon: parseFloat(result[0].lon)
          };
        } else {
          console.error('Adresse non trouvée:', address);
          return null;
        }
      } catch (error) {
        console.error('Erreur lors du géocodage:', error);
        return null;
      }
    };

    const getMarkers = async () => {
      const coordinates = await Promise.all(
        data.map(async (item) => await fetchCoordinates(item.adresseE))
      );
      setMarkers(coordinates.filter(Boolean) as { lat: number; lon: number; }[]);
    };

    if (show) {
      getMarkers();
    }
  }, [show, data]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[80%] h-[60%] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Carte des Patients</h2>
          <button
            className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
        <MapContainer
          center={[-21.4419, 47.0857]} // Coordonnées de Fianarantsoa
          zoom={13}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {markers.map((marker, index) => (
            <Marker key={index} position={[marker.lat, marker.lon]}>
              <Popup>
                Adresse {index + 1}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapModal;
