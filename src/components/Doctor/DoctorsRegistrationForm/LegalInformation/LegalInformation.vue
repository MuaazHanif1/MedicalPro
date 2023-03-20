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
        <UserInput :label="'Emirate number'" :dataModel="object.emirate_id" :placeHolder="'Enter emirate number'"
          :innerProperty="'emirate_id'" :inputType="'input-mask'" :mainproperty="mainproperty" :rules="[rules.required]"
          @update="updateProperty"></UserInput>
      </div>
      <div class="col-sm-6 col-12">
        <UserInput :label="'Passport number'" :dataModel="object.passport_number" :placeHolder="'Enter npi'"
          :innerProperty="'passport_number'" :mainproperty="mainproperty" :rules="[rules.required, rules.alphanumeric]"
          @update="updateProperty"></UserInput>
      </div>
    </div>
    <div class="row" :class="
      $q.screen.lt.sm
        ? 'q-col-gutter-y-xs q-mt-sm'
        : 'q-col-gutter-x-lg q-mt-md'
    ">
      <div class="col-sm-6 col-12">
        <UserInput :label="'License number'" :dataModel="object.license_number" :placeHolder="'Enter license number'"
          :innerProperty="'license_number'" :mainproperty="mainproperty" :rules="[rules.required, rules.alphanumeric]"
          @update="updateProperty"></UserInput>
      </div>
    </div>
  </q-form>
</template>

<script setup>
import { defineProps, ref, defineExpose } from "vue";
import { useDoctorsRegistrationStore } from "@/store/doctors_registration";
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
  mainproperty: {
    type: String,
  },
  object: {
    type: Object,
  },
});

const form = ref(null);
const store = useDoctorsRegistrationStore();
const updateProperty = (value) => {
  store.updatingDoctorsRegistrationFormValue(value);
};
defineExpose({
  form,
});
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
