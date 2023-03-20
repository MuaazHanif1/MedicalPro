<template>
  <div class="px-30">
    <div class="detail-page-heading">
      Basic Information
      <q-icon name="edit" class="edit-icon q-ml-sm" color="primary" />
    </div>
    <div class="row q-gutter-sm q-mt-md">
      <div class="col-md-5">
        <FormInput
          :label="'Legal First Name'"
          :placeHolder="'Enter First Name'"
          :rules="[rules.required, rules.single_word]"
        ></FormInput>
      </div>
      <div class="col-md-5">
        <FormInput
          :label="'Legal First Name'"
          :placeHolder="'Enter First Name'"
          :rules="[rules.required, rules.single_word]"
        ></FormInput>
      </div>
      <div class="col-md-2">Phone Number</div>
      <div class="col-md-3 q-mr-md">+92 340 1054925</div>
      <div class="col-md-2">Legal First Name</div>
      <div class="col-md-3 q-mr-md">Rai</div>
      <div class="col-md-2">Legal Middle Name</div>
      <div class="col-md-3 q-mr-md">Ahmad</div>
      <div class="col-md-2">Legal Last Name</div>
      <div class="col-md-3 q-mr-md">Fraz</div>
      <div class="col-md-2">Gender</div>
      <div class="col-md-3 q-mr-md">Male</div>
      <div class="col-md-2">Date of Birth</div>
      <div class="col-md-3 q-mr-md">1996-06-02</div>
    </div>
  </div>
</template>
<script setup>
import FormInput from "@/partials/FormInput.vue";
</script>
<style scoped>
:deep .edit-icon {
  background: #ebf0ee;
  border-radius: 8px;
  font-size: 18px;
  padding: 2px;
  cursor: pointer;
}
</style>
