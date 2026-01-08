import { useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import type { Layer, LeafletMouseEvent, PathOptions, GeoJSON as LeafletGeoJSON } from 'leaflet';
import type { Feature, FeatureCollection } from 'geojson';
import type { GeoJSONData, Prediccion, ModeloTipo } from '../utils/dataUtils';
import { getColorFromZScore, buscarPrediccionComuna } from '../utils/dataUtils';
import 'leaflet/dist/leaflet.css';
import '../styles/MapComponent.css';

interface MapComponentProps {
  geoJSON: GeoJSONData;
  predicciones: Prediccion[];
  modeloSeleccionado: ModeloTipo;
  comunaSeleccionada: string | null;
  onComunaClick: (comuna: string) => void;
  onComunaHover: (comuna: string | null) => void;
}

// Centro aproximado de la Región Metropolitana
const RM_CENTER: [number, number] = [-33.45, -70.65];
const RM_ZOOM = 10;

// Componente para ajustar bounds automáticamente
function FitBounds({ geoJSON }: { geoJSON: GeoJSONData }) {
  const map = useMap();
  
  useEffect(() => {
    if (geoJSON.features.length > 0) {
      // Calcular bounds desde las features
      const allCoords: [number, number][] = [];
      
      geoJSON.features.forEach((feature) => {
        const coords = feature.geometry.coordinates as number[][][];
        if (feature.geometry.type === 'Polygon') {
          coords[0].forEach((coord) => {
            allCoords.push([coord[1], coord[0]]);
          });
        } else if (feature.geometry.type === 'MultiPolygon') {
          (coords as unknown as number[][][][]).forEach((polygon) => {
            polygon[0].forEach((coord) => {
              allCoords.push([coord[1], coord[0]]);
            });
          });
        }
      });
      
      if (allCoords.length > 0) {
        const lats = allCoords.map((c) => c[0]);
        const lngs = allCoords.map((c) => c[1]);
        const bounds: [[number, number], [number, number]] = [
          [Math.min(...lats), Math.min(...lngs)],
          [Math.max(...lats), Math.max(...lngs)],
        ];
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [map, geoJSON]);
  
  return null;
}

export function MapComponent({
  geoJSON,
  predicciones,
  modeloSeleccionado,
  comunaSeleccionada,
  onComunaClick,
  onComunaHover,
}: MapComponentProps) {
  const geoJSONRef = useRef<LeafletGeoJSON | null>(null);

  // Función para obtener el estilo de cada feature
  const getFeatureStyle = useCallback(
    (feature: Feature | undefined): PathOptions => {
      if (!feature || !feature.properties) {
        return {
          fillColor: '#cccccc',
          weight: 1,
          opacity: 1,
          color: '#666666',
          fillOpacity: 0.7,
        };
      }

      const nombreComuna = feature.properties.Comuna as string;
      const prediccion = buscarPrediccionComuna(predicciones, nombreComuna, modeloSeleccionado);
      const isSelected = nombreComuna === comunaSeleccionada;
      
      // Color basado en balance migratorio (inmigración - emigración normalizado)
      let fillColor = '#cccccc';
      if (prediccion) {
        // Usar Z-score de inmigración para colorear
        fillColor = getColorFromZScore(prediccion.inmigracion_pred_z);
      }

      return {
        fillColor,
        weight: isSelected ? 3 : 1,
        opacity: 1,
        color: isSelected ? '#1a1a2e' : '#444444',
        fillOpacity: isSelected ? 0.9 : 0.7,
      };
    },
    [predicciones, modeloSeleccionado, comunaSeleccionada]
  );

  // Handler para cada feature
  const onEachFeature = useCallback(
    (feature: Feature, layer: Layer) => {
      const nombreComuna = feature.properties?.Comuna as string;

      layer.on({
        mouseover: (e: LeafletMouseEvent) => {
          const targetLayer = e.target;
          targetLayer.setStyle({
            weight: 2,
            color: '#1a1a2e',
            fillOpacity: 0.85,
          });
          targetLayer.bringToFront();
          onComunaHover(nombreComuna);
        },
        mouseout: (e: LeafletMouseEvent) => {
          if (geoJSONRef.current) {
            geoJSONRef.current.resetStyle(e.target);
          }
          onComunaHover(null);
        },
        click: () => {
          onComunaClick(nombreComuna);
        },
      });

      // Tooltip con nombre de comuna
      layer.bindTooltip(nombreComuna, {
        permanent: false,
        direction: 'center',
        className: 'comuna-tooltip',
      });
    },
    [onComunaClick, onComunaHover]
  );

  // Key para forzar re-render cuando cambia el modelo o la selección
  const geoJSONKey = `${modeloSeleccionado}-${comunaSeleccionada}`;

  return (
    <div className="map-container">
      <MapContainer
        center={RM_CENTER}
        zoom={RM_ZOOM}
        className="leaflet-map"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <GeoJSON
          key={geoJSONKey}
          ref={geoJSONRef}
          data={geoJSON as unknown as FeatureCollection}
          style={getFeatureStyle}
          onEachFeature={onEachFeature}
        />
        <FitBounds geoJSON={geoJSON} />
      </MapContainer>
      
      {/* Leyenda */}
      <div className="map-legend">
        <h4>Inmigración Predicha</h4>
        <div className="legend-scale">
          <div className="legend-gradient"></div>
          <div className="legend-labels">
            <span>Muy baja</span>
            <span>Normal</span>
            <span>Muy alta</span>
          </div>
        </div>
      </div>
    </div>
  );
}
