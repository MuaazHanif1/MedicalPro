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
        <UserInput :label="'Practice legal name'" :labelColor="'#484848'" :labelWeight="'400'" :labelFontSize="'13px'"
          :labelFontFamily="'lato'" :dataModel="object.practice_name" :placeHolder="'Enter practice legal name'"
          :innerProperty="'practice_name'" :mainproperty="mainproperty" :rules="[rules.required]"
          @update="updateProperty"></UserInput>
      </div>
      <div class="col-sm-6 col-12">
        <UserInput :label="'Tax id'" :dataModel="object.tax_id" :placeHolder="'Enter tax id'" :innerProperty="'tax_id'"
          :mainproperty="mainproperty" @update="updateProperty" :rules="[rules.required, rules.number]"></UserInput>
      </div>
    </div>
    <div class="row" :class="
      $q.screen.lt.sm
        ? 'q-col-gutter-y-xs q-mt-sm'
        : 'q-col-gutter-x-lg q-mt-md'
    ">
      <div class="col-sm-6 col-12">
        <UserInput :label="'Practice npi'" :dataModel="object.practice_npi" :placeHolder="'Enter practice npi'"
          :innerProperty="'practice_npi'" @update="updateProperty" :mainproperty="mainproperty"
          :rules="[rules.required]"></UserInput>
      </div>
      <div class="col-sm-6 col-12">
        <UserInput :label="'Facility id'" :dataModel="object.practice_id" :placeHolder="'Enter facility id'"
          :innerProperty="'facility_id'" @update="updateProperty" :mainproperty="mainproperty"
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
        <UserInput :label="'Practice taxonomy'" :dataModel="object.practice_taxonomy"
          :placeHolder="'Enter practice taxonomy'" :innerProperty="'practice_taxonomy'" @update="updateProperty"
          :mainproperty="mainproperty" :rules="[rules.required]"></UserInput>
      </div>
      <div class="col-sm-6 col-12">
        <UserInput :label="'Clia number'" :dataModel="object.clia_number" :placeHolder="'Enter clia number'"
          :innerProperty="'clia_number'" @update="updateProperty" :mainproperty="mainproperty"
          :rules="[rules.required]"></UserInput>
      </div>
    </div>
    <div class="row" :class="
      $q.screen.lt.sm
        ? 'q-col-gutter-y-xs q-mt-sm'
        : 'q-col-gutter-x-lg q-mt-md'
    ">
      <div class="col-sm-6 col-12">
        <UserInput :label="'Oid'" :dataModel="object.oid" :placeHolder="'Enter oid'" :innerProperty="'oid'"
          @update="updateProperty" :mainproperty="mainproperty" :rules="[rules.required]">
        </UserInput>
      </div>
    </div>
  </q-form>
</template>

<script setup>
import { defineProps, ref, defineExpose } from "vue";
import UserInput from "../../../partials/UserInput.vue";
import { usePracticeStore } from "@/store/practice";

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
const storePractice = usePracticeStore();
const updateProperty = (value) => {
  storePractice.updatingPracticeRegistrationFormValue(value);
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
