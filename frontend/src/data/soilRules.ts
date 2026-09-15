export interface SoilRule {
  key: string;
  sr_no: number;
  name: string;
  name_mr: string;
  category: 'Chemical' | 'Macro Nutrient' | 'Secondary Nutrient' | 'Micro Nutrient' | 'Physical';
  unit: string;
  reference_range: string;
  reference_range_mr: string;
  low_threshold?: number;
  medium_threshold?: number;
  high_threshold?: number;
  classify: (value: number | null | undefined) => {
    status: string;
    status_mr: string;
    badgeClass: string;
    interpretation: string;
    interpretation_mr: string;
  };
}

export const SOIL_RULES: SoilRule[] = [
  {
    key: 'ph',
    sr_no: 1,
    name: 'Soil pH',
    name_mr: 'मातीचा सामू (pH)',
    category: 'Chemical',
    unit: 'pH',
    reference_range: '6.5 - 7.5 (Neutral)',
    reference_range_mr: '६.५ - ७.५ (उदासीन)',
    classify: (val) => {
      if (val == null) return { status: 'Not Available', status_mr: 'उपलब्ध नाही', badgeClass: 'status-badge-moderate', interpretation: 'Not tested for this sample.', interpretation_mr: 'तपासणी उपलब्ध नाही.' };
      if (val < 6.5) return { status: 'Acidic', status_mr: 'आम्लधर्मी', badgeClass: 'status-badge-deficient', interpretation: 'Acidic soil. Lime application advised.', interpretation_mr: 'आम्लधर्मी माती. चुन्याचा वापर सुचवला जातो.' };
      if (val <= 7.5) return { status: 'Normal', status_mr: 'उदासीन/योग्य', badgeClass: 'status-badge-sufficient', interpretation: 'Optimum neutral pH. Ideal for crop nutrient uptake.', interpretation_mr: 'उत्तम उदासीन सामू. पिकांच्या पोषकद्रव्य शोषणासाठी आदर्श.' };
      if (val <= 8.5) return { status: 'Alkaline', status_mr: 'अल्कधर्मी', badgeClass: 'status-badge-moderate', interpretation: 'Moderately alkaline. Regular addition of organic compost and gypsum suggested.', interpretation_mr: 'मध्यम अल्कधर्मी. शेणखत व जिप्समचा वापर फायदेशीर ठरेल.' };
      return { status: 'Strongly Alkaline', status_mr: 'तीव्र अल्कधर्मी', badgeClass: 'status-badge-deficient', interpretation: 'High alkalinity restricts micronutrient availability. Gypsum reclamation required.', interpretation_mr: 'जास्त अल्कधर्मी. सूक्ष्मअन्नद्रव्यांची कमतरता जाणवू शकते.' };
    }
  },
  {
    key: 'ec',
    sr_no: 2,
    name: 'Electrical Conductivity (EC)',
    name_mr: 'विद्युत चालकता (EC)',
    category: 'Chemical',
    unit: 'dS/m',
    reference_range: '< 1.0 (Non-saline)',
    reference_range_mr: '< १.० (क्षारविरहित)',
    classify: (val) => {
      if (val == null) return { status: 'Not Available', status_mr: 'उपलब्ध नाही', badgeClass: 'status-badge-moderate', interpretation: 'Not tested.', interpretation_mr: 'तपासणी उपलब्ध नाही.' };
      if (val < 1.0) return { status: 'Normal', status_mr: 'सामान्य', badgeClass: 'status-badge-sufficient', interpretation: 'Non-saline, ideal safe range for root zone health.', interpretation_mr: 'क्षाररहित, पिकांच्या मुळांसाठी सुरक्षित व अनुकूल.' };
      if (val <= 2.0) return { status: 'Critical', status_mr: 'मध्यम क्षार', badgeClass: 'status-badge-moderate', interpretation: 'Slightly saline. Sensitive crops may suffer yield reduction.', interpretation_mr: 'किंचित क्षारयुक्त. संवेदनशील पिकांवर परिणाम होऊ शकतो.' };
      return { status: 'Saline', status_mr: 'क्षारयुक्त', badgeClass: 'status-badge-deficient', interpretation: 'Saline soil. Drainage improvement and leaching required.', interpretation_mr: 'जास्त क्षारयुक्त. पाण्याचा निचरा सुधारणे आवश्यक.' };
    }
  },
  {
    key: 'organic_carbon',
    sr_no: 3,
    name: 'Organic Carbon (OC)',
    name_mr: 'सेंद्रिय कर्ब (OC)',
    category: 'Chemical',
    unit: '%',
    reference_range: '0.50 - 0.75% (Medium)',
    reference_range_mr: '०.५० - ०.७५% (मध्यम)',
    classify: (val) => {
      if (val == null) return { status: 'Not Available', status_mr: 'उपलब्ध नाही', badgeClass: 'status-badge-moderate', interpretation: 'Not tested.', interpretation_mr: 'तपासणी उपलब्ध नाही.' };
      if (val < 0.50) return { status: 'Low', status_mr: 'कमी', badgeClass: 'status-badge-deficient', interpretation: 'Low carbon reserve. Green manuring (sunhemp/dhaincha) and FYM strongly advised.', interpretation_mr: 'सेंद्रिय कर्ब कमी आहे. हिरवळीची खते (ताग/धेंच्या) व शेणखत वापरा.' };
      if (val <= 0.75) return { status: 'Medium', status_mr: 'मध्यम', badgeClass: 'status-badge-moderate', interpretation: 'Moderate level. Maintain with continuous organic recycling.', interpretation_mr: 'मध्यम प्रमाण. सेंद्रिय खतांचा नियमित वापर चालू ठेवा.' };
      return { status: 'High', status_mr: 'भरपूर/उत्तम', badgeClass: 'status-badge-sufficient', interpretation: 'Excellent biological activity and moisture retention.', interpretation_mr: 'सेंद्रिय कर्ब उत्तम आहे. जमिनीची सुपीकता चांगली आहे.' };
    }
  },
  {
    key: 'nitrogen',
    sr_no: 4,
    name: 'Available Nitrogen (N)',
    name_mr: 'उपलब्ध नत्र (N)',
    category: 'Macro Nutrient',
    unit: 'kg/ha',
    reference_range: '280 - 560 kg/ha',
    reference_range_mr: '२८० - ५६० किलो/हेक्टर',
    classify: (val) => {
      if (val == null) return { status: 'Not Available', status_mr: 'उपलब्ध नाही', badgeClass: 'status-badge-moderate', interpretation: 'Not tested.', interpretation_mr: 'तपासणी उपलब्ध नाही.' };
      if (val < 280) return { status: 'Low', status_mr: 'कमी', badgeClass: 'status-badge-deficient', interpretation: 'Deficient nitrogen. Split application of recommended nitrogenous fertilizers.', interpretation_mr: 'नत्र कमी आहे. युरिया किंवा सेंद्रिय नत्र विभागून द्यावे.' };
      if (val <= 560) return { status: 'Medium', status_mr: 'मध्यम', badgeClass: 'status-badge-moderate', interpretation: 'Sufficient medium level for current cropping pattern.', interpretation_mr: 'मध्यम प्रमाण. पिकांच्या शिफारसीनुसार खतमात्रा द्या.' };
      return { status: 'High', status_mr: 'भरपूर', badgeClass: 'status-badge-sufficient', interpretation: 'High nitrogen reserve in root zone.', interpretation_mr: 'नत्र मुबलक प्रमाणात आहे.' };
    }
  },
  {
    key: 'phosphorus',
    sr_no: 5,
    name: 'Available Phosphorus (P)',
    name_mr: 'उपलब्ध स्फुरद (P)',
    category: 'Macro Nutrient',
    unit: 'kg/ha',
    reference_range: '14 - 28 kg/ha',
    reference_range_mr: '१४ - २८ किलो/हेक्टर',
    classify: (val) => {
      if (val == null) return { status: 'Not Available', status_mr: 'उपलब्ध नाही', badgeClass: 'status-badge-moderate', interpretation: 'Not tested.', interpretation_mr: 'तपासणी उपलब्ध नाही.' };
      if (val < 14) return { status: 'Low', status_mr: 'कमी', badgeClass: 'status-badge-deficient', interpretation: 'Deficient in phosphorus. Apply single super phosphate (SSP) or DAP.', interpretation_mr: 'स्फुरद कमी आहे. सिंगल सुपर फॉस्फेट किंवा डीएपी वापरावे.' };
      if (val <= 28) return { status: 'Medium', status_mr: 'मध्यम', badgeClass: 'status-badge-moderate', interpretation: 'Medium satisfactory level. Use PSB bio-fertilizers for better availability.', interpretation_mr: 'मध्यम समाधानकारक प्रमाण. पीएसबी जिवाणू संवर्धक वापरा.' };
      return { status: 'High', status_mr: 'भरपूर', badgeClass: 'status-badge-sufficient', interpretation: 'Abundant available phosphorus.', interpretation_mr: 'स्फुरदाचे प्रमाण मुबलक आहे.' };
    }
  },
  {
    key: 'potassium',
    sr_no: 6,
    name: 'Available Potassium (K)',
    name_mr: 'उपलब्ध पालाश (K)',
    category: 'Macro Nutrient',
    unit: 'kg/ha',
    reference_range: '150 - 280 kg/ha',
    reference_range_mr: '१५० - २८० किलो/हेक्टर',
    classify: (val) => {
      if (val == null) return { status: 'Not Available', status_mr: 'उपलब्ध नाही', badgeClass: 'status-badge-moderate', interpretation: 'Not tested.', interpretation_mr: 'तपासणी उपलब्ध नाही.' };
      if (val < 150) return { status: 'Low', status_mr: 'कमी', badgeClass: 'status-badge-deficient', interpretation: 'Potassium deficiency. Muriate of Potash (MOP) required.', interpretation_mr: 'पालाश कमी आहे. म्युरेट ऑफ पोटॅश (MOP) चा वापर करावा.' };
      if (val <= 280) return { status: 'Medium', status_mr: 'मध्यम', badgeClass: 'status-badge-moderate', interpretation: 'Adequate native level.', interpretation_mr: 'पालाश मध्यम प्रमाणात उपलब्ध आहे.' };
      return { status: 'Very High', status_mr: 'खूप जास्त', badgeClass: 'status-badge-sufficient', interpretation: 'Rich native potassium reservoir characteristic of basaltic soil.', interpretation_mr: 'काळ्या जमिनीत पालाश मुबलक प्रमाणात उपलब्ध आहे.' };
    }
  },
  {
    key: 'exchangeable_sodium',
    sr_no: 7,
    name: 'Exchangeable Sodium (Na)',
    name_mr: 'सोडियम प्रमाण (Na)',
    category: 'Secondary Nutrient',
    unit: 'meq/100g',
    reference_range: '< 1.5 meq/100g',
    reference_range_mr: '< १.५ मी.इ./१०० ग्रॅम',
    classify: (val) => {
      if (val == null) return { status: 'Not Available', status_mr: 'उपलब्ध नाही', badgeClass: 'status-badge-moderate', interpretation: 'Not tested.', interpretation_mr: 'तपासणी उपलब्ध नाही.' };
      if (val < 1.5) return { status: 'Normal', status_mr: 'सुरक्षित', badgeClass: 'status-badge-sufficient', interpretation: 'Safe sodicity level. No adverse physical degradation.', interpretation_mr: 'सोडियम सुरक्षित पातळीत आहे.' };
      return { status: 'High', status_mr: 'जास्त', badgeClass: 'status-badge-deficient', interpretation: 'High sodicity risk. Regular organic matter and gypsum advised.', interpretation_mr: 'सोडियम जास्त आहे. जिप्समचा वापर करा.' };
    }
  },
  {
    key: 'free_lime',
    sr_no: 8,
    name: 'Free Lime / Calcium Carbonate (CaCO3)',
    name_mr: 'मुक्त चुना (CaCO3)',
    category: 'Chemical',
    unit: '%',
    reference_range: '< 5% (Low)',
    reference_range_mr: '< ५% (कमी)',
    classify: (val) => {
      if (val == null) return { status: 'Not Available', status_mr: 'उपलब्ध नाही', badgeClass: 'status-badge-moderate', interpretation: 'Not tested.', interpretation_mr: 'तपासणी उपलब्ध नाही.' };
      if (val < 5.0) return { status: 'Low', status_mr: 'कमी/सुरक्षित', badgeClass: 'status-badge-sufficient', interpretation: 'Safe low free lime. Good nutrient mobility.', interpretation_mr: 'चुन्याचे प्रमाण कमी व सुरक्षित आहे.' };
      if (val <= 10.0) return { status: 'Medium', status_mr: 'मध्यम', badgeClass: 'status-badge-moderate', interpretation: 'Moderately calcareous soil.', interpretation_mr: 'मध्यम चुनखडीयुक्त जमीन.' };
      return { status: 'Abundant', status_mr: 'भरपूर/जास्त', badgeClass: 'status-badge-deficient', interpretation: 'High free lime reduces iron and zinc availability. Apply chelated micronutrients.', interpretation_mr: 'मुक्त चुना जास्त असल्याने लोह व जस्ताची उपलब्धता कमी होऊ शकते.' };
    }
  },
  {
    key: 'iron',
    sr_no: 9,
    name: 'Available Iron (Fe)',
    name_mr: 'उपलब्ध लोह (Fe)',
    category: 'Micro Nutrient',
    unit: 'ppm',
    reference_range: '4.5 - 9.0 ppm',
    reference_range_mr: '४.५ - ९.० पीपीएम',
    classify: (val) => {
      if (val == null) return { status: 'Not Available', status_mr: 'उपलब्ध नाही', badgeClass: 'status-badge-moderate', interpretation: 'Not tested.', interpretation_mr: 'तपासणी उपलब्ध नाही.' };
      if (val < 4.5) return { status: 'Low', status_mr: 'कमी', badgeClass: 'status-badge-deficient', interpretation: 'Deficient. Spray ferrous sulphate or soil apply with FYM.', interpretation_mr: 'लोहाची कमतरता. फेरस सल्फेट फवारावे किंवा शेणखतातून द्यावे.' };
      if (val <= 9.0) return { status: 'Medium', status_mr: 'मध्यम', badgeClass: 'status-badge-moderate', interpretation: 'Adequate iron concentration.', interpretation_mr: 'लोह समाधानकारक प्रमाणात आहे.' };
      return { status: 'High', status_mr: 'भरपूर', badgeClass: 'status-badge-sufficient', interpretation: 'Sufficient iron reserve.', interpretation_mr: 'लोह मुबलक प्रमाणात आहे.' };
    }
  },
  {
    key: 'manganese',
    sr_no: 10,
    name: 'Available Manganese (Mn)',
    name_mr: 'उपलब्ध मँगनीज (Mn)',
    category: 'Micro Nutrient',
    unit: 'ppm',
    reference_range: '2.0 - 5.0 ppm',
    reference_range_mr: '२.० - ५.० पीपीएम',
    classify: (val) => {
      if (val == null) return { status: 'Not Available', status_mr: 'उपलब्ध नाही', badgeClass: 'status-badge-moderate', interpretation: 'Not tested.', interpretation_mr: 'तपासणी उपलब्ध नाही.' };
      if (val < 2.0) return { status: 'Low', status_mr: 'कमी', badgeClass: 'status-badge-deficient', interpretation: 'Manganese deficiency.', interpretation_mr: 'मँगनीज कमी आहे.' };
      if (val <= 5.0) return { status: 'Medium', status_mr: 'मध्यम', badgeClass: 'status-badge-moderate', interpretation: 'Sufficient for normal crop growth.', interpretation_mr: 'मँगनीज योग्य प्रमाणात आहे.' };
      return { status: 'High', status_mr: 'भरपूर', badgeClass: 'status-badge-sufficient', interpretation: 'Abundant native manganese.', interpretation_mr: 'मँगनीज मुबलक आहे.' };
    }
  },
  {
    key: 'zinc',
    sr_no: 11,
    name: 'Available Zinc (Zn)',
    name_mr: 'उपलब्ध जस्त (Zn)',
    category: 'Micro Nutrient',
    unit: 'ppm',
    reference_range: '0.60 - 1.20 ppm',
    reference_range_mr: '०.६० - १.२० पीपीएम',
    classify: (val) => {
      if (val == null) return { status: 'Not Available', status_mr: 'उपलब्ध नाही', badgeClass: 'status-badge-moderate', interpretation: 'Not tested.', interpretation_mr: 'तपासणी उपलब्ध नाही.' };
      if (val < 0.60) return { status: 'Low', status_mr: 'कमी', badgeClass: 'status-badge-deficient', interpretation: 'Deficient. Zinc sulphate @ 20-25 kg/ha soil application recommended.', interpretation_mr: 'जस्त कमी आहे. झिंक सल्फेट २०-२५ किलो/हेक्टर जमिनीत मिसळा.' };
      if (val <= 1.20) return { status: 'Medium', status_mr: 'मध्यम', badgeClass: 'status-badge-moderate', interpretation: 'Sufficient zinc concentration.', interpretation_mr: 'जस्त समाधानकारक आहे.' };
      return { status: 'High', status_mr: 'भरपूर', badgeClass: 'status-badge-sufficient', interpretation: 'Abundant zinc availability.', interpretation_mr: 'जस्त मुबलक आहे.' };
    }
  },
  {
    key: 'copper',
    sr_no: 12,
    name: 'Available Copper (Cu)',
    name_mr: 'उपलब्ध तांबे (Cu)',
    category: 'Micro Nutrient',
    unit: 'ppm',
    reference_range: '0.20 - 1.00 ppm',
    reference_range_mr: '०.२० - १.०० पीपीएम',
    classify: (val) => {
      if (val == null) return { status: 'Not Available', status_mr: 'उपलब्ध नाही', badgeClass: 'status-badge-moderate', interpretation: 'Not tested.', interpretation_mr: 'तपासणी उपलब्ध नाही.' };
      if (val < 0.20) return { status: 'Low', status_mr: 'कमी', badgeClass: 'status-badge-deficient', interpretation: 'Low copper status.', interpretation_mr: 'तांबे कमी आहे.' };
      if (val <= 1.00) return { status: 'Medium', status_mr: 'मध्यम/योग्य', badgeClass: 'status-badge-sufficient', interpretation: 'Optimum copper concentration for enzyme activity.', interpretation_mr: 'तांब्याचे प्रमाण योग्य व पुरेसे आहे.' };
      return { status: 'High', status_mr: 'भरपूर', badgeClass: 'status-badge-sufficient', interpretation: 'Sufficient copper.', interpretation_mr: 'तांबे मुबलक आहे.' };
    }
  },
  {
    key: 'sulphur',
    sr_no: 13,
    name: 'Available Sulphur (S)',
    name_mr: 'उपलब्ध गंधक (S)',
    category: 'Secondary Nutrient',
    unit: 'ppm',
    reference_range: '10.0 - 20.0 ppm',
    reference_range_mr: '१०.० - २०.० पीपीएम',
    classify: (val) => {
      if (val == null) return { status: 'Not Available', status_mr: 'उपलब्ध नाही', badgeClass: 'status-badge-moderate', interpretation: 'Not tested.', interpretation_mr: 'तपासणी उपलब्ध नाही.' };
      if (val < 10.0) return { status: 'Low', status_mr: 'कमी', badgeClass: 'status-badge-deficient', interpretation: 'Deficient sulphur. Apply bensulf or gypsum for oilseeds and pulses.', interpretation_mr: 'गंधक कमी आहे. तेलबिया व कडधान्यांसाठी बेनसल्फ किंवा जिप्सम वापरा.' };
      if (val <= 20.0) return { status: 'Medium', status_mr: 'मध्यम', badgeClass: 'status-badge-moderate', interpretation: 'Adequate sulphur level.', interpretation_mr: 'गंधक मध्यम प्रमाणात उपलब्ध आहे.' };
      return { status: 'Abundant', status_mr: 'भरपूर', badgeClass: 'status-badge-sufficient', interpretation: 'Rich native sulphur content.', interpretation_mr: 'गंधक मुबलक प्रमाणात आहे.' };
    }
  },
  {
    key: 'boron',
    sr_no: 14,
    name: 'Available Boron (B)',
    name_mr: 'उपलब्ध बोरॉन (B)',
    category: 'Micro Nutrient',
    unit: 'ppm',
    reference_range: '0.50 - 1.00 ppm',
    reference_range_mr: '०.५० - १.०० पीपीएम',
    classify: (val) => {
      if (val == null) return { status: 'Not Available', status_mr: 'उपलब्ध नाही', badgeClass: 'status-badge-moderate', interpretation: 'Not tested for this sample.', interpretation_mr: 'या नमुन्यासाठी बोरॉन तपासणी केलेली नाही.' };
      if (val < 0.50) return { status: 'Low', status_mr: 'कमी', badgeClass: 'status-badge-deficient', interpretation: 'Deficient. Foliar application of solubor (0.1%) during flowering advised.', interpretation_mr: 'बोरॉन कमी आहे. फुलोरा अवस्थेत बोरिक ऍसिड किंवा सोलुबोर फवारावे.' };
      if (val <= 1.00) return { status: 'Medium', status_mr: 'मध्यम', badgeClass: 'status-badge-moderate', interpretation: 'Optimum boron level.', interpretation_mr: 'बोरॉनचे प्रमाण योग्य आहे.' };
      return { status: 'High', status_mr: 'भरपूर', badgeClass: 'status-badge-sufficient', interpretation: 'Sufficient boron.', interpretation_mr: 'बोरॉन मुबलक आहे.' };
    }
  },
  // Physical soil properties
  {
    key: 'sand',
    sr_no: 15,
    name: 'Sand Percentage',
    name_mr: 'वाळूचे प्रमाण',
    category: 'Physical',
    unit: '%',
    reference_range: '15 - 45%',
    reference_range_mr: '१५ - ४५%',
    classify: (val) => {
      if (val == null) return { status: 'Not Available', status_mr: 'उपलब्ध नाही', badgeClass: 'status-badge-moderate', interpretation: 'Physical fraction not measured.', interpretation_mr: 'तपासणी उपलब्ध नाही.' };
      return { status: `${val}%`, status_mr: `${val}%`, badgeClass: 'status-badge-sufficient', interpretation: 'Coarse mineral fraction.', interpretation_mr: 'वाळूचे मोजलेले प्रमाण.' };
    }
  },
  {
    key: 'clay',
    sr_no: 16,
    name: 'Clay Percentage',
    name_mr: 'चिकणमातीचे प्रमाण',
    category: 'Physical',
    unit: '%',
    reference_range: '35 - 55% (Black Soil)',
    reference_range_mr: '३५ - ५५% (काळी जमीन)',
    classify: (val) => {
      if (val == null) return { status: 'Not Available', status_mr: 'उपलब्ध नाही', badgeClass: 'status-badge-moderate', interpretation: 'Not measured.', interpretation_mr: 'तपासणी उपलब्ध नाही.' };
      return { status: `${val}%`, status_mr: `${val}%`, badgeClass: 'status-badge-sufficient', interpretation: 'Fine colloidal clay content imparting high CEC.', interpretation_mr: 'चिकणमातीचे प्रमाण, उच्च जलधारण क्षमता.' };
    }
  },
  {
    key: 'silt',
    sr_no: 17,
    name: 'Silt Percentage',
    name_mr: 'पोयट्याचे प्रमाण',
    category: 'Physical',
    unit: '%',
    reference_range: '20 - 40%',
    reference_range_mr: '२० - ४०%',
    classify: (val) => {
      if (val == null) return { status: 'Not Available', status_mr: 'उपलब्ध नाही', badgeClass: 'status-badge-moderate', interpretation: 'Not measured.', interpretation_mr: 'तपासणी उपलब्ध नाही.' };
      return { status: `${val}%`, status_mr: `${val}%`, badgeClass: 'status-badge-sufficient', interpretation: 'Medium particulate fraction.', interpretation_mr: 'पोयट्याचे मोजलेले प्रमाण.' };
    }
  },
  {
    key: 'texture',
    sr_no: 18,
    name: 'Soil Texture',
    name_mr: 'जमिनीचा पोत (Texture)',
    category: 'Physical',
    unit: 'Class',
    reference_range: 'Clay Loam to Deep Clay',
    reference_range_mr: 'मध्यम काळी ते खोल काळी',
    classify: (val) => {
      if (!val) return { status: 'Not Available', status_mr: 'उपलब्ध नाही', badgeClass: 'status-badge-moderate', interpretation: 'Texture classification pending.', interpretation_mr: 'पोत वर्गीकरण उपलब्ध नाही.' };
      return { status: String(val), status_mr: String(val), badgeClass: 'status-badge-sufficient', interpretation: 'Texture class determines tillage and irrigation schedules.', interpretation_mr: 'जमिनीचा पोत मशागत व पाणी व्यवस्थापनासाठी मार्गदर्शक.' };
    }
  },
  {
    key: 'bulk_density',
    sr_no: 19,
    name: 'Bulk Density',
    name_mr: 'जमिनीची घनता (Bulk Density)',
    category: 'Physical',
    unit: 'g/cm³',
    reference_range: '1.20 - 1.40 g/cm³',
    reference_range_mr: '१.२० - १.४० ग्रॅम/घ.सें.मी.',
    classify: (val) => {
      if (val == null) return { status: 'Not Available', status_mr: 'उपलब्ध नाही', badgeClass: 'status-badge-moderate', interpretation: 'Not measured.', interpretation_mr: 'तपासणी उपलब्ध नाही.' };
      if (val <= 1.40) return { status: 'Normal', status_mr: 'सामान्य', badgeClass: 'status-badge-sufficient', interpretation: 'Optimum compaction for root penetration and aeration.', interpretation_mr: 'मुळांच्या वाढीसाठी व हवा खेळती राहण्यासाठी योग्य घनता.' };
      return { status: 'High Compaction', status_mr: 'जास्त घट्ट', badgeClass: 'status-badge-deficient', interpretation: 'Subsoil compaction risk. Deep subsoiling advised.', interpretation_mr: 'जमीन जास्त घट्ट आहे. खोल नांगरणी आवश्यक.' };
    }
  },
  {
    key: 'water_holding_capacity',
    sr_no: 20,
    name: 'Water Holding Capacity',
    name_mr: 'जलधारण क्षमता (WHC)',
    category: 'Physical',
    unit: '%',
    reference_range: '50 - 65%',
    reference_range_mr: '५० - ६५%',
    classify: (val) => {
      if (val == null) return { status: 'Not Available', status_mr: 'उपलब्ध नाही', badgeClass: 'status-badge-moderate', interpretation: 'Not measured.', interpretation_mr: 'तपासणी उपलब्ध नाही.' };
      if (val >= 50) return { status: 'High', status_mr: 'उच्च/चांगली', badgeClass: 'status-badge-sufficient', interpretation: 'High moisture retention, drought resilience in black soil.', interpretation_mr: 'चांगली जलधारण क्षमता, दुष्काळ प्रतिकारकता.' };
      return { status: 'Moderate', status_mr: 'मध्यम', badgeClass: 'status-badge-moderate', interpretation: 'Moderate moisture retention. Mulching recommended.', interpretation_mr: 'मध्यम जलधारण क्षमता. आच्छादनाचा वापर करावा.' };
    }
  },
  {
    key: 'depth',
    sr_no: 21,
    name: 'Effective Soil Depth',
    name_mr: 'जमिनीची खोली (Depth)',
    category: 'Physical',
    unit: 'cm',
    reference_range: '> 60 cm (Deep Soil)',
    reference_range_mr: '> ६० सें.मी. (खोल जमीन)',
    classify: (val) => {
      if (!val) return { status: 'Not Available', status_mr: 'उपलब्ध नाही', badgeClass: 'status-badge-moderate', interpretation: 'Depth survey pending.', interpretation_mr: 'खोली माहिती उपलब्ध नाही.' };
      return { status: String(val), status_mr: String(val), badgeClass: 'status-badge-sufficient', interpretation: 'Effective rooting depth.', interpretation_mr: 'पिकांच्या मुळांसाठी उपलब्ध खोली.' };
    }
  }
];
