/**
 * Utilidades para manejo de datos de predicciones migratorias
 */

export interface Prediccion {
  comuna: string;
  año?: number;
  modelo: string;
  emigracion_pred_z?: number;
  emigracion_pred?: number;
  inmigracion_pred_z?: number;
  inmigracion_pred?: number;
  error?: string;
}

export interface ComunaFeature {
  type: 'Feature';
  properties: {
    objectid: number;
    cod_comuna: number;
    codregion: number;
    Region: string;
    Comuna: string;
    Provincia: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

export interface GeoJSONData {
  type: 'FeatureCollection';
  features: ComunaFeature[];
}

export type ModeloTipo = 'lineal' | 'random_forest' | 'gradient_boosting';

export const MODELOS: { value: ModeloTipo; label: string }[] = [
  { value: 'lineal', label: 'Regresión Lineal' },
  { value: 'random_forest', label: 'Random Forest' },
  { value: 'gradient_boosting', label: 'Gradient Boosting' },
];

/**
 * Normaliza el nombre de una comuna para comparación
 */
export function normalizarNombreComuna(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .trim();
}

/**
 * Filtra predicciones válidas (sin errores) por modelo
 */
export function filtrarPrediccionesPorModelo(
  predicciones: Prediccion[],
  modelo: ModeloTipo
): Prediccion[] {
  return predicciones.filter(
    (p) => p.modelo === modelo && !p.error && p.año !== undefined
  );
}

/**
 * Busca la predicción de una comuna específica
 */
export function buscarPrediccionComuna(
  predicciones: Prediccion[],
  nombreComuna: string,
  modelo: ModeloTipo
): Prediccion | null {
  const nombreNormalizado = normalizarNombreComuna(nombreComuna);
  
  return predicciones.find(
    (p) =>
      normalizarNombreComuna(p.comuna) === nombreNormalizado &&
      p.modelo === modelo &&
      !p.error
  ) || null;
}

/**
 * Obtiene estadísticas globales de las predicciones para un modelo
 */
export function obtenerEstadisticasModelo(
  predicciones: Prediccion[],
  modelo: ModeloTipo
): {
  maxEmigracion: number;
  minEmigracion: number;
  maxInmigracion: number;
  minInmigracion: number;
} {
  const prediccionesModelo = filtrarPrediccionesPorModelo(predicciones, modelo);
  
  const emigraciones = prediccionesModelo
    .map((p) => p.emigracion_pred)
    .filter((v): v is number => v !== undefined);
  
  const inmigraciones = prediccionesModelo
    .map((p) => p.inmigracion_pred)
    .filter((v): v is number => v !== undefined);

  return {
    maxEmigracion: Math.max(...emigraciones),
    minEmigracion: Math.min(...emigraciones),
    maxInmigracion: Math.max(...inmigraciones),
    minInmigracion: Math.min(...inmigraciones),
  };
}

/**
 * Calcula el color basado en el Z-score
 * Valores negativos -> tonos fríos (azul)
 * Valores positivos -> tonos cálidos (rojo/naranja)
 */
export function getColorFromZScore(zScore: number | undefined): string {
  if (zScore === undefined) return '#cccccc';
  
  // Clamp entre -3 y 3
  const clampedZ = Math.max(-3, Math.min(3, zScore));
  
  // Normalizar a 0-1
  const normalized = (clampedZ + 3) / 6;
  
  // Escala de colores: azul -> blanco -> rojo
  if (normalized < 0.5) {
    // Azul a blanco
    const intensity = Math.round(255 * (normalized * 2));
    return `rgb(${intensity}, ${intensity}, 255)`;
  } else {
    // Blanco a rojo
    const intensity = Math.round(255 * ((1 - normalized) * 2));
    return `rgb(255, ${intensity}, ${intensity})`;
  }
}

/**
 * Formatea un número como valor monetario/cantidad
 */
export function formatearNumero(valor: number | undefined): string {
  if (valor === undefined) return 'N/A';
  return new Intl.NumberFormat('es-CL', {
    maximumFractionDigits: 0,
    signDisplay: 'always',
  }).format(Math.round(valor));
}

/**
 * Obtiene la categoría del Z-score
 */
export function getCategoriaZScore(zScore: number | undefined): {
  label: string;
  className: string;
} {
  if (zScore === undefined) return { label: 'Sin datos', className: 'neutral' };
  
  if (zScore <= -2) return { label: 'Muy bajo', className: 'muy-bajo' };
  if (zScore <= -1) return { label: 'Bajo', className: 'bajo' };
  if (zScore <= 1) return { label: 'Normal', className: 'normal' };
  if (zScore <= 2) return { label: 'Alto', className: 'alto' };
  return { label: 'Muy alto', className: 'muy-alto' };
}

/**
 * Cruza datos del GeoJSON con predicciones
 */
export function cruzarDatosConPredicciones(
  geoJSON: GeoJSONData,
  predicciones: Prediccion[],
  modelo: ModeloTipo
): Map<string, Prediccion | null> {
  const resultado = new Map<string, Prediccion | null>();
  
  geoJSON.features.forEach((feature) => {
    const nombreComuna = feature.properties.Comuna;
    const prediccion = buscarPrediccionComuna(predicciones, nombreComuna, modelo);
    resultado.set(nombreComuna, prediccion);
  });
  
  return resultado;
}
