<template lang="">
  <div class="px-30 py-20">
    <h6 class="text-h6 text-weight-medium mb-40">Detail Overview</h6>

    <div class="bg-white rounded-borders sticky-div">
      <div class="px-30 pb-30 pt-6 row q-gutter-lg">
        <q-avatar rounded size="80px">
          <img :src="practiceStore.currentDoctor.data.profile_photo_url" v-if="practiceStore.currentDoctor.data.profile_photo_url"/>
          <img src="@/assets/man.png" v-else/>
        </q-avatar>
        <div>
          <div class="row">
            <p class="text-h6 text-weight-bold mb-0">
            {{ practiceStore.getDoctorFullname }}
          </p>
          <div class="ml-20" >
            <q-chip :class="
              practiceStore.currentDoctor.data.is_active ? 'status-chip active' : 'status-chip'
            " text-color="white">
              {{ practiceStore.currentDoctor.data.is_active ? "Active" : "InActive" }}
            </q-chip>
          </div>

          </div>
     
          <p class="doctor-sub-heading mb-3 " style="max-width: 700px">
            {{ practiceStore.getdoctorSpecializations }}
          </p>
          <p class="mb-0">
            <q-icon name="call" color="primary" size="16px" />
            <span class="doctor-sub-heading va-top"
              >&nbsp;&nbsp;{{
                practiceStore.currentDoctor.data.primary_phone_number
              }}</span
            >
          </p>
        </div>


      </div>
      <q-separator />
      <q-tabs
        v-model="patient_details_tabs"
        dense
        align="left"
        active-color="black"
        indicator-color="secondary"
        class="text-grey-8"
      >
        <q-tab
          :name="tab.name"
          class="py-15"
          label=""
          v-for="(tab, index) in tabs"
          :key="index"
        >
          <template #default>
            <p class="text-body2 mb-0 text-capitalize">{{ tab.label }}</p>
          </template>
        </q-tab>
      </q-tabs>
    </div>

    <div class="bg-white rounded-borders mt-25 pb-30">
      <keep-alive>
        <DoctorInformation
          v-if="patient_details_tabs === 'information'"
        ></DoctorInformation>
      </keep-alive>
      <keep-alive>
        <DoctorLegalInformation
          v-if="patient_details_tabs === 'history'"
        ></DoctorLegalInformation>
      </keep-alive>
      <keep-alive>
        <DoctorDetailSlots :isDoctorActive = "practiceStore.currentDoctor.data.is_active"
          v-if="patient_details_tabs === 'slots'"
        ></DoctorDetailSlots>
      </keep-alive>
      <keep-alive>
        <DoctorAppointment
          v-if="patient_details_tabs === 'appointments'"
        ></DoctorAppointment>
      </keep-alive>
      <keep-alive>
        <KycStatus v-if="patient_details_tabs === 'kyc'" :kycStatusMessage ="practiceStore.currentDoctor.data.kyc_status" ></KycStatus>
      </keep-alive>
      <keep-alive>        
        <DoctorFee
          v-if="patient_details_tabs === 'doctors-fee'"
        ></DoctorFee>
      </keep-alive>
      <keep-alive>
        <DoctorOffDates
          v-if="patient_details_tabs === 'off-dates'"
        ></DoctorOffDates>
      </keep-alive>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import DoctorInformation from "@/components/Doctor/DoctorsDetailPanel/DoctorInformation/DoctorInformation.vue";
import DoctorLegalInformation from "@/components/Doctor/DoctorsDetailPanel/DoctorLegalInformation/LegalInformation.vue";
import DoctorDetailSlots from "@/components/Doctor/DoctorsDetailPanel/DoctorDetailSlots/DoctorDetailSlots.vue";
import DoctorAppointment from "@/components/Doctor/DoctorsDetailPanel/DoctorDetailAppointment/DoctorDetailAppointment.vue";
import KycStatus from "@/components/Doctor/DoctorsDetailPanel/KycStatus/KycStatus.vue";
import DoctorFee from "@/components/Doctor/DoctorsDetailPanel/DoctorFee"
import DoctorOffDates from "@/components/Doctor/DoctorsDetailPanel/DoctorOffDates"
import { usePracticeStore } from "@/store/practice.js";
import { useRoute } from "vue-router";

const route = useRoute();
const practiceStore = usePracticeStore();
practiceStore.fetchCurrentDoctor(route.params.id);
const patient_details_tabs = ref("information");
const tabs = ref([
  {
    label: "Contact Information",
    name: "information",
  },
  {
    label: "Legal Information",
    name: "history",
  },
  {
    label: "KYC Verification",
    name: "kyc",
  },
  {
    label: "Slots",
    name: "slots",
  },
  {
    label: "Appointments",
    name: "appointments",
  },
  {
    label: "Off Dates",
    name: "off-dates",
  },
  {
    label: "Doctor's Fee",
    name: "doctors-fee",
  }
]);
</script>
<style lang="scss" scoped>
.sticky-div {
  position: sticky;
  top: 0;
  z-index: 4;
}

:deep .status-chip {
  font-weight: 700;
  font-size: 12px;
  background: $inactive-chip;
  height: 28px;
  width: 64px;
  border-radius: 10px;
}

:deep .active {
  background: $primary !important;

  .q-chip__content {
    justify-content: center;
  }
}
</style>
