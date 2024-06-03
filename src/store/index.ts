import {defineStore} from 'pinia'
import axios from "axios"
import {Truck} from "../utils/types";
import {useToast} from "primevue/usetoast";


export const useStore = defineStore('main', {
    state: () => ({
        API_URL: 'http://qa-api-mock-3.eu-central-1.elasticbeanstalk.com/',
        isInitialized: false,
        isFormVisible: false,
        draftTruck: {} as Truck | {},
        isTruckEdition: false,
        trucks: [] as Truck[],
        toast: useToast()
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
            this.draftTruck = {} as Truck
            this.isTruckEdition = false
        },
        async fetchTrucks(param) {
            try {
                const response = await axios.get(this.API_URL + param, {
                    params: {
                        limit: 30
                    }
                })
                this.trucks = response.data
            } catch (error) {
                console.log(error)
            }
        },
        async fetchTruckById(param) {
            try {
                const data = await axios.get(this.API_URL + param)
                return data.data
            } catch (error) {
                console.log(error)
            }
        },
        async updateTruck(param) {
            const {id, ...data} = param
            try {
                await axios.put(`${this.API_URL}trucks/${id}`, data)
            } catch (error) {
                console.log(error)
            } finally {
                this.isFormVisible = false;
                this.resetEditForm()
            }
        },
        async deleteTruck(id) {
            try {
                await axios.delete(`${this.API_URL}trucks/${id}`)
            } catch (error) {
                console.log(error)
            }
        },
        async addTruck(data) {
            try {
                await axios.post(`${this.API_URL}trucks`, data)
            } catch (error) {
                console.log(error)
            } finally {
                this.isFormVisible = false;
            }
        }
    },
    getters: {
        isReady: (state) => {
            return !state.isInitialized
        }
    },
})
