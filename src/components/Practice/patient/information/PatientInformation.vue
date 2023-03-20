<template lang="">
  <q-splitter v-model="splitterModel" :horizontal="$q.screen.lt.md ? true : false" :disable="$q.screen.lt.sm ? false : true">
    <template v-slot:before>
      <q-tabs
        v-model="tab"
        :vertical="$q.screen.lt.md ? false : true"
        :style="$q.screen.lt.md && 'height: 100%'"
        align="left"
        active-color="primary"
        indicator-color="primary"
        class="text-graphite"
      >
        <q-tab
          :name="tab.name"
          v-for="(tab, index) in tabs"
          :key="index"
          class=""
        >
          <template #default>
            <p class="fs-14 mb-0 font-weight-600 text-capitalize">
              {{ tab.label }}
            </p>
          </template>
        </q-tab>
      </q-tabs>
    </template>

    <template v-slot:after>
      <keep-alive>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          :vertical="$q.screen.lt.md ? false : true"
          transition-prev="jump-up"
          transition-next="jump-up"
          v-if="!loading"
        >
          <q-tab-panel name="basic" class="pa-0 pt-5">
            <BasicInformation class="mx-w-960"></BasicInformation>
          </q-tab-panel>

          <q-tab-panel name="identification">
            <keep-alive>
              <PatientIdentificaiton class="mx-w-960"></PatientIdentificaiton>
            </keep-alive>
          </q-tab-panel>
          <q-tab-panel name="contact">
            <keep-alive>
              <PatientContact class="mx-w-960"></PatientContact>
            </keep-alive>
          </q-tab-panel>
          <q-tab-panel name="demographics">
            <keep-alive>
              <PatientDemography class="mx-w-960"></PatientDemography>
            </keep-alive>
          </q-tab-panel>
          <q-tab-panel name="emergency">
            <keep-alive>
              <PatientEmergencyContact class="mx-w-960"></PatientEmergencyContact>
            </keep-alive>
          </q-tab-panel>
          <q-tab-panel name="kin">
            <keep-alive>
              <PatientNextToKin class="mx-w-960"></PatientNextToKin>
            </keep-alive>
          </q-tab-panel>
          <q-tab-panel name="guardian">
            <keep-alive>
              <PatientGuardian class="mx-w-960"></PatientGuardian>
            </keep-alive>
          </q-tab-panel>
          <q-tab-panel name="employment">
            <keep-alive>
              <PatientEmployment class="mx-w-960"></PatientEmployment>
            </keep-alive>
          </q-tab-panel>
        </q-tab-panels>
      </keep-alive>
      <keep-alive>
        <div class="row justify-center" v-if="loading">
          <q-spinner-dots color="primary" size="3em" :thickness="2" />
        </div>
      </keep-alive>
    </template>
  </q-splitter>
</template>
<script setup>
import { ref } from "vue";
import BasicInformation from "./BasicInformtaion.vue";
import PatientIdentificaiton from "./PatientIdentificaiton.vue";
import PatientContact from "./PatientContact.vue";
import PatientDemography from "./PatientDemography.vue";
import PatientEmergencyContact from "./PatientEmergencyContact.vue";
import PatientNextToKin from "./PatientNextToKin.vue";
import PatientGuardian from "./PatientGuardian.vue";
import PatientEmployment from "./PatientEmployment.vue";

import { usePracticeStore } from "@/store/practice";
import { useUserStore } from "@/store/user";
const userStore = useUserStore();

const practiceStore = usePracticeStore();
const loading = ref(true);

practiceStore.fetchCurrentPatient(userStore.loginUser.id).then(() => {
  loading.value = false;
});

const splitterModel = ref(20);
const tab = ref("basic");

const tabs = ref([
  {
    label: "Basic Information",
    name: "basic",
  },
  {
    label: "Identification",
    name: "identification",
  },
  {
    label: "Contact Information",
    name: "contact",
  },
  {
    label: "Demographics",
    name: "demographics",
  },
  {
    label: "Emergency Contact",
    name: "emergency",
  },
  {
    label: "Next To Kin",
    name: "kin",
  },
  {
    label: "Employment",
    name: "employment",
  },
  {
    label: "Guardian",
    name: "guardian",
  },
]);
</script>
<style lang="scss" scoped>
:deep(.q-tab) {
  justify-content: start !important;
  min-height: 40px;
}
:deep(.q-splitter){
  height: 40vh;
}
.q-splitter{
  height: 40vh !important;
}
:deep(.q-splitter__after){
  padding-top: 10px;
}
</style>
