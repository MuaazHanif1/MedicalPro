<template>
  <div class="heading mb-3">{{ parentheading.replaceAll("_", " ") }}</div>
  <div v-for="(cur, index) in object" :key="index">
    <SubmitAndReviewArrayLoop
      v-if="typeof cur == 'object'"
      :object="cur"
    ></SubmitAndReviewArrayLoop>
    <SubmitAndReviewUi
      :firstname="index"
      :lastname="cur"
      v-else
    ></SubmitAndReviewUi>
  </div>
</template>

<script setup>
import SubmitAndReviewUi from "./SubmitAndReviewUi.vue";
import SubmitAndReviewArrayLoop from "./submitAndReviewArrayloop.vue";
import { defineProps } from "vue";
defineProps({
  parentheading: {
    type: String,
  },
  object: {
    type: Array,
  },
});
</script>

<style>
.heading {
  font-family: "Lato";
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  line-height: 18px;
  /* identical to box height */
  text-transform: capitalize;
  /* Primary */

  color: #2a6049;
}
</style>
