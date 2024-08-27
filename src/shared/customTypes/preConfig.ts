export interface Metrics {
  key: string;
  weight: number;
}

export interface Measure {
  key: string;
  weight: number;
  metrics: Metrics[];
  min_threshold?: number;
  max_threshold?: number;
  active?: boolean
}

export interface Subcharacteristic {
  key: string;
  weight: number;
  measures: Measure[];
  active?: boolean
}

export interface Characteristic {
  key: string;
  weight: number;
  subcharacteristics: Subcharacteristic[];
  active?: boolean
}

export interface PreConfigData {
  characteristics: Characteristic[];
}

export interface PreConfigRoot {
  id: number;
  name: string;
  created_at: Date;
  data: PreConfigData;
}

export type PreConfigAttribute = Measure | Subcharacteristic | Characteristic;
