<template>
  <section class="bg-white full-height mt-10 row">
    <section class="width-100 pt-15 pb-25">
      <q-splitter
        v-model="splitterModel"
        :horizontal="$q.screen.lt.md ? true : false"
        :disable="$q.screen.lt.sm ? false : true"
      >
        <template v-slot:before>
          <q-tabs
            v-model="tab"
            :vertical="$q.screen.lt.md ? false : true"
            align="left"
            active-color="primary"
            indicator-color="primary"
            class="text-grey-6"
          >
            <q-tab
              :name="tab.name"
              v-for="(tab, index) in tabs"
              :key="index"
              class="tabs-list"
            >
              <template #default>
                <p class="text-body2 mb-0 text-weight-medium text-capitalize">
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
              vertical
              transition-prev="jump-up"
              transition-next="jump-up"
            >
              <q-tab-panel name="diagnoses">
                <keep-alive>
                  <EprescriptionDiagnoses />
                </keep-alive>
              </q-tab-panel>
              <q-tab-panel name="treatments">
                <keep-alive> Treatments </keep-alive>
              </q-tab-panel>
              <q-tab-panel name="labtest">
                <keep-alive> labtest </keep-alive>
              </q-tab-panel>
            </q-tab-panels>
          </keep-alive>
        </template>
      </q-splitter>
    </section>
  </section>
</template>
<script setup>
import { ref } from "vue";
import EprescriptionDiagnoses from "@/components/Practice/Appointments/EprescriptionDiagnoses.vue";

const splitterModel = ref("auto");
const tab = ref("diagnoses");

const tabs = ref([
  {
    label: "Diagnoses & Medicine",
    name: "diagnoses",
  },
  // {
  //   label: "Treatments",
  //   name: "treatments",
  // },
  // {
  //   label: "Lab Test",
  //   name: "labtest",
  // }
]);
</script>
<style lang="scss" scoped>
:deep .q-tab {
  justify-content: start !important;
  min-height: 35px;
  font-weight: 600;
}
:deep(.tabs-list p) {
  font-size: 14px;
  font-weight: 600;
  line-height: 17px;
  letter-spacing: 0em;
  text-align: left;
  margin: 10px;
}
</style>
