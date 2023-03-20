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
      >
        <q-tab-panel name="allergies" class="pa-0 pt-0">
          <PatientAllergies class="mx-w-960"></PatientAllergies>
        </q-tab-panel>

      <q-tab-panel name="vaccines" class="pa-0 pt-0">
        <keep-alive>
          <PatientVaccines class="mx-w-960"></PatientVaccines>
        </keep-alive>
      </q-tab-panel>

      <q-tab-panel name="problems" class="pa-0 pt-0">
        <keep-alive> 
          <MedicalProblem class="mx-w-960"></MedicalProblem>
        </keep-alive>
      </q-tab-panel>
      <q-tab-panel name="family" class="pa-0 pt-0"> 
        <keep-alive>
          <FamilyHistory class="mx-w-960"></FamilyHistory>
        </keep-alive>
      </q-tab-panel>
      <q-tab-panel name="social" class="pa-0 pt-0"> 
        <keep-alive>
          <SocialHistory class="mx-w-960"></SocialHistory>
        </keep-alive>
      </q-tab-panel>
      <q-tab-panel name="surgical" class="pa-0 pt-0"> 
        <keep-alive>
          <SurgicalHistory class="mx-w-960"></SurgicalHistory>
        </keep-alive>
      </q-tab-panel>
      </q-tab-panels>
    </keep-alive>
  </template>
</q-splitter>
</template>
<script setup>
import { ref } from 'vue';
import PatientAllergies from '@/components/Practice/patient/history/PatientAllergies.vue'
import PatientVaccines from './PatientVaccines.vue';
import SocialHistory from './SocialHistory.vue';
import SurgicalHistory from './SurgicalHistory.vue';
import MedicalProblem from './MedicalProblem.vue';
import FamilyHistory from './FamilyHistory.vue'

const splitterModel = ref(20);
const tab = ref("allergies");

const tabs = ref([
{
  label: "Allergies",
  name: "allergies",
},
{
  label: "Vaccines",
  name: "vaccines",
},
{
  label: 'Medical Problem',
  name: 'problems',
},
{
  label: "Family History",
  name: "family",
},
{
  label: "Social History",
  name: "social",
},
{
  label: "Surgical History",
  name: "surgical",
},
]); // left side tabs
</script>
<style lang="scss" scoped>
:deep(.q-tab) {
justify-content: start !important;
min-height: 40px;
}
:deep(.q-splitter){
height: 40vh !important;
}
.q-splitter{
 height: 40vh !important;
}
:deep(.q-splitter__after){
  padding-top: 10px;
}
</style>