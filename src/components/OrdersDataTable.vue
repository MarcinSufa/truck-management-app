<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { computed, ref, watch } from 'vue'
import { useOrdersStore } from '../store'
import Toast from 'primevue/toast'
import { FilterMatchMode } from 'primevue/api'
import { OrderStatus } from '../utils/types.ts'

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
  let { newData } = event
  ordersStore.editOrderLoadData(newData)
}

const getStatusLabel = (status: OrderStatus) => {
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
    default:
      return undefined
  }
}

</script>

<template>
  <Toast />
  <DataTable v-model:expandedRows="expandedRows" v-model:filters="filters" v-model:selection="selectedOrder"
             selectionMode="single" :value="orders"
             tableStyle="min-width: 50rem;"
             scrollable scrollHeight="50rem"
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

    <Column expander style="width: 5rem" />
    <Column field="orderId" header="Order Id" sortable style="max-width: 12rem; overflow: hidden"></Column>
    <Column field="orderData.orderType" header="Type" sortable />
    <Column field="label" header="Status" sortable style="width: 22%">
      <template #body="slotProps">
        <div class="flex items-center">
          <Tag :value="slotProps.data.orderStatus" :severity="getStatusLabel(slotProps.data.orderStatus)" />
        </div>
      </template>
    </Column>

    <Column field="orderData.orderCode" header="Code" sortable style="max-width: 8rem; overflow: hidden"
            class="truncate"
    ></Column>
    <Column field="orderData.projectCode" header="Project code" sortable style="width: 20%"></Column>
    <Column field="orderData.customerCode" header="Customer" style="width: 20%"></Column>
    <Column :exportable="false" style="min-width:8rem">
      <template #body="slotProps">
        <Button icon="pi pi-pencil" outlined rounded class="mr-2" />
        <Button icon="pi pi-trash" outlined rounded severity="danger"
        />
      </template>
    </Column>
    <template #expansion="slotProps">
      <DataTable :value="slotProps.data.data"
                 tableStyle="min-width: 50rem;"
                 scrollable scrollHeight="50rem"
                 editMode="row"
                 v-model:editingRows="editingRows"
                 @row-edit-save="onRowEditSave"
      >
        <Column field="id" header="id" sortable style=" overflow: hidden"></Column>
        <Column field="nested.load" header="load" sortable />
        <Column field="nested.time" header="time" sortable style="width: 22%">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid />
          </template>
        </Column>
        <Column field="nested.spacing" header="spacing" sortable style="width: 22%" />
        <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
      </DataTable>
    </template>

  </DataTable>
</template>

<style scoped>
</style>
