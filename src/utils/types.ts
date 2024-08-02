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

export type OrderType = 'Regular Sale' | 'Credit Memo' | 'Debit Memo' | 'Material Transfer' | 'Job Transfer' | 'Review'
export type OrderStatus = 'Will Call' | 'Weather Permitting' | 'Wait list' | 'Normal' | 'Hold Delivery' | 'Completed'

export type HistoryChange = {
  oldData: string;
  orderId: number;
  createdBy: string;
  createTime: string;
  description: string;
  type: string;
  newData: string
}