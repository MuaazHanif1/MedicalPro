import axiosApiClient from "@/axios";
import notify from "@/composables/notify";
import { defineStore } from "pinia";

export const useVitalsStore = defineStore("vitals", {
  state: () => ({
    appointment_id: null,
    patient_id: 1,
    id: undefined,
    bloodPressure: [],
    weight: [],
    height: [],
    bmi: [],
    heartRate: [],
    inhaledO2: [],
    pulse: [],
    respiratoryRate: [],
    temperature: [],
    waistCircumference: [],
    painScale: [],
  }),
  getters: {},
  actions: {
    /**  Description: this method get all vitals data with respect to the appointment Id and stores them in the store
     */
    async getAllVitals() {
      try {
        const response = await axiosApiClient.post(
          "/patientPortal/patient-vitals",
          {
            appointment_id: this.appointment_id,
          }
        );

        const { data } = response;
        this.bloodPressure = data.data[0].blood_pressure_vital;
        this.height = data.data[0].height_vital;
        this.weight = data.data[0].weight_vital;
        this.bmi = data.data[0].bmi_vital;
        this.heartRate = data.data[0].heart_rate_vital;
        this.inhaledO2 = data.data[0].inhaled_o2_vital;
        this.pulse = data.data[0].pulse_vital;
        this.respiratoryRate = data.data[0].respiratory_rate_vital;
        this.temperature = data.data[0].temperature_vital;
        this.waistCircumference = data.data[0].wc_vital;
        this.painScale = data.data[0].pain_scale_vital;

        return data;
      } catch (error) {
        notify("Something went wrong. Please try again !",'negative', "error");
        return error
      }
    },
     /**  Description: this method sends the vital details to the backend
      * @param {data} Object Vital Data to be sent to the backend
     */
    async sendBloodPressureVital(data) {
      try {
         const response = await axiosApiClient.post(
          "/vitals/set-blood-pressure/",
          data
        );
        notify("Blood Pressure Vital Added Successfully !",'primary');
        return response;
      } catch (error) {
        notify("Something went wrong. Please try again !",'negative', "error");
        return error;
      }
    },

      /**  Description: this method sends the vital details to the backend
      * @param {data} Object Vital Data to be sent to the backend
     */
    async sendPainScaleVital(data) {
      try {
        const response = await axiosApiClient.post(
          "/vitals/set-pain-scale/",

          data
        );
        notify("Pain Vital Added Successfully !",'primary');
        return response;
      } catch (error) {
         notify("Something went wrong. Please try again !",'negative', "error");
        return error;
      }
    },

    /**  Description: this method sends the vital details to the backend
      * @param {data} Object Vital Data to be sent to the backend
     */
    async sendWaistCircumferenceVital(data) {
      try {
        const response = await axiosApiClient.post("/vitals/set-wc/", data);
        notify("Waist Vital Added Successfully !",'primary');
        return response;
      } catch (error) {
         notify("Something went wrong. Please try again !",'negative', "error");
        return error;
      }
    },
    /**  Description: this method sends the vital details to the backend
      * @param {data} Object Vital Data to be sent to the backend
     */
    async sendTemperatureVital(data) {
      try {
        const response = await axiosApiClient.post(
          "/vitals/set-temperature/",
          data
        );
        notify("Temperature Vital Successfully !",'primary');
        return response;
      } catch (error) {
         notify("Something went wrong. Please try again !",'negative', "error");
        return error;
      }
    },
    /**  Description: this method sends the vital details to the backend
      * @param {data} Object Vital Data to be sent to the backend
     */
    async sendRespiratoryRateVital(data) {
      try {
        const response = await axiosApiClient.post(
          "/vitals/set-respiratory-rate/",
          data
        );
        notify("Respiratory Vital Added Successfully !",'primary');
        return response;
      } catch (error) {
         notify("Something went wrong. Please try again !",'negative', "error");
        return error;
      }
    },
    /**  Description: this method sends the vital details to the backend
      * @param {data} Object Vital Data to be sent to the backend
     */    
    async sendPulseVital(data) {
      try {
        const response = await axiosApiClient.post(
          "/vitals/set-pulse/",

          data
        );
        notify("Pulse Vital Added Successfully !",'primary');
        return response;
      } catch (error) {
         notify("Something went wrong. Please try again !",'negative', "error");
        return error;
      }
    },
    /**  Description: this method sends the vital details to the backend
      * @param {data} Object Vital Data to be sent to the backend
     */
    async sendInhaledO2Vital(data) {
      try {
        const response = await axiosApiClient.post(
          "/vitals/set-inhaled-o2/",

          data
        );
        notify("Inhaled O2 Vital Added Successfully !",'primary');
        return response;
      } catch (error) {
         notify("Something went wrong. Please try again !",'negative', "error");
        return error;
      }
    },
      /**  Description: this method sends the vital details to the backend
      * @param {data} Object Vital Data to be sent to the backend
     */
    async sendHeartRateVital(data) {
      try {
        const response = await axiosApiClient.post(
          "/vitals/set-heart-rate/",

          data
        );
        notify("Heart Rate Vital Added Successfully !",'primary');
        return response;
      } catch (error) {
         notify("Something went wrong. Please try again !",'negative', "error");
        return error;
      }
    },
      /**  Description: this method sends the vital details to the backend
      * @param {data} Object Vital Data to be sent to the backend
     */
    async sendBmiVital(data) {
      try {
        const response = await axiosApiClient.post(
          "/vitals/set-bmi/",

          data
        );
        notify("BMI Vital Added Successfully !",'primary');
        return response;
      } catch (error) {
         notify("Something went wrong. Please try again !",'negative', "error");
        return error;
      }
    },
     /**  Description: this method sends the vital details to the backend
      * @param {data} Object Vital Data to be sent to the backend
     */
    async sendHeightVital(data) {
      try {
        const response = await axiosApiClient.post("/vitals/set-height/", data);
        notify("Height Vital Added Successfully !",'primary');
        return response;
      } catch (error) {
         notify("Something went wrong. Please try again !",'negative', "error");
        return error;
      }
    },
    async sendWeightVital(data) {
      try {
        const response = await axiosApiClient.post("/vitals/set-weight/", data);
        notify("Weight Vital Added Successfully !",'primary');
        return response;
      } catch (error) {
         notify("Something went wrong. Please try again !",'negative', "error");
        return error;
      }
    },
    /**  Description: this method gets the appointment details
     */
    async getAppointmentDetails(aid='') {
      try {
        const response = await axiosApiClient.post('patient/patient-appointment-details',
        {id: aid ? aid : this.appointment_id}
        );
        return response.data.data;
      } catch (err) {
        notify(err.response.data.error,'negative', "error");
        return err;      
      }
    }
  },
});
