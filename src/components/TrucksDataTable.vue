<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Button from "primevue/button";
import {computed, ref} from 'vue'
import {useStore} from '@/store';
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";
import {truckStatusData} from '@/utils/truck-utils';
import notFound from '../assets/images/truck-not-found.jpg'
import truck from '../assets/images/truck.gif'

const store = useStore()
const trucks = computed(() => store.trucks)
const loading = computed(() => store.trucksLoading)
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

const deleteSelectedTruck = async () => {
  await store.deleteTruck(deleteTruckId.value)
  deleteTruckDialog.value = false;
  deleteTruckId.value = null;
  await store.fetchTrucks('trucks');
}

function addTruck() {
  store.toggleForm()
}

</script>

<template>
  <Toast/>
  <DataTable :value="trucks" tableStyle="min-width: 50rem;" scrollable scrollHeight="50rem" :loading="loading">
    <template #loading>
      <div class="flex items-center absolute -bottom-5 bg-white">
        <img :src='truck' alt='Truck image' class="mr-5 " width="50"/>
        <div class='flex flex-col items-center justify-center mr-3'>
          Loading truck data. Please wait.
      </div>
        <div class="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </template>
    <template #header>
      <div v-if="!loading" class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xl text-900 font-bold">Trucks Data</span>
        <Button icon="pi pi-plus" raised @click="addTruck"/>
      </div>
    </template>
    <template #empty>
      <div v-if="!loading" class='flex flex-col items-center justify-center my-4'>
        <img :src='notFound' alt='Truck not found' width="400"/>
        <div class="flex items-center mt-3">
          <h2 class='text-bold mr-4'> No Truck data found, please add truck</h2>
          <button class='bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded'
                  @click="addTruck">
            Add Truck
          </button>
        </div>
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
.lds-ring {
  color: #1c4c5b
}

.lds-ring,
.lds-ring div {
  box-sizing: border-box;
}

.lds-ring {
  display: inline-block;
  position: relative;
  width: 2rem;
  height: 2rem;
}

.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 32px;
  height: 32px;
  margin: 4px;
  border: 4px solid currentColor;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: currentColor transparent transparent transparent;
}

.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}

.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}

.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
