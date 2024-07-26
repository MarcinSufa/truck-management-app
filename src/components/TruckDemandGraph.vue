<template>
  <div>
    <Chart ref="chartMain" type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]" />
    <!--    <div ref="tooltipRef" v-show="tooltipActive" class="w-50 bg-amber-300 p-10"> {{ tooltipData }}</div>-->
    <Card ref="tooltipRef" v-show="tooltipActive" style="width: 15rem; overflow: hidden">
      <template #header>
      </template>
      <template #title>Order</template>
      <template #subtitle>Load</template>
      <template #content>
        <p class="m-0">
          {{ tooltipData }}
        </p>
      </template>
      <template #footer>
        <div class="flex gap-4 mt-1">
          <Button label="Cancel" severity="secondary" outlined class="w-full" />
          <Button label="Save" class="w-full" />
        </div>
      </template>
    </Card>
    <div class="flex w-100">
      <!--      <Chart ref="chartMain" type="bar" :data="chartData" :options="chartOptions" class="h-[30rem] w-1/2" />-->
      <!--      <Chart ref="chartSimulation" type="bar" :data="chartData" :options="chartOptions" class="h-[30rem] w-1/2" />-->
    </div>
    <div class="w-20 ml-10">
      <Button icon="pi pi-times" raised @click="resetZoom">Reset</Button>
      <Button icon="pi pi-times" raised @click="changeDataSetItem" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Chart from 'primevue/chart'
import { ref, onMounted, reactive, shallowRef } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { dataSetStacking } from '../composables/chartConfig.ts'
import { calculateDayTimeLines } from '../composables/time.ts'

onMounted(() => {
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()

})

const chartMain = ref()
const tooltipRef = ref()
const chartData = shallowRef()
const chartOptions = ref()
const tooltipActive = ref(false)
const tooltipData = reactive({ position: { x: 0, y: 0 }, id: undefined, title: undefined })

const resetZoom = () => {
  const chart = chartMain.value.getChart()
  chart.resetZoom()
}

const changeDataSetItem = () => {
  const chart = chartMain.value.getChart()
  chartData.value.datasets[2].data[10] = 0
  chart.update()
}
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

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement)

  const isUsedDefaultDataSet = true
  return {
    labels: calculateDayTimeLines(),
    datasets: isUsedDefaultDataSet ? dataSetsDefault : dataSetStacking,
  }
}

const showChartElementInteracted = (e) => {
  const chart = e.chart
  let elementsClicked = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true)
  if (elementsClicked.length === 0) {
    return null
  }
  const { index, datasetIndex } = elementsClicked[0]
  const selectedDatasetElement = chartData.value.datasets[datasetIndex].data[index]
  console.log('chartData.value.datasets', JSON.parse(JSON.stringify(chartData.value.datasets[datasetIndex].data[index])))
  console.log('selectedDatasetElement', selectedDatasetElement)
  return selectedDatasetElement
}

const setChartOptions = () => {
  const chart = chartMain.value.getChart()
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
      tooltipActive.value = true
      const selectedDataset = showChartElementInteracted(e)
      if (!selectedDataset) return
      tooltipData.value = { position: { x: 0, y: 0 }, id: 'id', title: selectedDataset }
      const chart = chartMain.value.getChart()
      chart.setActiveElements([{
        datasetIndex: 0,
        index: 11,
      }, {
        datasetIndex: 0,
        index: 10,
      }])
      chart.update()

    },
    onHover: (e) => {
      const selectedDataset = showChartElementInteracted(e)
      if (!selectedDataset) return
      console.log('hover', selectedDataset)
    },
    plugins: {
      tooltip: {
        mode: 'index',
        enabled: false,
        events: ['click', 'mousemove'],
        // external: tooltipRef,
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
              100,
            yMax:
              100,
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
      xAxisKey: 'nested.time',
      yAxisKey: 'nested.load',
    },
    layout: {
      padding: 0,
    },
  }

}

</script>