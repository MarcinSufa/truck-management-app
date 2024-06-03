<script setup lang="ts">
import TrucksDataTable from './components/TrucksDataTable.vue'
import {useStore} from "./store";
import Toast from "primevue/toast";
import {useToast} from "primevue/usetoast";
import {computed, onMounted} from "vue";
import Card from "primevue/card";
import TruckForm from "./components/TruckForm.vue";
import Dialog from "primevue/dialog";

const store = useStore()
const toast = useToast()

const isFormVisible = computed({
  get() {
    return store.isFormVisible
  },
  set(val) {
    store.isFormVisible = val
    if(!val) {
      store.resetEditForm()
    }
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
