/**
 * Location Hierarchy Data Structure for Pune District (Maharashtra)
 * District -> Taluka -> Village -> Gat / Survey Number
 */

export interface LocationHierarchy {
  district: string;
  district_mr: string;
  talukas: {
    name: string;
    name_mr: string;
    villages: {
      name: string;
      name_mr: string;
      available_gats: string[];
    }[];
  }[];
}

export interface StateHierarchy {
  state: string;
  state_mr: string;
  districts: LocationHierarchy[];
}

export const PUNE_DISTRICT_LOCATIONS: LocationHierarchy = {
  district: 'Pune',
  district_mr: 'पुणे',
  talukas: [
    {
      name: 'Baramati',
      name_mr: 'बारामती',
      villages: [
        {
          name: 'Malegaon',
          name_mr: 'माळेगाव',
          available_gats: ['104', '105', '108', '112', '115'],
        },
        {
          name: 'Songaon',
          name_mr: 'सोनगाव',
          available_gats: ['201', '204', '208'],
        },
        {
          name: 'Korhale Budruk',
          name_mr: 'कोरहळे बुद्रुक',
          available_gats: ['301', '305'],
        },
        {
          name: 'Medhad',
          name_mr: 'मेढद',
          available_gats: ['402', '405'],
        },
        {
          name: 'Pandare',
          name_mr: 'पांढरे',
          available_gats: ['510', '512'],
        },
        {
          name: 'Supe',
          name_mr: 'सुपे',
          available_gats: ['601', '604'],
        }
      ]
    },
    {
      name: 'Haveli',
      name_mr: 'हवेली',
      villages: [
        {
          name: 'Wadavli',
          name_mr: 'वडवली',
          available_gats: ['12', '15'],
        },
        {
          name: 'Loni Kalbhor',
          name_mr: 'लोणी काळभोर',
          available_gats: ['45', '48'],
        },
        {
          name: 'Uruli Kanchan',
          name_mr: 'उरुळी कांचन',
          available_gats: ['82', '86'],
        },
        {
          name: 'Wagholi',
          name_mr: 'वाघोली',
          available_gats: ['110', '114'],
        }
      ]
    },
    {
      name: 'Daund',
      name_mr: 'दौंड',
      villages: [
        {
          name: 'Patas',
          name_mr: 'पाटस',
          available_gats: ['52', '56'],
        },
        {
          name: 'Kedgaon',
          name_mr: 'केडगाव',
          available_gats: ['71', '74'],
        },
        {
          name: 'Yawat',
          name_mr: 'यवत',
          available_gats: ['93', '97'],
        },
        {
          name: 'Kurkumbh',
          name_mr: 'कुरकुंभ',
          available_gats: ['120', '124'],
        }
      ]
    },
    {
      name: 'Indapur',
      name_mr: 'इंदापूर',
      villages: [
        {
          name: 'Bawada',
          name_mr: 'बावडा',
          available_gats: ['14', '18'],
        },
        {
          name: 'Nimgaon Ketki',
          name_mr: 'निमगाव केतकी',
          available_gats: ['33', '37'],
        },
        {
          name: 'Palasdeo',
          name_mr: 'पळसदेव',
          available_gats: ['55', '58'],
        },
        {
          name: 'Anthurne',
          name_mr: 'अंथुर्णे',
          available_gats: ['80', '84'],
        }
      ]
    },
    {
      name: 'Shirur',
      name_mr: 'शिरूर',
      villages: [
        {
          name: 'Ranjangaon',
          name_mr: 'रांजणगाव',
          available_gats: ['22', '25'],
        },
        {
          name: 'Shikrapur',
          name_mr: 'शिक्रापूर',
          available_gats: ['41', '44'],
        },
        {
          name: 'Talegaon Dhamdhere',
          name_mr: 'तळेगाव ढमढेरे',
          available_gats: ['63', '67'],
        }
      ]
    },
    {
      name: 'Junnar',
      name_mr: 'जुन्नर',
      villages: [
        {
          name: 'Otur',
          name_mr: 'ओतूर',
          available_gats: ['10', '14'],
        },
        {
          name: 'Alephata',
          name_mr: 'आळेफाटा',
          available_gats: ['31', '35'],
        },
        {
          name: 'Narayangaon',
          name_mr: 'नारायणगाव',
          available_gats: ['52', '56'],
        }
      ]
    },
    {
      name: 'Ambegaon',
      name_mr: 'आंबेगाव',
      villages: [
        {
          name: 'Manchar',
          name_mr: 'मंचर',
          available_gats: ['18', '21'],
        },
        {
          name: 'Ghodegaon',
          name_mr: 'घोडेगाव',
          available_gats: ['40', '43'],
        }
      ]
    },
    {
      name: 'Khed (Rajgurunagar)',
      name_mr: 'खेड (राजगुरुनगर)',
      villages: [
        {
          name: 'Chakan',
          name_mr: 'चाकण',
          available_gats: ['27', '30'],
        },
        {
          name: 'Alandi',
          name_mr: 'आळंदी',
          available_gats: ['48', '51'],
        }
      ]
    },
    {
      name: 'Maval',
      name_mr: 'मावळ',
      villages: [
        {
          name: 'Vadgaon Maval',
          name_mr: 'वडगाव मावळ',
          available_gats: ['16', '19'],
        },
        {
          name: 'Talegaon Dabhade',
          name_mr: 'तळेगाव दाभाडे',
          available_gats: ['34', '38'],
        }
      ]
    },
    {
      name: 'Mulshi',
      name_mr: 'मुळशी',
      villages: [
        {
          name: 'Paud',
          name_mr: 'पौड',
          available_gats: ['11', '15'],
        },
        {
          name: 'Pirangut',
          name_mr: 'पिरंगुट',
          available_gats: ['29', '32'],
        }
      ]
    },
    {
      name: 'Bhor',
      name_mr: 'भोर',
      villages: [
        {
          name: 'Nasrapur',
          name_mr: 'नसरापूर',
          available_gats: ['21', '24'],
        },
        {
          name: 'Shirwal Border',
          name_mr: 'शिरवळ सीमा',
          available_gats: ['42', '46'],
        }
      ]
    },
    {
      name: 'Purandar (Saswad)',
      name_mr: 'पुरंदर (सासवड)',
      villages: [
        {
          name: 'Saswad Rural',
          name_mr: 'सासवड ग्रामीण',
          available_gats: ['17', '20'],
        },
        {
          name: 'Jejuri Rural',
          name_mr: 'जेजुरी ग्रामीण',
          available_gats: ['35', '39'],
        }
      ]
    },
    {
      name: 'Velhe (Rajgad)',
      name_mr: 'वेल्हे (राजगड)',
      villages: [
        {
          name: 'Velhe Budruk',
          name_mr: 'वेल्हे बुद्रुक',
          available_gats: ['13', '16'],
        }
      ]
    },
    {
      name: 'Pune City',
      name_mr: 'पुणे शहर',
      villages: [
        {
          name: 'Hadapsar Peri-Urban',
          name_mr: 'हडपसर उपनगर',
          available_gats: ['101', '102'],
        }
      ]
    }
  ]
};

export const MAHARASHTRA_STATE_LOCATIONS: StateHierarchy = {
  state: 'Maharashtra',
  state_mr: 'महाराष्ट्र',
  districts: [PUNE_DISTRICT_LOCATIONS],
};

