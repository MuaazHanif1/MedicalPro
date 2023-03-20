<template>
  <div>
    <DataListing :rows="doctors" :columns="patientlistheader" :pagination="pagination" :information="information"
      @pagination-data="onRequest" @toggle-DialogBox="toggleDialogBox"
      @toggle-PublishedDialogBox="togglePublishedDialogBox" class="pt-27"></DataListing>

    <q-dialog v-model="medium" persistent>
      <q-card style="width: 600px; max-width: 80vw">
        <div class="row justify-between">
          <q-card-section class="row items-center">
            <div class="lato-heading">Create New Slot</div>
          </q-card-section>
          <q-card-section>
            <q-btn flat round icon="close" v-close-popup />
          </q-card-section>
        </div>
        <q-form ref="form">
          <q-card-section class="q-pt-none">
            <div class="row q-col-gutter-x-lg">
              <div class="col">
                <UserInput :label="'Slot From'" :placeHolder="'Enter Date'" :arrayindex="index"
                  :innerProperty="'date_from'" :inputType="'date'" :dataModel="creatingSloteData.date_from"
                  dateLimited="upper then current date" :defineDateLimit="creatingSloteData.date_from"
                  :rules="[rules.required]" @update="updateProperty"></UserInput>
              </div>
              <div class="col">
                <UserInput :label="'Slot to'" :placeHolder="'Enter Date'" :arrayindex="index" :innerProperty="'date_to'"
                  :inputType="'date'" dateLimited="upper then current date" :isDisable="creatingSloteData.date_from"
                  :dataModel="creatingSloteData.date_to" :defineDateLimit="creatingSloteData.date_to"
                  :rules="[rules.required]" @update="updateProperty"></UserInput>

              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="row q-col-gutter-x-lg">
              <div class="col">
                <UserInput :label="'Time From'" :innerProperty="'time_from'" :inputType="'time'"
                  :mainproperty="mainproperty" :placeHolder="'Enter Time'" :dataModel="creatingSloteData.time_from"
                  :rules="[rules.required]" @update="updateProperty"></UserInput>
              </div>
              <div class="col">
                <UserInput :label="'Time to'" :innerProperty="'time_to'" :inputType="'time'" :placeHolder="'Enter Time'"
                  :mainproperty="mainproperty" :dataModel="creatingSloteData.time_to" :rules="[rules.required]"
                  @update="updateProperty"></UserInput>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="row q-col-gutter-x-lg">
              <div class="col-6">
                <UserInput :label="'Slot Duration'" :innerProperty="'slot_time'" :inputType="'input-append-slot'"
                  :placeHolder="'Enter Slot Duration'" :mainproperty="mainproperty"
                  :dataModel="creatingSloteData.slot_time" :rules="[rules.required]" @update="updateProperty">
                </UserInput>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="row q-col-gutter-x-lg">
              <div class="col">
                <div><span>Available Days</span></div>
                <div class="row q-gutter-sm mt-15">
                  <div v-for="(element, index) in days" :key="index">
                    <q-checkbox v-model="daysSelected" :dense="true" size="80px" :val="element">
                      <template #default>
                        <div class="custom-checkbox">
                          <span>{{ element.slice(0, 3) }}</span>
                        </div>
                      </template>
                    </q-checkbox>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-actions class="bg-white text-teal">
            <div class="width-100 justify-end row mr-20 mb-30">
              <q-btn color="primary" label="Create" class="q-p-md px-30 text-lower-case" size="md"
                @click.stop="creatingSlote" />
            </div>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="doctorPublishedStatusDialog" no-backdrop-dismiss>
      <q-card class="px-14" style="width: 600px">
        <q-card-section class="row items-center q-pb-none">
          <div class="dark-black medium-font">Change slot status</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class=" column flex col-sm-6 col-12 self-end">
            <FormInput class="col-sm-6 col-12" :class="$q.screen.lt.sm ? 'pr-0 mt-20' : ''" :isInput="false"
              :option="statusOptions" label="Doctor slot status" inputType="select" v-model="doctorSlotStatus"
              :isDisable="isPerformingModal" />
          </div>

          <div class="flex justify-end mt-28">
            <q-btn color="primary" :loading="isSaving" @click="changeDoctorSlotTypeStatus" size="md"
              class="q-p-md px-20 text-lower-case">
              Change
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps } from "vue";
import { usePracticeStore } from "@/store/practice";
import { useDoctorsRegistrationStore } from "@/store/doctors_registration";
import DataListing from "@/partials/DataListing.vue";
import UserInput from "@/partials/UserInput.vue";
import FormInput from "@/partials/FormInput.vue";
import { useRoute } from "vue-router";
import { date, useQuasar } from "quasar";
import moment from "moment";

onMounted(async () => {
  doctorDetailSlotsList();
});
const props = defineProps({
  isDoctorActive: {
    default: false,
    type: Boolean
  }
})
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const statusOptions = ['Published', 'Unpublished'];
const doctorSlotStatus = ref('Unpublished')
const doctorSlotId = ref('')
const route = useRoute();
const form = ref(null);
// const $q = useQuasar();
const medium = ref(false);
const doctorPublishedStatusDialog = ref(false);
const daysSelected = ref([]);
const store = usePracticeStore();
const storeDoctor = useDoctorsRegistrationStore();
let doctors = ref([]);
let creatingSloteData = ref({
  date_from: date.formatDate(Date.now(), "DD MMMM YYYY"),
  date_to: date.formatDate(
    date.addToDate(Date.now(), { days: 1 }),
    "DD MMMM YYYY"
  ),
  time_from: date.formatDate(Date.now(), "hh:mm A"),
  time_to: "",
  slot_time: "",
  days: [],
  doctor_id: 0,
});
const information = ref({
  heading: "Available Slots",
  isSimpleButton: props.isDoctorActive,
  text: "Create New Slot",
  detail_page_link: "docotor-detail-slots",
});
const patientlistheader = [
  {
    name: "slotfrom_slotto",
    label: "Slot from - Slot to",
    field: "slotfrom_slotto",
    align: "left",
  },
  {
    name: "timefrom_timeto",
    label: "Time from - Time to",
    field: "timefrom_timeto",
    align: "left",
  },
  {
    name: "slotduration",
    label: "Slot Duration",
    field: "phone_number",
    align: "left",
  },
  {
    name: "availabledays",
    label: "Available Days",
    field: "updated_at",
    align: "left",
  },
  {
    name: "status_doctor_detail",
    label: "Status",
    field: "status_doctor_detail",
    align: "left",
  },
  { name: "actions", label: "Action", field: "actions", align: "left" },
];
const $q = useQuasar();
const pagination = ref({
  page: 1,
  rowsPerPage: 15,
  rowsNumber: 15,
});

//date.formatDate(
// date.subtractFromDate(Date.now(), { years: 18 }),
//         "DD MMMM YYYY"
//       ),
const toggleDialogBox = () => {
  medium.value = !medium.value;
};
const togglePublishedDialogBox = (data, id) => {
  doctorSlotStatus.value = data
  doctorSlotId.value = id
  doctorPublishedStatusDialog.value = !doctorPublishedStatusDialog.value
}
const changeDoctorSlotTypeStatus = async () => {
  if (doctorSlotStatus.value.toLocaleLowerCase() == 'unpublished') {
    await store.doctorDeactivateSlot({ doctor_id: route.params.id, id: doctorSlotId.value }).then((response) => {
      $q.notify({
        type: "postivie",
        position: "top-right",
        color: "primary",
        avatar: require("@/assets/svg/success-toast-icon.svg"),
        message: "Slot Deactivate",
      });
      doctors.value.filter((cur) => cur.id == response.data.id)[0].status_doctor_detail = false
    }).catch(() => {
      $q.notify({
        color: "red-5",
        position: "top-right",
        textColor: "white",
        icon: "warning",
        message: `Request not accepted`,
      });
    }).finally(() => {

      doctorPublishedStatusDialog.value = false
    })
  }
  else {
    await store.doctorPublishSlot({ doctor_id: route.params.id, ids: [doctorSlotId.value] }).then((response) => {
      $q.notify({
        type: "postivie",
        position: "top-right",
        color: "primary",
        avatar: require("@/assets/svg/success-toast-icon.svg"),
        message: "Slot Publish",
      });
      doctors.value.filter((cur) => cur.id == response.data[0].id)[0].status_doctor_detail = true
    }).catch(() => {
      $q.notify({
        color: "red-5",
        position: "top-right",
        textColor: "white",
        icon: "warning",
        message: `Request not accepted`,
      });

    }).finally(() => {
      doctorPublishedStatusDialog.value = false
    })
  }

}
const updateProperty = (data) => {
  creatingSloteData.value[data.property] = data.updatedData;
};
const setDataFormat = (data) => {
  const tempArray = [];
  data.forEach((element) => {
    const data = {
      slotfrom_slotto: setDateFormatForView(element.date_from, element.date_to),
      timefrom_timeto: getTimeFormat(element.time_from, element.time_to),
      slotduration: `${element.slot_time} minutes`,
      availabledays: element.days
        .map((cur) => cur.day.slice(0, 3))
        .toString()
        .replaceAll(",", "-"),
      status_doctor_detail: element.status,
      id: element.id
    };
    tempArray.push(data);
  });
  doctors.value = tempArray;
};
const creatingSlote = async () => {
  form.value
    .validate()
    .then(async (success) => {
      if (success) {
        if (daysSelected.value.length == 0) throw 'need all input' //validation for the days 
        medium.value = false;
        creatingSloteData.value.days = daysSelected.value;
        creatingSloteData.value.doctor_id = route.params.id;
        creatingSloteData.value.date_from = storeDoctor.getDateFormat(
          creatingSloteData.value.date_from
        );
        creatingSloteData.value.date_to = storeDoctor.getDateFormat(
          creatingSloteData.value.date_to
        );

        await store
          .requestToCreateNewSloteForDoctorDetail(creatingSloteData.value)
          .then(() => {
            doctorDetailSlotsList();
            $q.notify({
              type: "postivie",
              position: "top-right",
              color: "primary",
              avatar: require("@/assets/svg/success-toast-icon.svg"),
              message: "Slot Created successfully",
            });
          })
          .catch(() => {
            $q.notify({
              color: "red-5",
              position: "top-right",
              textColor: "white",
              icon: "warning",
              message: `Try Again Some Thing Went Wrong`,
            });
          });

        creatingSloteData.value = {
          date_from: date.formatDate(Date.now(), "DD MMMM YYYY"),
          date_to: "",
          time_from: date.formatDate(Date.now(), "hh:mm A"),
          time_to: "",
          slot_time: "",
          days: [],
          doctor_id: 0,
        };
      }
    })
    .catch(() => {
      $q.notify({
        color: "red-5",
        position: "top-right",
        textColor: "white",
        icon: "warning",
        message: `Require all input`,
      });
    });
};
const onRequest = async (req) => {
  if (req.pagination && req.pagination.page != undefined) {
    store.getPracticePatients(req.pagination.page).then((res) => {
      doctors.value = [];
      doctors.value = res.data;
      pagination.value.page = req.pagination.page;
      pagination.value.rowsPerPage = req.pagination.rowsPerPage;
    });
  }
};
const doctorDetailSlotsList = async () => {
  const response = await store.fetchDoctorDetailSlotsList(route.params.id);
  if (response.status == 200) {
    response.data.data.length && setDataFormat(response.data.data);
    pagination.value.rowsNumber = response.data.meta.per_page;
    pagination.value.page = response.data.meta.current_page;
  }
};

const getTimeFormat = (time_from, time_to) => {
  let time = `${moment(time_from, ["HH:mm"]).format("hh:mm a")} - ${moment(
    time_to,
    ["HH:mm"]
  ).add(1, 'minutes').format("hh:mm a")
    } `;
  return time;
};
const setDateFormatForView = (date_from, date_to) => {
  let time = `${moment(date_from).format('D MMM YYYY')} - ${moment(date_to).format('D MMM YYYY')
    } `;
  return time;
}
//this watcher watching the from date for the calender and set to date always greater then from date
watch(
  () => creatingSloteData.value.date_from,
  (value, oldValue) => {
    (!value) && (creatingSloteData.value.date_from = oldValue) && (value = oldValue) // if the watching date is null then this condition is run
    creatingSloteData.value.date_to = date.formatDate(
      date.addToDate(new Date(value), { days: 1 }),
      "DD MMMM YYYY"
    );
  }
);
</script>
<style scoped lang="scss">
.text-lower-case {
  text-transform: none !important;
}

:deep(.q-checkbox__inner) {
  display: none;
}

.custom-checkbox {
  border: 1px solid $grey-3;
  border-radius: 50%;
  display: grid;
  place-items: center;
  padding: 13px 5px;
  border-radius: 50%;
  width: 50px;
  color: $grey-8;
  background: $grey-3;
}

:deep(.q-checkbox__inner--truthy + .q-checkbox__label .custom-checkbox) {
  border: 1px solid $primary !important;
  background: $primary;
  color: $white;
}
</style>
