import React, { useState, useMemo } from 'react';
import { Search, MapPin, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { searchFieldByGat } from '../lib/api/client';
import { DEMO_FIELDS } from '../data/demoData';
import { PUNE_DISTRICT_LOCATIONS, MAHARASHTRA_STATE_LOCATIONS } from '../data/locationData';
import { useTranslation } from 'react-i18next';

interface FieldSearchProps {
  onSelectField?: (fieldId: number | string) => void;
  className?: string;
}

export const FieldSearch: React.FC<FieldSearchProps> = ({ onSelectField, className = '' }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
  const isMr = i18n.language.startsWith('mr');

  // Hierarchy Selection State
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Pune');
  const [selectedTaluka, setSelectedTaluka] = useState<string>('Baramati');
  const [selectedVillage, setSelectedVillage] = useState<string>('Malegaon');
  const [gatNo, setGatNo] = useState<string>('104');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // 1. States
  const availableStates = useMemo(() => [
    { name: 'Maharashtra', name_mr: 'महाराष्ट्र' }
  ], []);

  // 2. Districts (Enabled only when State is selected)
  const isDistrictEnabled = Boolean(selectedState);
  const availableDistricts = useMemo(() => {
    if (!selectedState) return [];
    return MAHARASHTRA_STATE_LOCATIONS.districts.map((d) => ({
      name: d.district,
      name_mr: d.district_mr,
    }));
  }, [selectedState]);

  // 3. Talukas (Enabled only when District is selected)
  const isTalukaEnabled = Boolean(selectedState && selectedDistrict);
  const availableTalukas = useMemo(() => {
    if (!selectedDistrict) return [];
    return PUNE_DISTRICT_LOCATIONS.talukas;
  }, [selectedDistrict]);

  // Current Taluka Object
  const currentTalukaObj = useMemo(() => {
    if (!selectedTaluka) return null;
    return availableTalukas.find((t) => t.name === selectedTaluka) || null;
  }, [availableTalukas, selectedTaluka]);

  // 4. Villages (Enabled only when Taluka is selected)
  const isVillageEnabled = Boolean(isTalukaEnabled && selectedTaluka && currentTalukaObj);
  const availableVillages = useMemo(() => {
    return currentTalukaObj?.villages || [];
  }, [currentTalukaObj]);

  // Current Village Object
  const currentVillageObj = useMemo(() => {
    if (!selectedVillage) return null;
    return availableVillages.find((v) => v.name === selectedVillage) || null;
  }, [availableVillages, selectedVillage]);

  // 5. Gats (Enabled only when Village is selected)
  const isGatEnabled = Boolean(isVillageEnabled && selectedVillage && currentVillageObj);
  const availableGats = useMemo(() => {
    return currentVillageObj?.available_gats || ['104', '105', '108'];
  }, [currentVillageObj]);

  // Handle State Change
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);
    if (!newState) {
      setSelectedDistrict('');
      setSelectedTaluka('');
      setSelectedVillage('');
      setGatNo('');
    } else {
      setSelectedDistrict('Pune');
      setSelectedTaluka('Baramati');
      setSelectedVillage('Malegaon');
      setGatNo('104');
    }
    setStatusMessage(null);
  };

  // Handle District Change
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDistrict = e.target.value;
    setSelectedDistrict(newDistrict);
    if (!newDistrict) {
      setSelectedTaluka('');
      setSelectedVillage('');
      setGatNo('');
    } else {
      setSelectedTaluka('Baramati');
      setSelectedVillage('Malegaon');
      setGatNo('104');
    }
    setStatusMessage(null);
  };

  // Handle Taluka Change
  const handleTalukaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTaluka = e.target.value;
    setSelectedTaluka(newTaluka);
    const talukaObj = availableTalukas.find((t) => t.name === newTaluka);
    const firstVillage = talukaObj?.villages[0]?.name || '';
    setSelectedVillage(firstVillage);
    const villageObj = talukaObj?.villages[0];
    const firstGat = villageObj?.available_gats[0] || '';
    setGatNo(firstGat);
    setStatusMessage(null);
  };

  // Handle Village Change
  const handleVillageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVillage = e.target.value;
    setSelectedVillage(newVillage);
    const villageObj = availableVillages.find((v) => v.name === newVillage);
    const firstGat = villageObj?.available_gats[0] || '';
    setGatNo(firstGat);
    setStatusMessage(null);
  };

  // Handle Search Submission
  const handleLocatePlot = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Incomplete location validation
    if (!selectedState || !selectedDistrict || !selectedTaluka || !selectedVillage) {
      setStatusMessage({
        type: 'error',
        text: isMr
          ? 'कृपया राज्य, जिल्हा, तालुका आणि गाव निवडा.'
          : 'Please select State, District, Taluka and Village.'
      });
      return;
    }

    // 2. Incomplete Gat validation
    if (!gatNo.trim()) {
      setStatusMessage({
        type: 'error',
        text: isMr
          ? 'कृपया वैध गट / सर्व्हे क्रमांक टाका.'
          : 'Please enter a valid Gat / Survey Number.'
      });
      return;
    }

    setStatusMessage(null);
    setIsLoading(true);

    try {
      if (isAuthenticated) {
        try {
          const res = await searchFieldByGat(gatNo.trim());
          if (res.data && res.data.id) {
            setIsLoading(false);
            setStatusMessage({
              type: 'success',
              text: isMr ? 'शेत यशस्वीरीत्या सापडले.' : 'Field located successfully.'
            });
            setTimeout(() => {
              if (onSelectField) {
                onSelectField(res.data.id);
              } else {
                navigate(`/farmer/field/${res.data.id}`);
              }
            }, 500);
            return;
          }
        } catch {
          // Fallback to demo fields
        }
      }

      // Check authorized demo fields
      const cleanGat = gatNo.trim().toLowerCase();
      const match = DEMO_FIELDS.find(
        (f) =>
          f.gat_no.toLowerCase() === cleanGat &&
          f.village_name.toLowerCase() === selectedVillage.toLowerCase()
      ) || DEMO_FIELDS.find((f) => f.gat_no.toLowerCase() === cleanGat);

      setIsLoading(false);

      if (match) {
        setStatusMessage({
          type: 'success',
          text: isMr ? 'शेत यशस्वीरीत्या सापडले.' : 'Field located successfully.'
        });
        setTimeout(() => {
          if (onSelectField) {
            onSelectField(match.id);
          } else {
            navigate(`/farmer/field/${match.id}`);
          }
        }, 500);
      } else {
        setStatusMessage({
          type: 'error',
          text: isMr
            ? 'निवडलेल्या स्थानासाठी शेत सापडले नाही.'
            : 'Field not found for the selected location.'
        });
      }
    } catch {
      setIsLoading(false);
      setStatusMessage({
        type: 'error',
        text: isMr
          ? 'माहिती शोधण्यात अडचण आली. कृपया पुन्हा प्रयत्न करा.'
          : 'An error occurred while searching for the field. Please try again.'
      });
    }
  };

  return (
    <div className={`w-full max-w-6xl mx-auto bg-white rounded-3xl border border-[#FBE6C2] shadow-sm p-4 sm:p-6 lg:p-8 ${className}`}>
      {/* Header section with location icon and clear explanation */}
      <div className="flex items-start sm:items-center gap-3.5 pb-6 mb-6 border-b border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-[#FFF8CF] border border-[#FBE6C2] flex items-center justify-center text-[#2A7C13] shadow-xs flex-shrink-0">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {isMr ? 'आपली मृदा आरोग्य नोंद शोधा' : 'Find Your Soil Health Record'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            {isMr
              ? 'आपले क्षेत्र आणि मातीची माहिती पाहण्यासाठी आपले स्थान निवडा आणि आपला गट क्रमांक टाका.'
              : 'Select your location and enter your Gat number to view your field and soil information.'}
          </p>
        </div>
      </div>

      {/* Visual Hierarchy Flow Breadcrumb Indicator */}
      <div className="hidden md:flex items-center gap-2 mb-6 px-4 py-2.5 bg-[#fbfcf9] rounded-xl border border-slate-100 text-xs font-semibold text-slate-600">
        <span className="text-[#2A7C13] font-bold">{isMr ? 'स्थान क्रमवारी' : 'Hierarchy'}:</span>
        <span className={selectedState ? 'text-slate-900 font-bold' : 'text-slate-400'}>State</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className={selectedDistrict ? 'text-slate-900 font-bold' : 'text-slate-400'}>District</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className={selectedTaluka ? 'text-slate-900 font-bold' : 'text-slate-400'}>Taluka</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className={selectedVillage ? 'text-slate-900 font-bold' : 'text-slate-400'}>Village</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className={gatNo ? 'text-[#2A7C13] font-black' : 'text-slate-400'}>Gat / Survey Number</span>
      </div>

      {/* Status Feedback Notification */}
      {statusMessage && (
        <div
          className={`p-4 mb-6 rounded-2xl flex items-center gap-3 text-sm font-semibold transition-all ${
            statusMessage.type === 'success'
              ? 'bg-[#FFF8CF] text-[#2A7C13] border border-[#76C457]'
              : 'bg-[#FBE6C2] text-slate-900 border border-[#e8ce9e]'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#2A7C13] flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-[#2A7C13] flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Hierarchical Form */}
      <form onSubmit={handleLocatePlot} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. STATE */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
              {isMr ? 'राज्य' : 'State'}
            </label>
            <div className="relative">
              <select
                value={selectedState}
                onChange={handleStateChange}
                className="w-full h-12 px-3.5 py-3 bg-white border border-slate-300 rounded-xl text-base font-semibold text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#2A7C13] focus:border-[#2A7C13] transition-all"
              >
                <option value="">{isMr ? '-- राज्य निवडा --' : '-- Select State --'}</option>
                {availableStates.map((s) => (
                  <option key={s.name} value={s.name}>
                    {isMr ? `${s.name_mr} (${s.name})` : s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. DISTRICT */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
              {isMr ? 'जिल्हा' : 'District'}
            </label>
            <div className="relative">
              <select
                disabled={!isDistrictEnabled}
                value={selectedDistrict}
                onChange={handleDistrictChange}
                className={`w-full h-12 px-3.5 py-3 border rounded-xl text-base font-semibold shadow-xs transition-all ${
                  isDistrictEnabled
                    ? 'bg-white border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2A7C13] focus:border-[#2A7C13]'
                    : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <option value="">{isMr ? '-- जिल्हा निवडा --' : '-- Select District --'}</option>
                {availableDistricts.map((d) => (
                  <option key={d.name} value={d.name}>
                    {isMr ? `${d.name_mr} (${d.name})` : d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. TALUKA */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
              {isMr ? 'तालुका' : 'Taluka'}
            </label>
            <div className="relative">
              <select
                disabled={!isTalukaEnabled}
                value={selectedTaluka}
                onChange={handleTalukaChange}
                className={`w-full h-12 px-3.5 py-3 border rounded-xl text-base font-semibold shadow-xs transition-all ${
                  isTalukaEnabled
                    ? 'bg-white border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2A7C13] focus:border-[#2A7C13]'
                    : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <option value="">{isMr ? '-- तालुका निवडा --' : '-- Select Taluka --'}</option>
                {availableTalukas.map((t) => (
                  <option key={t.name} value={t.name}>
                    {isMr ? `${t.name_mr} (${t.name})` : t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. VILLAGE */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
              {isMr ? 'गाव' : 'Village'}
            </label>
            <div className="relative">
              <select
                disabled={!isVillageEnabled}
                value={selectedVillage}
                onChange={handleVillageChange}
                className={`w-full h-12 px-3.5 py-3 border rounded-xl text-base font-semibold shadow-xs transition-all ${
                  isVillageEnabled
                    ? 'bg-white border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2A7C13] focus:border-[#2A7C13]'
                    : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <option value="">{isMr ? '-- गाव निवडा --' : '-- Select Village --'}</option>
                {availableVillages.map((v) => (
                  <option key={v.name} value={v.name}>
                    {isMr ? `${v.name_mr} (${v.name})` : v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 5. GAT / SURVEY NUMBER & LOCATE BUTTON */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end pt-2">
          {/* Gat Input (8 cols on desktop) */}
          <div className="lg:col-span-8">
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
              {isMr ? 'गट / सर्व्हे क्रमांक' : 'Gat / Survey Number'}
            </label>
            <div className="relative">
              <input
                type="text"
                list="available-gats-list"
                disabled={!isGatEnabled}
                value={gatNo}
                onChange={(e) => {
                  setGatNo(e.target.value);
                  if (statusMessage) setStatusMessage(null);
                }}
                placeholder={isMr ? 'गट / सर्व्हे क्रमांक टाका (उदा. 104)' : 'Enter Gat / Survey Number (e.g. 104)'}
                className={`w-full h-12 px-4 py-3 border rounded-xl text-base font-black shadow-xs transition-all ${
                  isGatEnabled
                    ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2A7C13] focus:border-[#2A7C13]'
                    : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              />
              <datalist id="available-gats-list">
                {availableGats.map((g) => (
                  <option key={g} value={g}>
                    {`Gat No. ${g}`}
                  </option>
                ))}
              </datalist>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 pl-1">
              {isMr
                ? `${selectedVillage || 'गावातील'} उपलब्ध गट: ${availableGats.join(', ')}`
                : `Available demo plots in ${selectedVillage || 'village'}: Gat ${availableGats.join(', Gat ')}`}
            </p>
          </div>

          {/* Locate Plot Button (4 cols on desktop) */}
          <div className="lg:col-span-4">
            <button
              type="submit"
              disabled={isLoading || !isGatEnabled || !gatNo.trim()}
              className="w-full h-12 px-6 rounded-xl bg-[#2A7C13] hover:bg-[#236810] active:bg-[#1c540d] text-white font-black text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <span>{isMr ? 'शोधत आहे...' : 'Locating...'}</span>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>{isMr ? 'प्लॉट शोधा' : 'Locate Plot'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FieldSearch;
