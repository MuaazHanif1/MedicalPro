import axios from "axios";
import { useUserStore } from "@/store/user";
import { Notify } from 'quasar';
import { useRouter } from "vue-router";


const axiosApiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL_DEV
});

axiosApiClient.interceptors.request.use(function (config) {
  const userStore = useUserStore();
  if(userStore.loginUserToken){
    config.headers.Authorization =  `Bearer ${userStore.loginUserToken}`;
  }
  return config;
});
axiosApiClient.interceptors.response.use(function (response) {
  return response;
}, function (error) {

  if(!error.response.data.success && error.response.data.message == 'Unauthenticated.'){
    const userStore = useUserStore();
    const router = useRouter();
    userStore.$state.loginUser = {};
    router.push({name:'login'});
    
  }
  else if(error.response.data.message){
    Notify.create({
      type: 'negative',
      position: 'top-right',
      textColor: "white",
      icon: "warning",
      message: error.response.data.message ? error.response.data.message : "Something went wrong"
  })
    return error;
  }
  else if(error.response.data.error){
    Notify.create({
      type: 'negative',
      position: 'top-right',
      textColor: "white",
      icon: "warning",
      message: error.response.data.error ? error.response.data.error : "Something went wrong"
  })
  return error;
  }

  return Promise.reject(error)
})

export default axiosApiClient;
