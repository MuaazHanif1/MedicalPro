import { defineStore } from "pinia";
import axiosApiClient from "@/axios";
import notify from "@/composables/notify";

export const useDoctorStore = defineStore('doctor',{
    state: () => {},
    actions:{
        async addDoctorFee(docID,amount) {
            console.log(docID,amount)
            try {
              const data = await axiosApiClient
              .post('/doctors/add-doctor-fee',
              {
                amount :amount,
              })
              return data
            } catch (error) {
              notify(error.message, "negative", "error");
              console.log(error);
            }
          },
          async requestDoctorFeeList(docID, payload) {
            try {
              const data = await axiosApiClient
              .post(`/doctors/doctor-fee-list/${docID}`,
              payload)
              console.log(data.data);
              return data.data;
            } catch (error) {
              notify(error.message, "negative", "error");
              console.log(error);
            }
          },
          async updateDoctorFeeStatus(docID, id) {
            try {
              const data = await axiosApiClient
              .post(`/doctors/update-doctor-fee-status/${id}`,
               {
                doctor_id: docID,
               })
              console.log(data.data);
              return data.data;
            } catch (error) {
              notify(error.message, "negative", "error");
              console.log(error);
            }
          },
    }
});