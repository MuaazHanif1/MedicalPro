<template>
  <div class="dashboard">
    <div v-if="is_ready" class="width-100 justify-center items-center flex">
      <q-spinner-dots color="primary" size="2em" :thickness="2" />
    </div>
    <div class="row justify-between items-center mb-18 fs-20 ">
      <div class="title">
        {{
          information.page == "allappointments"
            ? information.title
            : Object.keys(upcoming_appointments).length
              ? information.title
              : ""
        }}
      </div>
      <div class="row q-gutter-x-md q-gutter-y-md">
        <q-btn v-if="
          tab == 'upcoming_appointments_tab' &&
          Object.keys(upcoming_appointments).length
        " color="white" flat class="add-patient-btn" text-color="primary" icon="event" label="Calendar integration"
          @click="$emit('calendarBtn')">
        </q-btn>
        <q-btn v-if="
          tab == 'upcoming_appointments_tab' &&
          Object.keys(upcoming_appointments).length
        " :to="{ name: 'create-appointment' }" color="white" flat class="add-patient-btn" text-color="primary"
          icon="add" label="Create Appointment">
        </q-btn>
      </div>
    </div>
    <q-tabs v-if="information.page == 'allappointments'" v-model="tab" dense align="left" active-color="black"
      indicator-color="secondary" class="text-grey-8">
      <q-tab name="upcoming_appointments_tab" class="py-15" label="Upcoming Appointments"
        @click="getAppointments('upcoming_appointments_tab')" />
      <q-tab name="past_appointments_tab" class="py-15 pl-15" label="Past Appointments"
        @click="getAppointments('past_appointments_tab')" />
    </q-tabs>
    <template v-if="!is_ready">
      <div v-if="Object.keys(upcoming_appointments).length">
        <div class="appointments-section" v-for="(appointments, month) in upcoming_appointments" :key="appointments">
          <div class="appointment-month">{{ month }}</div>
          <div class="row appointment" v-for="monthappointment in upcoming_appointments[month]" :key="monthappointment">
            <div class="col-md-2 col-sm-2 col-xs-12 date-section">
              <div class="date">
                {{ date.formatDate(monthappointment.date, "DD") }}
              </div>
              <div class="month-year">
                {{ date.formatDate(monthappointment.date, "MMMM YYYY") }}
              </div>
              <q-chip :class="
                monthappointment.status == 'Completed'
                  ? 'chip complete-chip'
                  : monthappointment.status == 'Cancelled'
                    ? 'chip cancel-chip'
                    : monthappointment.status == 'Confirmed'
                      ? 'chip confirm-chip'
                      : monthappointment.status == 'Checked in'
                        ? 'chip checkin-chip'
                        : 'chip cancel-chip'
              " text-color="white">{{ monthappointment.status }}</q-chip>
              <div v-if="monthappointment.previous_id">Rescheduled</div>
            </div>
            <q-separator vertical />
            <div class="col-md-7 col-sm-7 col-xs-12">
              <div class="row appointment-detail">
                <div class="col-md-3 col-sm-5 col-xs-6 heading">
                  Appointment ID:
                </div>
                <div class="col-md-9 col-sm-7 col-xs-6 description">
                  {{ monthappointment.appointment_key }}
                </div>
                <div class="col-md-3 col-sm-5 col-xs-6 heading">
                  Appointment Time:
                </div>
                <div class="col-md-9 col-sm-7 col-xs-6 description">
                  {{ timeFormatFilter(monthappointment.start_time) }}
                  -
                  {{ timeFormatFilter(monthappointment.end_time) }} ,
                  {{ date.formatDate(monthappointment.date, "dddd") }}
                </div>
                <div class="col-md-3 col-sm-5 col-xs-6 heading">
                  Practice Name:
                </div>
                <div class="col-md-9 col-sm-7 col-xs-6 description">
                  {{ monthappointment.practice.initial_practice.practice_name }}
                </div>
                <div class="col-md-3 col-sm-5 col-xs-6 heading">
                  Doctor Name:
                </div>
                <div class="col-md-9 col-sm-7 col-xs-6 description">
                  {{
                    monthappointment.doctor.first_name +
                      " " +
                      monthappointment.doctor.last_name
                  }}
                </div>

                <div class="col-md-3 col-sm-5 col-xs-6 heading">
                  Zoom Meeting:
                </div>

                <div class="col-md-9 col-sm-7 col-xs-6 description">
                  <p v-if="monthappointment.zoom_detail == null">N/A</p>

                  <q-btn :href="
                    monthappointment.zoom_detail
                      ? monthappointment.zoom_detail['join_url']
                      : '#'
                  " target="_blank" label="Join" class="verify-btn" color="primary"
                    v-if="monthappointment.zoom_detail != null">
                  </q-btn>
                </div>
              </div>
            </div>
            <div class="col-md-2 col-sm-2 col-xs-12 action-btn-xs action">
              <q-btn class="detail-btn" :to="{
                name: 'appointment-detail',
                params: { id: monthappointment.id },
              }" label="Appointment Detail"></q-btn>
              <q-btn v-if="
                monthappointment.status != 'Cancelled' &&
                monthappointment.status != 'Completed'
              " @click="deleteItem(monthappointment.id)" label="Cancel Appointment"></q-btn>
            </div>
          </div>
        </div>
      </div>
      <div class="loading-inner" v-else>
        <img :src="require('@/assets/data-loading-icon.svg')" alt="action" />
        <div class="listing-title">No Data Available</div>
        <q-btn v-if="tab == 'upcoming_appointments_tab'" color="white" :to="{ name: 'create-appointment' }" flat
          class="add-patient-btn" text-color="primary" icon="add" label="Create Appointment">
        </q-btn>
      </div>
      <q-dialog v-model="sure_to_delete" no-backdrop-dismiss>
        <q-card style="max-width: 500px; padding: 0px 40px; width: 100%" class="px-15">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6 text-weight-bold">Cancel Appointment</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section>
            <q-form ref="cancelForm" :greedy="true">
              <div class="row q-col-gutter-sm">
                <div class="col-12" :class="[
                  add_field.col ? `col-md-${add_field.col}` : 'col-md-6',
                ]" v-for="(add_field, add_index) in cancelInputs" :key="add_index">
                  <FormInput :inputType="add_field.type" :isInput="add_field.type === 'select' ? false : true"
                    :label="add_field.label" :option="add_field.options" v-model="cancelModel[add_field.value]"
                    :rules="add_field.rules" :optionlabel="add_field.optionlabel" :searchUrl="add_field.search_url"
                    :placeHolder="add_field.placeholder" :max="add_field.max ? add_field.max : null"></FormInput>
                </div>
              </div>
              <div class="row justify-end mt-20">
                <q-btn unelevated color="primary" label="Cancel Appointment" :loading="changing" padding="8px 41px"
                  no-caps @click="confirmDelection" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref, defineProps, defineEmits } from "vue";
import { usePatientStore } from "@/store/patient";
import { date } from "quasar";
import { timeFormatFilter } from "@/composables/helper-functions";
import notify from "@/composables/notify";
import FormInput from "@/partials/FormInput.vue";
import rules from "@/composables/validation-rules";

defineProps({
  information: {
    type: Object,
  },
});
defineEmits(["calendarBtn"]);
const upcoming_appointments = ref([]);
const patientStore = usePatientStore();
const is_ready = ref(false);
const tab = ref("upcoming_appointments_tab");
const sure_to_delete = ref(false);
const deleting_item_id = ref("");
const cancelForm = ref("");
const changing = ref(false);
const cancelInputs = ref([
  {
    label: "Cancellation reason",
    placeholder: "Select cancellation reason",
    value: "reason",
    col: "12",
    search_url: "",
    type: "select",
    rules: [rules.required],
    options: [
      {
        id: "Patient unable to join",
        name: "Patient unable to join",
      },
      {
        id: "Doctor did not arrive",
        name: "Doctor did not arrive",
      },
      {
        id: "Other",
        name: "Other",
      },
    ],
  },
  {
    label: "Description",
    placeholder: "Enter description",
    value: "comments",
    type: "text",
    col: "12",
  },
]);

const cancelModel = ref({
  comments: null,
  reason: null,
});

onMounted(() => {
  getAppointments("upcoming_appointments_tab");
});

const getAppointments = async (appointmenttype) => {
  tab.value = appointmenttype;
  if (tab.value == "upcoming_appointments_tab") {
    is_ready.value = true;
    upcoming_appointments.value = await patientStore.getUpComingAppointments();
  } else {
    is_ready.value = true;
    upcoming_appointments.value = await patientStore.getPreviousAppointments();
  }
  is_ready.value = false;
};

const deleteItem = (id) => {
  deleting_item_id.value = id;
  sure_to_delete.value = true;
};
const confirmDelection = () => {
  cancelForm.value.validate().then((success) => {
    if (success) {
      changing.value = true;
      patientStore
        .cancelAppointments({
          appointment_id: deleting_item_id.value,
          status: "Cancelled",
          reason: cancelModel.value.reason,
          comments: cancelModel.value.comments
            ? cancelModel.value.comments
            : "",
        })
        .then((res) => {
          if (res.data) {
            sure_to_delete.value = false;
            notify("Appointment cancelled successfully", "primary");
            location.reload();
          }
          changing.value = false;
        });
    }
  });
};
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 23px 37px;
}

:deep(.title) {
  font-family: "Lato";
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 22px;
  color: #0d0c22;
}

:deep(.q-btn) {
  background: $white;
}

:deep(.appointment-month) {
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  color: #0d0c22;
  margin-top: 23px;
  margin-bottom: 13px;
}

:deep(.appointment) {
  background: $white;
  padding: 25px;
  margin-bottom: 12px;

  .date-section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .date {
    font-family: "Lato";
    font-style: normal;
    font-weight: 700;
    font-size: 48px;
    line-height: 49px;
    text-align: center;
    color: #0d0c22;
  }

  .month-year {
    font-family: "Lato";
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    margin-top: 4px;
    margin-bottom: 8px;
    color: #0d0c22;
  }

  .action .q-btn {
    background: #f7f7f9;
    border-radius: 10px;
    min-height: 38px;
    margin-top: 5px;
    font-family: "Lato";
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 24px;
    color: #7b8491;
    text-transform: capitalize;
    font-family: "Lato";
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 24px;
  }

  .action .detail-btn {
    margin-bottom: 13px;
  }

  .appointment-detail {
    .heading {
      font-family: "Lato";
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      text-transform: capitalize;
      color: #0d0c22;
      margin-bottom: 12px;
    }

    .description {
      font-family: "Lato";
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      text-transform: capitalize;
      color: #505050;
    }
  }
}

:deep(.loading-inner) {
  margin-top: 50px;
  display: grid;
  justify-content: center;

  img {
    width: 100%;
    margin-left: 20px;
  }

  .listing-title {
    margin: 21px;
    font-weight: 700;
    text-align: center;
  }

  .add-patient-btn {
    background: $primary;
    color: $white !important;
  }
}

:deep(.q-tab__label) {
  text-transform: capitalize;
}

:deep(.q-separator) {
  margin: 0px 30px 0px 20px;
}

:deep(.q-chip__content) {
  display: flex;
  justify-content: center;
}

@media (max-width: 736px) {
  .action-btn-xs {
    width: 100%;
  }

  .appointment .action .detail-btn {
    margin-bottom: 0px !important;
    margin-right: 10px;
  }

  .title {
    margin-bottom: 10px;
  }
}

.add-patient-btn {
  text-transform: capitalize;
}

@media (max-width: 400px) {
  .dashboard {
    padding: 20px 10px;
  }

  .add-patient-btn {
    font-size: 12px;
  }

  :deep(.q-chip) {
    margin-bottom: 12px;
  }
}

.add-patient-btn:hover {
  background: $primary;
  color: $white !important;
}
</style>
