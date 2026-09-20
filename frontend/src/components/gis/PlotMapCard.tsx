import React, { useState } from 'react';
import { MapPin, Download, Layers } from 'lucide-react';
import { MapContainer } from '../MapContainer';
import { GeoPolygon, Field } from '../../types';

interface PlotMapCardProps {
  field?: Field;
  gatNo?: string;
  villageName?: string;
  areaHa?: number;
  geometry?: GeoPolygon;
  centroid?: [number, number];
}

export const PlotMapCard: React.FC<PlotMapCardProps> = ({
  field,
  gatNo = field?.gat_no || '104',
  villageName = field?.village_name || 'Malegaon',
  areaHa = field?.area_hectares || 1.96,
  geometry = field?.geometry,
  centroid = field?.centroid || [18.1565, 74.5242],
}) => {
  const [activeTab, setActiveTab] = useState<'satellite' | 'street' | 'kml'>('satellite');

  const handleDownloadKML = () => {
    // Generate valid KML blob and trigger download
    const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Gat_${gatNo}_${villageName}.kml</name>
    <Placemark>
      <name>Gat No. ${gatNo}</name>
      <description>Village: ${villageName}, Area: ${areaHa} ha</description>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>
              ${geometry?.coordinates[0].map(c => `${c[0]},${c[1]},0`).join(' ')}
            </coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
  </Document>
</kml>`;

    const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Gat_${gatNo}_Malegaon.kml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header bar matching reference */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-700" />
          <h3 className="text-sm font-bold text-slate-900">
            Plot Map (Gat No. {gatNo})
          </h3>
        </div>

        {/* Satellite / Map / KML switcher matching reference */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('satellite')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'satellite'
                ? 'bg-portal-active text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Satellite
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('street')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'street'
                ? 'bg-portal-active text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Map
          </button>
          <button
            type="button"
            onClick={handleDownloadKML}
            className="px-3 py-1 rounded-md text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all"
          >
            KML
          </button>
        </div>
      </div>

      {/* MapLibre GIS Container */}
      <div className="relative">
        <MapContainer
          geometry={geometry}
          centroid={centroid}
          height="380px"
          fieldGatNo={gatNo}
          villageName={villageName}
          areaHa={areaHa}
        />
      </div>

      {/* Footer bar with legend and KML download */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-xs bg-[#eab308]/40 border-2 border-[#eab308]"></span>
          <span className="font-semibold text-slate-700">
            Selected Plot (Gat No. {gatNo})
          </span>
        </div>

        <button
          type="button"
          onClick={handleDownloadKML}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Download KML</span>
        </button>
      </div>
    </div>
  );
};
