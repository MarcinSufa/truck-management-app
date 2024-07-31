export type TruckStatus = 'LOADING' | 'TO_JOB' | 'AT_JOB' | 'RETURNING' | 'OUT_OF_SERVICE';

export type Truck = {
  id: string,
  code: string,
  name: string,
  status: TruckStatus,
  description: string,
}

export type TooltipData = {
  position: string
  datasetIndex: string
  id: string
  loadData: LoadData
}

export type LoadData = {
  id: string
  name: string
  weight: number
  volume: number
  truck: Truck
  status: string
  start: string
  end: string
  startLocation: string
  endLocation: string
}
