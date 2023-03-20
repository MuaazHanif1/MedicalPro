<template>
  <div
    class="q-pa-md"
    style="display: grid; place-items: center; height: 100vh"
  >
    <q-form
      @submit="onSubmit"
      class="q-gutter-md"
      style="max-width: 400px; width: 100%"
      :greedy="true"
      ref="reg_form"
    >
      <q-input
        filled
        v-model="model.practice_name"
        label="Practice name *"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
      <q-input
        filled
        v-model="model.country_code"
        label="Country Code *"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        filled
        v-model="model.phone_number"
        label="Phone number *"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
      <q-input
        filled
        v-model="model.first_name"
        label="First name *"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
      <q-input filled v-model="model.middle_name" label="Middle name " />
      <q-input
        filled
        v-model="model.last_name"
        label="Last name *"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
      <q-input
        filled
        v-model="model.designation"
        label="Designation *"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
      <q-input
        filled
        v-model="model.email"
        label="Email *"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axiosApiClient from "@/axios";

const reg_form = ref(null);
const model = ref({
  practice_name: "",
  country_code: "",
  phone_number: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  designation: "",
  email: "",
});

const onSubmit = () => {
  reg_form.value.validate().then((res) => {
    if (res) {
      axiosApiClient
        .post("/initial-practice", { ...model.value })
        .then(() => {
          location.reload();
        })
        .catch((err) => {
          throw err;
        });
    }
  });
};
</script>

