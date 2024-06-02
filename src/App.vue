<script setup lang="ts">
import {useStore} from "./store";
import Toast from "primevue/toast";
import {useToast} from "primevue/usetoast";
import {computed, onMounted} from "vue";

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

onMounted(() => {
  store.initApp()
  store.fetchTrucks('trucks');
})


</script>
<template>
  <Toast/>
  <div class="rounded overflow-hidden shadow-lg p-4 bg-white">
  </div>
</template>

<style scoped>

</style>
