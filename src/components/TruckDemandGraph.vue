<template>
  <div class="relative">
    <div class=" card ml-10 flex gap-4 my-4 ">
      <Button icon="pi pi-times w-full " label="Zoom" raised @click="resetZoom" />
      <Button icon="pi pi-undo w-full " label="Generate" raised @click="updateChartData" />
      <Button type="button" @click="toggleDarkMode" rounded
              :icon="{ 'pi pi-moon': isDarkTheme, 'pi pi-sun': !isDarkTheme }" severity="secondary"
      />
      <!--      <ToggleButton v-model="toggleSummaryOrdersView" @change="updateChartOptions" onLabel="Summary" offLabel="Details"-->
      <!--                    onIcon="pi pi-lock"-->
      <!--                    offIcon="pi pi-lock-open" class="w-36" aria-label="Do you confirm"-->
      <!--      />-->
    </div>

    <Chart ref="chartMain" type="bar" :data="chartData" :options="chartOptions" class="h-[20rem]" />
    <transition name="fade" mode="out-in">
      <Card ref="tooltipRef" v-show="tooltipActive"
            style="width: 15rem; overflow: hidden; position: absolute; top: 0; left: 50px" class="relative"
      >
        <template #header>
        </template>
        <template #title>Order: {{ tooltipData?.value?.id }}</template>
        <template #subtitle>Load : {{ tooltipData?.value?.loadData?.id }}</template>
        <template #content>
          <div>
            <div class="flex justify-between">
              <Button icon="pi pi-angle-double-up" @click="moveOrderBar('up')" />
              <Button icon="pi pi-arrow-up" severity="secondary" outlined @click="moveBarByOnePosition('up')" />
              <Button icon="pi pi-arrow-down" severity="secondary" outlined @click="moveBarByOnePosition('down')" />
              <Button icon="pi pi-angle-double-down" @click="moveOrderBar('down')" />
            </div>
            <p class="m-0">
              time: {{ tooltipData?.value?.loadData?.nested?.time }}
            </p>
            <div>
              <InputText type="text" v-model="timeUpdateInput" @change="updateTime" />
            </div>

          </div>
        </template>
        <template #footer>
          <div class="flex gap-4 mt-1">
            <Button label="Cancel" severity="secondary" outlined
                    @click="toogleTooltip()"
            />

            <Button icon="pi pi-thumbtack" label="show" raised
                    @click="activateBarsFromTooltip()"
            />
          </div>
        </template>
      </Card>
    </transition>
    <div class="flex gap-4">
      <OrdersDataTable />
      <div class="w-1/2 pt-5">
        <Menubar :model="menuItems" />
        <OverloadedDataTable v-if="activeMenuItem === 'overloaded'" />
        <HistoryDataTable v-if="activeMenuItem === 'history'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Chart from 'primevue/chart'
import { computed, onMounted, reactive, ref, shallowRef, watch } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import { moveObjectToIndex, PLANT_PRODUCTION, sortBy } from '../composables/chartConfig'
import { calculateDayTimeLines } from '../composables/time'
import { useOrdersStore } from '../store'
import OrdersDataTable from './OrdersDataTable.vue'
import { storeToRefs } from 'pinia'
import HistoryDataTable from './HistoryDataTable.vue'
import Menubar from 'primevue/menubar'
import OverloadedDataTable from './OverloadedDataTable.vue'
import { usePrimeVue } from 'primevue/config'


const ordersStore = useOrdersStore()
const PrimeVue = usePrimeVue()
const isHoverActive = ref(false)
const orders = computed(() => ordersStore.orders)
const activeMenuItem = ref('overloaded')
const menuItems = ref([
  {
    label: 'History',
    icon: 'pi pi-star',
    command: () => {
      activeMenuItem.value = 'history'
    },
  },
  {
    label: 'Overloaded Orders',
    icon: 'pi pi-exclamation-triangle',
    command: () => {
      console.log('Overloaded Orders')
      activeMenuItem.value = 'overloaded'
    },
  }])

const isDarkTheme = computed(() => {
  const element = document.querySelector('html')
  return element.classList.contains('dark-mode')
})

const toggleDarkMode = () => {
  const element = document.querySelector('html')
  element.classList.toggle('dark-mode')
}

const { isChartUpdate } = storeToRefs(ordersStore)
const selectedOrderIndex = computed(() => ordersStore.selectedOrderIndex)

onMounted(() => {
  updateChartData()

  chartOptions.value = setChartOptions()

})

const updateChartData = () => {
  ordersStore.fetchOrders()
  chartData.value = setChartData()
}

watch(isChartUpdate, () => {
  const chart = chartMain.value.getChart()
  chart.update()
  ordersStore.isChartUpdate = false
})

watch(selectedOrderIndex, () => {
  activateBarsFromOneOrder(selectedOrderIndex.value, true)
})

const timeUpdateInput = ref()
const chartMain = ref()
const tooltipRef = ref()
const chartData = shallowRef()
const chartOptions = ref()
const tooltipActive = ref(false)
const tooltipData = reactive({ position: undefined, datasetIndex: undefined, id: undefined, loadData: undefined })

const resetZoom = () => {
  const chart = chartMain.value.getChart()
  chart.resetZoom()
}

const updateTime = () => {
  const chart = chartMain.value.getChart()
  const { datasetIndex, loadData } = tooltipData.value
  const findIndex = chartData.value.datasets[datasetIndex].data.findIndex((item) => item.id === loadData.id)
  chartData.value.datasets[datasetIndex].data[findIndex].nested.time = timeUpdateInput.value
  timeUpdateInput.value = ''

  chart.update()
}

const moveOrderBar = (direction: 'down' | 'up' = 'down') => {
  const chart = chartMain.value.getChart()
  const { id } = tooltipData.value
  chartData.value.datasets = sortBy(chartData.value.datasets, id, 'orderId', direction)
  tooltipData.value.datasetIndex = chartData.value.datasets.findIndex((item) => item.orderId === id)
  chart.update()
}

const moveBarByOnePosition = (direction: 'down' | 'up') => {
  const { datasetIndex } = tooltipData.value
  if ((direction === 'down' && datasetIndex === 0) || (direction == 'up' && datasetIndex === chartData.value.datasets.length - 1)) return
  const chart = chartMain.value.getChart()
  const newIndex = direction === 'down' ? datasetIndex - 1 : datasetIndex + 1
  chartData.value.datasets = moveObjectToIndex([...chartData.value.datasets], datasetIndex, newIndex)
  tooltipData.value.datasetIndex = newIndex
  chart.update()
}

const toogleTooltip = () => {
  tooltipActive.value = !tooltipActive.value
}

const setChartData = () => {
  return {
    labels: calculateDayTimeLines('07:00:00', '23:59:59'),
    datasets: orders.value,
  }
}

const showChartElementInteracted = (e): { selectedDatasetElement, orderId, datasetIndex } => {
  const chart = e.chart
  let elementsClicked = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true)
  if (elementsClicked.length === 0) {
    return { datasetIndex: null, orderId: null, selectedDatasetElement: null }
  }
  const { index, datasetIndex } = elementsClicked[0]
  const selectedDatasetElement = chartData.value.datasets[datasetIndex].data[index]
  return { selectedDatasetElement, orderId: chartData.value.datasets[datasetIndex]?.orderId, datasetIndex }
}

const activateBarsFromTooltip = () => {
  activateBarsFromOneOrder(tooltipData.value.datasetIndex, true)
}

const activateBarsFromOneOrder = (datasetIndex: number | null | undefined, chartUpdate = false) => {
  if (datasetIndex === null) {
    const chart = chartMain.value.getChart()
    chart.setActiveElements([])
    chart.active = []
    chartUpdate && chart.update()
    return
  }
  const chart = chartMain.value.getChart()
  const elementsInDataSet = chartData.value.datasets[datasetIndex]?.data?.length
  if (elementsInDataSet === 0) return
  const activeElements = [...Array(elementsInDataSet)].map((_, index: number) => {
    return { datasetIndex, index }
  })

  chart.setActiveElements(activeElements)
  chartUpdate && chart.update()
}

const setChartOptions = () => {
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
      const selectedDatasetElement = showChartElementInteracted(e).selectedDatasetElement
      const orderId = showChartElementInteracted(e).orderId
      const datasetIndex = showChartElementInteracted(e).datasetIndex
      if (!selectedDatasetElement) return
      activateBarsFromOneOrder(datasetIndex)
      tooltipData.value = {
        position: { x: e.x, y: e.y },
        datasetIndex: datasetIndex,
        id: orderId,
        loadData: selectedDatasetElement,
      }

    },
    onHover: (e) => {
      if (isHoverActive.value) {
        const selectedDatasetElement = showChartElementInteracted(e)?.selectedDatasetElement
        const orderId = showChartElementInteracted(e)?.orderId
        const datasetIndex = showChartElementInteracted(e)?.datasetIndex
        if (!selectedDatasetElement || !orderId) {
          activateBarsFromOneOrder(null)
          return
        }
        tooltipData.value = { position: { x: 0, y: 0 }, id: orderId, loadData: selectedDatasetElement }
        activateBarsFromOneOrder(datasetIndex)
      }
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
      xAxisKey: 'nested.time',
      yAxisKey: 'nested.load',
    },
    layout: {
      padding: 0,
    },
  }

}

</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>