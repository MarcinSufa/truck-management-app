<script setup lang="ts">
import {computed} from 'vue'
import {useStore} from "../store";
import {useFormKitContextById} from '@formkit/vue'
import {truckStatusData} from "../utils/truck-utils";
import Tag from 'primevue/tag';

const store = useStore()

const submitTruckData = (submitData: any) => {
  store.addTruck(submitData)
}

const formContext = useFormKitContextById('truck')
const getImageFromStatus = computed(() => {
  return truckStatusData[formContext.value.value.status]?.image || '/src/assets/images/loading-truck.gif'
})

const getTrackStatusColor = computed(() => {
  return truckStatusData[formContext.value.value.status]?.color || null
})

const getTrackStatusLabel =computed(() => {
  return truckStatusData[formContext.value.value.status]?.label || null
})

</script>

<template>

  <FormKit
      id='truck'
      v-slot='{ value: formData }'
      type='form'
      form-class='fk-univ-app p-4'
      submit-label='Submit'
      submit-class='btn btn-primary'
      incomplete-message='Sorry. The application was not submitted because not all fields are filled out correctly.'
      @submit='submitTruckData'
  >
    <div class='grid gap-3 grid-cols-6 w-100'>
      <div class="flex flex-col items-center justify-center w-100 col-span-3">
        <img :src="getImageFromStatus" alt="logo" class="w-30 mx-auto " width="70"/>
        <Tag :value="getTrackStatusLabel"
             :severity="getTrackStatusColor"/>
      </div>
      <FormKit
          name='status'
          label='Status'
          type="radio"
          outer-class='col-span-3'
          validation='required'
          :options="[{
            value: 'LOADING', label: 'LOADING'},
            {value: 'TO_JOB', label: 'TO JOB'},
            {value: 'AT_JOB', label: 'AT JOB'},
            {value: 'RETURNING', label: 'RETURNING'},
            {value: 'OUT_OF_SERVICE', label: 'OUT OF SERVICE'}]"
          help="Select Truck status."
      />

    </div>
    <FormKit
        name='code'
        label='Code'
        type='text'
        validation='required:trim|alphanumeric|length:3,10'
        outer-class='col-span-3'
    />
    <FormKit
        name='name'
        label='Name'
        type='text'
        validation='required:trim|length:1,20'
        outer-class='col-span-3'
    />

    <FormKit
        type="textarea"
        name="description"
        label="Truck Description"
        validation="optional:trim|length:0,120"
        validation-visibility="live"
        :validation-messages="{ 'length': 'Description cannot be more than 120 characters.' }"
        outer-class='col-span-3'
    />


  </FormKit>
</template>

<style scoped>

</style>
