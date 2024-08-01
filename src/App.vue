<script setup lang="ts">
import { useStore } from './store'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { computed, onMounted, ref } from 'vue'
import Card from 'primevue/card'
import TruckForm from './components/TruckForm.vue'
import Dialog from 'primevue/dialog'
import { useRouter } from 'vue-router'
import Menubar from 'primevue/menubar'

const store = useStore()
const toast = useToast()
const router = useRouter()

const isFormVisible = computed({
  get() {
    return store.isFormVisible
  },
  set(val) {
    store.isFormVisible = val
    if (!val) {
      store.resetEditForm()
    }
  },
})

onMounted(() => {
  store.initApp()
  store.fetchTrucks('trucks')
})

const menuItems = ref([
  {
    label: 'Trucks Data',
    icon: 'pi pi-home',
    command: () => {
      router.push('/')
    },
  },
  {
    label: 'Truck Demand Graph',
    icon: 'pi pi-star',
    command: () => {
      router.push('/demand')
    },
  },
])


</script>
<template>
  <div class="card">
    <Menubar :model="menuItems" />
  </div>
  <Toast />
  <Dialog v-model:visible="isFormVisible" modal header="Add Truck" :style="{ width: '25rem' }">
    <TruckForm />
  </Dialog>
  <Card class="w-100">
    <template #content>
      <RouterView />
    </template>
  </Card>
</template>

<style scoped>

</style>
