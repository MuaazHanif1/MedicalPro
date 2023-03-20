import axiosApiClient from "@/axios";
import { defineStore } from "pinia";

export const useGeneralStore = defineStore("general", {
  state: () => ({
    countries: [
      {
        continent_name: "North America",
        created_at: "2022-08-03T10:26:18.000000Z",
        id: 1,
        name: "United States",
        updated_at: "2022-08-03T10:26:18.000000Z",
      },
      {
        continent_name: "Asia",
        created_at: "2022-08-03T10:26:18.000000Z",
        id: 2,
        name: "Pakistan",
        updated_at: "2022-08-03T10:26:18.000000Z",
      },
      {
        continent_name: "Africa",
        created_at: "2022-08-03T10:26:18.000000Z",
        id: 3,
        name: "Zimbabwe",
        updated_at: "2022-08-03T10:26:18.000000Z",
      },
    ],
    states: [],
    cities: [],
    languages: [],
    races: [],
    ethnicities: [],
    allergies: [],
    vaccines: [],
    allergy_reactions: [],
    surgery_procedures: [],
    medical_problems: [],
    family_relations: [],
    NDCs: [],
    manufacturers: [],
    sites: [],
    routes: [],
  }),
  getters: {},
  actions: {
    /**
     *
     * @returns {object}
     */
    async getCountryRequest() {
      await axiosApiClient
        .get("/countries")
        .then((res) => {
          this.countries = res.data.data;
          return res.data.data;
        })
        .catch((e) => {
          console.log(e);
          return this.countries;
        });
      return this.countries;
    },
    /**
     *
     * @returns {object}
     */
    async getStateRequest(id) {
      if(id){
      return await axiosApiClient
        .get(`/states/${id}`)
        .then((res) => {
          this.states = res.data.data;
          return res.data.data;
        })
        .catch((e) => {
          console.log(e);
          return this.states;
        });
      }  
    },
    /**
     *
     * @returns {object}
     */
    async getCityRequest(id) {
      if(id){
        return await axiosApiClient
        .get(`/cities/${id}`)
        .then((res) => {
          this.cities = res.data.data;
          return res.data.data;
        })
        .catch((e) => {
          console.log(e);
          return this.cities;
        });
      }
    },
    /**
     *
     * @returns {object}
     */
    getLanguages() {
      axiosApiClient
        .get("/languages")
        .then((res) => {
          this.languages = res.data.data;
        })
        .catch((e) => console.log(e));
    },
    /**
     *
     * @returns {object}
     */
    getRace() {
      axiosApiClient
        .get("/races")
        .then((res) => {
          this.races = res.data.data;
        })
        .catch((e) => console.log(e));
    },
    /**
     *
     * @returns {object}
     */
    getEthnicity() {
      axiosApiClient
        .get("/ethnicities")
        .then((res) => {
          this.ethnicities = res.data.data;
        })
        .catch((e) => console.log(e));
    },
    /**
     *
     * @returns {object}
     */
    async getAllergies() {
      return axiosApiClient
        .post("/allergies")
        .then((res) => {
          this.allergies = res.data.data.data;
        })
        .catch((error) => {
          throw error;
        });
    },
    /**
     *
     * @returns {object}
     */
    async getVaccines() {
      return axiosApiClient.post("/vaccines").then((res) => {
        this.vaccines = res.data.data.data;
      });
    },
    /**
     *
     * @returns {object}
     */
    async getAllergyReactions() {
      return axiosApiClient.get("/reactions").then((res) => {
        this.allergy_reactions = res.data.data;
      });
    },
    /**
     *
     * @returns {object}
     */
    async getAllSurgery() {
      return axiosApiClient.post("/surgeries").then((res) => {
        this.surgery_procedures = res.data.data.data;
      });
    },
    /**
     *
     * @returns {object}
     */
    async getAllMedicalProblems() {
      return axiosApiClient.post("/medical-problems").then((res) => {
        this.medical_problems = res.data.data.data;
      });
    },
    /**
     *
     * @returns {object}
     */
    async getAllRelations() {
      return axiosApiClient.get("/relationships").then((res) => {
        this.family_relations = res.data.data;
      });
    },
    /**
     *
     * @returns {object}
     */
    async getAllNDCs() {
      return axiosApiClient.post("/ndcs").then((res) => {
        this.NDCs = res.data.data.data;
      });
    },
    /**
     *
     * @returns {object}
     */
    async getAllManufacturers() {
      return axiosApiClient.post("/manufactures").then((res) => {
        this.manufacturers = res.data.data.data;
      });
    },
    /**
     *
     * @returns {object}
     */
    async getAllSites() {
      return axiosApiClient.get("/sites").then((res) => {
        this.sites = res.data.data;
      });
    },
    /**
     *
     * @returns {object}
     */
    async getAllRoutes() {
      return axiosApiClient.get("/routes").then((res) => {
        this.routes = res.data.data;
      });
    },
    /**
     * Description: get drug detail by  drug id
     * @param {*} id
     * @returns get drug objeect
     */

    async getDrugDetail(id) {
      const response = await axiosApiClient
        .get(`ePrescription/drug/${id}`)
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return err;
        });
      return response;
    },
    /**
     * Description: save e prescription detail api
     * @param {*} payload data of e prescription object
     * @returns saved prescription object
     */
    async saveEPrescription(payload) {
      const response = await axiosApiClient
        .post("ePrescription/set-drug", payload)
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return err;
        });
      return response;
    },
    /**
     *  Description: get e prescription by id
     * @param {*} id
     * @returns prescribed_drugs array
     */
    async getEPrescriptionById(id) {
      const response = await axiosApiClient
        .get(`patientPortal/view/${id}`)
        .then((res) => {
          return res.data?.data?.prescribed_drugs;
        })
        .catch((err) => {
          return err;
        });
      return response;
    },
    /**
     * Description: remove e prescription by id
     * @param {*} id
     * @returns removed object
     */
    async removeEPrescriptionById(id) {
      const response = await axiosApiClient
        .get(`ePrescription/remove-drug/${id}`)
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return err;
        });
      return response;
    },
    /**
     * Description:  e prescription set notes
     * @param {*} id
     * @returns object
     */
    async setEPrescriptionNoteById(payload) {
      const response = await axiosApiClient
        .post("ePrescription/set-notes", payload)
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return err;
        });
      return response;
    },
  },
});
