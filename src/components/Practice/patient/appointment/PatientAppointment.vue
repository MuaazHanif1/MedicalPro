<template lang="">
  <!-- Loading Spinner  -->

  <!-- Main Content  -->
  <q-splitter v-model="splitterModel" :horizontal="$q.screen.lt.md ? true : false" :disable="$q.screen.lt.sm ? false : true">
    <!-- Left Side Tabs  -->
    <template v-slot:before>
      <q-tabs
        v-model="tab"
        :vertical="$q.screen.lt.md ? false : true"
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
              {{ tab.label + year }}
            </p>
          </template>
        </q-tab>
      </q-tabs>
    </template>

    <!-- Right Side Tabs  -->
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
          <div class="row justify-center" v-if="loading">
            <q-spinner-dots color="primary" size="3em" :thickness="2" />
          </div>
          <q-tab-panel
            v-else
            :name="each_tab.name"
            class="pa-0 pt-5"
            v-for="(each_tab, index) in tabs"
            :key="index"
          >
          <!-- If no appointment  -->
            <div class="row justify-end px-40" v-if="appointments.length == 0">
              <q-input
                class="mr-10"
                outlined
                v-model="appointment_id"
                @keyup.enter="searchAppointment()"
                :dense="true"
                placeholder="Appointment ID"
                :class="$q.screen.lt.md  ? 'col-12': 'mr-10'"
              />
              <q-btn-dropdown
                class="px-10 py-0"
                color="light-green"
                text-color="primary"
                unelevated
                icon="calendar_month"
                size="md"
                label="Select Year"
                style="height: 40px"
                :class="$q.screen.lt.md  ? 'col-12': ''"
              >
                <q-list>
                  <q-item
                    clickable
                    v-close-popup
                    @click="year = index + 2019"
                    v-for="index in 31"
                    :key="index"
                  >
                    <q-item-section>
                      <q-item-label>{{ index + 2019 }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          <!-- If no appointment  -->
          <!-- Appointment View Component  -->
            <div class="px-40" v-else>
              <keep-alive>
                <SingleAppointment
                  class="mb-10"
                  :class="[index > 0 ? 'pt-15': '']"
                  v-model="appointment_id"
                  :appointment="appointment"
                  :index="index"
                  v-for="(appointment, index) in appointments"
                  :key="index"
                  @search-by-id="searchAppointment"
                  @year-change="year = $event"
                ></SingleAppointment>
              </keep-alive>
            </div>
          <!-- Appointment View Component  -->
          </q-tab-panel>
        </q-tab-panels>
      </keep-alive>
    </template>
  </q-splitter>
</template>
<script setup>
import { ref, computed, watch } from "vue";
import { usePracticeStore } from "@/store/practice";
import { useUserStore } from "@/store/user";
import SingleAppointment from "@/components/Practice/patient/appointment/SingleAppointment.vue";

const userStore = useUserStore();
const splitterModel = ref(15); // splitter width control
const loading = ref(true);
const practiceStore = usePracticeStore();
const year = ref(new Date().getFullYear());
const tab = ref(`${new Date().getMonth() + 1}`);
const appointments = computed(() => practiceStore.currentPatient.appointments);
const appointment_id = ref(null);
practiceStore.getCurrenPatientAppointmentWithFilters({
  date: `${year.value}-${new Date().getMonth() + 1}`,
  patient_id: userStore.loginUser.id,
})
.then(() => (loading.value = false)); // Appointment Api 

const tabs = ref([
  {
    label: `January, `,
    name: `1`,
  },
  {
    label: `February, `,
    name: `2`,
  },
  {
    label: `March, `,
    name: `3`,
  },
  {
    label: `April, `,
    name: `4`,
  },
  {
    label: `May, `,
    name: `5`,
  },
  {
    label: `June, `,
    name: `6`,
  },
  {
    label: `July, `,
    name: `7`,
  },
  {
    label: `August, `,
    name: `8`,
  },
  {
    label: `September, `,
    name: `9`,
  },
  {
    label: `October, `,
    name: `10`,
  },
  {
    label: `November, `,
    name: `11`,
  },
  {
    label: `December, `,
    name: `12`,
  },
]);

/**
 * Description: appointment search module
 * 1) check if appointments array is empty or not
 * 2) then searches for appointments according to given date and id
 */
const searchAppointment = () => {
  if (appointment_id.value.length > 0) {
    practiceStore
      .getCurrenPatientAppointmentWithFilters({
        date: `${year.value}-${new Date().getMonth() + 1}`,
        appointment_key: appointment_id.value,
        patient_id: userStore.loginUser.id,
      })
      .then(() => (loading.value = false));
  } else {
    practiceStore.getCurrenPatientAppointmentWithFilters({
      date: `${year.value}-${new Date().getMonth() + 1}`,
      patient_id: userStore.loginUser.id,
    })
  }
};

/**
 * Description: watcher for appointment tabs changing
 * 1) if tab changes searches for 
 * 2) then searches for appointments according to given date and id
 */
watch(
  tab,
  (newTab) => {
    loading.value = true;
    practiceStore
      .getCurrenPatientAppointmentWithFilters({
        date: `${year.value}-${newTab}`,
        patient_id: userStore.loginUser.id,
      })
      .then(() => (loading.value = false));
  },
  { deep: true }
);


watch(
  appointment_id,
  (newTab) => {
    if (newTab == null || newTab == "") {
      tab.value = `${new Date().getMonth() + 1}`;
    }
  },
  { deep: true }
);

watch(
  year,
  (newTab) => {
    tab.value = "0";
    if (newTab == new Date().getFullYear()) {
      let current_month = new Date().getMonth() + 1;
      tab.value = current_month.toString();
    } else {
      tab.value = "1";
    }
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
:deep .q-tab {
  justify-content: start !important;
  min-height: 40px;
}
:deep .q-item{
  min-height: 40px !important;
}
:deep(.q-splitter__after){
  padding-top: 10px;
}
</style>
