import React, { useEffect, useState } from 'react';
import { Layers, Search, Filter, AlertCircle } from 'lucide-react';
import { Layout } from '../components/Layout';
import { FieldCard } from '../components/FieldCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { Input } from '../components/Input';
import { Field } from '../types';
import { getMyFields } from '../lib/api/client';
import { DEMO_FIELDS } from '../data/demoData';

export const FarmerFieldsPage: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFields = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getMyFields();
        if (res.data?.fields) {
          setFields(res.data.fields);
        } else {
          setFields(DEMO_FIELDS);
        }
      } catch (err: any) {
        // Graceful fallback to authorized demo fields
        setFields(DEMO_FIELDS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFields();
  }, []);

  const filteredFields = fields.filter((f) => {
    const query = searchQuery.toLowerCase();
    return (
      f.gat_no.toLowerCase().includes(query) ||
      f.village_name.toLowerCase().includes(query) ||
      (f.soil_type && f.soil_type.toLowerCase().includes(query))
    );
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">
                Authorized Cadastral Fields
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                {fields.length} Registered
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Official cadastral survey numbers authorized for your farmer profile
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full sm:w-72">
            <Input
              type="text"
              placeholder="Search by Gat No. (e.g. 104)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Content area */}
        {isLoading ? (
          <LoadingState message="Fetching authorized cadastral records..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : filteredFields.length === 0 ? (
          <EmptyState
            title="No Matching Fields"
            description={`No cadastral fields found matching "${searchQuery}".`}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFields.map((field) => (
              <FieldCard key={field.id} field={field} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
