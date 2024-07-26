
export function generateChartDataSets() {
  // generate 3 to 12 orders
  // between 8:00 - 18:00
  // load between 15 - 100 -  incremented by 5
  // orderId: unique generated
  // order type : 'Regular Sale' | ''
  // customer name: Random

}

const truckDemandColor = '#4A7FBA'
// const ORDER_STATUS_NORMAL = 'Normal';

const trucksData = [
  {id: '12456', nested: {load: 100, time: '08:15'}}, {id: '2345', nested: {load: 50, time: '08:45'}}, {id: '45234', nested: {load: 120, time: '08:30'}}
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

//   {
//     label: 'Order 2',
//     data: [10, 20, 14],
//   backgroundColor: truckDemandColor,
// }, {
//   label: 'Order 3',
//   data: [15, 20, 16],
//   backgroundColor: truckDemandColor,
// }, {
//   label: 'Order 4',
//   data: [500, 20, 30],
//   backgroundColor: truckDemandColor,
// }, {
//   label: 'Order 5',
//   data: [0, 20, 45],
//   backgroundColor: truckDemandColor,
// }, {
//   label: 'Order 6',
//   data: [0, 20, 21],
//   backgroundColor: truckDemandColor,
// }, {
//   label: 'Order 7',
//   data: [60, 10, 52],
//   backgroundColor: truckDemandColor,
// }, {
//   label: 'Order 8',
//   data: [0, 200, 15],
//   backgroundColor: truckDemandColor,
// }, {
//   label: 'Order 9',
//   data: [0, 30, 20],
//   backgroundColor: truckDemandColor,
// }, {
//   label: 'Order 10',
//   data: [0, 20, 50],
//   backgroundColor: truckDemandColor,
// }, {
//   label: 'Order 11',
//   data: [0, 10, 40],
//   backgroundColor: truckDemandColor,
// }, {
//   label: 'Order 12',
//   data: [40, 10, 32],
//   backgroundColor: truckDemandColor,
// }
]
