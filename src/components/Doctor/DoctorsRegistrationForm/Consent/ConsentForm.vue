<template lang="">
  <q-form ref="form" style="max-width: 600px">
    <div class="mb-44">
      <p class="heading lato-heading">Consent Form</p>
    <p class="lato-sub-heading q-mt-md">Provide information about Address</p>
    </div>

    <ConsentCheck
      v-model="model[index]"
      :key="index"
      v-for="(check, index) in checks"
      :check="check"
    ></ConsentCheck>
  </q-form>
</template>
<script setup>
import { ref, defineExpose, onMounted } from "vue";
import ConsentCheck from "./ConsentCheck.vue";
import { useDoctorsRegistrationStore } from "@/store/doctors_registration";
const model = ref([false, false, false]);
const form = ref(null);
const checks = ref([
  {
    type: "Heading 1",
    publish_consent_form: {
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    },
    details: "javascript:void(0)",
    TC: "javascript:void(0)",
    value: true,
    error: false,
  },
  {
    type: "Heading 2",
    publish_consent_form: {
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    },
    details: "javascript:void(0)",
    TC: "javascript:void(0)",
    value: false,
    error: false,
  },
]);
const store = useDoctorsRegistrationStore();
const validate = () => {
  let error = 0;
  let index = 0;
  model.value.forEach((value) => {
    if (!value) {
      checks.value[index].error = true;
      error++;
    } else {
      checks.value[index].error = false;
    }
    index++;
  });

  return error;
};

onMounted(async () => {
  const status = [];
  checks.value = await store.consent_form.data;
  const savedconsentform = await store.getAgreeConstentForms();
  if (checks.value.length && savedconsentform.length) {
    var savedconsentformids = savedconsentform.map(s => s.consent_form_type_id);
    for (let i = 0; i < checks.value.length; i++) {
      if (savedconsentformids.includes(checks.value[i].id)) {
        const is_agree = savedconsentform.find(x => x.consent_form_type_id === checks.value[i].id)?.consent_status;
        if (is_agree == "AGREE") {
          status.push(true);
        } else {
          status.push(false);
        }
      }
      else {
        status.push(false);
      }
    }
    model.value = status;
  }
});

defineExpose({ form, validate });
</script>
<style lang="scss">
</style>
