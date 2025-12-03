import { useMemo } from 'react';
import { MapComponent } from './components/MapComponent';
import { InfoPanel } from './components/InfoPanel';
import { useMigracionData } from './hooks/useMigracionData';
import type { GeoJSONData, Prediccion } from './utils/dataUtils';
import { buscarPrediccionComuna } from './utils/dataUtils';

// Importar datos
import comunasGeoJSON from './data/comunas.json';
import prediccionesData from './data/predicciones.json';

// Estilos
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
  const geoJSON = comunasGeoJSON as GeoJSONData;
  const predicciones = prediccionesData as Prediccion[];

  const {
    modeloSeleccionado,
    setModeloSeleccionado,
    comunaSeleccionada,
    setComunaSeleccionada,
    comunaHover,
    setComunaHover,
  } = useMigracionData({ predicciones });

  // Obtener predicción actual basada en comuna seleccionada o hover
  const prediccionActual = useMemo(() => {
    const comunaMostrar = comunaHover || comunaSeleccionada;
    if (!comunaMostrar) return null;
    return buscarPrediccionComuna(predicciones, comunaMostrar, modeloSeleccionado);
  }, [predicciones, comunaHover, comunaSeleccionada, modeloSeleccionado]);

  return (
    <div className="app-container">
      <InfoPanel
        modeloSeleccionado={modeloSeleccionado}
        onModeloChange={setModeloSeleccionado}
        comunaSeleccionada={comunaSeleccionada}
        comunaHover={comunaHover}
        prediccionActual={prediccionActual}
      />
      <main className="main-content">
        <MapComponent
          geoJSON={geoJSON}
          predicciones={predicciones}
          modeloSeleccionado={modeloSeleccionado}
          comunaSeleccionada={comunaSeleccionada}
          onComunaClick={setComunaSeleccionada}
          onComunaHover={setComunaHover}
        />
      </main>
    </div>
  );
}

export default App;
