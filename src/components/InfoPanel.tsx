import type { Prediccion, ModeloTipo } from '../utils/dataUtils';
import {
  MODELOS,
  formatearNumero,
  getCategoriaZScore,
} from '../utils/dataUtils';
import '../styles/InfoPanel.css';

interface InfoPanelProps {
  modeloSeleccionado: ModeloTipo;
  onModeloChange: (modelo: ModeloTipo) => void;
  comunaSeleccionada: string | null;
  comunaHover: string | null;
  prediccionActual: Prediccion | null;
}

export function InfoPanel({
  modeloSeleccionado,
  onModeloChange,
  comunaSeleccionada,
  comunaHover,
  prediccionActual,
}: InfoPanelProps) {
  const comunaMostrar = comunaHover || comunaSeleccionada;

  return (
    <aside className="info-panel">
      {/* Header */}
      <header className="panel-header">
        <h1 className="panel-title">Migración RM</h1>
        <p className="panel-subtitle">Predicciones 2023</p>
      </header>

      {/* Selector de modelo */}
      <section className="panel-section">
        <label className="section-label" htmlFor="modelo-select">
          Modelo de Predicción
        </label>
        <select
          id="modelo-select"
          className="modelo-select"
          value={modeloSeleccionado}
          onChange={(e) => onModeloChange(e.target.value as ModeloTipo)}
        >
          {MODELOS.map((modelo) => (
            <option key={modelo.value} value={modelo.value}>
              {modelo.label}
            </option>
          ))}
        </select>
      </section>

      {/* Información de comuna */}
      <section className="panel-section comuna-info">
        {comunaMostrar ? (
          <>
            <h2 className="comuna-nombre">{comunaMostrar}</h2>
            
            {prediccionActual ? (
              <div className="predicciones-container">
                {/* Emigración */}
                <div className="prediccion-card emigracion">
                  <div className="prediccion-header">
                    <span className="prediccion-icon">↗</span>
                    <span className="prediccion-label">Emigración</span>
                  </div>
                  <div className="prediccion-value">
                    {formatearNumero(prediccionActual.emigracion_pred)}
                  </div>
                  <div className={`prediccion-badge ${getCategoriaZScore(prediccionActual.emigracion_pred_z).className}`}>
                    {getCategoriaZScore(prediccionActual.emigracion_pred_z).label}
                    <span className="z-score">
                      (z: {prediccionActual.emigracion_pred_z?.toFixed(2)})
                    </span>
                  </div>
                </div>

                {/* Inmigración */}
                <div className="prediccion-card inmigracion">
                  <div className="prediccion-header">
                    <span className="prediccion-icon">↙</span>
                    <span className="prediccion-label">Inmigración</span>
                  </div>
                  <div className="prediccion-value">
                    {formatearNumero(prediccionActual.inmigracion_pred)}
                  </div>
                  <div className={`prediccion-badge ${getCategoriaZScore(prediccionActual.inmigracion_pred_z).className}`}>
                    {getCategoriaZScore(prediccionActual.inmigracion_pred_z).label}
                    <span className="z-score">
                      (z: {prediccionActual.inmigracion_pred_z?.toFixed(2)})
                    </span>
                  </div>
                </div>

                {/* Balance migratorio */}
                <div className="balance-container">
                  <span className="balance-label">Balance Migratorio</span>
                  <span className={`balance-value ${
                    (prediccionActual.inmigracion_pred ?? 0) - (prediccionActual.emigracion_pred ?? 0) >= 0 
                      ? 'positivo' 
                      : 'negativo'
                  }`}>
                    {formatearNumero(
                      (prediccionActual.inmigracion_pred ?? 0) - (prediccionActual.emigracion_pred ?? 0)
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <div className="no-data">
                <p>No hay datos de predicción disponibles para esta comuna con el modelo seleccionado.</p>
              </div>
            )}
          </>
        ) : (
          <div className="placeholder">
            <p>Selecciona una comuna en el mapa para ver sus predicciones migratorias.</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="panel-footer">
        <p>Datos de migración interna Chile 2018-2023</p>
        <p className="disclaimer">Data Science - Universidad Diego Portales</p>
      </footer>
    </aside>
  );
}
