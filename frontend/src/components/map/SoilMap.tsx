import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Layers, Maximize2, MapPin, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import { GeoPolygon } from '../../types';

export interface SoilMapProps {
  geometry?: GeoPolygon | null;
  centroid?: [number, number]; // [lat, lng]
  height?: string;
  fieldGatNo?: string;
  villageName?: string;
  areaHa?: number;
  selectedDsmProperty?: string;
  selectedDsmValue?: number | string;
  propertyUnit?: string;
  className?: string;
  interactive?: boolean;
  showBoundary?: boolean;
  fields?: any[];
  selectedFieldId?: number | string;
}

// Basemap Tile Sources
const STREETS_STYLE = {
  version: 8 as const,
  sources: {
    'osm-tiles': {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm-layer',
      type: 'raster' as const,
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

const SATELLITE_STYLE = {
  version: 8 as const,
  sources: {
    'satellite-tiles': {
      type: 'raster' as const,
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution: '© Esri, Maxar, Earthstar Geographics',
    },
  },
  layers: [
    {
      id: 'satellite-layer',
      type: 'raster' as const,
      source: 'satellite-tiles',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

// Color palettes for DSM properties
const getDsmPropertyColor = (propertyKey?: string): string => {
  switch (propertyKey) {
    case 'ph':
      return '#2A7C13'; // Deep green
    case 'ec':
      return '#76C457'; // Green
    case 'oc':
      return '#854d0e'; // Brown/Amber
    case 'n':
      return '#15803d'; // Green
    case 'p':
      return '#b45309'; // Warm amber
    case 'k':
      return '#4d7c0f'; // Olive green
    case 'clay':
      return '#a16207'; // Clay brown
    case 'sand':
      return '#ca8a04'; // Sand yellow
    case 'silt':
      return '#65a30d'; // Light olive
    case 'cec':
      return '#166534'; // Forest
    case 'bulk_density':
      return '#3f6212'; // Earth
    default:
      return '#2A7C13';
  }
};

export const SoilMap: React.FC<SoilMapProps> = ({
  geometry,
  centroid = [18.1565, 74.5242], // Default Malegaon, Baramati
  height = '480px',
  fieldGatNo,
  villageName = 'Malegaon',
  areaHa,
  selectedDsmProperty,
  selectedDsmValue,
  propertyUnit = '',
  className = '',
  interactive = true,
  showBoundary = true,
  fields,
  selectedFieldId,
}) => {
  // Resolve geometry and centroid from fields array if passed
  const activeFieldFromList = fields?.find((f) => f.id === selectedFieldId) || fields?.[0];
  const activeGeometry = geometry || activeFieldFromList?.geometry;
  const activeCentroid = centroid || activeFieldFromList?.centroid || [18.1565, 74.5242];
  const activeGatNo = fieldGatNo || activeFieldFromList?.gat_no;
  const activeVillage = villageName || activeFieldFromList?.village_name || 'Malegaon';
  const activeArea = areaHa || activeFieldFromList?.area_hectares || activeFieldFromList?.area_ha;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [basemap, setBasemap] = useState<'streets' | 'satellite'>('satellite');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [coordinates, setCoordinates] = useState<[number, number]>(activeCentroid);

  // Render Polygon and DSM styling
  const renderFieldPolygon = useCallback((map: maplibregl.Map) => {
    if (!showBoundary || !activeGeometry || !activeGeometry.coordinates || activeGeometry.coordinates.length === 0) {
      return;
    }

    const sourceId = 'field-polygon-source';
    const fillLayerId = 'field-polygon-fill';
    const lineLayerId = 'field-polygon-line';

    // Remove existing layers if present
    if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
    if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);

    // Add GeoJSON polygon source
    map.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {
          gat_no: activeGatNo || '',
          village: activeVillage,
          area: activeArea || 0,
          dsm_property: selectedDsmProperty || '',
          dsm_value: selectedDsmValue || '',
        },
        geometry: activeGeometry,
      },
    });

    const fillColor = getDsmPropertyColor(selectedDsmProperty);

    // Fill Layer with DSM property tint
    map.addLayer({
      id: fillLayerId,
      type: 'fill',
      source: sourceId,
      paint: {
        'fill-color': fillColor,
        'fill-opacity': 0.45,
      },
    });

    // Boundary outline in sharp high-contrast SoilPilot green
    map.addLayer({
      id: lineLayerId,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': '#2A7C13',
        'line-width': 3.5,
      },
    });

    // Fit map bounds to polygon coordinates
    try {
      const bounds = new maplibregl.LngLatBounds();
      const coords = activeGeometry.coordinates[0];
      coords.forEach((coord: number[]) => {
        bounds.extend([coord[0], coord[1]]);
      });
      map.fitBounds(bounds, { padding: 60, maxZoom: 17, duration: 800 });
    } catch (err) {
      console.warn('Could not fit bounds to polygon:', err);
    }
  }, [showBoundary, activeGeometry, activeGatNo, activeVillage, activeArea, selectedDsmProperty, selectedDsmValue]);

  // Initialize MapLibre
  const initMap = useCallback(() => {
    if (!mapContainerRef.current) return;

    try {
      setHasError(false);
      setIsLoaded(false);

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      // MapLibre requires center as [lng, lat]
      const initialCenter: [number, number] = [activeCentroid[1], activeCentroid[0]];

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: basemap === 'satellite' ? SATELLITE_STYLE : STREETS_STYLE,
        center: initialCenter,
        zoom: 15,
        maxZoom: 19,
        minZoom: 6,
        interactive: interactive,
      });

      mapRef.current = map;

      // Navigation Controls
      if (interactive) {
        map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'top-right');
        map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-left');
      }

      map.on('load', () => {
        setIsLoaded(true);
        map.resize();
        renderFieldPolygon(map);
      });

      map.on('error', (e) => {
        console.error('MapLibre error occurred:', e);
      });

      map.on('mousemove', (e) => {
        setCoordinates([e.lngLat.lat, e.lngLat.lng]);
      });
    } catch (err: any) {
      console.error('Failed to initialize MapLibre GL:', err);
      setHasError(true);
      setErrorMessage(err?.message || 'WebGL context or MapLibre initialization failed.');
    }
  }, [basemap, activeCentroid, interactive, renderFieldPolygon]);

  useEffect(() => {
    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [initMap]);

  // Update field polygon when geometry or selected DSM property changes
  useEffect(() => {
    if (mapRef.current && isLoaded) {
      renderFieldPolygon(mapRef.current);
    }
  }, [activeGeometry, selectedDsmProperty, selectedDsmValue, isLoaded, renderFieldPolygon]);

  // Attach ResizeObserver to handle container size changes cleanly
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    });

    resizeObserver.observe(container);

    // Also trigger immediate resize after short timeout to handle DOM paint
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    }, 150);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, [isLoaded]);

  // Toggle basemap style
  const handleBasemapToggle = (type: 'streets' | 'satellite') => {
    setBasemap(type);
    if (!mapRef.current) return;

    mapRef.current.setStyle(type === 'satellite' ? SATELLITE_STYLE : STREETS_STYLE);

    mapRef.current.once('style.load', () => {
      if (mapRef.current) {
        mapRef.current.resize();
        renderFieldPolygon(mapRef.current);
      }
    });
  };

  // Reset view to boundary
  const resetView = () => {
    if (mapRef.current && activeGeometry) {
      renderFieldPolygon(mapRef.current);
    } else if (mapRef.current) {
      mapRef.current.flyTo({ center: [activeCentroid[1], activeCentroid[0]], zoom: 15, duration: 600 });
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex flex-col ${className}`}
      style={{ height, minHeight: '420px' }}
    >
      {/* Top Floating Map Controls */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 max-w-[90%]">
        {/* Plot Info Badge */}
        <div className="bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs text-xs font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#2A7C13]" />
          <span>
            {activeVillage} {activeGatNo ? `• Gat ${activeGatNo}` : ''}
          </span>
          {activeArea && (
            <span className="text-slate-500 font-medium">
              ({typeof activeArea === 'number' ? activeArea.toFixed(2) : activeArea} Ha)
            </span>
          )}
        </div>

        {/* Selected DSM Property Overlay Badge */}
        {selectedDsmProperty && (
          <div className="bg-[#FFF8CF]/95 backdrop-blur-xs border border-[#FBE6C2] rounded-xl px-3 py-1.5 shadow-xs text-xs font-black text-[#2A7C13] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2A7C13] animate-pulse"></span>
            <span className="uppercase">{selectedDsmProperty}</span>
            {selectedDsmValue !== undefined && (
              <span>: {selectedDsmValue} {propertyUnit}</span>
            )}
          </div>
        )}

        {/* Basemap Switcher */}
        <div className="bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-0.5 shadow-xs flex items-center text-xs">
          <button
            type="button"
            onClick={() => handleBasemapToggle('satellite')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              basemap === 'satellite'
                ? 'bg-[#2A7C13] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Satellite
          </button>
          <button
            type="button"
            onClick={() => handleBasemapToggle('streets')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              basemap === 'streets'
                ? 'bg-[#2A7C13] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Street
          </button>
        </div>

        {/* Reset View Button */}
        <button
          type="button"
          onClick={resetView}
          className="bg-white/95 backdrop-blur-xs border border-slate-200 hover:bg-slate-50 text-slate-700 p-1.5 rounded-xl shadow-xs cursor-pointer transition-all"
          title="Reset View to Field Boundary"
        >
          <Maximize2 className="w-4 h-4 text-slate-700" />
        </button>
      </div>

      {/* Loading Overlay */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-20 bg-slate-100/90 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#2A7C13] animate-spin" />
          <span className="text-xs font-bold text-slate-700">Loading soil map...</span>
        </div>
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 z-20 bg-white/95 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#FBE6C2] flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6 text-[#2A7C13]" />
          </div>
          <h4 className="text-sm font-black text-slate-900 mb-1">
            Unable to load the soil map.
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            {errorMessage || 'WebGL error or map service timeout. Please verify your connection.'}
          </p>
          <button
            type="button"
            onClick={initMap}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A7C13] hover:bg-[#236810] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* MapLibre Canvas Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full flex-1 min-h-[420px]"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Bottom Coordinates & EPSG Strip */}
      <div className="absolute bottom-2 left-3 z-10 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-md font-mono hidden sm:flex items-center gap-2">
        <span>Lat: {coordinates[0].toFixed(5)}, Lng: {coordinates[1].toFixed(5)}</span>
        <span className="text-slate-400">•</span>
        <span className="text-[#FFF8CF]">EPSG:4326</span>
      </div>
    </div>
  );
};

export default SoilMap;
