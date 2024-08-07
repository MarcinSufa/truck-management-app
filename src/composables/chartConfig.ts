import { calculateDayTimeLines } from './time.ts'
import moment from 'moment/moment'

export type Order = {
  label: string;
  data: { id: number; nested: { load: number; time: string, spacing: number } }[];
  backgroundColor: string;
  orderId: number;
  orderData: { orderDate: string; orderCode: number; orderType: string; customerCode: string; projectCode: string }
}[]

export const PLANT_PRODUCTION = 300

export function generateChartDataSets(): Order[] {
  const orders = []
  const orderCount = Math.floor(Math.random() * 35) + 3
  const orderTypes = ['Regular Sale', 'Credit Memo', 'Debit Memo', 'Material Transfer', 'Job Transfer', 'Review']

  //['Will Call', 'Weather Permitting', 'Wait list', 'Normal', 'Hold Delivery', 'Completed']
  const orderStatuses = ['Normal']
  const customers = ['HL Construction', 'Cemex', 'Lafarge', 'Vulcan', 'Martin Marietta', 'Heidelberg', 'CRH']
  const projects = ['DR-01', 'DR-02', 'DR-03', 'DR-04', 'DR-05', 'DR-06', 'DR-07', 'DR-08', 'DR-09', 'DR-10']
  const aggregatedOrdersByTime = {}
  let isOverloaded = false

  for (let i = 0; i < orderCount; i++) {
    isOverloaded = false
    const loadCount = Math.floor(Math.random() * 10) + 3
    const orderId = Math.floor(Math.random() * 100000)
    const orderType = orderTypes[Math.floor(Math.random() * orderTypes.length)]
    const orderStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)]
    const customer = customers[Math.floor(Math.random() * customers.length)]
    const project = projects[Math.floor(Math.random() * projects.length)]
    const orderDate = '2/14/2024'
    const orderCode = Math.floor(Math.random() * 1000)
    const innerData = generateOrderData(loadCount, orderId)
    for (let i = 0; i < innerData.length; i++) {
      aggregatedOrdersByTime[innerData[i]?.nested?.time] = parseInt(innerData[i]?.nested?.load) + (aggregatedOrdersByTime[innerData[i]?.nested?.time] || 0)
      aggregatedOrdersByTime[innerData?.nested?.time] > PLANT_PRODUCTION
    }
    //check if the order is overloaded
    innerData.forEach((data) => {
      if (aggregatedOrdersByTime[data.nested.time] > PLANT_PRODUCTION) {
        isOverloaded = true
      }
    })
    orders.push({
      label: `Order ${i + 1}`,
      data: innerData,
      backgroundColor: isOverloaded ? orderOverloadColor : truckDemandColor,
      orderId,
      orderStatus: isOverloaded ? 'Overloaded' : orderStatus,
      orderData: {
        orderDate,
        orderCode,
        orderType,
        customerCode: customer,
        projectCode: project,
        isOverloaded: isOverloaded,
      },
    })

  }
  return { orders, aggregatedOrdersByTime }
}

function generateOrderData(orderCount: number, orderId: number) {
  const data = []
  const timeIntervals = calculateDayTimeLines('08:00:00', '17:59:59')
  //Minutes between each delivery
  const spacing = 30
  const timeIntervalsForOrder = timeIntervals.sort(() => Math.random() - 0.5).slice(0, orderCount)
  timeIntervalsForOrder.forEach((time, index) => {
    if (index !== 0) {
      const prevTime = moment(timeIntervalsForOrder[index - 1], 'HH:mm')
      const currentTime = moment(time, 'HH:mm')
      const diff = currentTime.diff(prevTime, 'minutes')
      if (diff < spacing) {
        const newTime = prevTime.add(spacing, 'minutes')
        timeIntervalsForOrder[index] = newTime.format('HH:mm')
      }
    }
  })
  const loadSize = Math.floor(Math.random() * 100) + 15
  // sort by time
  timeIntervalsForOrder.sort((a, b) => moment(a, 'HH:mm').diff(moment(b, 'HH:mm')))

  for (let i = 0; i < orderCount; i++) {
    data.push({
      id: Math.floor(Math.random() * 100000),
      orderId,
      nested: { load: loadSize, time: timeIntervalsForOrder[i], spacing },
    })
  }
  return data
}


const truckDemandColor = '#798ef8'
const orderOverloadColor = '#fad993'

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

export const dataSetsDefault = [
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
  const top = []
  const rest = []

  for (const el of arr) {
    if (el[prop] == val) {
      top.push(el)
    } else {
      rest.push(el)
    }
  }
  return direction === 'down' ? top.concat(rest) : rest.concat(top)
}

export const moveObjectToIndex = (arr, old_index, new_index) => {
  if (new_index >= arr.length) {
    let k = new_index - arr.length + 1
    while (k--) {
      arr.push(undefined)
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
  return arr
}

export const addExternalTooltip = (context) => {
  // Tooltip Element
  let tooltipEl = document.getElementById('chartjs-tooltip')

  // Create element on first render
  if (!tooltipEl) {
    tooltipEl = document.createElement('div')
    tooltipEl.id = 'chartjs-tooltip'
    tooltipEl.innerHTML = '<table></table>'
    document.body.appendChild(tooltipEl)
  }

  // Hide if no tooltip
  const tooltipModel = context.tooltip
  if (tooltipModel.opacity === 0) {
    tooltipEl.style.opacity = 0
    return
  }

  // Set caret Position
  tooltipEl.classList.remove('above', 'below', 'no-transform')
  if (tooltipModel.yAlign) {
    tooltipEl.classList.add(tooltipModel.yAlign)
  } else {
    tooltipEl.classList.add('no-transform')
  }

  function getBody(bodyItem) {
    return bodyItem.lines
  }

  // Set Text
  if (tooltipModel.body) {
    const titleLines = tooltipModel.title || []
    const bodyLines = tooltipModel.body.map(getBody)

    let innerHtml = '<thead>'

    titleLines.forEach(function(title) {
      innerHtml += '<tr><th>' + title + '</th></tr>'
    })
    innerHtml += '</thead><tbody>'

    bodyLines.forEach(function(body, i) {
      const colors = tooltipModel.labelColors[i]
      let style = 'background:' + colors.backgroundColor
      style += '; border-color:' + colors.borderColor
      style += '; border-width: 2px'
      const span = '<span style="' + style + '">' + body + '</span>'
      innerHtml += '<tr><td>' + span + '</td></tr>'
    })
    innerHtml += '</tbody>'

    const tableRoot = tooltipEl.querySelector('table')
    tableRoot.innerHTML = innerHtml
  }

  const position = context.chart.canvas.getBoundingClientRect()

  const element = document.createElement('div')
  element.appendChild(document.createTextNode('Click Me!'))
  element.addEventListener('onClick', () => {
    console.log('clicked')
  })
  tooltipEl.appendChild(element)

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1
  tooltipEl.style.position = 'absolute'
  tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px'
  tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px'
  tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px'
}

export const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    categoryPercentage: 1.0, // padding between bars
    barPercentage: 0.98,  // padding between bars
    events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
    onClick: (e) => {
      console.log('click', e)
      const chart = e.chart
      const event = e.native
      console.log(
        'on click',
        chart.getElementsAtEventForMode(
          event,
          'nearest',
          { intersect: true },
          false,
        ),
      )

    },
    onHover: () => {
    },
    plugins: {
      tooltip: {
        mode: 'index',
        enabled: false,
        events: ['click', 'mousemove', 'mouseout'],
        // external: addExternalTooltip,
        // onClick: (e) => {
        //   console.log('tooltip clicked', e);
        // }
      },
      legend: {
        display: false,
        labels: {
          color: textColor,
        },
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          }
          ,
          pinch: {
            enabled: true,
          }
          ,
          mode: 'xy',
        },
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin:
            PLANT_PRODUCTION,
            yMax:
            PLANT_PRODUCTION,
            borderColor:
              'rgb(220 38 38)',
            borderWidth:
              2,
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
    parsing: {
      xAxisKey: 'time',
      yAxisKey: 'load',
    },
    layout: {
      padding: 0,
    },
  }
}