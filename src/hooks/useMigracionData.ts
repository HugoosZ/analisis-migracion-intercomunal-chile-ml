import { useState, useMemo, useCallback } from 'react';
import type { Prediccion, ModeloTipo } from '../utils/dataUtils';
import {
  buscarPrediccionComuna,
  filtrarPrediccionesPorModelo,
  obtenerEstadisticasModelo,
} from '../utils/dataUtils';

interface UseMigracionDataProps {
  predicciones: Prediccion[];
}

interface UseMigracionDataReturn {
  modeloSeleccionado: ModeloTipo;
  setModeloSeleccionado: (modelo: ModeloTipo) => void;
  comunaSeleccionada: string | null;
  setComunaSeleccionada: (comuna: string | null) => void;
  comunaHover: string | null;
  setComunaHover: (comuna: string | null) => void;
  prediccionActual: Prediccion | null;
  prediccionesModelo: Prediccion[];
  estadisticas: ReturnType<typeof obtenerEstadisticasModelo>;
  getPrediccionComuna: (nombreComuna: string) => Prediccion | null;
}

export function useMigracionData({
  predicciones,
}: UseMigracionDataProps): UseMigracionDataReturn {
  const [modeloSeleccionado, setModeloSeleccionado] = useState<ModeloTipo>('lineal');
  const [comunaSeleccionada, setComunaSeleccionada] = useState<string | null>(null);
  const [comunaHover, setComunaHover] = useState<string | null>(null);

  // Predicciones filtradas por modelo
  const prediccionesModelo = useMemo(
    () => filtrarPrediccionesPorModelo(predicciones, modeloSeleccionado),
    [predicciones, modeloSeleccionado]
  );

  // Estadísticas del modelo actual
  const estadisticas = useMemo(
    () => obtenerEstadisticasModelo(predicciones, modeloSeleccionado),
    [predicciones, modeloSeleccionado]
  );

  // Predicción de la comuna seleccionada
  const prediccionActual = useMemo(() => {
    if (!comunaSeleccionada) return null;
    return buscarPrediccionComuna(predicciones, comunaSeleccionada, modeloSeleccionado);
  }, [predicciones, comunaSeleccionada, modeloSeleccionado]);

  // Función para obtener predicción de una comuna específica
  const getPrediccionComuna = useCallback(
    (nombreComuna: string) => {
      return buscarPrediccionComuna(predicciones, nombreComuna, modeloSeleccionado);
    },
    [predicciones, modeloSeleccionado]
  );

  return {
    modeloSeleccionado,
    setModeloSeleccionado,
    comunaSeleccionada,
    setComunaSeleccionada,
    comunaHover,
    setComunaHover,
    prediccionActual,
    prediccionesModelo,
    estadisticas,
    getPrediccionComuna,
  };
}
