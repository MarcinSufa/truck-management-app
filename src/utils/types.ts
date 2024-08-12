import { type Order } from '@/composables/chartConfig'
import type { BarElement } from 'chart.js'

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
export type OrderStatus =
  'Will Call'
  | 'Weather Permitting'
  | 'Wait list'
  | 'Normal'
  | 'Hold Delivery'
  | 'Completed'
  | 'Overloaded'

export type HistoryChange = {
  oldData: Order;
  orderId: number;
  createdBy: string;
  createTime: string;
  description: string;
  type: IconForPropType;
  newData: Order
}

export type IconForPropType = 'backgroundColor' | 'load' | 'time'

export type ChartElement = { element: BarElement, datasetIndex: number, index: number }
export type RescheduleChartDataSet = { backgroundColor: string, data: {load: number, time: string}[], label: string }