<template>
  <DataListing :rows="doctors" :columns="doctorlistheader" :pagination="pagination" :information="information"
    :loading="loading" @pagination-data="onRequest" @toggle-DialogBox="registerpop = true" class="pt-27"></DataListing>
  <RegisterDoctor v-model="registerpop"></RegisterDoctor>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { usePracticeStore } from "@/store/practice";
import RegisterDoctor from "@/partials/RegisterDoctor.vue";
import DataListing from "@/partials/DataListing.vue";
const store = usePracticeStore();
const loading = ref(false);
const doctors = ref([]);
const registerpop = ref(false);
const information = ref({
  heading: "All Doctors",
  isSimpleButton: true,
  text: "Register New Doctor",
  detail_page_link: "doctor-detail",
});
const doctorlistheader = [
  { name: "index", label: "Sr. #", field: "index", align: "left" },
  {
    name: "first_name",
    label: "Doctor Name",
    field: "first_name",
    align: "left",
  },
  { name: "id", label: "ID", field: "id", align: "left" },
  {
    name: "created_at",
    label: "Registered Date",
    field: "created_at",
    align: "left",
  },
  {
    name: "primary_phone_number",
    label: "Contact Number",
    field: "primary_phone_number",
    align: "left",
  },
  {
    name: "specializations",
    label: "Specialization",
    field: "doctor_specializations",
    align: "left",
  },
  {
    name: "kyc_status",
    label: "Kyc Status",
    field: "kyc_status",
    align: "left",
  },
  {
    name: "active",
    label: "Status",
    field: "is_active",
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
  const doctorlist = await store.requestDoctorList({ page: 1, pagination: 15 });
  doctors.value = doctorlist.doctors;
  pagination.value.rowsNumber = doctorlist.meta.total;
  pagination.value.page = doctorlist.meta.current_page;
  pagination.value.last_page = doctorlist.meta.last_page;
  loading.value = false;
});

const onRequest = async (req) => {
  loading.value = true;
  const returnedData = await store.requestDoctorList({
    page: req.pagination && req.pagination.page ? req.pagination.page : req,
    pagination: req.pagination && req.pagination.rowsPerPage ? req.pagination.rowsPerPage : pagination.value.rowsPerPage
  });
  const data = returnedData.doctors;
  doctors.value = [];
  doctors.value = data;
  pagination.value.rowsNumber = returnedData.meta.total;
  pagination.value.rowsPerPage = returnedData.meta.per_page;
  pagination.value.page = returnedData.meta.current_page;
  pagination.value.last_page = returnedData.meta.last_page;
  loading.value = false;
};
</script>

<style scoped lang="scss">
:deep .status-chip-active {
  background: $dark-green;
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  color: $white;
}

:deep .status-chip {
  background: #b5b7b6;
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  color: $white;
}

.status-kyc {
  background: #d7816a;
  border-radius: 10px;
}

:deep tr {
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid #f6f6f8;
  border-radius: 5px;
}

:deep .add-patient-btn {
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid #f6f6f8;
  border-radius: 4px;
  font-family: "Lato";
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
}

:deep .add-patient-btn:hover {
  color: white !important;
  background: $dark-green !important;
}
</style>
