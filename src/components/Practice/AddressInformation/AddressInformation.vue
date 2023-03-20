<template>
  <q-form ref="form" class="full-width" style="max-width: 600px" :class="$q.screen.lt.md ? 'q-mx-auto' : ''"
    :greedy="true">
    <div class="mb-44">
      <div class="row justify-start items-center">
        <span class="heading">{{ label }}</span>
      </div>
      <i class="sub-heading q-mt-md">{{ subLabel }}</i>
    </div>

    <div class="row" :class="
      $q.screen.lt.sm
        ? 'q-col-gutter-y-xs q-mt-lg'
        : 'q-col-gutter-x-lg q-mt-md'
    ">
      <div class="col-sm-6 col-12">
        <UserInput :label="'Address line 1'" :dataModel="object.address_line_1" :placeHolder="'Enter address'"
          :mainproperty="mainproperty" innerProperty="address_line_1" @update="updateValue" :rules="[rules.required]">
        </UserInput>
      </div>
      <div class="col-sm-6 col-12">
        <UserInput :label="'Address line 2'" :dataModel="object.address_line_2" :placeHolder="'Enter address'"
          innerProperty="address_line_2" :mainproperty="mainproperty" @update="updateValue" :rules="[rules.required]">
        </UserInput>
      </div>
    </div>
    <div class="row" :class="
      $q.screen.lt.sm
        ? 'q-col-gutter-y-xs q-mt-sm'
        : 'q-col-gutter-x-lg q-mt-sm'
    ">
      <div class="col-sm-6 col-12">
        <UserInput label="Country" :option="storeGeneral.countries" :placeHolder="'Enter country'"
          :dataModel="object.country_id" :inputType="'single-selector'" :innerProperty="'country_id'"
          :mainproperty="mainproperty" :rules="[rules.required]" @update="updateProperty"></UserInput>
      </div>
      <div class="col-sm-6 col-12">
        <UserInput :label="'State'" :dataModel="object.state_id" :option="storeGeneral.states"
          :isDisable="object.country_id" :placeHolder="'Enter state'" :inputType="'single-selector'" :isInput="false"
          :innerProperty="'state_id'" :mainproperty="mainproperty" @update="updateProperty" :rules="[rules.required]">
        </UserInput>
      </div>
    </div>
    <div class="row" :class="
      $q.screen.lt.sm
        ? 'q-col-gutter-y-xs q-mt-sm'
        : 'q-col-gutter-x-lg q-mt-sm'
    ">
      <div class="col-sm-6 col-12">
        <UserInput :label="'City'" :dataModel="object.city_id" :placeHolder="'Enter  city'" :isDisable="object.state_id"
          :option="storeGeneral.cities" :inputType="'single-selector'" :innerProperty="'city_id'" :isInput="false"
          :mainproperty="mainproperty" @update="updateProperty" :rules="[rules.required]"></UserInput>
      </div>
      <div class="col-sm-6 col-12">
        <UserInput :label="'Zip code'" :dataModel="object.zip_code" innerProperty="zip_code_id"
          :placeHolder="'Enter zip code'" :mainproperty="mainproperty" @update="updateValue"
          :rules="[rules.required, rules.number]"></UserInput>
      </div>
    </div>
    <div class="row" :class="
      $q.screen.lt.sm
        ? 'q-col-gutter-y-xs q-mt-sm'
        : 'q-col-gutter-x-lg q-mt-sm'
    ">
      <div class="col-sm-6 col-12">
        <UserInput :label="'Location'" :dataModel="object.location" :placeHolder="'Add your location'" :icon="true"
          :isInput="false" :mainproperty="mainproperty"></UserInput>
      </div>
    </div>
  </q-form>
</template>

<script setup>
import { defineProps, ref, defineExpose, onMounted, watch } from "vue";
import { useGeneralStore } from "@/store/general";
import { usePracticeStore } from "@/store/practice";
import UserInput from "@/partials/UserInput.vue";


defineProps({
  mainproperty: {
    default: "none",
  },
  label: {
    default: "",
    type: String,
  },
  subLabel: {
    default: "",
    type: String,
  },
  index: {
    default: 1,
    type: Number,
  },
  object: {
    type: Object,
  },
});
onMounted(async () => {
  storePractice.practice_country_state_country_information.country = await storeGeneral.getCountryRequest();
});
const form = ref(null);
const storeGeneral = useGeneralStore();
const storePractice = usePracticeStore();
const updateValue = (data) => {
  storePractice.updatingPracticeRegistrationFormValue(data);
};
defineExpose({
  form,
});
const updateProperty = (value) => {
  storePractice.updatingPracticeRegistrationFormValue(value);
};
watch(
  () => storePractice.practiceRegistrationFormData.address.country_id,
  async (newvalue) => {
    storePractice.practiceRegistrationFormData.address.state_id = ""
    storePractice.practiceRegistrationFormData.address.city_id = ""
    storePractice.practice_country_state_country_information.address.address_state = await storeGeneral.getStateRequest(newvalue);
  }
);
watch(
  () => storePractice.practiceRegistrationFormData.address.state_id,
  async (newvalue) => {
    storePractice.practiceRegistrationFormData.address.city_id = ""
    storePractice.practice_country_state_country_information.address.address_city = await storeGeneral.getCityRequest(newvalue);
  }
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
