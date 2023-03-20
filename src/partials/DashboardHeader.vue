<template lang="">
  <q-header elevated class="bg-paper-white text-white">
    <q-toolbar>

      <!-- drawer button  -->
      <q-btn
        dense
        flat
        round
        icon="menu"
        @click="$emit('toggle-drawer')"
        color="primary"
        v-if="$q.screen.lt.md"
      />
      <!-- drawer button  -->
      <q-toolbar-title>
        <!-- <q-avatar> -->
        <q-img :src="logo" style="height: 16.7px; max-width: 140px; margin-left: 16px;" />
        <!-- </q-avatar> -->
      </q-toolbar-title>

      <!-- search input field  -->
      <!-- <q-input
        :class="[$q.screen.lt.xl ? 'flex-2' : 'flex-6']"
        color="purple-12"
        borderless
        v-model="searchTerm"
        :placeholder="[
          $route.path == 'practice/doctors'
            ? 'Search Doctors By Name or ID'
            : 'Search Patients By Name or ID',
        ]"
        v-if="!$q.screen.lt.md"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input> -->
      <!-- search input field  -->

      <!-- notification badge  -->
      <q-btn-dropdown color="light-green" class="px-6 mr-10 py-5 bell-icon-rotate" text-color="primary"  dropdown-icon="notifications" align="right" >
    <template #label v-if="unread">
      <q-badge  color="red" floating   rounded  />
    </template>
    <q-list bordered padding class="rounded-borders" style="min-width: 370px" v-if="!checkIsDataAvaliable">
     <div v-for="(value, key) in data" :key="key">
      <q-item-label header>{{key}}</q-item-label>
      <div v-for="(element, index) in value" :key="index">
        <!-- :to="{ path: '/doctor/notifications' }" -->
        <q-item   active-class="my-card-gray-background"  :active="!element.read_at" clickable v-close-popup @click="onItemClick({id:element.data.appointment_id  , title:element.data.title , key : key, index:index, notification_id:element.id})" >
         <q-item-section>
          <q-item-label lines="1">{{element.data.title}}</q-item-label>
          <q-item-label caption>{{timeAndDateFormat(element.created_at)}}</q-item-label>
        </q-item-section>
         <q-item-section side v-show="!element.read_at">
          <q-badge  rounded color="primary" floating />
        </q-item-section>
      </q-item>
      </div>
      <q-separator spaced />
    </div>
    <span class="row justify-center items-center cursor-pointer"    @click.stop="() => router.push({ path: '/notifications' })">{{`Show all notification(${pagination.totalrow})`}}</span>
    </q-list>
    <q-list bordered padding class="rounded-borders" style="min-width: 370px" v-else>
   <q-item>
     <q-item-section>
      <q-item-label lines="1"> No Notification</q-item-label>
     </q-item-section>
   </q-item>
    <!-- <span class="row justify-center items-center cursor-pointer"  v-show="pagination.totalrow > 10"  @click.stop="() => router.push({ path: '/doctor/notifications' })">{{`Show all notification(${pagination.totalrow})`}}</span> -->
    </q-list>
    </q-btn-dropdown>
      <!-- notification badge  -->

      <!-- profile menu  -->
      <div class="q-pa-xs">
        <q-btn-dropdown
          color="white"
          flat
          text-color="black"
          dropdown-icon="expand_more"
          unelevated
        >
          <template v-slot:label>
            <q-avatar rounded size="35px">
              <img :src='require("@/assets/man.png")' />
            </q-avatar>
            <div class="row column mx-10" v-if="!$q.screen.lt.sm">
              <p class="mb-2 text-black text-caption text-weight-medium">{{userStore.loginUserToken !='' ? userStore.getLoginUser.first_name +' '+ (userStore.getLoginUser.middle_name != null ? userStore.getLoginUser.middle_name : '') +' '+ userStore.getLoginUser.last_name :"South Whales"}}</p>
              <p class="mb-2 text-grey-6 text-caption text-left">Patient</p>
            </div>
          </template>
          <q-list>
            <q-item clickable v-close-popup @click="logout">
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <!-- profile menu  -->
    </q-toolbar>
  </q-header>
</template>
<script setup>
import { defineEmits, onMounted, ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/store/user.js";
import { usePatientStore } from '@/store/patient';
import moment from "moment";
import notify from "@/composables/notify";
import logo from "@/assets/logo1.png";
import echo_instance from "@/composables/echo";
import useEmitter from "@/composables/useEmitter";
onMounted(() => {
  emitter.on('notification-update', markReadNotification)
  patientStore.getNotificationsDoctor({ page: 1, perPage: 5 }).then(response => {
    if (response.status == 200) {
      // isPageLoad.value = true
      unread.value = response.data.data.data.unread
      userStore.$state.calendar.googleCalendar = response.data.data.data.google_calendar
      userStore.$state.calendar.outlookCalendar = response.data.data.data.outlook_calendar
      delete response.data.data.data.unread
      delete response.data.data.data.google_calendar
      delete response.data.data.data.outlook_calendar
      data.value = response.data.data.data
      //  getNotificationData(data.value)
      pagination.value.totalrow = response.data.data.total
      pagination.value.rowsPerPage = pagination.value.rowsPerPage + 10
    }
  })
  //console.log(`.SendDoctorRegistrationInvitation-${userStore.getLoginUser.doctor_key}`)
})
const route = useRoute();
const router = useRouter();
const patientStore = usePatientStore();
const userStore = useUserStore();
const pagination = ref({ page: 1, rowsPerPage: 7 })
const unread = ref(null)
const data = ref({})
const emitter = useEmitter();
const currentDate = `${moment(new Date()).format('DD MMM YYYY')}`
// const routerPath = computed(() => {
//   return route.fullPath;
// });
const markReadNotification = (object) => {
  // eslint-disable-next-line no-prototype-builtins
  data.value.hasOwnProperty(data.value[object.key]) && (data.value[object.key][object.index].read_at = 'Readed')
  unread.value = object.unread
}
const onItemClick = (object) => {
  object.title.toLowerCase().includes('appointment') && router.push({ name: 'appointment-detail', params: { id: object.id } })
  object.title.toLowerCase().includes('prescription') && router.push({ name: 'appointment-detail', params: { id: object.id } })
  object.title.toLowerCase().includes('registration') && router.push({ path: '/settings/check', })
  patientStore.setNotificationsRead(object.notification_id).then((response) => {
    unread.value = response.data.data
    data.value[object.key][object.index].read_at = 'Readed'
  })
}

const logout = () => {
  userStore.$state.loginUser = {};
  router.push({ name: 'login' });
} // logout module

defineEmits(["toggle-drawer"]);
watch(() => route.path, () => {
  console.log(route.path, route.name);
  if (route.path != '/profile' && route.name != 'appointment-detail') {
    localStorage.removeItem('patient_details_tabs');
  }
});

// const searchTerm = ref();

//echo -----> for the push notifications ---> start

// echo_instance.channel(`send-doctor-registration-invitation`).listen(`.SendDoctorRegistrationInvitation-${userStore.getLoginUser.doctor_key}`, (response) => {
//   notify(response.title, 'primary', 'info', timeAndDateFormat(new Date()))
//   JSON.stringify(data.value) === '{}' ? (data.value[currentDate] = [{ read_at: null, created_at: new Date(), data: response }]) : data.value[currentDate].unshift({ read_at: null, created_at: new Date(), data: response })
// });
echo_instance.channel(`appointment-cancelled-patient`).listen(`.AppointmentCancelledPatient-${userStore.getLoginUser.patient_key}`, (response) => {
  notify(response.title, 'primary', 'info', timeAndDateFormat(new Date()))
  //JSON.stringify(data.value) === '{}' ? (data.value[currentDate] = [{ read_at: null, created_at: new Date(), data: response, id: response.id }]) : data.value[currentDate].unshift({ read_at: null, created_at: new Date(), data: response, id: response.id })
  addingPushNotificationIntoArray(response)
});
echo_instance.channel(`appointment-rescheduled-patient`).listen(`.AppointmentRescheduledPatient-${userStore.getLoginUser.patient_key}`, (response) => {
  notify(response.title, 'primary', 'info', timeAndDateFormat(new Date()))
  //JSON.stringify(data.value) === '{}' ? (data.value[currentDate] = [{ read_at: null, created_at: new Date(), data: response, id: response.id }]) : data.value[currentDate].unshift({ read_at: null, created_at: new Date(), data: response, id: response.id })
  addingPushNotificationIntoArray(response)
});
echo_instance.channel(`new-appointment-patient`).listen(`.NewAppointmentPatient-${userStore.getLoginUser.patient_key}`, (response) => {
  notify(response.title, 'primary', 'info', timeAndDateFormat(new Date()))
  //JSON.stringify(data.value) === '{}' ? (data.value[currentDate] = [{ read_at: null, created_at: new Date(), data: response, id: response.id }]) : data.value[currentDate].unshift({ read_at: null, created_at: new Date(), data: response, id: response.id })
  addingPushNotificationIntoArray(response)
});
echo_instance.channel(`patient-checked-in`).listen(`.PatientCheckedIn-${userStore.getLoginUser.patient_key}`, (response) => {
  notify(response.title, 'primary', 'info', timeAndDateFormat(new Date()))
  //JSON.stringify(data.value) === '{}' ? (data.value[currentDate] = [{ read_at: null, created_at: new Date(), data: response, id: response.id }]) : data.value[currentDate].unshift({ read_at: null, created_at: new Date(), data: response, id: response.id })
  addingPushNotificationIntoArray(response)
});
echo_instance.channel(`e-prescription-generated`).listen(`.EPrescriptionGenerated-${userStore.getLoginUser.patient_key}`, (response) => {
  notify(response.title, 'primary', 'info', timeAndDateFormat(new Date()))
  //JSON.stringify(data.value) === '{}' ? (data.value[currentDate] = [{ read_at: null, created_at: new Date(), data: response, id: response.id }]) : data.value[currentDate].unshift({ read_at: null, created_at: new Date(), data: response, id: response.id })
  addingPushNotificationIntoArray(response)
});

const addingPushNotificationIntoArray = (response) => {
  //below line is used to update the unread variable so that we can check the value of the unread at the run time 
  unread.value = response.un_read_notifications_count ? response.un_read_notifications_count : ''
  //following line for the total number of row count
  pagination.value.totalrow = response.total_notifications ? response.total_notifications : ''

  if (JSON.stringify(data.value) === '{}') {
    data.value[currentDate] = [{ read_at: null, created_at: new Date(), data: response, id: response.id }]
    unread.value = 1
  }
  // eslint-disable-next-line no-prototype-builtins
  else if (!data.value.hasOwnProperty(currentDate)) {
    data.value = {
      [currentDate]: [{ read_at: null, created_at: new Date(), data: response, id: response.id }], ...data.value
    }
  }
  else {
    data.value[currentDate].unshift({ read_at: null, created_at: new Date(), data: response, id: response.id })
  }
}
//echo -----> for the push notifications ---> End
const timeAndDateFormat = (data) => `${moment(data).format('D MMM, YYYY')} at ${moment(data).format('h:mm a')}`
const checkIsDataAvaliable = computed(() => JSON.stringify(data.value) === '{}')
</script>
<style lang="scss" scoped>
.q-layout__shadow:after {
  box-shadow: 0 0 0px rgb(0 0 0 / 4%), 0 0px 2px rgb(0 0 0 / 17%);
}

.q-badge--floating {
  position: absolute;
  top: 10px;
  right: 9px;
  cursor: inherit;
}

.q-badge {
  padding: 3px 3px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 12px;
  min-height: 6px;
}

:deep(.bell-icon-rotate) {
  .rotate-180 {
    transform: rotate(20deg)
  }
}

.my-card-gray-background {
  background: $gray-light-2;
}

:deep(.q-btn-dropdown--simple * + .q-btn-dropdown__arrow) {
  margin-left: 2px;
}
</style>
