import { defineStore } from "pinia";
import { useUserStore } from "@/store/user";
import axiosApiClient from "@/axios";
export const usePatientStore = defineStore("patient", {
  persist: true,
  state: () => ({
    googleCalendarIntegration: null,
    outlookCalendarIntegration: null,
    userStore: useUserStore()
  }),
  actions: {


    async sendVerificationCode(payload) {
      const response = await axiosApiClient
        .post('patient/send-verification-code', payload)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err;
        });
      return response;
    },
    async verifyVerificationCode(payload) {
      const response = await axiosApiClient
        .post('patient/verify-otp', payload)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err;
        });
      return response;
    },
    async savePatient(payload) {
      const response = await axiosApiClient
        .post('patient/edit-patient-basic-info', payload)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err;
        });
      return response;
    },
    async registerPatient(payload) {
      const response = await axiosApiClient
        .post('patient/patient-register', payload)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err;
        });
      return response;
    },
    async resetPatientPassword(payload) {
      const response = await axiosApiClient
        .post('patient/set-password', payload)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err;
        });
      return response;
    },
    async getUpComingAppointments() {
      const response = await axiosApiClient
        .get('patient/appointment-list-monthly')
        .then((res) => {
          this.$state.googleCalendarIntegration = res.data.data.googleCalendar
          this.$state.outlookCalendarIntegration = res.data.data.outlookCalendar
          return res.data.data.data
        })
        .catch((err) => {
          return err;
        });
      return response;
    },
    async getPreviousAppointments() {
      const response = await axiosApiClient
        .get('patient/appointment-list-pervious-monthly')
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return err;
        });
      return response;
    },
    async cancelAppointments(payload) {
      const response = await axiosApiClient
        .post('patientPortal/change-appointment-status', payload)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err;
        });
      return response;
    },
    async changePatientPhoneNumber(payload) {
      const response = await axiosApiClient
        .post('patient/change-patient-phone-number', payload)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err;
        });
      return response;
    },
    async updatePatientPhoneNumber(payload) {
      const response = await axiosApiClient
        .post('patient/verify-verification-code', payload)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err;
        });
      return response;
    },
    async updatePatientPassword(payload) {
      const response = await axiosApiClient
        .post('patient/update-password', payload)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err;
        });
      return response;
    },
    async getNotificationsDoctor(payload) {
      return axiosApiClient
        .post(
          `/${this.userStore.$state.loginUser.role}/notifications`, { page: payload.page, pagination: payload.perPage }
        )
        .then((res) => {
          return res;
        });
    },
    async setNotificationsRead(id) {
      return axiosApiClient
        .post(
          `/${this.userStore.$state.loginUser.role}/notification-read`, { notification_id: id }
        )
        .then((res) => {
          return res;
        });
    },
  },

}); 
