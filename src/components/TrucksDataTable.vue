<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Button from "primevue/button";
import {computed, ref} from 'vue'
import {useStore} from "../store";
import Dialog from "primevue/dialog";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import {truckStatusData} from "../utils/truck-utils";

const store = useStore()
const trucks = computed(() => store.trucks)
const toast = useToast()
const truckStatus = truckStatusData;

const deleteTruckDialog = ref(false)
const deleteTruckId = ref(null)

const getTrackStatusColor = (status) => {
  return truckStatus[status].color || null
}

const getTrackStatusLabel = (status) => {
  return truckStatus[status].label || null
}

const editTruck = (truck) => {
  store.editTruckForm(truck)
}

const toggleDeleteTruckDialog = (truck) => {
  deleteTruckDialog.value = true;
  deleteTruckId.value = truck.id;
}

const deleteSelectedTruck = () => {
  const id = deleteTruckId.value;
  store.deleteTruck(deleteTruckId.value)
  deleteTruckDialog.value = false;
  deleteTruckId.value = null;
  toast.add({
    severity: 'success', summary: 'Successful', detail: `Truck with id: ${id} was Deleted`, life: 3000
  })
  store.fetchTrucks('trucks');
}

function addTruck() {
  store.toggleForm()
}

</script>

<template>
  <Toast/>
  <DataTable :value="trucks" tableStyle="min-width: 50rem;" scrollable scrollHeight="50rem">
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xl text-900 font-bold">Trucks Data</span>
        <Button icon="pi pi-plus" raised @click="addTruck"/>
      </div>
    </template>
    <Column field="id" header="ID" sortable style="max-width: 12rem; overflow: hidden"></Column>
    <Column field="status" header="status" sortable style="width: 22%">
      <template #body="slotProps">
        <div class="flex items-center">
          <img :src="truckStatus[slotProps.data.status].image" alt="truck icon" class="mr-3" width="25"/>
          <Tag :value="getTrackStatusLabel(slotProps.data.status)"
               :severity="getTrackStatusColor(slotProps.data.status)"/>
        </div>
      </template>
    </Column>

    <Column field="code" header="code" sortable style="max-width: 8rem; overflow: hidden" class="truncate"></Column>
    <Column field="name" header="name" sortable style="width: 20%"></Column>
    <Column field="description" header="description" style="width: 20%"></Column>
    <Column :exportable="false" style="min-width:8rem">
      <template #body="slotProps">
        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click.prevent="editTruck(slotProps.data)"/>
        <Button icon="pi pi-trash" outlined rounded severity="danger"
                @click.prevent="toggleDeleteTruckDialog(slotProps.data)"/>
      </template>
    </Column>
  </DataTable>
  <Dialog v-model:visible="deleteTruckDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
    <div class="confirmation-content flex items-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
      <span v-if="deleteTruckId">Are you sure you want to delete the selected Truck with id: {{ deleteTruckId }}?</span>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="deleteTruckDialog = false"/>
      <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedTruck"/>
    </template>
  </Dialog>
</template>

<style scoped>

</style>
