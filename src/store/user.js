import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import axiosApiClient from "@/axios";
export const useUserStore = defineStore("user", {
  state: () => ({
    loginUser: [],
    calendar: {
      googleCalendar: null,
      outlookCalendar: null
    },
    registeringUser: [],
    registeringUserPhone: []
  }),
  getters: {
    // getter to get login User
    getLoginUser(state) {
      return state.loginUser;
    },
    // getter to get login User Token
    loginUserToken(state) {
      return state.loginUser.token ? state.loginUser.token : "";
    },
  },
  persist: true,
  actions: {
    logout() {
      const router = useRouter();
      this.loginUser = {};
      router.push({ name: 'login' });
    },
    // login user api function 
    /**
     * 
     * @param {*} payload 
     * @returns login user object
     */
    async Login(payload, endpoint) {
      const response = await axiosApiClient
        .post(endpoint, payload)
        .then((res) => {
          return res.data;
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
    async resetPassword(payload, endpoint) {
      const response = await axiosApiClient
        .post(endpoint, payload)
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          return error;
        });
      return response;
    }
  },

}); 
