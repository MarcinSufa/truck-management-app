import { defineStore } from 'pinia'
import axios from 'axios'
import { HistoryChange, Truck } from '../utils/types'
import { useToast } from 'primevue/usetoast'
import * as toast from '../composables/toast'
import { generateChartDataSets, Order } from '../composables/chartConfig.ts'
import { ref, shallowRef } from 'vue'


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
    aggregatedOrders: [] as any[],
    selectedOrderIndex: null as number,
    history: [] as HistoryChange[],
    rescheduleOrder: ref({ orderId: null, id: null, load: null }),
    isRescheduleDialog: ref(false),
    isFormVisible: false,
    isChartUpdate: false,
  }),
  actions: {
    fetchOrders() {
      const { orders, aggregatedOrdersByTime } = generateChartDataSets()
      this.orders = orders
      this.aggregatedOrders = aggregatedOrdersByTime
    },
    selectOrderIndex(orderId: number) {
      this.selectedOrderIndex = this.orders.findIndex((order) => order.orderId === orderId)
    },
    toggleForm() {
      this.isFormVisible = !this.isFormVisible
    },
    addNewChangeToHistory(orderId, loadId, description, type, newData, oldData) {
      const createdBy = 'User'
      const createTime = new Date().toLocaleString()
      this.history.push({ orderId, loadId, description, type, newData, oldData, createdBy, createTime })
    },
    toggleRescheduleDialog(isVisible: boolean = false) {
      if (!isVisible) {
        this.rescheduleOrder = { orderId: null, id: null, load: null }
      }
      this.isRescheduleDialog = isVisible
    },
    updateRescheduleOrder(orderId, id, load) {
      this.rescheduleOrder = { orderId, id, load }
    },
    revertHistory(orderId, loadId = null, oldData, index, key = null) {
      const indexOfOrder = this.orders.findIndex((order) => order.orderId === orderId)
      if (loadId) {
        const indexOfLoad = this.orders[indexOfOrder].data.findIndex((load) => load.id === loadId)
        if (key) {
          this.orders[indexOfOrder].data[indexOfLoad].nested[key] = oldData
        }
      }
      if (key) {
        this.orders[indexOfOrder][key] = oldData
      }

      this.history = this.history.filter((change, i) => i !== index)
      this.isChartUpdate = true
    },
    editOrderLoadData(data: Order, oldData) {
      const orderId = data.orderId
      const indexOfOrder = this.orders.findIndex((order) => order.orderId === orderId)
      const indexOfLoad = this.orders[indexOfOrder].data.findIndex((load) => load.id === data.id)
      const oldTime = oldData.nested.time
      const oldLoad = oldData.nested.load
      if (data['nested.time']) {
        this.addNewChangeToHistory(orderId, data.id, 'Edit Load Time', 'time', data['nested.time'], oldTime)
        this.orders[indexOfOrder].data[indexOfLoad].nested.time = data['nested.time']
      }
      if (data['nested.load']) {
        this.addNewChangeToHistory(orderId, data.id, 'Edit Load Size', 'load', data['nested.load'], oldLoad)
        this.orders[indexOfOrder].data[indexOfLoad].nested.load = data['nested.load']
      }
      this.isChartUpdate = true
    },
    moveOrderBar(orderId: number, direction: string) {
      const oldIndex = this.orders.findIndex((order) => order.orderId === orderId)
      const newIndex = direction === 'up' ? oldIndex - 1 : oldIndex + 1
      const order = this.orders.splice(oldIndex, 1)[0]
      this.orders.splice(newIndex, 0, order)

      this.isChartUpdate = true
    },
    changeColor(indexOfOrder: number, color: string) {
      this.orders[indexOfOrder].backgroundColor = color
    },
    editOrderBackgroundColor(data: Order, color: string) {
      const orderId = data.orderId
      const indexOfOrder = this.orders.findIndex((order) => order.orderId === orderId)
      const oldColor = JSON.parse(JSON.stringify(this.orders[indexOfOrder].backgroundColor))
      this.addNewChangeToHistory(orderId, null, 'Edit Order Color', 'backgroundColor', color, oldColor)
      this.changeColor(indexOfOrder, color)
      this.isChartUpdate = true
    },
  },
  getters: {
    ordersGetter: (state) => {
      return shallowRef(state.orders)
    },
    ordersOverloaded: (state) => {
      return state.orders.filter((order) => order.orderData.isOverloaded)
    },
  },
})
