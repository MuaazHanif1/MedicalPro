<template>
  <div v-if="isLoading" class="parent">
    <div class="dot-spinner justify-center items-center vertical-middle flex">
      <q-spinner-dots color="primary" size="3em" :thickness="2" />
    </div>
  </div>
  <div class="row">
    <div class="col-12 q-ml-md q-mt-xs" v-for="error in errors" :key="error">
      <p class="danger-color">{{ error[0] }}<br /></p>
    </div>
    <div class="col-md-8">
      <q-form ref="createAppointmentForm">
        <q-stepper v-model="step" vertical color="primary" animated>
          <q-step
            :name="1"
            prefix="1"
            title="Select Practice"
            :caption="practice_name ? practice_name : ''"
            :activeIcon="`img:${require('@/assets/numbers/1.png')}`"
            :done="step > 1"
          >
            <div class="row" v-if="!isLoading">
              <div class="col-md-8 practice-select col-12">
                <FormInput
                  label="Select Practice"
                  :option="practices"
                  :placeHolder="'Select practice'"
                  :optionlabel="'name'"
                  :optionvalue="'id'"
                  v-model="createAppointment.practice_id"
                  :isInput="false"
                  :rules="[rules.required]"
                  @dropdown-value-change="selectedPracitce($event, true)"
                >
                </FormInput>
                <q-stepper-navigation
                  :class="
                    $q.screen.lt.md
                      ? 'float-right'
                      : 'float-right slot-next-btn'
                  "
                >
                  <q-btn
                    :disable="doctorAvailable"
                    @click="validation(2)"
                    color="primary"
                    label="Next"
                  />
                </q-stepper-navigation>
              </div>
            </div>
          </q-step>

          <q-step
            :name="2"
            prefix="2"
            title="Select Doctor"
            :caption="selectedDoctorName ? selectedDoctorName : ''"
            :activeIcon="`img:${require('@/assets/numbers/2.png')}`"
            :done="step > 2"
          >
            <div class="row">
              <div class="col-md-6 q-pa-xs col-12">
                <FormInput
                  label="Doctor Name"
                  :placeHolder="'Select doctor'"
                  :option="doctors"
                  :optionvalue="'id'"
                  :optionlabel="'full_name'"
                  v-model="createAppointment.doctor_id"
                  :isInput="false"
                  :rules="[rules.required]"
                  @dropdown-value-change="selectedDoctor($event, true)"
                ></FormInput>
              </div>
              <div class="col-md-6 q-ma-xs q-pa-xs col-12">
                <q-stepper-navigation class="float-right">
                  <q-btn
                    :disable="!datesAvailabeAgainstDoctor"
                    @click="validation(3)"
                    color="primary"
                    label="Next"
                  />
                </q-stepper-navigation>
                <q-stepper-navigation class="float-left">
                  <q-btn
                    flat
                    @click="step = 1"
                    color="primary"
                    label="Back"
                    class="q-ml-sm"
                  />
                </q-stepper-navigation>
              </div>
            </div>
          </q-step>
          <q-step
            :name="3"
            prefix="3"
            title="Select Date and Time"
            :caption="appointmentdate + ' ' + appointmenttime"
            :activeIcon="`img:${require('@/assets/numbers/3.png')}`"
            :done="step > 3"
          >
            <div class="row">
              <div class="col-md-6 col-12">
                <div class="custom-input-selector">
                  <q-input
                    ref="date_input"
                    @focus="restrictFocus"
                    v-model="createAppointment.date"
                    mask="date"
                    :placeholder="'Select date'"
                    outlined
                    :rules="[rules.required]"
                  >
                    <q-popup-proxy
                      class="mydatepopup"
                      cover
                      ref="qDateProxy1"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="createAppointment.date"
                        :rules="[rules.required]"
                        @update:model-value="
                          fetchAvailableSlots();
                          $refs.qDateProxy1.hide();
                        "
                        :options="doctorAvailabityFitleredDates"
                      >
                        <div class="row items-center">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer"></q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="q-gutter-sm q-py-md" v-if="zoom_status == 1">
                  <q-radio
                    v-model="createAppointment.appointment_type"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="1"
                    label="Physical-Appointment"
                  />
                  <q-radio
                    v-model="createAppointment.appointment_type"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="2"
                    label="Tele-Appointment"
                  />
                </div>
              </div>

              <div
                class="col-12 q-pa-xs"
                v-if="doctorAvailabeSlots && doctorAvailabeSlots.length"
              >
                <q-btn
                  :disable="slot.is_booked"
                  :class="
                    createAppointment.start_time == slot.start_time &&
                    slot.is_booked
                      ? 'time-slot q-ma-xs selected-slot'
                      : slot.is_booked
                      ? 'time-slot q-ma-xs booked-slot'
                      : createAppointment.start_time == slot.start_time
                      ? 'time-slot q-ma-xs selected-slot'
                      : 'time-slot q-ma-xs'
                  "
                  v-for="slot in doctorAvailabeSlots"
                  :key="slot"
                  @click="!slot.is_booked ? selectSlot(slot) : ''"
                >
                  {{ timeFormatFilter(slot.start_time) }}
                </q-btn>
              </div>

              <div class="col-12" v-else>
                <div class="row">
                  <div class="col-2">
                    <p
                      v-if="appointmentdate && !isLoading"
                      class="text-negative"
                    >
                      No Slot Found
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-12">
                <q-stepper-navigation class="float-left">
                  <q-btn
                    flat
                    @click="step = 2"
                    color="primary"
                    label="Back"
                    class="q-ml-sm"
                  />
                </q-stepper-navigation>
                <q-stepper-navigation
                  :class="
                    $q.screen.lt.md
                      ? 'float-right'
                      : 'float-right slot-next-btn'
                  "
                >
                  <q-btn @click="validation(4)" color="primary" label="Next" />
                </q-stepper-navigation>
              </div>
            </div>
          </q-step>

          <q-step
            :name="4"
            prefix="4"
            title="Reason"
            :activeIcon="`img:${require('@/assets/numbers/4.png')}`"
            :done="step > 4"
          >
            <div class="row">
              <div class="col-md-6 q-pa-xs col-12 appointment-instructions">
                <label for="">Patient's Complaint</label>
                <!-- <FormInput
                            label=" "
                            :labelColor="'#484848'"
                            :labelWeight="'400'"
                            :labelFontSize="'13px'"
                            :rules="[rules.required]"
                            :labelFontFamily="'lato'"
                            v-model="createAppointment.instructions"
                        ></FormInput> -->
                <q-input
                  v-model="createAppointment.instructions"
                  :rules="[rules.required, rules.note_max_length]"
                  placeholder="Appointment note"
                  autogrow
                  outlined
                  type="textarea"
                />
              </div>

              <div class="col-md-6 q-pa-xs col-12 field-border">
                <label for="">Medical Problems</label>
                <q-select
                  class="medical-problems"
                  outlined
                  v-model="createAppointment.medical_problem_id"
                  multiple
                  option-label="name"
                  option-value="id"
                  :options="medicalProblems"
                  :placeholder="
                    createAppointment.medical_problem_id?.length
                      ? ''
                      : 'Search and select medical problem'
                  "
                  use-input
                  use-chips
                  stack-label
                  emit-value
                  map-options
                  @filter="fetchMedicalProblems"
                />
              </div>
            </div>
            <q-stepper-navigation class="float-left">
              <q-btn
                flat
                @click="step = 3"
                color="primary"
                label="Back"
                class="q-ml-sm"
              />
            </q-stepper-navigation>
            <q-stepper-navigation class="float-right">
              <q-btn @click="validation(5)" color="primary" label="Next" />
            </q-stepper-navigation>
          </q-step>
          <q-step
            :name="5"
            prefix="5"
            title="Review and Submit"
            :activeIcon="`img:${require('@/assets/numbers/5.png')}`"
          >
            <div class="row mt-20">
              <div
                class="col-md-6 col-12 row"
                v-for="field in createAppointmentReveiw"
                :key="field"
              >
                <div class="col-6">
                  <label class="text-weight-bold">{{ field.label }}</label>
                </div>
                <div class="col-auto">
                  <p class="float-left">{{ field.value }}</p>
                </div>
              </div>
              <div class="col-md-10 col-12">
                <q-stepper-navigation class="float-left">
                  <q-btn
                    flat
                    @click="step = 4"
                    color="primary"
                    label="Back"
                    class="q-ml-sm"
                  />
                </q-stepper-navigation>
                <q-stepper-navigation class="float-right">
                  <q-btn
                    :loading="is_submit"
                    class="create-appointment-btn"
                    color="primary"
                    @click="createAppointmentSubmit"
                    :label="
                      isEdit ? 'Reschedule appointment' : 'Create appointment'
                    "
                  />
                </q-stepper-navigation>
              </div>
            </div>
          </q-step>
        </q-stepper>
      </q-form>
      <div class="q-pa-md q-gutter-sm">
        <q-dialog v-model="successfullyPopup">
          <q-card class="success-popup-main">
            <q-card-section class="row items-center q-pb-none">
              <q-space />
              <q-btn
                icon="close"
                flat
                round
                dense
                v-close-popup
                @click="redirectToAppointments"
              />
            </q-card-section>

            <q-card-section>
              <div class="success-popup">
                <img
                  :src="require('@/assets/success-popup-icon.png')"
                  alt="icon"
                />
                <div class="text-h6">
                  Your Appointment has been
                  {{ isEdit ? "rescheduled" : "created" }}!
                </div>
                <p>
                  We have sent a confirmation email at
                  <span>{{ userStore.loginUser.email }}</span>
                </p>
                <div class="row q-pa-sm appointment-success">
                  <div class="col-md-4 col-sm-6 col-xs-6">Appointment ID:</div>
                  <div class="col-md-6 col-sm-6 col-xs-6">
                    {{ appointmentId }}
                  </div>
                  <div class="col-md-4 col-sm-6 col-xs-6">
                    Appointment Time:
                  </div>
                  <div class="col-md-8 col-sm-6 col-xs-6">
                    {{ appointmentdate }} {{ appointmenttime }}
                  </div>
                  <div class="col-md-4 col-sm-6 col-xs-6">Doctor Name:</div>
                  <div class="col-md-6 col-sm-6 col-xs-6">
                    {{ selectedDoctorName }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import FormInput from "@/partials/FormInput.vue";
import {
  datesbetween,
  timeFormatFilter,
  usetimeSlotsWithAppointments,
} from "@/composables/helper-functions";
import { usePracticeStore } from "@/store/practice";
import axiosApiClient from "@/axios/index";
import { useQuasar, date } from "quasar";
import { useRouter } from "vue-router";
import notify from "@/composables/notify";
import { useRoute } from "vue-router";
import { useVitalsStore } from "@/store/vitals";
import { useUserStore } from "@/store/user";

const userStore = useUserStore();
const router = useRouter();
const $q = useQuasar();
const step = ref(1);
const practices = ref([]);
const medicalProblems = ref([]);
const doctorAvailableDates = ref([]);
const doctorAvailabityFitleredDates = ref([]);
const doctors = ref([]);
const selectedDoctorName = ref("");
const doctorAvailabeSlots = ref([]);
const appointmentId = ref("");
const successfullyPopup = ref(false);
const is_submit = ref(false);
const store = usePracticeStore();
const vitalStore = useVitalsStore();
const practice_name = ref("");
const doctor_email = ref("");
const createAppointmentForm = ref(null);
const errors = ref("");
const isLoading = ref(false);
const date_input = ref(null);
const datesAvailabeAgainstDoctor = ref(false);
const route = useRoute();
const isEdit = ref(false);
const doctorAvailable = ref(false);
// const n1 = import('@/assets/numbers/1.png');
const createAppointment = ref({
  patient_id: 1,
  doctor_id: "",
  practice_id: "",
  doctor_slot_id: "",
  start_time: "",
  end_time: "",
  medical_problem_id: [],
  instructions: "",
  date: "",
  appointment_type: "1",
});
const appointmentdate = computed(() => {
  return createAppointment.value.date
    ? date.formatDate(createAppointment.value.date, "DD MMMM YYYY")
    : "";
});
const appointmenttime = computed(() => {
  return createAppointment.value.start_time
    ? timeFormatFilter(createAppointment.value.start_time) +
        " - " +
        timeFormatFilter(createAppointment.value.end_time)
    : "";
});
const appointmentnote = computed(() => {
  return createAppointment.value.instructions
    ? createAppointment.value.instructions
    : "";
});
const createAppointmentReveiw = ref([
  { label: "Practice Name", value: practice_name },
  { label: "Doctor Name", value: selectedDoctorName },
  { label: "Appointment Date", value: appointmentdate },
  { label: "Appointment Time", value: appointmenttime },
  { label: "Appointment Note", value: appointmentnote },
]);

onMounted(async () => {
  practices.value = await store.getPractices();
  if (route.query.id) {
    isLoading.value = true;
    const appointment = await vitalStore.getAppointmentDetails(route.query.id);
    if (appointment) {
      createAppointment.value = appointment;
      if (appointment.medicalProblem.length) {
        createAppointment.value.medical_problem_id =
          appointment.medicalProblem.map((s) => s.id);
        medicalProblems.value = appointment.medicalProblem;
      } else {
        createAppointment.value.medical_problem_id = [];
      }
      await selectedPracitce(appointment.practice_id);
      await selectedDoctor(appointment.doctor_id);
      await fetchAvailableSlots();
      isEdit.value = true;
    } else {
      notify("Invalid id", "negative");
    }
    isLoading.value = false;
  }
});

const fetchMedicalProblems = (val, update) => {
  if (val === "") {
    update(() => {
      medicalProblems.value = [];
    });
    return;
  } else if (val) {
    isLoading.value = true;
    update(() => {
      axiosApiClient.post("medical-problems", { search: val }).then((res) => {
        medicalProblems.value = res.data?.data?.data;
        isLoading.value = false;
      });
    });
  } else {
    update(() => {
      const needle = val.toLowerCase();
      medicalProblems.value = medicalProblems.value.filter(
        (v) => v.name.toLowerCase().indexOf(needle) > -1
      );
    });
  }
};

const selectedPracitce = async (id, change = false) => {
  if (change) {
    createAppointment.value.doctor_id = "";
  }

  practice_name.value = "";
  practice_name.value = practices.value.find((x) => x.id == id).name;
  doctors.value = await store.getSpecializationDoctors({ practice_id: id });
  doctors.value = doctors.value.map((object, i) => {
    return {
      ...object,
      full_name:
        doctors.value[i]["first_name"] + " " + doctors.value[i]["last_name"],
    };
  });
  if (!doctors.value?.length) {
    notify("No doctor available against this practice", "negative");
    doctorAvailable.value = true;
  } else {
    doctorAvailable.value = false;
  }
};
const zoom_status = ref("0");
const selectedDoctor = async (id, change = false) => {
  if (change) {
    createAppointment.value.start_time = "";
    createAppointment.value.end_time = "";
    createAppointment.value.date = "";
    doctorAvailabeSlots.value = [];
  }
  const first_name = doctors.value.find((x) => x.id == id).first_name;
  const last_name = doctors.value.find((x) => x.id == id).last_name;
  zoom_status.value = doctors.value.find((x) => x.id == id).zoom_status;

  doctor_email.value = doctors.value.find((x) => x.id == id).primary_email;
  selectedDoctorName.value = first_name + " " + last_name;
  doctorAvailableDates.value = await store.getDoctorAvalilabeDates(
    id,
    createAppointment.value.practice_id
  );

  if (doctorAvailableDates.value) {
    if (doctorAvailableDates.value.doctor_slots) {
      datesAvailabeAgainstDoctor.value = true;
      let dates = [];
      doctorAvailableDates.value.doctor_slots.map(function (value) {
        const datess = datesbetween(
          value.date_from,
          value.date_to,
          value.doctor_slot_days
        );
        dates = [...datess, ...dates];
      });
      if (doctorAvailableDates.value.doctor_off_days) {
        doctorAvailableDates.value.doctor_off_days.map(function (value) {
          dates = dates.filter(
            (date1) => date1 != date.formatDate(value.date, "YYYY/MM/DD")
          );
        });
      }
      doctorAvailabityFitleredDates.value = dates;
    } else {
      datesAvailabeAgainstDoctor.value = false;
      notify("No date available against this doctor", "negative");
    }
  }
};
const fetchAvailableSlots = async () => {
  isLoading.value = true;
  const res = await store.getAppointmentSlotsBooked(
    createAppointment.value.doctor_id,
    createAppointment.value.date
  );

  if (res) {
    let slots = [];
    res.map(function (value) {
      const slts = usetimeSlotsWithAppointments(
        value.time_from,
        value.time_to,
        value.slot_time,
        value.appointments,
        value.id
      );
      slots = [...slts, ...slots];
    });
    doctorAvailabeSlots.value = slots;
    isLoading.value = false;
  }
};
const selectSlot = (slot) => {
  createAppointment.value.start_time = slot.start_time;
  createAppointment.value.end_time = slot.end_time;
  createAppointment.value.doctor_slot_id = slot.id;
  step.value = 4;
};

const validation = (n) => {
  if (n == 4 && !createAppointment.value.start_time) {
    $q.notify({
      type: "negative",
      position: "top-right",
      textColor: "white",
      icon: "warning",
      message: "Select time and slot to continue",
    });
    return;
  }
  // if (n == 5 && !createAppointment.value.medical_problem_id.length) {
  //   $q.notify({
  //     type: "negative",
  //     position: "top-right",
  //     textColor: "black",
  //     icon: "warning",
  //     message: "Select medical problem to continue",
  //   });
  //   return;
  // }
  createAppointmentForm.value.validate().then((success) => {
    if (success) {
      step.value = n;
    }
  });
};

const redirectToAppointments = () => {
  router.push({ name: "all-appointments" });
};
const createAppointmentSubmit = async () => {
  is_submit.value = true;
  const creatappoint = await store.practiceCreateAppointment(
    createAppointment.value
  );
  if (creatappoint.id) {
    appointmentId.value = creatappoint.appointment_key;
    successfullyPopup.value = true;
    is_submit.value = false;
  } else {
    is_submit.value = false;
    errors.value = creatappoint.response.data.data;
  }
};

const restrictFocus = () => {
  date_input.value.blur();
};
</script>
<style>
.mydatepopup {
  min-width: 24px !important;
}
</style>
<style scoped lang="scss">
.error {
  color: red;
  text-align: left;
}

::v-deep .patient-found {
  font-family: "Lato";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: #0d0c22;
  margin-bottom: 10px;
}

::v-deep .q-table tr {
  background: #f4f4f6;
  border: 1px solid rgba(210, 213, 224, 0.15);
}

::v-deep .time-slot {
  background: #ebeff6;
  border-radius: 6px;
}

::v-deep .q-stepper {
  box-shadow: none;
  border-radius: 0px;
  background: transparent;
}

::v-deep .q-stepper--vertical .q-stepper__dot:after,
::v-deep .q-stepper--vertical .q-stepper__dot:before {
  background: transparent;
  border-left: 1px dashed $gray;
}

::v-deep .q-stepper__dot {
  background: transparent;
  border: 1px solid $gray;

  span {
    color: $gray;
  }
}

::v-deep .q-stepper__tab--done {
  .q-stepper__dot {
    background: $primary;
    border: 1px solid $primary;

    span {
      color: $white;
    }
  }
}

::v-deep .q-stepper__tab--active {
  .q-icon {
    width: 6px;
    height: 9px;
  }
}

.light-green-chip {
  background: #ebf0ee !important;
  color: $primary;
  cursor: pointer;
}

::v-deep .field-border .q-field__control {
  max-height: 70px !important;
}

::v-deep .field-border .q-field__control-container {
  min-height: 70px !important;
  overflow: scroll;
}

.appointment-success {
  background: rgba(245, 246, 248, 0.89);
  border-radius: 6px;
  margin: 20px;
  padding: 15px;

  div:nth-of-type(odd) {
    margin-bottom: 9px;
    font-family: "Lato";
    font-style: normal;
    font-weight: 500;
    color: black;
    font-size: 13px;
    line-height: 16px;
    text-transform: capitalize;
  }

  div:nth-of-type(even) {
    margin-bottom: 9px;
    font-family: "Lato";
    font-style: normal;
    font-weight: 500;
    color: #505050;
    font-size: 13px;
    line-height: 16px;
    text-transform: capitalize;
  }
}

.success-popup {
  display: flex;
  flex-direction: column;

  span {
    color: $primary;
  }
}

.success-popup img {
  align-self: center;
}

.success-popup .text-h6,
p {
  text-align: center;
}

::v-deep .q-field--outlined .q-field__control {
  border-radius: 8px !important;
}

::v-deep .q-field__control {
  color: $text-2 !important;
}

::v-deep .q-field--outlined .q-field__control:hover:before {
  border-color: #d2d5e0 !important;
}

::v-deep .appointment-instructions .q-field__control {
  background: #f9f9fb !important;
  border: 1px solid #bebdbf;
  border-radius: 8px;
  min-height: 70px !important;
}

// ::v-deep .custom-input-selector .q-field .q-field__inner{
//   max-height: 40px !important;
// }
::v-deep .custom-input-selector .q-field .q-field__inner .q-field__control {
  max-height: 40px !important;
}

::v-deep
  .custom-input-selector
  .q-field.q-field--outlined.q-field--highlighted
  .q-field__control:after {
  max-height: 40px !important;
}

::v-deep
  .custom-input-selector
  .q-field.q-field--outlined.q-field--focused
  .q-field__control:after {
  max-height: 40px !important;
}

::v-deep .custom-input-selector .q-field__append {
  max-height: 40px !important;
}

::v-deep .custom-input-selector .q-field__control-container {
  max-height: 40px !important;
}

:deep(.danger-color) {
  color: red;
  float: left;
}

:deep(.q-stepper__dot) {
  border: 1px solid;
  background: #ebeff6;
}

:deep(.q-stepper__dot span) {
  color: $primary;
  font-weight: 600;
}

:deep(.q-stepper__nav) {
  padding-top: 0px;
  margin-top: 5px;
}

:deep(.q-stepper__step-inner .float-left .q-btn) {
  margin-left: 0px;
  font-family: "Lato";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 12px;
  text-transform: capitalize;
  height: 12px;
  width: 39px;
}

:deep(.q-stepper__step-inner .float-right .q-btn) {
  height: 40px;
  width: 99px;
  border-radius: 6px;
  text-transform: capitalize;
  margin-right: 2px;
}

:deep(.create-appointment-btn) {
  width: 100% !important;
}

:deep(.green-background-btn) {
  height: 40px;
  border-radius: 6px;
  text-transform: capitalize;
}

:deep(.verify-btn) {
  height: 40px;
  width: 99px;
  margin: 10px 0px;
  border-radius: 6px;
  text-transform: capitalize;
}

:deep(.q-menu .q-position-engine) {
  max-width: 200px !important;
}

:deep(.q-field) {
  padding-bottom: 0px !important;

  .q-field__bottom {
    display: none !important;
  }
}

:deep(.text-negative) {
  color: $negative !important;
  // margin-top: 5px;
  margin-bottom: 0px;
}

:deep(.q-stepper--vertical .q-stepper__step-inner) {
  padding-bottom: 0px;
}

:deep(.q-stepper__title) {
  font-size: 16px;
}

:deep(.q-stepper__caption) {
  font-size: 14px;
}

:deep(.slot-next-btn) {
  margin-right: 16px;
}

:deep(.q-field) {
  max-width: 330px;
}

:deep(.success-popup-main) {
  max-width: 510px;
}

:deep(.parent) {
  position: relative;

  .dot-spinner {
    position: absolute;
    width: 100%;
  }
}

:deep(.practice-select .q-field) {
  max-width: 440px;
}

:deep(.booked-slot) {
  background: #dfdfdf;
  color: #777777;
}

.selected-slot {
  background: $primary;
  color: white;
}
</style>
