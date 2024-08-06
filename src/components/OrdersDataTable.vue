<script setup lang="ts">
import DataTable, { DataTableRowClickEvent } from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { computed, ref, watch } from 'vue'
import { useOrdersStore } from '../store'
import { FilterMatchMode } from 'primevue/api'
import ColorPicker from 'primevue/colorpicker'
import { Order } from '../composables/chartConfig.ts'
import { useDebounceFn } from '@vueuse/core'
import { getStatusLabel } from '../composables/dataTableService.ts'

const ordersStore = useOrdersStore()
const orders = computed(() => ordersStore.orders)
const selectedOrder = ref()
const expandedRows = ref([])
const editingRows = ref([])

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

watch(selectedOrder, (value) => {
  ordersStore.selectOrderIndex(value?.orderId)
})

const onRowEditSave = (event) => {
  let { newData, data } = event
  ordersStore.editOrderLoadData(newData, data)
}
const updateColor = useDebounceFn((event: string, orderField: Order) => {
  const color = event.value
  ordersStore.editOrderBackgroundColor(orderField, `#${color}`)
}, 500)

const setExpandedRow = ($event: DataTableRowClickEvent) => {
  // check if row expanded before click of not
  const isExpanded = expandedRows.value.find((p) => p.orderId === $event.data.orderId)

  if (isExpanded?.orderId) expandedRows.value = []
  else expandedRows.value = [$event.data]
}

const removeHash = (color: string) => {
  return color.replace('#', '')
}

const moveOrderBar = (order: Order, direction: 'down' | 'up' = 'down') => {
  ordersStore.moveOrderBar(order.orderId, direction)
}

</script>

<template>
  <DataTable v-model:expandedRows="expandedRows" v-model:filters="filters" v-model:selection="selectedOrder"
             selectionMode="single" :value="orders"
             tableStyle="width: 50rem;"
             scrollable scrollHeight="50rem"
             class="pt-5"
             @row-click="setExpandedRow"
  >
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xl text-900 font-bold">Visible Orders</span>
        <div class="flex justify-between">
          <IconField class="mr-3 ">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Search" />
          </IconField>
          <Button icon="pi pi-align-justify " raised @click="ordersStore.toggleForm" />
        </div>
      </div>
    </template>

    <!--    <Column header="Action" style="width: 5rem">-->
    <!--      <template #body="slotProps">-->
    <!--        <div class="flex align-items-center justify-content-center gap-4">-->
    <!--          <Button icon="pi pi-angle-double-up" severity="secondary" @click="moveOrderBar('up', slotProps.data)" />-->
    <!--          <Button icon="pi pi-angle-double-down" severity="secondary" @click="moveOrderBar('down', slotProps.data)" />-->
    <!--        </div>-->
    <!--      </template>-->
    <!--    </Column>-->
    <Column expander style="width: 5rem" />
    <Column field="orderId" header="Order Id" sortable style="max-width: 12rem; overflow: hidden"></Column>
    <Column field="orderData.orderType" header="Type" sortable />
    <Column field="label" header="Status" sortable style="width: 22%">
      <template #body="slotProps">
        <div class="flex items-center">
          <Tag :value="slotProps.data.orderStatus" :severity="getStatusLabel(slotProps.data.orderStatus)" />
          <i v-if="slotProps.data.orderData.isOverloaded" style="color: orange"
             class="pi pi-exclamation-triangle ml-3"
          />
        </div>
      </template>
    </Column>

    <Column field="orderData.orderCode" header="Code"
            class="truncate"
    ></Column>
    <Column field="orderData.projectCode" header="Project code" sortable style="width: 20%"></Column>
    <Column field="orderData.customerCode" header="Customer"></Column>
    <Column field="orderData.backgroundColor" header="Color" :exportable="false" class="">
      <template #body="slotProps">
        <ColorPicker :base-z-index="50"
                     :model-value="removeHash(slotProps.data.backgroundColor)"
                     @change="updateColor($event, slotProps.data)"
                     format="hex"
        />
      </template>
    </Column>

    <template #expansion="slotProps">
      <DataTable :value="slotProps.data.data"
                 scrollable scrollHeight="50rem"
                 editMode="row"
                 v-model:editingRows="editingRows"
                 @row-edit-save="onRowEditSave"
      >
        <Column field="id" header="id" sortable style=" overflow: hidden"></Column>
        <Column field="nested.load" header="load" sortable>
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid style="width: 4rem;" />
          </template>
        </Column>
        <Column field="nested.time" header="time" sortable>
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid style="width: 4rem" />
          </template>
        </Column>
        <Column field="nested.spacing" header="spacing" sortable style="width: 6rem" />
        <Column :rowEditor="true" bodyStyle="text-align:center" style="width: 20%"></Column>
      </DataTable>
    </template>

  </DataTable>
</template>

<style scoped>
</style>
