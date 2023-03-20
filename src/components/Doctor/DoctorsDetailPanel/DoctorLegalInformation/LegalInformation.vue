<template>
  <!--Doctor Detail Legal Information Start Here --->
  <q-form ref="form" class="full-width overflow-auto" :class="$q.screen.lt.md ? 'q-mx-auto' : ''">
    <div class="mt-27  px-20">
      <span class="doctor-detail-information-heading"> Legal information </span>
      <div class="row" :class="[
        $q.screen.lt.sm
          ? 'q-col-gutter-y-xs q-mt-lg'
          : 'q-col-gutter-x-lg q-mt-md',
      ]">
        <div class="col-sm-6 col-12">
          <TextField fieldname="Emirate Id" :fieldvalue="emirateId"></TextField>
          <TextField fieldname="License Number" :fieldvalue="licenseNumber"></TextField>
          <TextField fieldname="Passport Number" :fieldvalue="passportNumber"></TextField>
        </div>
      </div>
    </div>
    <q-separator class="mt-40" />

    <!--Doctor Detail Legal Information End Here --->

    <!--**********************************************--->

    <!--Doctor Detail Attach Documents Information Start Here --->

    <div class="mt-30 px-20">
      <span class="doctor-detail-information-heading"> Attached documents </span>
      <div class="row" :class="[
        $q.screen.lt.sm
          ? 'q-col-gutter-y-xs q-mt-lg'
          : 'q-col-gutter-x-lg q-mt-md',
      ]">
        <div class="col-12 col-md-6 col-sm-6 col-xl-4" v-for="(cur, index) in photoUrl" :key="index">
          <IconAndValueVue :path="cur"></IconAndValueVue>
        </div>
      </div>
    </div>
  </q-form>
  <!--Doctor Detail Attach Documents Information End Here --->

  <!--**********************************************--->
</template>

<script setup>
import TextField from "../NameAndValue.vue";
import IconAndValueVue from "./IconAndValue.vue";
import { usePracticeStore } from "@/store/practice.js";
import { computed } from "vue";
const practiceStore = usePracticeStore();
let urlLink = [];
const emirateId = computed(() => {
  return practiceStore.currentDoctor.data.legal_information &&
    practiceStore.currentDoctor.data.legal_information.emirate_id
    ? practiceStore.currentDoctor.data.legal_information.emirate_id
    : "_";
});
const licenseNumber = computed(() => {
  return practiceStore.currentDoctor.data.legal_information &&
    practiceStore.currentDoctor.data.legal_information.license_number
    ? practiceStore.currentDoctor.data.legal_information.license_number
    : "_";
});
const passportNumber = computed(() => {
  return practiceStore.currentDoctor.data.legal_information &&
    practiceStore.currentDoctor.data.legal_information.passport_number
    ? practiceStore.currentDoctor.data.legal_information.passport_number
    : "_";
});
const photoUrl = computed(() => {
  const obj = practiceStore.currentDoctor.data;
  urlLink = [
    obj.emirate_photo_url
      ? obj.emirate_photo_url.replace("public", "storage")
      : "",
    obj.license_photo_url
      ? obj.license_photo_url.replace("public", "storage")
      : "",
    obj.passport_photo_url
      ? obj.passport_photo_url.replace("public", "storage")
      : "",
  ];
  return urlLink;
});
</script>

<style>
</style>
