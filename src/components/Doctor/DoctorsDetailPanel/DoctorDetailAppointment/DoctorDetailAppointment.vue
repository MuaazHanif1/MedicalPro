<template>
  <div class="row justify-between mx-30 pt-27">
    <div>
      <span class="color-green mr-14 font-size-16 font-weight-600">Select Date</span>
      <q-icon size="1rem" name="event" class="calendar-icon" color="primary">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="calendarDate" mask="MM-DD-YYYY">
            <div class="row items-center justify-end">
              <q-btn @click="calendarData()" v-close-popup label="Select" color="primary" flat
                class="text-lower-case" />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </div>
    <div class="listing-title">
      {{moment(heading).format('DD MMMM, YYYY - dddd')}}
    </div>
  </div>
  <DataListing :rows="appointments" :columns="patientlistheader" :pagination="pagination" :information="information"
    :loading="loading" @pagination-data="onRequest">
    <template v-slot:date-slider>
      <div class="tabs-slider-parent">
        <q-tabs v-model="selected_date" active-color="primary" active-class="tab-slider-active"
          active-bg-color="lightsecondary" indicator-color="transparent" outside-arrows mobile-arrows
          @update:model-value="getAppointmentsByDate">
          <q-tab class="tab-slider column justify-center px-40" :name="moment(date).format('MM-DD-YYYY')"
            v-for="date in dates" :key="date">
            <span style="font-size: 12px;" class="text-capitalize">{{ new Date(date).toString().split(" ")[0] }}</span>
            <span style="font-size: 24px; line-height: 1;">{{ new Date(date).getDate() }}</span>
          </q-tab>
        </q-tabs>
      </div>
    </template>
  </DataListing>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { usePracticeStore } from "@/store/practice";
import DataListing from "@/partials/DataListing.vue";
import moment from "moment";
const route = useRoute();
const loading = ref(false);
const store = usePracticeStore();
const appointments = ref([]);
const calendarDate = ref(moment().format('MM-DD-YYYY'));
const selected_date = ref(moment().format('MM-DD-YYYY'));
const heading = ref(selected_date.value);
const information = ref({
  detail_page_link: "appointment-detail",
});
const patientlistheader = [
  // {
  //   name: "appointment_id",
  //   label: "ID",
  //   field: "appointment_id",
  //   align: "left",
  // },
  {
    name: "patient_id",
    label: "Patient Name",
    field: "patient_id",
    align: "left",
  },
  {
    name: "doctor_id",
    label: "Doctor Name",
    field: "doctor_id",
    align: "left",
  },
  { name: "start_time", label: "Start Time", field: "start_time", align: "left" },
  { name: "status", label: "Status", field: "status", align: "left" },
  { name: "actions", label: "Action", field: "actions", align: "left" },
];
const pagination = ref({
  page: 1,
  rowsPerPage: 15,
  rowsNumber: 15,
});

const docId = ref(route.params.id);

onMounted(async () => {
  loading.value = true;
  const appointmentlist = await store.getDoctorAppointmentList(docId.value,
    selected_date.value, pagination.value.page, pagination.value.rowsPerPage);
  appointments.value = appointmentlist.data;
  console.log("Doctor detail Appointment", appointments.value);
  pagination.value.rowsNumber = appointmentlist.total;
  pagination.value.page = appointmentlist.current_page;
  pagination.value.last_page = appointmentlist.last_page;
  loading.value = false;
});
const onRequest = async (req) => {
  heading.value = selected_date.value;
  console.log("ON REQUEST IS CALLED", req);
  loading.value = true;
  //   console.log(req);
  if (req.pagination && req.pagination.page != undefined) {
    store
      .getDoctorAppointmentList(docId.value, selected_date.value,
        req.pagination && req.pagination.page ? req.pagination.page : req,
        req.pagination && req.pagination.rowsPerPage ? req.pagination.rowsPerPage : pagination.value.rowsPerPage,
      )
      .then((res) => {
        appointments.value = [];
        appointments.value = res.data;
        pagination.value.rowsNumber = res.total;
        pagination.value.rowsPerPage = res.per_page;
        pagination.value.page = res.current_page;
        pagination.value.last_page = res.last_page;
        loading.value = false;
      });
  }
};
const dates = computed(() => {
  let startDate = new Date(new Date());
  var endDate = new Date();
  endDate.setDate(endDate.getDate() + 365);
  let date = new Date(startDate.getTime());
  let dates = [];
  while (date <= endDate) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return dates;
});

const getAppointmentsByDate = () => {
  // heading.value = moment(selected_date.value).format('DD MMMM, YYYY - dddd');
  heading.value = selected_date.value;
  loading.value = true;
  store.getDoctorAppointmentList(docId.value, selected_date.value).then((res) => {
    appointments.value = [];
    appointments.value = res.data;
    pagination.value.rowsNumber = res.total;
    pagination.value.page = res.current_page;
    loading.value = false;
  });
};

const calendarData = async () => {
  // 
  heading.value = calendarDate.value;
  // deselect the table date
  selected_date.value = null;
  // API call
  loading.value = true;
  const appointmentlist = await store.getDoctorAppointmentList(docId.value,
    calendarDate.value, pagination.value.page, pagination.value.rowsPerPage);
  appointments.value = appointmentlist.data;
  console.log("Doctor detail Appointment", appointments.value);
  pagination.value.rowsNumber = appointmentlist.total;
  pagination.value.page = appointmentlist.current_page;
  pagination.value.last_page = appointmentlist.last_page;
  loading.value = false;

}

watch(calendarDate, (newValue) => {
  console.log("DATE CHANGED BY CALENDAR", newValue);
})
</script>

<style scoped lang="scss">
:deep(.tab-slider) {
  width: 128px;
  height: 67px;
  background: #ffffff;
  border-radius: 8px;
  margin: 5px;
}

:deep(.tab-slider-active) {
  font-weight: bolder !important;
}

:deep(.q-tabs--horizontal .q-tabs__arrow) {
  margin-top: 15px;
}

// :deep(.q-tab__content){
//   width: 128px;
// }
:deep(.q-tabs--scrollable.q-tabs__arrows--outside.q-tabs--horizontal) {
  padding: 0px;
}

:deep(.q-tabs--horizontal .q-tabs__arrow) {
  margin-left: -30px;
  margin-right: -30px;
}

:deep(.listing-title) {
  font-family: "Lato";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  color: #0d0c22;
}

:deep .calendar-icon {
  background: #ebf0ee;
  border-radius: 8px;
  font-size: 32px;
  padding: 5px;
  cursor: pointer;
}
</style>
