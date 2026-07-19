export type LineState = 'normal' | 'warning' | 'critical';

export interface Substation {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface PowerLine {
  id: string;
  name: string;
  path: [number, number][];
  state: LineState;
  fiderCode: string;
  district: string;
  substationName: string;
  currentAmps: number;
  voltageKV: number;
  activePowerMW: number;
  cableType: string;
  maxTemp: number;
}

export const substations: Substation[] = [
  { id: 'ps-1', name: 'ПС Самал (110/10 кВ)', lat: 43.2300, lng: 76.9450 },
  { id: 'ps-2', name: 'ПС Ерменсай (220/110/10 кВ)', lat: 43.1900, lng: 76.9200 },
  { id: 'ps-3', name: 'ПС Алатау (110/10 кВ)', lat: 43.2500, lng: 76.8800 },
  { id: 'ps-4', name: 'ПС Горный Гигант (110/10 кВ)', lat: 43.2100, lng: 76.9500 },
  { id: 'ps-5', name: 'ПС Орбита (110/10 кВ)', lat: 43.2050, lng: 76.8750 },
  { id: 'ps-6', name: 'ПС Медеу (110/10 кВ)', lat: 43.1600, lng: 77.0200 },
];

export const powerLines: PowerLine[] = [
  {
    id: 'line-1',
    name: 'Самал - Горный Гигант',
    path: [[43.2300, 76.9450], [43.2200, 76.9480], [43.2100, 76.9500]],
    state: 'critical',
    fiderCode: 'Ф-12',
    district: 'Медеуский район, ЖК Dostyk Residence, ЖК Терренкур',
    substationName: 'ПС Самал',
    currentAmps: 485,
    voltageKV: 10,
    activePowerMW: 4.5,
    cableType: 'АС-95 (Сталеалюминий)',
    maxTemp: 85,
  },
  {
    id: 'line-2',
    name: 'Ерменсай - Орбита',
    path: [[43.1900, 76.9200], [43.1950, 76.9000], [43.2050, 76.8750]],
    state: 'normal',
    fiderCode: 'Ф-04',
    district: 'Бостандыкский район, мкр. Орбита-1, 2',
    substationName: 'ПС Ерменсай',
    currentAmps: 150,
    voltageKV: 110,
    activePowerMW: 15.2,
    cableType: 'АС-120',
    maxTemp: 85,
  },
  {
    id: 'line-3',
    name: 'Алатау - Орбита',
    path: [[43.2500, 76.8800], [43.2300, 76.8780], [43.2050, 76.8750]],
    state: 'warning',
    fiderCode: 'Ф-08',
    district: 'Алмалинский/Бостандыкский район',
    substationName: 'ПС Алатау',
    currentAmps: 320,
    voltageKV: 110,
    activePowerMW: 28.5,
    cableType: 'АС-120',
    maxTemp: 85,
  },
  {
    id: 'line-4',
    name: 'Самал - Ерменсай',
    path: [[43.2300, 76.9450], [43.2100, 76.9350], [43.1900, 76.9200]],
    state: 'normal',
    fiderCode: 'Ф-02',
    district: 'Бостандыкский район, пр. Аль-Фараби',
    substationName: 'ПС Самал',
    currentAmps: 180,
    voltageKV: 110,
    activePowerMW: 18.0,
    cableType: 'АС-120',
    maxTemp: 85,
  },
];
