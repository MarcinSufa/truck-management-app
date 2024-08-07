<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { computed, ref, watch } from 'vue'
import { useOrdersStore } from '@/store'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import { FilterMatchMode } from 'primevue/api'
import Tag from 'primevue/tag'
import { getStatusLabel } from '@/composables/dataTableService'

const ordersStore = useOrdersStore()
const overloadedOrders = computed(() => ordersStore.ordersOverloaded)
const selectedOrder = ref()

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

watch(selectedOrder, (value) => {
  ordersStore.selectOrderIndex(value?.orderId)
})

</script>

<template>
  <DataTable selectionMode="single" :value="overloadedOrders" v-model:filters="filters"
             scrollable scrollHeight="50rem"
             class="pt-5"
             v-model:selection="selectedOrder"
  >
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xl text-900 font-bold">Overloaded Orders</span>
        <div class="flex justify-between">
          <IconField class="mr-3 ">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Search" />
          </IconField>
        </div>
      </div>
    </template>
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
  </DataTable>
</template>

<style scoped>
</style>
