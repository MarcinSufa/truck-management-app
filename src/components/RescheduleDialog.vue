<script setup lang="ts">
import { useOrdersStore } from '../store'
import Dialog from 'primevue/dialog'
import { computed, onMounted, ref, shallowRef } from 'vue'
import Chart from 'primevue/chart'
import { PLANT_PRODUCTION, setChartOptions } from '../composables/chartConfig.ts'
import { calculateDayTimeLines } from '../composables/time.ts'

const ordersStore = useOrdersStore()
const isRescheduleDialog = computed({
    get() {
      return ordersStore.isRescheduleDialog
    },
    set(val) {
      ordersStore.toggleRescheduleDialog(val)
    },
  },
)
const aggregatedOrders = computed(() => ordersStore.aggregatedOrders)
const chartData = shallowRef()
const chartOptions = ref()

onMounted(() => {
  updateChartData()
  chartOptions.value = setChartOptions()

})

const updateChartData = () => {
  ordersStore.fetchOrders()
  // ordersStore.generateAggregatedOrdersData()
  chartData.value = setChartData()
}

const createDatasets = () => {
  const datasetsFromAggregatedOrders = Object.entries(aggregatedOrders.value).map(([key, value]) => {
    return {
      load: value,
      time: key,
    }
  })
  const datasetForAvailableTime = calculateDayTimeLines('07:00:00', '23:59:59').map((time) => {
    const isTimeExist = datasetsFromAggregatedOrders.find((data) => data.time === time)
    const load = isTimeExist ? PLANT_PRODUCTION - isTimeExist.load > 0 ? PLANT_PRODUCTION - isTimeExist.load : 0 :
      PLANT_PRODUCTION
    return {
      load: load,
      time: time,
    }
  })
  console.log('datasetForAvailableTime', datasetForAvailableTime)
  return { datasetsFromAggregatedOrders, datasetForAvailableTime }
}

const setChartData = () => {
  return {
    labels: calculateDayTimeLines('07:00:00', '23:59:59'),
    datasets: [{
      label: 'Scheduled',
      data: createDatasets().datasetsFromAggregatedOrders,
      backgroundColor: '#fad993',
    }, { label: 'Available', data: createDatasets().datasetForAvailableTime, backgroundColor: '#d3ffce' }],
  }
}


</script>
<template>
  <Dialog v-model:visible="isRescheduleDialog" header="Reschedule Order" :modal="true" :closable="true"
          :style="{ width: '50vw' }"
  >
    <Chart ref="chartMain" type="bar" :data="chartData" :options="chartOptions" class="h-[20rem]" />
  </Dialog>
</template>
