<template>
  <DataListing :rows="patients" :columns="patientlistheader" :pagination="pagination" :information="information"
    :loading="loading" @pagination-data="onRequest" class="pt-27"></DataListing>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { usePracticeStore } from "@/store/practice";
import DataListing from "@/partials/DataListing.vue";

const store = usePracticeStore();
const patients = ref([]);
const loading = ref(false);
const information = ref({
  heading: "All Patients",
  createbtn: {
    text: "Register New Patient",
    link: "patients/searchpatient",
  },
  detail_page_link: "patient-detail",
});
const patientlistheader = [
  { name: "index", label: "Sr. #", field: "index", align: "left" },
  {
    name: "first_name",
    label: "Patient Name",
    field: "first_name",
    align: "left",
  },
  { name: "patient_key", label: "ID", field: "patient_key", align: "left" },
  {
    name: "created_at",
    label: "Registered Date",
    field: "created_at",
    align: "left",
  },
  {
    name: "phone_number",
    label: "Contact Number",
    field: "phone_number",
    align: "left",
  },
  // {
  //   name: "updated_at",
  //   label: "Last Visit",
  //   field: "updated_at",
  //   align: "left",
  // },
  {
    name: "verified_phone_number",
    label: "Status",
    field: "verified_phone_number",
    align: "left",
  },
  { name: "actions", label: "Action", field: "actions", align: "left" },
];
const pagination = ref({
  page: 1,
  rowsPerPage: 15,
  rowsNumber: 15,
  last_page: 1
});
onMounted(async () => {
  loading.value = true;
  const patientlist = await store.getPracticePatients();
  patients.value = patientlist.data;
  pagination.value.rowsNumber = patientlist.total;
  pagination.value.page = patientlist.current_page;
  pagination.value.last_page = patientlist.last_page;
  loading.value = false;
});
const onRequest = async (req) => {
  loading.value = true;
  store.getPracticePatients({
    page: req.pagination && req.pagination.page ? req.pagination.page : req,
    pagination: req.pagination && req.pagination.rowsPerPage ? req.pagination.rowsPerPage : pagination.value.rowsPerPage
  }).then((res) => {
    patients.value = [];
    patients.value = res.data;
    pagination.value.rowsNumber = res.total;
    pagination.value.rowsPerPage = res.per_page;
    pagination.value.page = res.current_page;
    pagination.value.last_page = res.last_page;
    loading.value = false;
  });

};
</script>
