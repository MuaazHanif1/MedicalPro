<template>
  <AppointmentsCommon :information="information" @calendarBtn="isBoxOpen = !isBoxOpen"></AppointmentsCommon>
  <q-dialog v-model="isBoxOpen">
    <q-card style="max-width: 648px;">
      <q-card-section class="row items-center q-pb-none">
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <!-- <q-separator /> -->
      <div class="doctor-calendar pb-20 pr-20 pl-20">
        <div class="section">
          <h2 class="heading-section">Integrate Calendar</h2>
          <p class="paragraph-section mt-15">Integrate the calendar into your project</p>
        </div>
        <div class="row no-wrap mt-30 mb-20">
          <CalendarIntegration :connected="isGoogleConnected" calendarName="google" class="q-mr-lg"
            @button-click="onButtonClick" :isLoading="isGoogleLoading"
            :conncetedEmail="userStore.$state.calendar.googleCalendar && userStore.$state.calendar.googleCalendar.status ? userStore.$state.calendar.googleCalendar.calendar_email:'' " />
          <CalendarIntegration :connected="isOutlookConnected" calendarName="outlook" @button-click="onButtonClick"
            :isLoading="isOutlookLoading" 
            :conncetedEmail="userStore.$state.calendar.outlookCalendar && userStore.$state.calendar.outlookCalendar.status ? userStore.$state.calendar.outlookCalendar.calendar_email:'' " />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
//@calendar-btn=""
import { ref, onMounted, watch } from 'vue';
import AppointmentsCommon from '@/partials/AppointmentsCommon.vue';
import CalendarIntegration from '@/partials/CalendarIntegration/CalendarIntegration.vue'
import { useUserStore } from '@/store/user'
//import { usePatientStore } from '@/store/patient'
import axiosApiClient from "@/axios";
onMounted(() => {
  userStore.$state.calendar.googleCalendar && (isGoogleConnected.value = userStore.$state.calendar.googleCalendar.status)
  userStore.$state.calendar.outlookCalendar && (isOutlookConnected.value = userStore.$state.calendar.outlookCalendar.status)
})
const isBoxOpen = ref(false)
const userStore = useUserStore()
////const userPatient = usePatientStore()
const information = ref({
  page: 'allappointments',
  title: 'All Appointments'
});
let isGoogleConnected = ref(false)
let isOutlookConnected = ref(false)
let isOutlookLoading = ref(false)
let isGoogleLoading = ref(false)

const onButtonClick = (object) => {
  if (!object.isAlreadyConnected) {
    object.iconType == 'google' && window.open(`${process.env.VUE_APP_API_URL_CALENDAR_PATIENT}google/callback`, "_parent") && setVariableForGoogle(object.isAlreadyConnected)
    object.iconType == 'outlook' && window.open(`${process.env.VUE_APP_API_URL_CALENDAR_PATIENT}outlook/callback`, "_parent") && setVariableForOutlook(object.isAlreadyConnected)
  }
  else {
    object.iconType == 'google' && setVariableForGoogle(object.isAlreadyConnected)
    object.iconType == 'outlook' && setVariableForOutlook(object.isAlreadyConnected)
  }
}
const setVariableForOutlook = (isConnected) => {
  isOutlookLoading.value = true
  axiosApiClient
    .post(isConnected ? `remove-outlook-calendar` : `patient-email`, { email: userStore.$state.loginUser.email })
    .then(() => {

      if (isConnected) {
        isOutlookConnected.value = false
        userStore.$state.calendar.outlookCalendar = null
      }
    })
    .catch((error) => {
      console.log(error)
    }).finally(() => setTimeout(() => { isOutlookLoading.value = false }, 3000))
}
const setVariableForGoogle = (isConnected) => {
  isGoogleLoading.value = true
  axiosApiClient
    .post(isConnected ? `remove-google-calendar` : `gpatient-email`, { email: userStore.$state.loginUser.email })
    .then((res) => {
      console.log(res.data);
      //isConnected && (isGoogleConnected.value = false)
      if (isConnected) {
        isGoogleConnected.value = false
        userStore.$state.calendar.googleCalendar = null

      }
    })
    .catch((error) => {
      console.log(error)
    }).finally(() => {
      setTimeout(() => { isGoogleLoading.value = false }, 3000)

    })
}
watch(() => userStore.$state.calendar.outlookCalendar, () => {
  userStore.$state.calendar.outlookCalendar &&
    (isOutlookConnected.value = userStore.$state.calendar.outlookCalendar.status);

}, { deep: true }
);
watch(() => userStore.$state.calendar.googleCalendar, () => {
  userStore.$state.calendar.googleCalendar && (isGoogleConnected.value = userStore.$state.calendar.googleCalendar.status);
}, { deep: true });
</script>
<style scoped lang="scss">
.doctor-calendar {

  // margin-left: 30px;
  //width: 648px;
  .section {
    .heading-section {
      font-weight: 600;
      font-size: 17px;
      line-height: 20px;
      color: $text;
    }

    .paragraph-section {
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      color: $text-2;
    }
  }
}
</style>