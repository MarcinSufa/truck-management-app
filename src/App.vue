<script setup lang="ts">
import TrucksDataTable from './components/TrucksDataTable.vue'
import {useStore} from "./store";
import Toast from "primevue/toast";
import {useToast} from "primevue/usetoast";
import {computed, onMounted, ref} from "vue";
import Card from "primevue/card";
import TruckForm from "./components/TruckForm.vue";
import Dialog from "primevue/dialog";

const store = useStore()
const trucks = computed(() => store.trucks)
const isAppInit = computed(() => store.isInitialized)

const toast = useToast()

function greet() {
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'This is a success message',
  })
}

const isFormVisible = computed({
  get() {
    return store.isFormVisible
  },
  set(val) {
    store.isFormVisible = val
  }
})

onMounted(() => {
  store.initApp()
  store.fetchTrucks('trucks');
})


</script>
<template>
  <Toast/>
  <Dialog v-model:visible="isFormVisible"  modal header="Add Truck" :style="{ width: '25rem' }">
    <TruckForm/>
  </Dialog>
  <Card>
    <template #content>
      <TrucksDataTable/>
    </template>
  </Card>
</template>

<style scoped>

</style>
