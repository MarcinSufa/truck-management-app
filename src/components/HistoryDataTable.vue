<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { computed, ref } from 'vue'
import { useOrdersStore } from '../store'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import { FilterMatchMode } from 'primevue/api'

const ordersStore = useOrdersStore()
const history = computed(() => ordersStore.history)

const reverseChange = (data, index) => {
  if (data.orderId) {
    ordersStore.revertHistory(data.orderId, data.loadId, data.oldData, index, data.type)
    return
  }
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})
</script>

<template>
  <DataTable selectionMode="single" :value="history" v-model:filters="filters"
             scrollable scrollHeight="50rem"
             class="pt-5 w-1/2"
  >
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xl text-900 font-bold">History</span>
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
    <Column field="description" header="Description" sortable />
    <Column field="createTime" header="Created On"
            class="truncate" sortable
    ></Column>
    <Column header="Action">
      <template #body="{ data, index }">
        <Button icon="pi pi-history" severity="secondary" raised @click="reverseChange(data, index)" />
      </template>
    </Column>

  </DataTable>
</template>

<style scoped>
</style>
