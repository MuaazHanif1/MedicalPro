<template>
  <q-form ref="form">
    <div class="row q-gutter-sm q-pa-md">
      <div class="col-md-4 col-12">
        <PhoneInput
          v-model="phone_number"
          @selected-country="onCountryChange"
          @searchPatient="search"
        ></PhoneInput>
      </div>
      <div class="col-md-6 col-12">
        <q-btn label="Verify" :loading="loading" @click="search" color="primary" />
      </div>
    </div>
  </q-form>
  <div class="q-pl-md q-pr-md">
    <q-table
      v-if="patients && patients.length && is_searched"
      :rows="patients"
      title="Patient Found"
      :columns="columns"
      row-key="name"
      hide-pagination
    >
      <template v-slot:top="">
        <div class="text-h6 patient-found">Patient Found</div>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <router-link
            :to="{ name: 'patient-detail', params: { id: props.row.id } }"
          >
            <q-chip class="light-green-chip" text-color="primary"
              >Select</q-chip
            >
          </router-link>
        </q-td>
      </template>
    </q-table>
  </div>
  <div v-if="!patients.length && is_searched">
    <p class="q-pl-md error">Patient does not exist. Register here</p>
    <q-btn
      class="q-ml-md green-background-btn"
      label="Register New Patient"
      @click="registerpop = true"
    ></q-btn>
    <RegisterPatient
      v-model="registerpop"
      :phone_number="phone_number"
      :phone="phoneProp"
      :defaultCountry="defaultCountry"
    ></RegisterPatient>
  </div>
</template>
<script setup>
import { ref,watch } from "vue";
import PhoneInput from '@/partials/PhoneInput.vue';
import {phone} from "@/composables/helper-functions";
import {usePracticeStore} from "@/store/practice";
import RegisterPatient from "@/partials/RegisterPatient.vue";

const registerpop = ref(false);
let is_searched = ref(false);
const phone_number = ref("");
let countryObj = "";
let patients = ref("");
let phoneProp = ref("");
let defaultCountry = ref("");
const form = ref('');
const store = usePracticeStore();
const loading = ref(false);

const onCountryChange = (country) => {
  countryObj = country;
  defaultCountry.value = country.dialCode;
};

const search =  () => {
  form.value.validate().then((success) => {
    if(success){
      loading.value = true;
      phoneProp.value = phone(countryObj, phone_number.value);
      const patientslist =  store.searchPatient(phoneProp.value);
      if(patientslist){
        patients.value = patientslist;
      }

      is_searched.value = true;
      loading.value = false;
    }
  });
};

const columns = [
  { name: "id", label: "Patient ID", align: "left", field: "id" },
  {
    name: "first_name",
    label: "Patient Name",
    align: "left",
    field: "first_name",
  },
  {
    name: "phone_number",
    label: "Phone Number",
    align: "left",
    field: "phone_number",
  },
  { name: "action", label: "Action", align: "left", field: "action" },
];

watch(phone_number, () => {
  is_searched.value = false;
})

</script>   
<style scoped lang="scss">
.error {
  color: red;
}
.light-green-chip {
  background: #ebf0ee !important;
  color: $primary;
  cursor: pointer;
}
:deep .patient-found {
  color: $primary !important;
}
:deep(.q-btn){
  height: 40px;
  min-width: 99px;
  border-radius: 6px;
  text-transform: capitalize;
}
</style>
