<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Button from "primevue/button";
import {computed} from 'vue'
import {useStore} from "../store";

const store = useStore()
const trucks = computed(() => store.trucks)

const truckStatus = {
  LOADING: {label: 'LOADING', color: 'warning'},
  TO_JOB: {label: 'TO JOB', color: 'info'},
  AT_JOB: {label: 'AT JOB', color: 'primary'},
  RETURNING: {label: 'RETURNING', color: 'success'},
  OUT_OF_SERVICE: {label: 'OUT OF SERVICE', color: 'danger'}
}

const getTrackStatusColor = (status) => {
  return truckStatus[status].color || null
}

const getTrackStatusLabel = (status) => {
  return truckStatus[status].label || null
}

function addTruck() {
  store.addTruck({
    id: 4,
    code: 'T004',
    name: 'Truck 4',
    status: 'Active',
    description: 'Truck 4 Description'
  })
}

</script>

<template>
  <DataTable :value="trucks" tableStyle="min-width: 50rem;">
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xl text-900 font-bold">Trucks Data</span>
        <Button icon="pi pi-plus" raised @click="addTruck"/>
      </div>
    </template>
    <Column field="id" header="ID" style="max-width: 12rem; overflow: hidden"></Column>
    <Column field="code" header="code" style="max-width: 8rem; overflow: hidden" class="truncate"></Column>
    <Column field="name" header="name" style="width: 20%"></Column>
    <Column field="status" header="status" style="width: 20%">
      <template #body="slotProps">
        <Tag :value="getTrackStatusLabel(slotProps.data.status)"
             :severity="getTrackStatusColor(slotProps.data.status)"/>
      </template>
    </Column>
    <Column field="description" header="description" style="width: 20%"></Column>
  </DataTable>
</template>

<style scoped>

</style>
