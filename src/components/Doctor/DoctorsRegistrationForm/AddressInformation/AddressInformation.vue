<template>
  <q-form ref="form" class="full-width" style="max-width: 600px" :class="$q.screen.lt.md ? 'q-mx-auto' : ''"
    :greedy="true">
    <!--current address-->
    <div>
      <div class="mb-44">
        <div class="row justify-start items-center">
          <span class="heading">Current address</span>
        </div>
        <i class="sub-heading q-mt-md">Provide information about address</i>
      </div>

      <div class="row" :class="
        $q.screen.lt.sm
          ? 'q-col-gutter-y-xs q-mt-lg'
          : 'q-col-gutter-x-lg q-mt-md'
      ">
        <div class="col-sm-6 col-12">
          <UserInput :label="'Address line 1'" :dataModel="array[0].current_address_1" :placeHolder="'Enter address'"
            :mainproperty="mainproperty" :innerProperty="'current_address_1'" :arrayindex="0" :rules="[rules.required]"
            @update="updateProperty"></UserInput>
        </div>
        <div class="col-sm-6 col-12">
          <UserInput :label="'Address line 2'" :dataModel="array[0].current_address_2" :placeHolder="'Enter address'"
            :arrayindex="0" :innerProperty="'current_address_2'" :mainproperty="mainproperty" :rules="[rules.required]"
            @update="updateProperty"></UserInput>
        </div>
      </div>
      <div class="row" :class="
        $q.screen.lt.sm
          ? 'q-col-gutter-y-xs q-mt-sm'
          : 'q-col-gutter-x-lg q-mt-md'
      ">
        <div class="col-sm-6 col-12">
          <UserInput label="Country" :option="storeGeneral.countries" :placeHolder="'Enter country'" :arrayindex="0"
            :dataModel="array[0].current_country_id" :innerProperty="'current_country_id'" :mainproperty="mainproperty"
            :inputType="'single-selector'" :rules="[rules.required]" @update="updateProperty"></UserInput>
        </div>
        <div class="col-sm-6 col-12">
          <UserInput :label="'State'" :option="
            store.doctor_country_state_country_information.current
              .current_state
          " :dataModel="array[0].current_state_id" :placeHolder="'Enter state'" :inputType="'single-selector'"
            :arrayindex="0" :innerProperty="'current_state_id'" :isDisable="store.getCurrentCountry"
            :mainproperty="mainproperty" :rules="[rules.required]" @update="updateProperty"></UserInput>
        </div>
      </div>
      <div class="row" :class="
        $q.screen.lt.sm
          ? 'q-col-gutter-y-xs q-mt-sm'
          : 'q-col-gutter-x-lg q-mt-md'
      ">
        <div class="col-sm-6 col-12">
          <UserInput :label="'City'" innerProperty="current_city_id" :option="
            store.doctor_country_state_country_information.current
              .current_city
          " :placeHolder="'Enter city'" :inputType="'single-selector'" :dataModel="array[0].current_city_id"
            :arrayindex="0" :isDisable="store.getCurrentState" :mainproperty="mainproperty" :rules="[rules.required]"
            @update="updateProperty"></UserInput>
        </div>
        <div class="col-sm-6 col-12">
          <UserInput :label="'Zip code'" :dataModel="array[0].current_zip_code" innerProperty="current_zip_code"
            :placeHolder="'Enter zip code'" :arrayindex="0" :mainproperty="mainproperty"
            :rules="[rules.required, rules.alphanumeric]" @update="updateProperty"></UserInput>
        </div>
      </div>
    </div>
    <!--*************current address End********************-->

    <!--hometown address-->

    <div class="mt-50">
      <div class="mb-44">
        <div class="row justify-start items-center">
          <span class="heading">Hometown address </span>
        </div>

      </div>

      <div class="row " :class="
        $q.screen.lt.sm
          ? 'q-col-gutter-y-xs q-mt-lg'
          : 'q-col-gutter-x-lg q-mt-md'
      ">
        <div class="col-sm-6 col-12">
          <UserInput :label="'Address line 1'" :dataModel="array[1].home_town_address_1" :placeHolder="'Enter address'"
            :mainproperty="mainproperty" :innerProperty="'home_town_address_1'" :arrayindex="1"
            :rules="[rules.required]" @update="updateProperty"></UserInput>
        </div>
        <div class="col-sm-6 col-12">
          <UserInput :label="'Address line 2'" :dataModel="array[1].home_town_address_2" :placeHolder="'Enter address'"
            :arrayindex="1" :innerProperty="'home_town_address_2'" :mainproperty="mainproperty"
            :rules="[rules.required]" @update="updateProperty"></UserInput>
        </div>
      </div>
      <div class="row" :class="
        $q.screen.lt.sm
          ? 'q-col-gutter-y-xs q-mt-sm'
          : 'q-col-gutter-x-lg q-mt-md'
      ">
        <div class="col-sm-6 col-12">
          <UserInput label="Country" :option="storeGeneral.countries" :placeHolder="'Enter country'" :arrayindex="1"
            :dataModel="array[1].home_town_country_id" :inputType="'single-selector'"
            :innerProperty="'home_town_country_id'" :mainproperty="mainproperty" :rules="[rules.required]"
            @update="updateProperty"></UserInput>
        </div>
        <div class="col-sm-6 col-12">
          <UserInput :label="'State'" :option="
            store.doctor_country_state_country_information.hometown
              .hometown_state
          " :placeHolder="'Enter state'" :inputType="'single-selector'" :arrayindex="1"
            :dataModel="array[1].home_town_state_id" :innerProperty="'home_town_state_id'"
            :isDisable="store.getHometownCountry" :mainproperty="mainproperty" :rules="[rules.required]"
            @update="updateProperty"></UserInput>
        </div>
      </div>
      <div class="row" :class="
        $q.screen.lt.sm
          ? 'q-col-gutter-y-xs q-mt-sm'
          : 'q-col-gutter-x-lg q-mt-md'
      ">
        <div class="col-sm-6 col-12">
          <UserInput :label="'City'" innerProperty="home_town_city_id" :option="
            store.doctor_country_state_country_information.hometown
              .hometown_city
          " :placeHolder="'Enter city'" :inputType="'single-selector'" :arrayindex="1"
            :dataModel="array[1].home_town_city_id" :isDisable="store.getHometownState" :mainproperty="mainproperty"
            :rules="[rules.required]" @update="updateProperty"></UserInput>
        </div>
        <div class="col-sm-6 col-12">
          <UserInput :label="'Zip code'" :dataModel="array[1].home_town_zip_code" innerProperty="home_town_zip_code"
            :placeHolder="'Enter zip code'" :arrayindex="1" :mainproperty="mainproperty"
            :rules="[rules.required, rules.alphanumeric]" @update="updateProperty"></UserInput>
        </div>
      </div>
    </div>

    <!--hometown address End-->
  </q-form>
</template>

<script setup>
//import DoctorInformation from "./DoctorInformation.vue";
//import { useDoctorsRegistrationStore } from "@/store/doctors_registration.js";
import {
  defineProps,
  defineExpose,
  ref,
  onMounted,
  watch,
  // computed,
} from "vue";
import { useGeneralStore } from "@/store/general";
import { useDoctorsRegistrationStore } from "@/store/doctors_registration";
import UserInput from "@/partials/UserInput.vue";
onMounted(async () => {
  store.doctor_country_state_country_information.country =
    storeGeneral.countries;
});
const form = ref(null);

const storeGeneral = useGeneralStore();
const store = useDoctorsRegistrationStore();

const updateProperty = (value) => {
  store.updatingDoctorsRegistrationFormValue(value);
};
// const currentCountryNameById = computed(()=>{

// })
defineProps({
  mainproperty: {
    default: "none",
  },
  index: {
    default: 1,
    type: Number,
  },
  array: {
    type: Array,
  },
});

defineExpose({
  form,
});

watch(
  () => store.doctorRegistrationFormData.address[0].current_country_id,
  async (valueN) => {
    store.doctorRegistrationFormData.address[0].current_state_id = "";
    store.doctorRegistrationFormData.address[0].current_city_id = "";

    if (valueN > 0) {
      store.doctor_country_state_country_information.current.current_state =
        await storeGeneral.getStateRequest(valueN);
    }
  },
  { deep: true }
);
watch(
  () => store.doctorRegistrationFormData.address[0].current_state_id,
  async (valueN) => {
    store.doctorRegistrationFormData.address[0].current_city_id = "";
    if (valueN > 0) {
      store.doctor_country_state_country_information.current.current_city =
        await storeGeneral.getCityRequest(valueN);
    }
  },
  { deep: true }
);
watch(
  () => store.doctorRegistrationFormData.address[1].home_town_country_id,
  async (valueN) => {
    store.doctorRegistrationFormData.address[1].home_town_state_id = "";
    store.doctorRegistrationFormData.address[1].home_town_city_id = "";

    if (valueN > 0) {
      store.doctor_country_state_country_information.hometown.hometown_state =
        await storeGeneral.getStateRequest(valueN);
    }
  },
  { deep: true }
);
watch(
  () => store.doctorRegistrationFormData.address[1].home_town_state_id,
  async (valueN) => {
    store.doctorRegistrationFormData.address[1].home_town_city_id = "";
    if (valueN > 0) {
      store.doctor_country_state_country_information.hometown.hometown_city =
        await storeGeneral.getCityRequest(valueN);
    }
  },
  { deep: true }
);
</script>

<style scoped lang="scss">
.heading {
  font-family: "Lato";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  /* identical to box height */

  /* Text */

  color: #0d0c22;
}

.sub-heading {
  font-family: "Lato";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 12px;
  /* identical to box height, or 92% */
  display: block;
  text-transform: capitalize;

  /* Text 2 */

  color: #7d8693;
}

.drop-down {
  width: 562px;
  height: 57px;
  border: 1px dashed #d2d5e0;
  border-radius: 12px;
}

.drop-down-button {
  width: 34px;
  height: 34px;
  left: 168px;
  top: 11.5px;
  background: #ecefed;
  border-radius: 12px;
  cursor: pointer;

  .drop-down-button-text {
    font-family: "lato";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 140%;
    color: #0d0c22;
  }
}
</style>
