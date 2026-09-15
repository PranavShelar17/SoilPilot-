import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Layers, ShieldCheck, Download, AlertCircle } from 'lucide-react';
import { Layout } from '../components/Layout';
import { MapContainer } from '../components/MapContainer';
import { SoilHealthCard } from '../components/SoilHealthCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { Button } from '../components/Button';
import { Field, SoilHealthCard as ISoilHealthCard } from '../types';
import { getFieldById, getFieldSoil } from '../lib/api/client';
import { DEMO_FIELDS, DEMO_SOIL_CARDS, DEMO_FARMER } from '../data/demoData';
import { useAuth } from '../context/AuthContext';

export const FieldDetailPage: React.FC = () => {
  const { fieldId } = useParams<{ fieldId: string }>();
  const { farmer } = useAuth();

  const [field, setField] = useState<Field | null>(null);
  const [soilCard, setSoilCard] = useState<ISoilHealthCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchFieldAndSoil = async () => {
      if (!fieldId) return;

      setIsLoading(true);
      setErrorCode(null);
      setErrorMessage(null);

      try {
        // 1. Try querying backend field & soil APIs
        try {
          const [fieldRes, soilRes] = await Promise.all([
            getFieldById(fieldId),
            getFieldSoil(fieldId),
          ]);

          if (fieldRes.data) {
            setField(fieldRes.data);
          }
          if (soilRes.data) {
            setSoilCard(soilRes.data);
          }
          setIsLoading(false);
          return;
        } catch (apiErr: any) {
          if (apiErr.response?.status === 403) {
            setErrorCode(403);
            setErrorMessage('This cadastral plot is not associated with your authorized farmer account.');
            setIsLoading(false);
            return;
          }
          if (apiErr.response?.status === 404) {
            setErrorCode(404);
            setErrorMessage('Field record not found in this village jurisdiction.');
            setIsLoading(false);
            return;
          }
        }

        // 2. Demo fallback for local development & demonstration
        const numericId = parseInt(fieldId, 10);
        const matchField = DEMO_FIELDS.find(
          (f) => f.id === numericId || f.gat_no === fieldId
        );

        if (matchField) {
          setField(matchField);
          const matchCard = DEMO_SOIL_CARDS[matchField.id] || DEMO_SOIL_CARDS[104];
          setSoilCard(matchCard);
          setIsLoading(false);
        } else {
          setErrorCode(404);
          setErrorMessage(`No field found for Gat / ID ${fieldId}. V1 pilot covers Gat 104, 105, 108.`);
          setIsLoading(false);
        }
      } catch {
        setErrorCode(500);
        setErrorMessage('Failed to load field details.');
        setIsLoading(false);
      }
    };

    fetchFieldAndSoil();
  }, [fieldId]);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <LoadingState message="Loading Cadastral Boundary & Soil Health Records..." />
        </div>
      </Layout>
    );
  }

  if (errorCode || !field || !soilCard) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ErrorState statusCode={errorCode || 404} message={errorMessage || undefined} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <Link to="/farmer/fields">
              <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Fields List
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Gat No. {field.gat_no}
                  {field.sub_division ? `/${field.sub_division}` : ''}
                </h1>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Authorized Plot
                </span>
                {field.is_demo && (
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
                    DEMO DATA
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                Village {field.village_name}, Taluka {field.taluka_name}, District {field.district_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/farmer/report/rep-${field.id}-01`}>
              <Button variant="primary" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                Download PDF Report
              </Button>
            </Link>
          </div>
        </div>

        {/* GIS Cadastral Map Container */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-gov-primary" />
              Cadastral GIS Map (MapLibre GL JS)
            </h3>
            <span className="text-[11px] text-slate-500">
              Polygon Area: {field.area_hectares} Ha ({field.area_acres} Acres)
            </span>
          </div>

          <MapContainer
            geometry={field.geometry}
            centroid={field.centroid || [18.1565, 74.5242]}
            height="460px"
            fieldGatNo={field.gat_no}
            villageName={field.village_name}
            areaHa={field.area_hectares}
          />
        </div>

        {/* Comprehensive Soil Health Card */}
        <SoilHealthCard
          card={soilCard}
          farmer={farmer || DEMO_FARMER}
          field={field}
          reportId={`rep-${field.id}-01`}
        />
      </div>
    </Layout>
  );
};
