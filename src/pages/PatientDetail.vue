<template lang="">
  <div class="patient-detail px-30 py-20">
    <h6 class="text-h6 font-weight-600 mb-40">Detail Overview</h6>

    <!-- Top section  -->
    <div class="bg-white rounded-borders sticky-div">
      <!-- current patient detail -->
      <div class="pb-30 pt-6 row no-wrap q-gutter-lg" :class="$q.screen.gt.sm ?'pl-30':''">
        <q-avatar rounded size="80px" class="patient-profile">
          <img :src="practiceStore.currentPatient.data.profile_photo_url" v-if="practiceStore.currentPatient.data.profile_photo_url"/>
          <img src="@/assets/man.png" v-else/>
        </q-avatar>
        <div>
          <p class="text-h6 text-weight-bold mb-0">{{ practiceStore.getPatientFullname }}<q-chip :class="practiceStore.currentPatient.data.is_first_login ? 'chip active-chip' : 'chip inactive-chip'" text-color="white">{{ practiceStore.currentPatient.data.is_first_login ? 'Active' : 'InActive' }}</q-chip></p>
          <p class="text-subtitle2 text-weight-regular mb-3">
            Patient ID: {{ practiceStore.currentPatient.data.patient_key }}
          </p>
          <p class="mb-0">
            <q-icon name="call" color="primary" size="16px" />
            <span class="text-grey-8 va-top">&nbsp;&nbsp;{{ practiceStore.currentPatient.data.phone_number ? `${practiceStore.currentPatient.data.country_code} ${practiceStore.currentPatient.data.phone_number}` : '-' }}</span>
          </p>
        </div>
      </div>
      <!-- current patient detail -->
      <q-separator />

      <!-- bottom tabs navigation  -->
      <q-tabs v-model="patient_details_tabs" dense align="left" active-color="black" indicator-color="secondary" class="text-grey-8">
        <q-tab :name="tab.name" class="py-15" label="" v-for="(tab, index) in tabs" :key="index">
            <template #default>
                <p class="text-body2 mb-0 text-capitalize">{{ tab.label }}</p>
            </template>
        </q-tab>
      </q-tabs>
      <!-- bottom tabs navigation  -->
    </div>
    <!-- Top section  -->

    <!-- bottom tabs  -->
    <div class="bg-white rounded-borders mt-25 px-20 py-30">
        <keep-alive>
            <PatientInformation v-if="patient_details_tabs === 'information'"></PatientInformation>
        </keep-alive>
        <keep-alive>
            <PatientHistory v-if="patient_details_tabs === 'history'"></PatientHistory>
        </keep-alive>
        <keep-alive>
            <PatientInsurance v-if="patient_details_tabs === 'insurance'"></PatientInsurance>
        </keep-alive>
        <keep-alive>
          <PatientAppointment v-if="patient_details_tabs === 'appointments'"></PatientAppointment>
        </keep-alive>
    </div>
    <!-- bottom tabs  -->
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import PatientInformation from '@/components/Practice/patient/information/PatientInformation.vue'
import PatientHistory from '@/components/Practice/patient/history/PatientHistory.vue';
import PatientInsurance from '@/components/Practice/patient/insurance/PatientInsurance.vue';
import PatientAppointment from '@/components/Practice/patient/appointment/PatientAppointment.vue';
import { usePracticeStore } from '@/store/practice.js';
import { useUserStore } from "@/store/user";

const practiceStore = usePracticeStore();

const userStore = useUserStore();
practiceStore.fetchCurrentPatient(userStore.loginUser.id).then(() => {
});
onMounted(() => {
})
const patient_details_tabs = ref(localStorage.getItem('patient_details_tabs') || 'information')
const tabs = ref([
  {
    label: "Patient's Information",
    name: 'information'
  },
  {
    label: "Patient's History",
    name: 'history',
  },
  // {
  //     label: "Insurance",
  //     name: 'insurance'
  // },
  {
    label: "Appointments",
    name: 'appointments',
  },
  // {
  //     label: "Report",
  //     name: 'report'
  // },
  // {
  //     label: "Privacy",
  //     name: 'privacy',
  // },
]) // navigation tabs structure

watch(patient_details_tabs, () => {
  localStorage.setItem('patient_details_tabs', patient_details_tabs.value);
})
</script>
<style lang="scss" scoped>
.sticky-div {
  position: sticky;
  top: 0;
  z-index: 4;
}

:deep(.q-chip__content) {
  display: flex;
  justify-content: center;
}

@media (max-width: 410px) {
  .q-gutter-lg {
    margin-left: 0px;
  }

  .patient-detail {
    padding-left: 5px !important;
    padding-right: 5px !important;
  }

  .patient-profile {
    font-size: 48px !important;
  }
}
</style>
