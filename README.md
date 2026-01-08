# Análisis de Patrones Migratorios y Factores Socioeconómicos en Comunas de Chile

![Machine Learning](https://img.shields.io/badge/Machine%20Learning-Migration%20Analysis-blue)
![Python](https://img.shields.io/badge/Python-3.x-green)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)

## 📋 Descripción

Este proyecto analiza los **patrones de emigración e inmigración** en las comunas de Chile durante el período **2018-2023**, evaluando la influencia de diversos factores socioeconómicos mediante técnicas de Machine Learning. El proyecto incluye un análisis exhaustivo de datos, modelos predictivos y una aplicación web interactiva para visualizar las predicciones.

## 🎯 Objetivos

1. **Identificar** las variables socioeconómicas que mejor predicen los flujos migratorios
2. **Construir** modelos predictivos de emigración e inmigración
3. **Comparar** el rendimiento de diferentes algoritmos de Machine Learning
4. **Analizar** la importancia relativa de cada variable
5. **Visualizar** los resultados de manera interactiva mediante un mapa de Chile

## ✨ Características Principales

- 📊 **Análisis exploratorio de datos (EDA)** completo con visualizaciones
- 🤖 **Modelos de Machine Learning** (Regresión Polinomial, Random Forest, Gradient Boosting)
- 🗺️ **Aplicación web interactiva** con mapa de comunas de Chile
- 📈 **Predicciones** de emigración e inmigración por comuna
- 🔍 **Análisis de componentes principales (PCA)** para reducción de dimensionalidad
- 📱 **Interfaz responsive** construida con React y TypeScript

## 📁 Estructura del Proyecto

```
analisis-migracion-intercomunal-chile-ml/
├── ml_pipeline/                    # Pipeline de Machine Learning
│   ├── DATASCIENCE_E2Codigo.ipynb # Notebook principal con análisis y modelos
│   └── data/                       # Datasets procesados
│       ├── Emigracion_poblacion_normalizado.xlsx
│       ├── Inmigracion_poblacion_normalizado.xlsx
│       └── indicadores_macroecon_promedio_anual.xlsx
├── frontend/                       # Aplicación web de visualización
│   ├── src/
│   │   ├── components/            # Componentes React
│   │   │   ├── MapComponent.tsx   # Mapa interactivo de Chile
│   │   │   └── InfoPanel.tsx      # Panel de información y controles
│   │   ├── data/                  # Datos para la aplicación
│   │   │   ├── comunas.json       # GeoJSON de comunas
│   │   │   └── predicciones.json  # Predicciones de los modelos
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── utils/                 # Utilidades
│   │   └── types/                 # Tipos TypeScript
│   └── package.json
├── presentation/                   # Presentación del proyecto
│   └── Proyecto-DataScience.pdf
└── README.md                       # Este archivo
```

## 🛠️ Tecnologías Utilizadas

### Machine Learning y Análisis de Datos
- **Python 3.x**
- **pandas** - Manipulación de datos
- **numpy** - Operaciones numéricas
- **scikit-learn** - Modelos de Machine Learning
- **matplotlib & seaborn** - Visualización de datos
- **ydata-profiling** - Perfilado automático de datos
- **Jupyter Notebook** - Desarrollo interactivo

### Frontend (Aplicación Web)
- **React 19.2** - Framework de interfaz de usuario
- **TypeScript 5.9** - Tipado estático
- **Vite** - Build tool y dev server
- **Leaflet & React-Leaflet** - Mapas interactivos
- **CSS Modules** - Estilos componetizados

## 📦 Instalación

### Requisitos Previos
- Python 3.x
- Node.js 18+ y npm
- Jupyter Notebook

### Pipeline de Machine Learning

```bash
# Navegar al directorio ml_pipeline
cd ml_pipeline

# Instalar dependencias de Python
pip install pandas matplotlib seaborn scikit-learn jupyterlab ipywidgets
pip install ydata-profiling openpyxl

# Iniciar Jupyter Notebook
jupyter notebook DATASCIENCE_E2Codigo.ipynb
```

### Aplicación Frontend

```bash
# Navegar al directorio frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# O construir para producción
npm run build
```

## 🚀 Uso

### 1. Análisis de Datos y Modelos ML

Abrir el notebook `ml_pipeline/DATASCIENCE_E2Codigo.ipynb` en Jupyter y ejecutar las celdas secuencialmente para:

- Cargar y explorar los datos de migración y variables socioeconómicas
- Realizar análisis exploratorio de datos (EDA)
- Aplicar transformaciones y normalización
- Entrenar modelos de Machine Learning
- Evaluar y comparar resultados
- Generar predicciones para las comunas

### 2. Visualización Interactiva

```bash
cd frontend
npm run dev
```

Esto iniciará la aplicación web en `http://localhost:5173`. La aplicación permite:

- 🗺️ Visualizar el mapa de comunas de Chile
- 🔄 Alternar entre modelos de predicción (Regresión Polinomial, Random Forest, Gradient Boosting)
- 🎨 Ver predicciones de emigración e inmigración con código de colores
- 📊 Consultar detalles específicos al hacer clic o hover sobre una comuna

## 📊 Variables Analizadas

### Variables Demográficas
- **Población** total de la comuna
- **Densidad** poblacional
- **Población país** (Chile)

### Variables Económicas
- **PIB** (millones USD, últimos 12 meses)
- **PIB per cápita** (en dos escalas diferentes)

### Variables de Migración (Variables objetivo)
- **Emigración** - Personas que dejan la comuna
- **Inmigración** - Personas que llegan a la comuna

## 🧮 Metodología

1. **Recopilación de Datos**: Datos de migración comunal y estadísticas macroeconómicas de Chile (2018-2023)

2. **Preprocesamiento**:
   - Limpieza y validación de datos
   - Transformación Yeo-Johnson para normalidad
   - Normalización Z-score
   - Manejo de valores atípicos

3. **Análisis Exploratorio**:
   - Estadísticas descriptivas
   - Matrices de correlación
   - Visualizaciones de distribuciones
   - Análisis de componentes principales (PCA)

4. **Modelado**:
   - **Regresión Polinomial** (grado 2)
   - **Random Forest Regressor**
   - **Gradient Boosting Regressor**

5. **Evaluación**:
   - Métricas: R², MAE, RMSE
   - Validación cruzada
   - Análisis de importancia de variables

## 📈 Resultados Principales

Los modelos desarrollados identificaron que:

- La **población** es el predictor más fuerte tanto para emigración como inmigración
- El **PIB per cápita** muestra una relación positiva significativa con la inmigración
- Los modelos de **Gradient Boosting** y **Random Forest** superan a la regresión polinomial en términos de R²
- Existe evidencia de **multicolinealidad** entre algunas variables económicas

Para resultados detallados, consultar el notebook y la presentación en PDF.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible para fines educativos y de investigación.

## 👥 Autores

Proyecto desarrollado como parte de un análisis de Data Science sobre migración intercomunal en Chile.

## 📞 Contacto

Para preguntas o sugerencias, por favor abre un issue en este repositorio.

---

**Nota**: Los datos utilizados en este proyecto son históricos (2018-2023) y las predicciones son con fines de análisis académico.
