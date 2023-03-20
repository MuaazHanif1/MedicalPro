<template lang="">
  <!-- Form Wrapper  -->
  <q-form ref="form" style="max-width: 600px">
    <div class="mb-44">
      <p class="heading lato-heading">Consent Form</p>
    <p class="lato-sub-heading q-mt-md">Provide information about Address</p>
    </div>

    <!-- Cards  -->
    <ConsentCheck
      v-model="model[index]"
      :key="index"
      v-for="(check, index) in checks"
      :check="check"
    ></ConsentCheck>
    <!-- Cards Ends here  -->
  </q-form>
  <!-- Form ends here  -->
</template>
<script setup>
import { ref, defineExpose } from "vue";
import ConsentCheck from "./ConsentCheck.vue";

const model = ref([false, false, false]);
const form = ref(null);

const checks = ref([
  {
    heading: "Heading 1",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    details: "javascript:void(0)",
    TC: "javascript:void(0)",
    value: true,
    error: false,
  },
  {
    heading: "Heading 2",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    details: "javascript:void(0)",
    TC: "javascript:void(0)",
    value: false,
    error: false,
  },
  {
    heading: "Heading 3",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    details: "javascript:void(0)",
    TC: "javascript:void(0)",
    value: false,
    error: false,
  },
]);

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

defineExpose({ form, validate });
</script>
<style lang="scss">
</style>
