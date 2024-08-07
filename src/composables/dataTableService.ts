import { type OrderStatus } from '@/utils/types'

export const getStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case 'Will Call':
      return 'warning'
    case 'Weather Permitting':
      return 'info'
    case 'Wait list':
      return 'warning'
    case 'Normal':
      return 'success'
    case 'Hold Delivery':
      return 'danger'
    case 'Completed':
      return 'success'
    case 'Overloaded':
      return 'warning'
    default:
      return 'info'
  }
}

export const getHistoryItemTypeLabel = (field:string):string => {
  switch (field) {
    case 'backgroundColor':
      return 'Order Color'
    case 'load':
      return 'Load'
    case 'time':
      return 'Time'
    default:
      return 'Unknown'
  }
}