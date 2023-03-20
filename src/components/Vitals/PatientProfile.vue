<!-- eslint-disable vue/valid-template-root -->
<template>
  <div class="row justify-center" v-if="isLoading">
    <q-spinner-dots color="primary" size="2em" :thickness="2" />
  </div>
  <section v-else class="mt-10 mb-24 full-width bg-white rounded-borders flex col">
    <!-- Details card -->
    <div class="px-15 py-30 full-width flex orientation items-start relative-position">
      <div class="image-position">
        <q-avatar class="placeholder-img-border" rounded size="100px">
          <img :src="require('@/assets/man.png')" />
        </q-avatar>
      </div>
      <div class="flex col width-100">
        <!-- first row -->
        <div class="ml-26 flex items-center width-100 row"
          :class="[$q.screen.lt.md ? ' justify-center' : 'justify-between']">
          <div class="flex row" :class="{
            'width-100 pb-10': $q.screen.lt.sm,
            'justify-center': $q.screen.lt.md
          }">
            <span class="medium-font lato">
              {{
                patientDetail.patient.first_name &&
                  capitalizeFirstLetter(patientDetail.patient.first_name)
              }}

              {{
                patientDetail.patient.middle_name &&
                  capitalizeFirstLetter(patientDetail.patient.middle_name)
              }}
              {{
                patientDetail.patient.last_name &&
                  capitalizeFirstLetter(patientDetail.patient.last_name)
              }}
            </span>
            <!-- status -->
            <q-chip :class="
              patientDetail.status == 'Completed'
                ? 'chip complete-chip'
                : patientDetail.status == 'Cancelled'
                  ? 'chip cancel-chip'
                  : patientDetail.status == 'Confirmed'
                    ? 'chip confirm-chip'
                    : patientDetail.status == 'Checked in' ? 'chip checkin-chip' : 'chip cancel-chip'
            " text-color="white">{{ patientDetail.status }}</q-chip>

            <!-- <div flat :class="statusColor(patientDetail.status)"
              class="ml-24  lato flex justify-center items-center status-label">
              {{ patientDetail.status }}
            </div> -->
          </div>
          <div class="profile-btn-position">
            <router-link :to="{
              name: 'create-appointment',
              query: { id: patientDetail.id },
            }">
              <q-chip class="chip confirm-chip" text-color="white" v-if="
                patientDetail.status != 'Cancelled' &&
                patientDetail.status != 'Rescheduled'
              ">Reschedule</q-chip>
            </router-link>
            <!-- <q-btn
              @click="redirectToPatient()"
              color="light-green"
              no-caps
              text-color="primary"
              unelevated
              size="md"
              label="View Patient's Profile"
            /> -->
            <!-- <q-btn class="profile-patient-btn" text-color="primary" flat color="light-green"
              label="View Patient's Profile">
            </q-btn> -->
          </div>
        </div>
        <!-- second row grid-->
        <div class="ml-26 mt-14 width-100 row">
          <p class="lato text-subtitle2 text-weight-regular mb-3 col-4 col-md-4 col-sm-6 col-xs-12">
            <span class="dark-black">Appointment ID</span>:
            <span class="dark-grey ml-sm">{{
              patientDetail.appointment_key
            }}</span>
          </p>
          <p class="text-subtitle2 text-weight-regular mb-3 col-4 col-md-4 col-sm-6 col-xs-12">
            <span class="dark-black">Doctor</span>:
            <span class="dark-grey ml-sm">
              {{
                patientDetail.doctor.first_name &&
                  capitalizeFirstLetter(patientDetail.doctor.first_name)
              }}

              {{
                patientDetail.doctor.middle_name &&
                  capitalizeFirstLetter(patientDetail.doctor.middle_name)
              }}
              {{
                patientDetail.doctor.last_name &&
                  capitalizeFirstLetter(patientDetail.doctor.last_name)
              }}
            </span>
          </p>
          <p class="text-subtitle2 text-weight-regular mb-3 col-4 col-md-4 col-sm-6 col-xs-12">
            <span class="dark-black">Date</span>:
            <span class="dark-grey ml-sm">
              {{ moment(patientDetail.date).format("DD MMM YYYY") }}
            </span>
          </p>
        </div>
        <!-- third row -->
        <div v-if="!$q.screen.lt.sm" class="ml-26 row mt-3 width-100">
          <p class="pr-28 col-12">
            <span class="dark-black">Appointment Note : </span>
            <span class="dark-grey text-wrapping">
              {{
                firstCharac
              }}<span v-if="showMoreText">{{ remainingCharac }}</span>
              <span v-if="remainingCharac !== ''" class="font-weight-600 cursor-pointer"
                @click="showMoreText = !showMoreText">
                {{ showMoreText? " Show Less": "...Show More" }}
              </span>
            </span>
          </p>
        </div>
        <!-- <div class="ml-26 mt-3 row" v-if="!$q.screen.lt.sm">
          <span v-if="patientDetail.instructions" class="text-subtitle2 text-weight-regular mb-3 col-6">
            <span class="dark-black">Appointment Note</span>:

            <span class="dark-grey">
              {{ patientDetail.instructions }}
            </span>
          </span>
        </div> -->
      </div>
      <div v-if="$q.screen.lt.sm" class="ml-26 row mt-3 width-100">
        <p class="pr-28 col-12">
          <span class="dark-black">Appointment Note : </span>
          <span class="dark-grey text-wrapping">
            {{
              firstCharac
            }}<span v-if="showMoreText">{{ remainingCharac }}</span>
            <span v-if="remainingCharac !== ''" class="font-weight-600 cursor-pointer"
              @click="showMoreText = !showMoreText">
              {{ showMoreText? " Show Less": "...Show More" }}
            </span>
          </span>
        </p>
      </div>
    </div>
    <!-- divider -->
    <q-separator class="width-100" />
    <!-- tabs section -->
    <!-- <q-tabs
      v-model="selectedtab"
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
    </q-tabs> -->
    <q-tabs v-model="tab" dense align="left" active-color="black" indicator-color="secondary" class="text-grey-8">
      <q-tab :name="tab.name" class="py-15" label="" v-for="(tab, index) in tabs" :key="index">
        <template #default>
          <p class="text-body2 mb-0 text-capitalize">{{ tab.label }}</p>
        </template>
      </q-tab>
      <!-- <q-tab name="vitals" class="py-15" label="Vitals" />
      <q-tab name="e-prescription" class="py-15 pl-15" label="E-prescription" /> -->
    </q-tabs>
  </section>
  <section class="bg-white full-width rounded-borders px-20">
    <keep-alive>
      <Vitals v-if="tab === 'vitals'" />
    </keep-alive>
    <keep-alive>
      <EprescriptionPage v-if="tab === 'e-prescription'" />
    </keep-alive>
  </section>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import Vitals from "@/components/Vitals/index.vue";
import EprescriptionPage from "@/components/Practice/Appointments/EprescriptionPage.vue";
import { useVitalsStore } from "@/store/vitals";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import moment from "moment";
import snack_error from "@/composables/error-snack";

const $q = useQuasar();

const showMoreText = ref(false);

// store
const store = useVitalsStore();

// loader
const isLoading = ref(true);

// getting the appointment ID from the URL
const route = useRoute();
store.appointment_id = Number(route.params.id);

// patient details
const patientDetail = ref({});

const tab = ref("vitals");

const tabs = ref([
  {
    label: "Vitals",
    name: "vitals",
  },
  {
    label: "E-prescription",
    name: "e-prescription",
  },
]);

//

const firstCharac = ref("");
const remainingCharac = ref("");

/**  Description: this method capitalizes the first letter of the word
 * @param {status} String the string to be capitalized
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**  Description: this method shows the respective bg-color depending upon the status it recieves from the backend.
 * @param {status} String the status string from the backend
 */
// const statusColor = (status) => {
//   if (status === 'Complete' || status === 'Confirmed') {
//     return 'dark-green-background-btn';
//   } else if (status === 'Reschedule' || status === 'Pending') {
//     return 'bg-warning';
//   } else if (status === 'Cancel') {
//     return 'bg-negative';
//   }
// }

/**  Description: this method redirects the user to the respective patient detail page
 */
// const redirectToPatient = () => {
//   window.location.href = `/profile`;
// };

/**  Description: this method counts the characters in the sentence
   * 1) If the sentence has more than 375 characters, it enables the Show More/less
    feature.
*/
const characterCounter = (sentence) => {
  if (sentence.length > 375) {
    firstCharac.value = sentence.substring(0, 375);
    remainingCharac.value = sentence.substring(376, sentence.length);
    console.log(firstCharac.value, "----", remainingCharac.value);
  } else {
    firstCharac.value = sentence.substring(0, sentence.length);
    console.log(firstCharac.value);
  }
};
const getIntialAppointmentDetails = async (id = "") => {
  const response = await store.getAppointmentDetails(id);
  if (response) {
    if (!(response instanceof Error)) {
      patientDetail.value = response;
      isLoading.value = false;
      // take first 350 words
      characterCounter(patientDetail.value.instructions);
    } else {
      $q.notify({
        position: "top-right",
        message: snack_error(response),
        color: "negative",
        avatar: require("@/assets/svg/error.svg"),
        caption: "Please try again",
      });
    }
    isLoading.value = false;
  } else {
    isLoading.value = false;
    $q.notify({
      position: "top-right",
      message: "No Record Found",
      color: "negative",
      avatar: require("@/assets/svg/error.svg"),
      caption: "This appointment does not exist",
    });
  }
};

/**  Description: this method gets the vital's data from the backend.
 * 1) On succeessful response, it assigns the respective values to the variables/refs
 * 2) If the response is empty, it displays a snackbar with no record message
 * 3) If there's an error from the backend side, it displays the warning snack bar
 */
onMounted(async () => {
  getIntialAppointmentDetails();
});

watch(
  () => route.path,
  (path) => {
    //console.log(route.params.id)
    path.includes("/appointments/detail/") &&
      getIntialAppointmentDetails(route.params.id);
  }
);
</script>
<style lang="scss" scoped>
.orientation {
  flex-direction: row;
}

@media (max-width: 510px) {
  .image-position {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .orientation {
    flex-direction: column;
  }
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

@media (max-width: 676px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .profile-btn-position row {
    display: flex;
    justify-content: end;
    width: 100%;
    margin-top: 10px;
  }
}

.button-border {
  border-radius: 10px;
  border: none;
  outline: none;
  display: table-cell;
  vertical-align: middle;
}

.right-0 {
  right: 0;
}

:deep .profile-patient-btn {
  box-sizing: border-box;
  background: $white;
  border: 1px solid $white;
  border-radius: 4px;
  font-family: "Lato";
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
}

:deep .profile-patient-btn:hover {
  color: $white !important;
  background: $primary !important;
}

.status-label {
  width: 70px;
  height: 30px;
  border-radius: 10px;
}

.text-wrapping {
  //text-overflow: ;
  word-wrap: break-word;
}
</style>
