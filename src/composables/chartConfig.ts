import { calculateDayTimeLines } from './time.ts'
import moment from 'moment/moment'

export function generateChartDataSets() {
  const orders = []
  const orderCount = Math.floor(Math.random() * 35) + 3
  const orderTypes = ['Regular Sale', '']
  const customers = ['HL Construction', 'Cemex', 'Lafarge', 'Vulcan', 'Martin Marietta', 'Heidelberg', 'CRH']
  const projects = ['DR-01', 'DR-02', 'DR-03', 'DR-04', 'DR-05', 'DR-06', 'DR-07', 'DR-08', 'DR-09', 'DR-10']

  for (let i = 0; i < orderCount; i++) {
    const loadCount = Math.floor(Math.random() * 10) + 3
    const orderId = Math.floor(Math.random() * 100000)
    const orderType = orderTypes[Math.floor(Math.random() * orderTypes.length)]
    const customer = customers[Math.floor(Math.random() * customers.length)]
    const project = projects[Math.floor(Math.random() * projects.length)]
    const orderDate = '2/14/2024'
    const orderCode = Math.floor(Math.random() * 1000)
    orders.push({
      label: `Order ${i + 1}`,
      data: generateOrderData(loadCount),
      backgroundColor: truckDemandColor,
      orderId,
      orderData: {
        orderDate,
        orderCode,
        orderType,
        customerCode: customer,
        projectCode: project,
      },
    })
  }
  return orders
}

function generateOrderData(orderCount: number) {
  const data = []
  const timeIntervals = calculateDayTimeLines('08:00:00', '17:59:59')
  const timeIntervalsForOrder = timeIntervals.sort(() => Math.random() - 0.5).slice(0, orderCount)
  // sort by time
  timeIntervalsForOrder.sort((a, b) => moment(a, 'HH:mm').diff(moment(b, 'HH:mm')))

  for (let i = 0; i < orderCount; i++) {
    data.push({
      id: Math.floor(Math.random() * 100000),
      nested: { load: Math.floor(Math.random() * 100) + 15, time: timeIntervalsForOrder[i] },
    })
  }
  return data
}


const truckDemandColor = '#798ef8'
// const ORDER_STATUS_NORMAL = 'Normal';

const trucksData = [
  { id: '12456', nested: { load: 100, time: '08:15' } }, {
    id: '2345',
    nested: { load: 50, time: '08:45' },
  }, { id: '45234', nested: { load: 120, time: '08:30' } },
]

export const dataSetStacking = [{
  label: 'Order 1',
  data: trucksData,
  backgroundColor: truckDemandColor,
  orderId: '12456',
  orderData: {
    orderDate: '2/14/2024',
    orderCode: '105',
    orderType: 'Regular Sale',
    customerCode: 'HL Construction',
    projectCode: 'DR-02',
  },
},
]

const dataSetsDefault = [
  {
    type: 'bar',
    label: 'Order 1',
    backgroundColor: '#798ef8',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 25, 12, 48, 90, 76, 42, 20, 45, 20, 35, 15, 50, 45, 35, 50, 25, 12, 48, 90, 76, 42, 20, 45, 20, 35, 15, 50, 45, 35],
  },
  {
    type: 'bar',
    label: 'Order 2',
    backgroundColor: '#798ef8',
    data: [0, 0, 0, 0, 0, 0, 5, 21, 84, 24, 75, 37, 65, 34, 20, 45, 20, 35, 48, 90, 76, 42],
  },
  {
    type: 'bar',
    label: 'Order 3',
    backgroundColor: '#798ef8',
    data: [0, 0, 0, 0, 0, 0, 15, 41, 52, 24, 74, 23, 21, 32, 20, 45, 20, 35, 41, 52, 24, 74],
  },
]

export const sortBy = (arr, val, prop, direction: 'down' | 'up' = 'down') => {
  let top = []
  let rest = []

  for (let el of arr) {
    if (el[prop] == val) {
      top.push(el)
    } else {
      rest.push(el)
    }
  }
  console.log('top.concat(rest)', top.concat(rest))
  return direction === 'down' ? top.concat(rest) : rest.concat(top)
}

export const moveObjectToIndex = (arr, old_index, new_index) => {
  if (new_index >= arr.length) {
    let k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.filter(i => i !== undefined)
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
}