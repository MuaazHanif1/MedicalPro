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
          :mainproperty="mainproperty" innerProperty="billing_address_line_1" @update="updateProperty"
          :rules="[rules.required]">
        </UserInput>
      </div>
      <div class="col-sm-6 col-12">
        <UserInput :label="'Address line 2'" :dataModel="object.address_line_2" :placeHolder="'Enter address'"
          innerProperty="billing_address_line_2" :mainproperty="mainproperty" @update="updateProperty"
          :rules="[rules.required]">
        </UserInput>
      </div>
    </div>
    <div class="row" :class="
      $q.screen.lt.sm
        ? 'q-col-gutter-y-xs q-mt-sm'
        : 'q-col-gutter-x-lg q-mt-md'
    ">
      <div class="col-sm-6 col-12">
        <UserInput label="Country" :option="storeGeneral.countries" :placeHolder="'Enter country'"
          :dataModel="object.billing_country_id" :inputType="'single-selector'" :innerProperty="'billing_country_id'"
          :mainproperty="mainproperty" :rules="[rules.required]" @update="updateProperty"></UserInput>
      </div>
      <div class="col-sm-6 col-12">
        <UserInput :label="'State'" :dataModel="object.billing_state_id" :option="storeGeneral.states"
          :isDisable="object.billing_country_id" :placeHolder="'Enter state'" :inputType="'single-selector'"
          :isInput="false" :innerProperty="'billing_state_id'" :mainproperty="mainproperty" @update="updateProperty"
          :rules="[rules.required]"></UserInput>
      </div>
    </div>
    <div class="row" :class="
      $q.screen.lt.sm
        ? 'q-col-gutter-y-xs q-mt-sm'
        : 'q-col-gutter-x-lg q-mt-md'
    ">
      <div class="col-sm-6 col-12">
        <UserInput :label="'City'" :dataModel="object.billing_city_id" :placeHolder="'Enter city'"
          :isDisable="object.billing_state_id" :option="storeGeneral.cities" :inputType="'single-selector'"
          :innerProperty="'billing_city_id'" :isInput="false" :mainproperty="mainproperty" @update="updateProperty"
          :rules="[rules.required]"></UserInput>
      </div>
      <div class="col-sm-6 col-12">
        <UserInput :label="'Zip code'" :dataModel="object.billing_zip_code" :placeHolder="'Enter zip code'"
          :mainproperty="mainproperty" :rules="[rules.required, rules.number]"></UserInput>
      </div>
    </div>
    <div class="row" :class="
      $q.screen.lt.sm
        ? 'q-col-gutter-y-xs q-mt-sm'
        : 'q-col-gutter-x-lg q-mt-md'
    ">
      <div class="col-sm-6 col-12">
        <UserInput :label="'Location'" :dataModel="object.billing_location" :placeHolder="'Enter billing location'"
          :icon="true" :isInput="false" :mainproperty="mainproperty"></UserInput>
      </div>
    </div>
  </q-form>
</template>

<script setup>
import { defineProps, ref, defineExpose, watch } from "vue";
import { useGeneralStore } from "@/store/general";
import { usePracticeStore } from "@/store/practice";
import UserInput from "@/partials/UserInput.vue";

defineProps({
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
    default: false,
    type: Boolean,
  },
  mainproperty: {
    type: String,
  },
});

const form = ref(null);
const storeGeneral = useGeneralStore();
const storePractice = usePracticeStore();
const updateProperty = (value) => {
  storePractice.updatingPracticeRegistrationFormValue(value);
};
watch(
  () => storePractice.practiceRegistrationFormData.billing.billing_country_id,
  async (newvalue) => {
    storePractice.practiceRegistrationFormData.billing.billing_state_id = ""
    storePractice.practiceRegistrationFormData.billing.billing_city_id = ""
    storePractice.practice_country_state_country_information.billing.billing_state = await storeGeneral.getStateRequest(newvalue);
  }
);
watch(
  () => storePractice.practiceRegistrationFormData.billing.billing_state_id,
  async (newvalue) => {
    storePractice.practiceRegistrationFormData.billing.billing_city_id = ""
    storePractice.practice_country_state_country_information.billing.billing_city = await storeGeneral.getCityRequest(newvalue);
  }
);

defineExpose({ form });
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
