<template>
  <section v-if="!isLoading" class="mt-10 ml-10 width-100">
    <q-splitter v-model="splitterValue" :horizontal="$q.screen.lt.md ? true : false" :disable="$q.screen.lt.sm ? false : true">
      <template v-slot:before>
        <q-tabs v-model="tab" :vertical="$q.screen.lt.md ? false : true" align="left" active-color="primary" indicator-color="primary"
          class="text-grey-6">
          <q-tab class="tab text-graphite" v-for="(tab, index) in tabs" :key="index" :name="tab.name"
            :class="{ 'pl-2': tab.name === 'bmi' }">
            <template #default>
              <p class="fs-14 font-weight-600 mb-0 text-capitalize">
                {{ tab.label }}
              </p>
            </template>
          </q-tab>
        </q-tabs>
      </template>

      <template v-slot:after>
        <keep-alive class="" :style="$q.screen.lt.md ? 'padding-top: 15px;' : 'margin-left: 62px;'">
          <q-tab-panels :vertical="$q.screen.lt.md ? false : true" v-model="tab" animated class="tab-panel" swipeable inline-label outside-arrows mobile-arrows
            transition-prev="jump-up" transition-next="jump-up">
            <q-tab-panel name="blood-pressure" class="pt-0  row">
              <keep-alive>
                <div :class="{
                  'col-7': $q.screen.width >= 1270 && $q.screen.width <= 1600,
                  'col-9': $q.screen.width >= 1170 && $q.screen.width <= 1270,
                  'col-10': $q.screen.width >= 1024 && $q.screen.width <= 1170,
                  'col-9': $q.screen.width >= 925 && $q.screen.width < 1024,
                  'col-11': $q.screen.width >= 790 && $q.screen.width <= 925,
                  'col-11': $q.screen.width >= 0 && $q.screen.width <= 790
                }">
                  <BloodPressure />
                </div>
              </keep-alive>
            </q-tab-panel>
            <q-tab-panel name="height" class="pt-0 row">
              <keep-alive>
                <div :class="{
                  'col-6': $q.screen.width >= 1270 && $q.screen.width <= 1600,
                  'col-9': $q.screen.width >= 1170 && $q.screen.width <= 1270,
                  'col-10': $q.screen.width >= 1024 && $q.screen.width <= 1170,
                  'col-8': $q.screen.width >= 925 && $q.screen.width < 1024,
                  'col-10': $q.screen.width >= 790 && $q.screen.width <= 925,
                  'col-11': $q.screen.width >= 0 && $q.screen.width <= 790
                }">
                  <Height />
                </div>
              </keep-alive>
            </q-tab-panel>
            <q-tab-panel name="weight" class="pt-0 row">
              <keep-alive>
                <div :class="{
                  'col-8': $q.screen.width >= 1270 && $q.screen.width <= 1600,
                  'col-10': $q.screen.width >= 1170 && $q.screen.width <= 1270,
                  'col-11': $q.screen.width >= 1024 && $q.screen.width <= 1080,
                  'col-9': $q.screen.width >= 925 && $q.screen.width < 1024,
                  'col-10': $q.screen.width >= 790 && $q.screen.width <= 925,
                  'col-11': $q.screen.width >= 0 && $q.screen.width <= 790
                }">
                  <Weight />
                </div>
              </keep-alive>
            </q-tab-panel>
            <q-tab-panel name="bmi" class="pt-0 row">
              <keep-alive>
                <div :class="{
                  'col-6': $q.screen.width >= 1270 && $q.screen.width <= 1600,
                  'col-9': $q.screen.width >= 1170 && $q.screen.width <= 1270,
                  'col-10': $q.screen.width >= 1024 && $q.screen.width <= 1170,
                  'col-8': $q.screen.width >= 925 && $q.screen.width < 1024,
                  'col-10': $q.screen.width >= 790 && $q.screen.width <= 925,
                  'col-11': $q.screen.width >= 0 && $q.screen.width <= 790
                }">
                  <BMI />
                </div>
              </keep-alive>
            </q-tab-panel>
            <q-tab-panel name="heart-rate" class="pt-0 row">
              <keep-alive>
                <div :class="{
                  'col-6': $q.screen.width >= 1270 && $q.screen.width <= 1600,
                  'col-9': $q.screen.width >= 1170 && $q.screen.width <= 1270,
                  'col-10': $q.screen.width >= 1024 && $q.screen.width <= 1170,
                  'col-8': $q.screen.width >= 925 && $q.screen.width < 1024,
                  'col-10': $q.screen.width >= 790 && $q.screen.width <= 925,
                  'col-11': $q.screen.width >= 0 && $q.screen.width <= 790
                }">
                  <HeartRate />
                </div>
              </keep-alive>
            </q-tab-panel>
            <q-tab-panel name="inhaled-o2" class="pt-0 row">
              <keep-alive>
                <div :class="{
                  'col-6': $q.screen.width >= 1270 && $q.screen.width <= 1600,
                  'col-9': $q.screen.width >= 1170 && $q.screen.width <= 1270,
                  'col-10': $q.screen.width >= 1024 && $q.screen.width <= 1170,
                  'col-8': $q.screen.width >= 925 && $q.screen.width < 1024,
                  'col-10': $q.screen.width >= 790 && $q.screen.width <= 925,
                  'col-11': $q.screen.width >= 0 && $q.screen.width <= 790
                }">
                  <InhaledO2 />
                </div>
              </keep-alive>
            </q-tab-panel>
            <q-tab-panel name="pulse" class="pt-0 row">
              <keep-alive>
                <div :class="{
                  'col-6': $q.screen.width >= 1270 && $q.screen.width <= 1600,
                  'col-9': $q.screen.width >= 1170 && $q.screen.width <= 1270,
                  'col-10': $q.screen.width >= 1024 && $q.screen.width <= 1170,
                  'col-8': $q.screen.width >= 925 && $q.screen.width < 1024,
                  'col-10': $q.screen.width >= 790 && $q.screen.width <= 925,
                  'col-11': $q.screen.width >= 0 && $q.screen.width <= 790
                }">
                  <Pulse />
                </div>
              </keep-alive>
            </q-tab-panel>
            <q-tab-panel name="respiratory-rate" class="pt-0 row">
              <keep-alive>
                <div :class="{
                  'col-6': $q.screen.width >= 1270 && $q.screen.width <= 1600,
                  'col-9': $q.screen.width >= 1170 && $q.screen.width <= 1270,
                  'col-10': $q.screen.width >= 1024 && $q.screen.width <= 1170,
                  'col-8': $q.screen.width >= 925 && $q.screen.width < 1024,
                  'col-10': $q.screen.width >= 790 && $q.screen.width <= 925,
                  'col-11': $q.screen.width >= 0 && $q.screen.width <= 790
                }">
                  <RespiratoryRate />
                </div>
              </keep-alive>
            </q-tab-panel>
            <q-tab-panel name="temperature" class="pt-0 row">
              <keep-alive>
                <div :class="{
                  'col-6': $q.screen.width >= 1270 && $q.screen.width <= 1600,
                  'col-9': $q.screen.width >= 1170 && $q.screen.width <= 1270,
                  'col-10': $q.screen.width >= 1024 && $q.screen.width <= 1170,
                  'col-8': $q.screen.width >= 925 && $q.screen.width < 1024,
                  'col-10': $q.screen.width >= 790 && $q.screen.width <= 925,
                  'col-11': $q.screen.width >= 0 && $q.screen.width <= 790
                }">
                  <Temperature />
                </div>
              </keep-alive>
            </q-tab-panel>
            <q-tab-panel name="waist-circumference" class="pt-0 row">
              <keep-alive>
                <div :class="{
                  'col-6': $q.screen.width >= 1270 && $q.screen.width <= 1600,
                  'col-9': $q.screen.width >= 1170 && $q.screen.width <= 1270,
                  'col-10': $q.screen.width >= 1024 && $q.screen.width <= 1170,
                  'col-8': $q.screen.width >= 925 && $q.screen.width < 1024,
                  'col-10': $q.screen.width >= 790 && $q.screen.width <= 925,
                  'col-11': $q.screen.width >= 0 && $q.screen.width <= 790
                }">
                  <WaistCircumference />
                </div>
              </keep-alive>
            </q-tab-panel>
            <q-tab-panel name="pain-scale" class="pt-0 row">
              <keep-alive>
                <div :class="{
                  'col-6': $q.screen.width >= 1270 && $q.screen.width <= 1600,
                  'col-9': $q.screen.width >= 1170 && $q.screen.width <= 1270,
                  'col-10': $q.screen.width >= 1024 && $q.screen.width <= 1170,
                  'col-8': $q.screen.width >= 925 && $q.screen.width < 1024,
                  'col-10': $q.screen.width >= 790 && $q.screen.width <= 925,
                  'col-11': $q.screen.width >= 0 && $q.screen.width <= 790
                }">
                  <PainScale />
                </div>
              </keep-alive>
            </q-tab-panel>
          </q-tab-panels>
        </keep-alive>
      </template>
    </q-splitter>
  </section>
</template>
<script setup>
import { ref, onMounted } from "vue";
// import { useQuasar } from "quasar";
import { useVitalsStore } from "@/store/vitals";
import BloodPressure from "./BloodPressure.vue";
import Height from "./Height.vue";
import Weight from "./Weight.vue";
import BMI from "./BMI.vue";
import HeartRate from "./HeartRate.vue";
import InhaledO2 from "./InhaledO2.vue";
import Pulse from "./Pulse.vue";
import RespiratoryRate from "./RespiratoryRate.vue";
import Temperature from "./Temperature.vue";
import WaistCircumference from "./WaistCircumference.vue";
import PainScale from "./PainScale.vue";

// const $q = useQuasar();
// const responsive = computed(() => {
//   return $q.screen.width >= 1170 && $q.screen.width <= 1270
//     ? 'col-9'
//     : $q.screen.width >= 1050 && $q.screen.width <= 1170 ? 'col-10' : 'dont know'
// })

// loader
const isLoading = ref(true);

// store
const store = useVitalsStore();
// sidebar splitter
const splitterValue = ref('auto');
const tab = ref("blood-pressure");

const tabs = ref([
  {
    label: "Blood Pressure",
    name: "blood-pressure",
  },
  {
    label: "Height",
    name: "height",
  },
  {
    label: "Weight",
    name: "weight",
  },
  {
    label: "BMI",
    name: "bmi",
  },
  {
    label: "Heart Rate",
    name: "heart-rate",
  },
  {
    label: "Inhaled O2 Conc.",
    name: "inhaled-o2",
  },
  {
    label: "Pulse",
    name: "pulse",
  },
  {
    label: "Respiratory Rate",
    name: "respiratory-rate",
  },
  {
    label: "Temperature",
    name: "temperature",
  },
  {
    label: "Waist Circumference",
    name: "waist-circumference",
  },
  {
    label: "Pain Scale",
    name: "pain-scale",
  },
]);

onMounted(async () => {
  const response = await store.getAllVitals();
  if (response) {
    isLoading.value = false;
  }
})
</script>
<style lang="scss" scoped>
:deep .q-tab {
  justify-content: start !important;
  min-height: 35px;
  font-weight: 600;
}

.container {
  max-height: 350px !important;
  height: 350px !important;
}
</style>
