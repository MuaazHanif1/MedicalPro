import axiosApiClient from "@/axios";
import { defineStore } from "pinia";
import { useUserStore } from "./user";
import notify from "@/composables/notify";

const userStore = useUserStore();

export const usePracticeStore = defineStore("practice", {
  state: () => ({
    practiceRegistrationFormData: {
      contact_person: [
        {
          heading: "Contact person details",
          sub_heading: "Provide information about contact details",
          first_name: "",
          middle_name: "",
          last_name: "",
          phone_number: "",
          designation: "",
          country_code: "92",
          email: "",
        },
      ],
      address: {
        address_line_1: "",
        address_line_2: "",
        country_id: "",
        state_id: "",
        city_id: "",
        zip_code_id: 1,
        location: "la: 31.582045 ,lo: 74.329376",
      },
      billing: {
        billing_address_line_1: "",
        billing_address_line_2: "",
        billing_country_id: "",
        billing_state_id: "",
        billing_city_id: "",
        billing_zip_code: "",
        billing_location: "la: 31.582045 ,lo: 74.329376",
      },
      legal_information: {
        practice_name: "",
        tax_id: "",
        practice_npi: "",
        practice_taxonomy: "",
        clia_number: "",
        logo_url: "",
        email: "",
        facility_id: "",
        oid: "",
      },
      file_attached: [],
    },
    practice_country_state_country_information: {
      country: [],
      address: {
        address_state: [],
        address_city: [],
      },
      billing: {
        billing_state: [],
        billing_city: [],
      },
    },
    selectedFrom: 1,
    uploadPercentage: 0,

    currentPatient: {
      id: null,
      data: [],
      history: {
        allergies: [],
        social_history: {},
        surgical: {},
        medical_problems: {},
        family_history: {},
        vaccines: {},
      },
      insurance: {
        data: [],
      },
      insurance_companies: [],
      appointments: [],
    },
    currentStaff: {},
    staff: {
      data: [],
      link: {},
      meta: {},
    },
    roles: {
      data: [],
      link: {},
      meta: {},
    },
    permissions: {
      data: [],
      link: {},
      meta: {},
    },
    tempToken:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYWUwNzRlNWRmYWIzZTQzOWZiNDc3NDBkYzE5NjVlZTkyNGYwNWE3ODk5OWE2OTFlMjU1MDczNzc1OTk5M2U0NzQxN2Q3NmQ5MDFjNzQ0YWQiLCJpYXQiOjE2NjA4MzAyMzkuNzMyNTU3LCJuYmYiOjE2NjA4MzAyMzkuNzMyNTU4LCJleHAiOjE2OTIzNjYyMzkuNzI5NzA5LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.J843CiSJxkfYMYcZbGYdfJrHGOjRsOF6RrvdmVbD9g8INFTMMByL1-r_6mnvZYJRFpPX4zkgKXUY_pzkmmRenn2aRXAl6Kw2yna6BtV0vQbfB9qYvXrZfuZbBhzl6Lj5PKurrI-je058sdgO2WEDTD9wQnQ61WGYxUUYAyOREfHjKqb9XtFdDgyaopghAYFNMIjnf6p3qpskecknEWikdaxyd5QMtY5kTodsHzWwyqxs44dvY0z-HG5ATSOnxu57b7vEq_Lp9V2ECnDt9HzljkVZ81t_s9XRa1kcBy3rkMoX-3yYbKxBl702z1Ovjr6vvNtIVo6422BqfmwQooTZMCrQj4GmkSk6ibE-04lsP8ANjZ2M1aTQG3XVgo6KcnMG5Mxba8F-2qB4mCz0K1MGDq-6c9b-uHBKmx144oEulo8koC7d653MnXeeW0csj5rYX_uVnBobGWbTIPMOO9Oh1TYn5LyUvYTYnwKiD4kJdoAM-sBJgg0KLSv93ag4LSO58i65X2I2y65bD80lgWL0rp-nMo4nDgKmSjAXjn2YZKDQ1tURRjFOJ2k6NgW_HA8OchUgQBubwgE1yFWu0fSq_xUJ3U9CX5gbhqTbho8gcA_AhbPt_eW0RK-KFrcYun-vPb8TteNBdyCnMW8SYFZyfaSuc9J_cSs3HeQFK9_2OfE",
    practice: {
      token: userStore.loginUserToken,
      departments: [],
      roles: [],
    },
    currentDoctor: {
      id: null,
      data: [],
    },
  }),
  getters: {
    getStaffFullName() {
      let staff_full_name = `${this.currentStaff.first_name || ""} ${
        this.currentStaff.middle_name || ""
      } ${this.currentStaff.last_name || ""}`;
      return staff_full_name;
    },
    getPracticeRegistrationFormDataForSubmitAndReview(state) {
      const practiceData = JSON.parse(
        JSON.stringify(state.practiceRegistrationFormData)
      );
      practiceData.contact_person.forEach((element) => {
        for (const property in element) {
          if (property == "heading" || property == "sub_heading") {
            delete element[property];
          }
        }
      });
      delete practiceData.address.country_id;
      practiceData.address.country;
      return practiceData;
    },
    getPatientFullname() {
      return `${
        this.currentPatient.data.first_name
          ? this.currentPatient.data.first_name
          : ""
      } ${
        this.currentPatient.data.middle_name
          ? this.currentPatient.data.middle_name
          : ""
      } ${
        this.currentPatient.data.last_name
          ? this.currentPatient.data.last_name
          : ""
      }`;
    },
    getDoctorFullname() {
      return `${
        this.currentDoctor.data.first_name
          ? this.currentDoctor.data.first_name
          : ""
      } ${
        this.currentDoctor.data.middle_name
          ? this.currentDoctor.data.middle_name
          : ""
      } ${
        this.currentDoctor.data.last_name
          ? this.currentDoctor.data.last_name
          : ""
      }`;
    },
    getPatientInsuranceAsTabs() {
      let tabs = [];
      this.currentPatient.insurance_companies.forEach((element) => {
        let { company: name, company: label } = element;
        tabs.push({ name, label });
      });

      return tabs;
    },
    getdoctorSpecializations(state) {
      let specializations = "";
      if (state.currentDoctor.data.doctor_specializations) {
        state.currentDoctor.data.doctor_specializations.forEach((cur) => {
          specializations = `${specializations} ${cur.name}, `;
        });
      }
      return specializations;
    },
    getCurrentCountry(state) {
      return state.practiceRegistrationFormData.billing.billing_country_id
        ? state.practiceRegistrationFormData.billing.billing_country_id
        : true;
    },
  },
  actions: {
    addingContactArrayMoreField() {
      this.practiceRegistrationFormData.contact_person.push({
        heading: "Add another details",
        sub_heading: "",
        first_name: "",
        middle_name: "",
        designation: "",
        last_name: "",
        phone_number: "",
        email: "",
        country_code: "",
      });
    },
    deleteContactArrayField(data) {
      this.practiceRegistrationFormData.contact_person.splice(data, 1);
    },
    updatingPracticeRegistrationFormValue(value) {
      if (value._arrayindex !== -1) {
        this.practiceRegistrationFormData[value.mainProperty][
          value._arrayindex
        ][value.property] = value.updatedData;
      } else {
        this.practiceRegistrationFormData[value.mainProperty][value.property] =
          value.updatedData;
      }
    },
    async getSpecializationDoctors1(specid = "") {
      const response = await axiosApiClient
        .post(
          "practice/specialization-doctor",
          specid ? { specialization_id: specid } : {}
        )
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          throw err;
        });
      return response;
    },
    /**
     * Description: This function deletes pre uploaded practice registration documents
     * @param {*} id
     * @return {Object}
     */
    async deleteFile(id) {
      await axiosApiClient
        .get(`/practice-document-delete/${id}`)
        .then((res) => {
          return res.data;
        });
    },
    async createPracticeFormData(id) {
      let temp = {
        contacts: this.practiceRegistrationFormData.contact_person,
        privacy_policy: true,
        ...this.practiceRegistrationFormData.address,
        ...this.practiceRegistrationFormData.billing,
        ...this.practiceRegistrationFormData.legal_information,
      };
      const data = await axiosApiClient
        .post(`/practice-request/${id}`, temp)
        .then((data) => {
          if (data.response && data.response.status == 409) {
            throw data;
          }
          return data;
        })
        .catch((err) => {
          throw err;
        });
      return data;
    },
    async searchPatient(payload) {
      const response = await axiosApiClient
        .post("practice/patient-list", payload)
        .then((res) => {
          return res?.data?.data;
        })
        .catch((err) => err);
      return response;
    },
    async getSpecialization(docid = "") {
      const response = await axiosApiClient
        .post("patient/doctor-specializations-list", docid ? { id: docid } : {})
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
      return response;
    },
    async getPractices() {
      const response = await axiosApiClient
        .get("practices")
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
      return response;
    },
    async getSpecializationDoctors(payload) {
      const response = await axiosApiClient
        .post("patient/specialization-doctor", payload)
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
      return response;
    },
    // doctor available dates for appointment
    /**
     *
     * @param {*} doctor_id
     * @returns Array
     */
    async getDoctorAvalilabeDates(doctor_id, practice_id) {
      const response = await axiosApiClient
        .post(`patient/doctor-slot/${doctor_id}`, {practice_id})
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
      return response;
    },
    /**
     * Descripiton: fetch all medical problems
     * @returns medical problem collection
     */
    async getMedicalProblem() {
      const response = await axiosApiClient
        .get("/patient/medical-problem-list")
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
      return response;
    },
    /**
     * Description: create patient by practice
     * @param {*} payload
     * @returns created patient
     */
    async practiceCreatePatient(payload) {
      const response = await axiosApiClient
        .post("practice/patient-register", payload)
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          return error;
        });
      return response;
    },
    async doctorPublishSlot(payload) {
      const response = await axiosApiClient
        .post("practice/publish-slot", payload)
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          return error;
        });
      return response;
    },
    async doctorDeactivateSlot(payload) {
      const response = await axiosApiClient
        .post("practice/deactivate-slot", payload)
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          return error;
        });
      return response;
    },
    async fetchCurrentDoctor(id) {
      return axiosApiClient
        .get(`practice/doctor/${id}`, {
          headers: {
            Authorization: `Bearer ${this.tempToken}`,
          },
        })
        .then((res) => {
          this.currentDoctor.data = res.data.doctors[0];
          return res;
        })
        .catch((error) => {
          throw error;
        });
    },
    async fetchDoctorDetailSlotsList(id) {
      return axiosApiClient
        .get(`practice/list-of-slots/${id}`, {
          headers: {
            Authorization: `Bearer ${this.tempToken}`,
          },
        })
        .then((res) => {
          //this.currentDoctor.data = res.data.doctors[0];
          return res;
        })
        .catch((error) => {
          throw error;
        });
    },
    async requestToCreateNewSloteForDoctorDetail(data) {
      const temp = await axiosApiClient
        .post(`pπaractice/add-slot`, data)
        .then((res) => {
          //this.currentDoctor.data = res.data.doctors[0];
          return res;
        })
        .catch((error) => {
          throw error;
        });
      return temp;
    },
    // fetch all appointments  by practice
    /**
     *
     * @param {*} pageNo
     * @param {*} date
     * @returns appointments
     */
    async getPracticeAppointments(payload) {
      const response = await axiosApiClient
        .post("patient/appointment-list", payload)
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return err;
        });
      return response;
    },
    /**
     * Description: get curent patient according to given id
     * @param {*} id
     * @returns {Object}
     */
    async fetchCurrentPatient(id) {
      return axiosApiClient
        .get(`/patient/patient-information/${id}`)
        .then((res) => {
          this.currentPatient.data = res.data.data;
          return res;
        })
        .catch((error) => {
          throw error;
        });
    },
    /**
     * Description: update basic info of a patient
     * @param {Object} data
     * @returns {Object}
     */
    async saveBasicInfo(data) {
      let { first_name, last_name, middle_name, gender, phone_number, dob } =
        data;
      return axiosApiClient
        .post(`/patient/edit-patient-basic-info`, {
          first_name: first_name,
          last_name: last_name,
          middle_name: middle_name,
          gender: gender,
          phone_number: phone_number,
          dob: dob,
        })
        .then((res) => {
          this.currentPatient.data = {
            ...this.currentPatient.data,
            ...res.data.data,
          };
          notify("Record Updated", "primary", "check_circle");
          return res;
        })
        .catch((error) => {
          notify(error.message, "negative", "error");
          throw error;
        });
    },
    /**
     * Description: update identification data of patient
     * @param {Object} data
     * @returns {Object}
     */
    async saveIdentificationInfo(data) {
      return axiosApiClient
        .post(`/patient/set-patient-identification`, {
          ...data,
          patient_identification_id: userStore.loginUser.id,
          patient_id: userStore.loginUser.id,
        })
        .then((res) => {
          this.currentPatient.data.patient_identification = {
            ...this.currentPatient.data.patient_identification,
            ...res.data.data,
          };
          notify("Record Updated", "primary", "check_circle");
          return res;
        })
        .catch((error) => {
          notify(error.message, "negative", "error");
          throw error;
        });
    },
    /**
     * Description: update contact info of patient
     * @param {Object} data
     * @returns {Object}
     */
    async saveContactInfo(data) {
      return axiosApiClient
        .post(`/patient/set-patient-contact`, {
          ...data,
          patient_contact_id: this.currentPatient.data.patient_contact,
          patient_id: userStore.loginUser.id,
        })
        .then((res) => {
          this.currentPatient.data.patient_contact = {
            ...this.currentPatient.data.patient_contact,
            ...res.data.data,
          };
          notify("Record Updated", "primary", "check_circle");
          return res;
        })
        .catch((error) => {
          throw error;
        });
    },
    async requestDoctorList(payload) {
      const data = await axiosApiClient
        .post("/patient/doctors", payload)
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          console.log(error);
        });
      return data;
    },
    async requestDoctorFeeList(docID, payload) {
      try {
        const data = await axiosApiClient.post(
          `/patient/doctor-fee-list/${docID}`,
          payload
        );
        console.log(data.data);
        return data.data;
      } catch (error) {
        notify(error.message, "negative", "error");
        console.log(error);
      }
    },
    async addDoctorFee(docID, amount) {
      console.log(docID, amount);
      try {
        const data = await axiosApiClient.post("/patient/add-doctor-fee", {
          doctor_id: docID,
          amount: amount,
        });
        return data;
      } catch (error) {
        notify(error.message, "negative", "error");
        console.log(error);
      }
    },
    async updateDoctorFeeStatus(docID, id) {
      try {
        const data = await axiosApiClient.post(
          `/patient/update-doctor-fee-status/${id}`,
          {
            doctor_id: docID,
          }
        );
        console.log(data.data);
        return data.data;
      } catch (error) {
        notify(error.message, "negative", "error");
        console.log(error);
      }
    },
    /**
     * Description: saving demographic info of patient
     * @param {Object} data
     * @returns {Object}
     */
    async saveDemographicInfo(data) {
      return axiosApiClient
        .post(`/patient/set-patient-demography`, {
          ...data,
          patient_demography_id:
            this.currentPatient.data.patient_demography?.id,
          patient_id: userStore.loginUser.id,
        })
        .then((res) => {
          this.currentPatient.data.patient_demography = {
            ...this.currentPatient.data.patient_demography,
            ...res.data.data,
          };
          notify("Record Updated", "primary", "check_circle");
          return res;
        })
        .catch((error) => {
          throw error;
        });
    },
    /**
     * Description: save reference contact info of a patient
     * @param {Object} data
     * @returns {Object}
     */
    async saveReferenceContactInfo(data) {
      return axiosApiClient
        .post(`/patient/set-reference-contact`, {
          ...data,
          patient_id: userStore.loginUser.id,
        })
        .then((res) => {
          const foundIndex = this.currentPatient.data.common_contact.findIndex(
            (reference) => reference.id === data.contact_id
          );
          if (foundIndex > -1) {
            this.currentPatient.data.common_contact[foundIndex] = res.data.data;
          } else this.currentPatient.data.common_contact.push(res.data.data);
          notify("Record Updated", "primary", "check_circle");
        })
        .catch((error) => {
          throw error;
        });
    },
    /**
     * Description: save employee info of a patient
     * @param {Object} data
     * @returns {Object}
     */
    async saveEmployeeInfo(data) {
      return axiosApiClient
        .post(`/patient/set-patient-employment`, {
          ...data,
          employment_id: this.currentPatient.data.patient_employment?.id,
          patient_id: userStore.loginUser.id,
        })
        .then((res) => {
          this.currentPatient.data.patient_employment = {
            ...this.currentPatient.data.patient_employment,
            ...res.data.data,
          };
          notify("Record Updated", "primary", "check_circle");
          return res;
        })
        .catch((error) => {
          throw error;
        });
    },
    /**
     * Description: get allergies of current patient
     * @param {Number} id
     * @returns {Object}
     */
    async getCurrentPatientAllergies(id) {
      return axiosApiClient
        .get(`/patient/patient-allergy/${id}`)
        .then((res) => {
          this.currentPatient.history.allergies = res.data.data;
          return res.data;
        })
        .catch((error) => {
          throw error;
        });
    },
    /**
     * Description: add or update allergies of current patient
     * @param {Object} sentData
     * @param {Boolean} creating creating or updating
     * @returns {Object}
     */
    async updatePatientAllergy(sentData, creating = false) {
      return axiosApiClient
        .post(`patient/set-patient-allergy`, {
          ...sentData,
          patient_allergy_id: sentData.id,
          patient_id: userStore.loginUser.id,
        })
        .then((res) => {
          let allery_index =
            this.currentPatient.history.allergies.data.findIndex(
              (x) => x.id == res.data.data.id
            );
          this.currentPatient.history.allergies.data[allery_index] = {
            ...this.currentPatient.history.allergies.data[allery_index],
            ...res.data.data,
          };

          if (creating) {
            this.currentPatient.history.allergies.data.unshift(res.data.data);
            notify("Record Added", "primary", "check_circle");
          } else {
            let allery_index =
              this.currentPatient.history.allergies.data.findIndex(
                (x) => x.id == res.data.data.id
              );
            this.currentPatient.history.allergies.data[allery_index] = {
              ...this.currentPatient.history.allergies.data[allery_index],
              ...res.data.data,
            };
            notify("Record Updated", "primary", "check_circle");
          }

          return res;
        });
    },
    /**
     * Description: delete allergies of current patient
     * @param {*} id
     * @returns {Object}
     */
    async deletePatientAllergy(id) {
      axiosApiClient
        .get(`/patient/delete-patient-allergy/${id}`)
        .then((res) => {
          this.currentPatient.history.allergies.data =
            this.currentPatient.history.allergies.data.filter(
              (allergy) => allergy.id !== id
            );
          notify("Record Deleted", "primary", "check_circle");
          return res;
        });
    },
    /**
     * Description: get social history of current patient
     * @param {*} id
     * @returns {Object}
     */
    async getCurrentPatientSocialHistory(id) {
      return axiosApiClient
        .get(`/patient/patient-social-history/${id}`)
        .then((res) => {
          this.currentPatient.history.social_history = { ...res.data.data };
        });
    },
    /**
     * Description: update social history of current patient
     * @param {Object} data
     * @returns {Object}
     */
    async updateCurrentPatientSocialHistory(data) {
      return axiosApiClient
        .post(`/patient/set-patient-social-history`, {
          ...data,
          patient_id: userStore.loginUser.id,
        })
        .then((res) => {
          this.currentPatient.history.social_history = { ...res.data.data };
          return res;
        });
    },
    /**
     * Description: get surgical history of current patient
     * @param {*} id
     * @returns {Object}
     */
    async getPatientSurgicalHistory(id) {
      return axiosApiClient
        .get(`/patient/patient-surgery-history/${id}`)
        .then((res) => {
          this.currentPatient.history.surgical = res.data.data;
          return res;
        });
    },
    /**
     * Description: get surgical history of current patient
     * @param {Object} data
     * @param {Boolean} create create or update
     * @returns {Object}
     */
    async updateCurrentPatientSurgicalHistory(data, create = false) {
      return axiosApiClient
        .post(`/patient/set-patient-surgery-history`, {
          ...data,
          patient_id: userStore.loginUser.id,
        })
        .then((res) => {
          if (create) {
            this.currentPatient.history.surgical.data.unshift(res.data.data);
          } else {
            let surgery_index =
              this.currentPatient.history.surgical.data.findIndex(
                (x) => x.id == res.data.data.id
              );
            this.currentPatient.history.surgical.data[surgery_index] = {
              ...this.currentPatient.history.surgical.data[surgery_index],
              ...res.data.data,
            };
          }
          return res;
        });
    },
    /**
     * Description: delete surgical history of current patient
     * @param {*} id
     */
    async deletePatientSurgery(id) {
      axiosApiClient
        .get(`/patient/delete-patient-surgery-history/${id}`)
        .then((res) => {
          this.currentPatient.history.surgical.data =
            this.currentPatient.history.surgical.data.filter(
              (surgery) => surgery.id !== id
            );
          return res;
        });
    },
    /**
     * Description: get medical problems of current patient
     * @param {*} id
     * @returns {Object}
     */
    async getPatientMedicalProblems(id) {
      return axiosApiClient
        .get(`/patient/patient-medical-problem/${id}`)
        .then((res) => {
          this.currentPatient.history.medical_problems = res.data.data;
          return res;
        });
    },
    /**
     * Description: add or update surgical history of current patient
     * @param {Object} data
     * @param {Boolean} create create or update
     * @returns {Object}
     */
    async updateCurrentPatientMedicalHistory(data, create = false) {
      return axiosApiClient
        .post(`/patient/set-medical-problem`, {
          ...data,
          patient_id: userStore.loginUser.id,
        })
        .then((res) => {
          if (create) {
            this.currentPatient.history.medical_problems.data.unshift(
              res.data.data
            );
          } else {
            let surgery_index =
              this.currentPatient.history.medical_problems.data.findIndex(
                (x) => x.id == res.data.data.id
              );
            this.currentPatient.history.medical_problems.data[surgery_index] = {
              ...this.currentPatient.history.medical_problems.data[
                surgery_index
              ],
              ...res.data.data,
            };
          }
          return res;
        });
    },
    /**
     * Description: delete medical history of current patient
     * @param {*} id
     * @returns {Object}
     */
    async deletePatientMedicalProblem(id) {
      axiosApiClient
        .get(`/patient/delete-patient-medical-problem/${id}`)
        .then((res) => {
          this.currentPatient.history.medical_problems.data =
            this.currentPatient.history.medical_problems.data.filter(
              (surgery) => surgery.id !== id
            );
          return res;
        });
    },
    /**
     * Description: get family history of current patient
     * @param {*} id
     * @returns {Object}
     */
    async getPatientFamilyHistory(id) {
      return axiosApiClient.get(`/patient/family-history/${id}`).then((res) => {
        this.currentPatient.history.family_history = res.data.data;
        return res;
      });
    },
    /**
     * Description: add or update family history of current patient
     * @param {Object} data
     * @param {Boolean} create create or update
     * @returns {Object}
     */
    async updateCurrentPatientFamilyHistory(data, create = false) {
      return axiosApiClient
        .post(`/patient/set-family-history`, {
          ...data,
          patient_id: userStore.loginUser.id,
        })
        .then((res) => {
          if (create) {
            this.currentPatient.history.family_history.data.unshift(
              res.data.data
            );
            notify("Record Added", "primary", "check_circle");
          } else {
            let surgery_index =
              this.currentPatient.history.family_history.data.findIndex(
                (x) => x.id == res.data.data.id
              );
            this.currentPatient.history.family_history.data[surgery_index] = {
              ...this.currentPatient.history.family_history.data[surgery_index],
              ...res.data.data,
            };
            notify("Record Updated", "primary", "check_circle");
          }
          return res;
        })
        .catch((err) => {
          throw err;
        });
    },
    /**
     * Description: delete family history of current patient
     * @param {*} id
     */
    async deleteFamilyHistory(id) {
      axiosApiClient.get(`/patient/delete-family-history/${id}`).then((res) => {
        this.currentPatient.history.family_history.data =
          this.currentPatient.history.family_history.data.filter(
            (surgery) => surgery.id !== id
          );
        notify("Record Deleted", "primary", "check_circle");
        return res;
      });
    },
    /**
     * Description: get vaccines of current patient
     * @param {*} id
     * @returns {Object}
     */
    async getPatientVaccines(id) {
      return axiosApiClient
        .get(`/patient/patient-vaccine/${id}`)
        .then((res) => {
          this.currentPatient.history.vaccines = res.data.data;
          return res;
        });
    },
    /**
     * Description: add or update vaccines of current patient
     * @param {Object} data
     * @param {Boolean} create create or update
     * @returns {Object}
     */
    async updateCurrentPatientVaccines(data, create = false) {
      return axiosApiClient
        .post(`/patient/set-patient-vaccine`, {
          ...data,
          patient_id: userStore.loginUser.id,
        })
        .then((res) => {
          if (create) {
            this.currentPatient.history.vaccines.data.unshift(res.data.data);
            notify("Record Added", "primary", "check_circle");
          } else {
            let surgery_index =
              this.currentPatient.history.vaccines.data.findIndex(
                (x) => x.id == res.data.data.id
              );
            this.currentPatient.history.vaccines.data[surgery_index] = {
              ...this.currentPatient.history.vaccines.data[surgery_index],
              ...res.data.data,
            };
            notify("Record Updated", "primary", "check_circle");
          }
          return res;
        });
    },
    /**
     * Description: get vaccines of current patient
     * @param {*} id
     */
    async deletePatientVaccines(id) {
      axiosApiClient
        .get(`/patient/delete-patient-vaccine/${id}`)
        .then((res) => {
          this.currentPatient.history.vaccines.data =
            this.currentPatient.history.vaccines.data.filter(
              (surgery) => surgery.id !== id
            );
          notify("Record Deleted", "primary", "check_circle");
          return res;
        });
    },
    /**
     * Description: get all insurances companies of a patient
     * @param {*} id
     * @returns {Object}
     */
    async getCurrentPatientInsuranceCompanies(id) {
      return axiosApiClient
        .get(`/patient/insurance-company-list/${id}`)
        .then((res) => {
          this.currentPatient.insurance_companies = res.data.data;
          return res;
        });
    },
    /**
     * Description: get all insurances of a patient by company id
     * @param {Number} id
     * @returns {Object}
     */
    async getCurrentPatientInsurance(id) {
      return axiosApiClient.get(`/patient/insurance-list/${id}`).then((res) => {
        this.currentPatient.insurance = res.data;
        return res;
      });
    },
    /**
     * Description: create insurances of a patient
     * @param {Object} adta
     * @returns {Object}
     */
    async createCurrentPatientInsurance(data) {
      return axiosApiClient
        .post("/patient/add-insurance", { ...data })
        .then((res) => {
          this.currentPatient.insurance.data.push({ ...res.data.data });
          let index = this.currentPatient.insurance_companies.find(
            (ic) => ic.company == res.data.data.company
          );
          if (!index) {
            this.currentPatient.insurance_companies.unshift({
              id: res.data.data.company,
              company: res.data.data.company,
            });
          }
        });
    },
    /**
     * Description: get staff listing with desired pagination
     * @param {Number} pageNumber current page of pagination
     * @param {Number} records records needeed per page
     * @returns {Object}
     */
    async getAllStaff(pageNumber = 1, records = 10) {
      return axiosApiClient
        .post(`/patient/staffs`, { page: pageNumber, pagination: records })
        .then((res) => {
          this.staff = res.data;
          return res.data;
        })
        .catch((error) => {
          throw error;
        });
    },
    /**
     * Description: adding practice staff
     * @param {Object} data
     * @returns {Object}
     */
    async addStaff(data) {
      return axiosApiClient
        .post(`/patient/add-staff`, { ...data })
        .then((res) => {
          notify("Staff added", "primary", "check_circle");
          this.staff.data.unshift(res.data.data);
          return res.data;
        })
        .catch((error) => {
          notify(error.message, "negative", "error");
          throw error;
        });
    },
    /**
     * Description: adding practice staff
     * @param {String} id
     * @returns {Object}
     */
    async getSingleStaff(id) {
      return axiosApiClient
        .post(`/patient/staff`, { user_id: id })
        .then((res) => {
          this.currentStaff = res.data.data;
          return res.data;
        })
        .catch((error) => {
          notify(error.message, "negative", "error");
          throw error;
        });
    },
    /**
     * Description: adding practice staff
     * @param {String} id
     * @returns {Object}
     */
    async updateStaffStatus(data) {
      return axiosApiClient
        .post(`/patient/staff-status-update`, { ...data })
        .then((res) => {
          this.currentStaff.is_active = res.data.data.is_active;
          // this.currentStaff.status = res.data.data;
          return res.data;
        })
        .catch((error) => {
          notify(error.message, "negative", "error");
          throw error;
        });
    },
    /**
     * Description: get roles listing of current practice with desired pagination
     * @param {Number} pageNumber current page of pagination
     * @param {Number} records records needeed per page
     * @returns {Object}
     */
    async getPracticeRoles(pageNumber = 1, records = 10) {
      return axiosApiClient
        .get(
          `/patient/roles-pagination/${parseInt(records)}?page=${parseInt(
            pageNumber
          )}`
        )
        .then((res) => {
          this.roles = res.data;
          return res.data;
        })
        .catch((error) => {
          throw error;
        });
    },
    /**
     * Description: adding practice role
     * @param {Object} data
     * @returns {Object}
     */
    async addRole(data) {
      return axiosApiClient
        .post(`/patient/add-role`, { ...data })
        .then((res) => {
          notify("Role added", "primary", "check_circle");
          return res.data;
        })
        .catch((error) => {
          notify(error.message, "negative", "error");
          throw error;
        });
    },
    /**
     * Description: get permissions listing for current practice
     * @returns {Object}
     */
    async getPracticePermissions() {
      return axiosApiClient
        .get(`/patient/permissions`)
        .then((res) => {
          this.permissions = res.data;
          return res.data;
        })
        .catch((error) => {
          throw error;
        });
    },
    /**
     * Description: assigning permissions to role for current practice
     * @param {Object} data
     * @returns {Object}
     */
    async setRolePermissions(data) {
      return axiosApiClient
        .post(`/patient/assign-permissions-to-role`, { ...data })
        .then((res) => {
          let surgery_index = this.roles.data.findIndex(
            (x) => x.id == res.data.data.id
          );
          this.roles.data[surgery_index] = {
            ...this.roles.data[surgery_index],
            ...res.data.data,
          };
          return res.data;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    },
    /**
     * Description: get departments listing for current practice
     * @returns {object}
     */
    async getAllDepartments() {
      return axiosApiClient.get("/patient/departments").then((res) => {
        this.practice.departments = res.data.data;
      });
    },
    /**
     * Description: get roles listing for current practice
     * @returns {object}
     */
    async getAllRole() {
      return axiosApiClient.get("/patient/roles").then((res) => {
        this.practice.roles = res.data.data;
      });
    },

    //Patient Appointments View And Search
    async getCurrenPatientAppointmentWithFilters(data) {
      return axiosApiClient
        .post(`/patient/appointment-date-list`, { ...data })
        .then((res) => {
          this.currentPatient.appointments = res.data.data;
          return res;
        });
    },

    // doctor appointment slots for specific date

    /**
     *
     * @param {*} doctor_id
     * @param {*} date
     * @returns slots
     */
    async getAppointmentSlotsBooked(doctor_id, date) {
      const response = await axiosApiClient
        .post("patient/appointment-date", { doctor_id: doctor_id, date: date })
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return err;
        });
      return response;
    },

    // create appointment by practice
    /**
     *
     * @param {*} payload
     * @returns created appointment array
     */
    async practiceCreateAppointment(payload) {
      const endPoint = payload.id
        ? "patient/re-schedule"
        : "patient/appointment-create";
      const response = await axiosApiClient
        .post(endPoint, payload)
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return err;
        });
      return response;
    },
    // get all patients registered by practice
    /**
     *
     * @param {*} pageNo
     * @returns all patients collection
     */
    async getPracticePatients(payload) {
      const response = await axiosApiClient
        .post(`practice/practice-patient/${userStore.getLoginUser.id}`, payload)
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return err;
        });
      return response;
    },

    // login user api function
    /**
     *
     * @param {*} payload
     * @returns login user object
     */
    async practiceLogin(payload) {
      const response = await axiosApiClient
        .post("practice/login", payload)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err;
        });
      return response;
    },

    // get medical problem by name
    async getMedicalProblemByName(payload) {
      const response = await axiosApiClient
        .post("medical-problems", payload)
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return err;
        });
      return response;
    },
    /**
     * create doctor by practice
     * @param {*} payload
     * @returns created doctor
     */
    async practiceCreateDoctor(payload) {
      const response = await axiosApiClient
        .post("practice/send-doctor-registration-link", payload)
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          return error;
        });
      return response;
    },

    async getDoctorAppointmentList(docId, date, page, rowsPerPage) {
      let response = null;
      try {
        response = await axiosApiClient.post(
          "practice/doctor-appointment-list",
          {
            doctor_id: docId,
            date: date,
            page: page,
            pagination: rowsPerPage,
          }
        );
        console.log(response.data.data);
        return response.data.data;
      } catch (error) {
        return error;
      }
    },
    async practiceCreateDoctorOffDays(payload) {
      const response = await axiosApiClient
        .post("practice/add-off-dates", payload)
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          return error;
        });
      return response;
    },
    async deleteDoctorOffDate(payload) {
      const response = await axiosApiClient
        .post("practice/delete-off-dates", payload)
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          return error;
        });
      return response;
    },
    async getDoctorOffDates(payload) {
      const response = await axiosApiClient
        .get(
          `practice/list-of-off-dates/${payload.doctor_id}/${payload.pagination}?page=${payload.page}`
        )
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err;
        });
      return response;
    },
    async generatePrescription(id) {
      return axiosApiClient
        .get(`patientPortal/generate-e-prescription-pdf/${id}`)
        .then((res) => {
          console.log(res.data);
          notify("E-Prescription sent", "primary", "check_circle");
          window.open(`${res.data.data}`);
        });
    },
  },
});
