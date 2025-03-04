import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Coordonnées fixes pour les quartiers de Fianarantsoa
const QUARTIER_COORDINATES: { [key: string]: [number, number] } = {
  "Ampitakely": [-21.4534, 47.0853],
  "Talatamaty": [-21.4589, 47.0891],
  "Imandry": [-21.4478, 47.0867],
  "Isada": [-21.4512, 47.0823],
  "Ankofafa": [-21.4467, 47.0845],
  "Tsianolondroa": [-21.4556, 47.0812],
  "Antarandolo": [-21.4501, 47.0878],
  "Ankazomiriotra": [-21.4445, 47.0834],
  // Ajoutez d'autres quartiers selon vos besoins
};

interface MapModalProps {
  show: boolean;
  onClose: () => void;
  data: { adresseE: string; }[];
}

const MapModal: React.FC<MapModalProps> = ({ show, onClose, data }) => {
  const [markers, setMarkers] = useState<{ lat: number; lon: number; address: string; }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizeAddress = (address: string): string => {
    // Nettoie et normalise l'adresse
    return address
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .split(',')[0] // Prend seulement la première partie de l'adresse
      .trim();
  };

  useEffect(() => {
    const processAddresses = () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Processing addresses:", data);
        
        const processedMarkers = data
          .filter(item => item.adresseE) // Filtrer les adresses vides
          .map(item => {
            const normalizedAddress = normalizeAddress(item.adresseE);
            console.log("Normalized address:", normalizedAddress);
            
            // Chercher les coordonnées dans notre mapping
            for (const [quartier, coordinates] of Object.entries(QUARTIER_COORDINATES)) {
              if (normalizedAddress.includes(quartier.toLowerCase())) {
                return {
                  lat: coordinates[0],
                  lon: coordinates[1],
                  address: item.adresseE
                };
              }
            }
            return null;
          })
          .filter(marker => marker !== null) as { lat: number; lon: number; address: string; }[];

        console.log("Processed markers:", processedMarkers);
        setMarkers(processedMarkers);

        if (processedMarkers.length === 0) {
          setError("Aucune correspondance trouvée pour les adresses fournies");
        }
      } catch (error) {
        console.error("Error processing addresses:", error);
        setError("Erreur lors du traitement des adresses");
      } finally {
        setLoading(false);
      }
    };

    if (show) {
      processAddresses();
    }
  }, [show, data]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] h-[90%] overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center border-b-2 border-gray-300 pb-2 flex-1">
        Géolocalisation pour la sensibilisation des patients dans les zones à forte concentration.
        </h2>
        <button
          className="px-4 py-2  text-red-700 text-[30px] rounded ml-4"
          onClick={onClose}
        >
          X
        </button>
      </div>
  
      {loading && (
        <div className="mb-4 text-blue-600">
          Chargement de la carte...
        </div>
      )}
  
      {error && (
        <div className="mb-4 text-red-600">
          {error}
        </div>
      )}
  
      <div className="mb-4 text-sm text-gray-600">
        <div>Adresses reçues: {data?.length || 0}</div>
        <div>Marqueurs placés: {markers.length}</div>
      </div>
  
      <MapContainer
        center={[-21.4419, 47.0857]} // Centre de Fianarantsoa
        zoom={14}
        style={{ height: "calc(100% - 200px)", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((marker, index) => (
          <Marker 
            key={`${marker.lat}-${marker.lon}-${index}`}
            position={[marker.lat, marker.lon]}
            icon={customIcon}
          >
            <Popup>
              {marker.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  </div>
  
  
  );
};

export default MapModal;