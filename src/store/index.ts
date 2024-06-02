import {defineStore} from 'pinia'
import axios from "axios"

export const useStore = defineStore('main', {
    state: () => ({
        API_URL: 'http://qa-api-mock-3.eu-central-1.elasticbeanstalk.com/',
        isInitialized: false,
        trucks: [],
    }),

    actions: {
        initApp() {
            this.isInitialized = true
            console.log('app initialized!')
        },
        async fetchTrucks(param) {
            try {
                const data = await axios.get(this.API_URL + param)
                this.trucks = data.data
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
            try {
                await axios.put(this.API_URL + param)
            } catch (error) {
                console.log(error)
            }
        },
        async deleteTruck(param) {
            try {
                await axios.delete(this.API_URL + param)
            } catch (error) {
                console.log(error)
            }
        },
        async addTruck(param) {
            try {
                console.log('addTruck', param);
                // await axios.post(this.API_URL + param)
            } catch (error) {
                console.log(error)
            }
        }
    },
    getters: {
        isReady: (state) => {
            return !state.isInitialized
        }
    },
})
