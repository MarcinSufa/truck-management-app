<template>
  <Card
    class="bg-gradient-to-br from-[#f5f5f5] to-[#f5f5f5] border border-gray-200"
  >
    <div>{{ tooltipDataId }}</div>
    <div>{{ tooltipDataLoadData }}</div>
    <template #header>
      <div>Header</div>
    </template>
    <template #title>Order ID: {{ tooltipDataId }}</template>
    <template #subtitle>Load ID : {{ tooltipDataLoadData }}</template>
    <template #content>
      <div>
      </div>
    </template>
    <template #footer>
      <div class="flex gap-4 mt-1">
        <Button label="Cancel" severity="secondary" outlined
                @click="$emit('toogleTooltip')"
        />

        <Button icon="pi pi-thumbtack" label="show" raised
                @click="$emit('activateBarsFromTooltip')"
        />
      </div>
    </template>
  </Card>
</template>
<script setup lang="ts">

defineProps({
  tooltipDataId: {
    type: String,
    required: true,
  },
  tooltipDataLoadData: {
    type: String,
    required: true,
  },
})
</script>