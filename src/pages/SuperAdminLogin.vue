<template>
  <div class="q-pa-md" style="display: grid; place-items: center; height: 100vh">
    <q-form @submit="onSubmit" class="q-gutter-md" style="max-width: 400px; width: 100%" :greedy="true" ref="reg_form">
      <q-input filled v-model="model.email" label="Email *" lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']" />
      <q-input filled v-model="model.password" label="Password *" type="password" lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']" />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axiosApiClient from "@/axios";
import { useRouter } from "vue-router";

const reg_form = ref(null);
const model = ref({
  email: "",
  password: "",
});
const router = useRouter();

const onSubmit = () => {
  reg_form.value.validate().then((res) => {
    if (res) {
      axiosApiClient
        .post("/superAdmin/login", { ...model.value })
        .then((res) => {
          localStorage.setItem("token", res.data.data.token);
          router.push({
            name: "practice-registration-pending-request",
          });
        })
        .catch((err) => {
          throw err;
        });
    }
  });
};
</script>

