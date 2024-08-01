import { defineStore } from 'pinia'
import axios from 'axios'
import { Truck } from '../utils/types'
import { useToast } from 'primevue/usetoast'
import * as toast from '../composables/toast'
import { generateChartDataSets, Order } from '../composables/chartConfig.ts'
import { shallowRef } from 'vue'


export const useStore = defineStore('main', {
  state: () => ({
    API_URL: 'http://qa-api-mock-3.eu-central-1.elasticbeanstalk.com/',
    isInitialized: false,
    isFormVisible: false,
    trucksLoading: false,
    draftTruck: {} as Truck | {},
    isTruckEdition: false,
    trucks: [] as Truck[],
    toast: useToast(),
  }),

  actions: {
    initApp() {
      this.isInitialized = true
      console.log('app initialized!')
    },
    toggleForm() {
      this.isFormVisible = !this.isFormVisible
    },
    editTruckForm(truck: Truck) {
      this.draftTruck = truck
      this.isFormVisible = true
      this.isTruckEdition = true
    },
    resetEditForm() {
      this.draftTruck = {}
      this.isTruckEdition = false
    },
    async fetchTrucks(param: string) {
      try {
        this.trucksLoading = true
        const response = await axios.get(this.API_URL + param, {
          params: {
            limit: 30,
          },
        })
        this.trucks = response.data
      } catch (error) {
        console.log(error)
      } finally {
        this.trucksLoading = false
      }
    },
    async updateTruck(param: Truck) {
      const { id, ...data } = param
      try {
        await axios.put(`${this.API_URL}trucks/${id}`, data)
        toast.info('Update', `Truck with id: ${id} was updated successfully!`)
      } catch (error) {
        console.log(error)
        toast.error('Error', `Truck with id: ${id} was updated successfully!`)
      } finally {
        this.isFormVisible = false
        this.resetEditForm()
      }
    },
    async deleteTruck(id: string) {
      try {
        await axios.delete(`${this.API_URL}trucks/${id}`)
        toast.success('Delete', `Truck with id: ${id} was deleted successfully!`)
      } catch (error) {
        console.log(error)
        toast.error('Error', `Truck with id: ${id} was not deleted!`)
      }
    },
    async addTruck(data: Truck) {
      try {
        await axios.post(`${this.API_URL}trucks`, data)
        toast.success('Added', `Truck ${data.name} was added successfully!`)
      } catch (error) {
        console.log(error)
        toast.error('Error', `Truck ${data.name} was not added!`)
      } finally {
        this.isFormVisible = false
      }
    },
  },
  getters: {
    isReady: (state) => {
      return !state.isInitialized
    },
  },
})

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: shallowRef([]) as Order[],
    selectedOrderIndex: null as number,
    isFormVisible: false,
    isChartUpdate: false
  }),
  actions: {
    fetchOrders() {
      this.orders = generateChartDataSets()
    },
    selectOrderIndex(orderId: number) {
      this.selectedOrderIndex = this.orders.findIndex((order) => order.orderId === orderId)
    },
    toggleForm() {
      this.isFormVisible = !this.isFormVisible
    },
    editOrderLoadData(data: Order) {
      const orderId = data.orderId
      const indexOfOrder = this.orders.findIndex((order) => order.orderId === orderId)
      const indexOfLoad = this.orders[indexOfOrder].data.findIndex((load) => load.id === data.id)
      this.orders[indexOfOrder].data[indexOfLoad].nested.time = data['nested.time']
      this.isChartUpdate = true;
    },
    editOrderBackgroundColor(data: Order, color: string) {
      const orderId = data.orderId
      const indexOfOrder = this.orders.findIndex((order) => order.orderId === orderId)
      this.orders[indexOfOrder].backgroundColor = color
      this.isChartUpdate = true;
    }
  },
  getters: {
    ordersGetter: (state) => {
      return shallowRef(state.orders)
    }
  }
})
