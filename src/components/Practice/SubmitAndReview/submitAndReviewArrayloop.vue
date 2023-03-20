<template>
  <div v-for="(cur, index) in object" :key="index">
    <SubmitAndReviewUi :firstname="index" :lastname="cur"></SubmitAndReviewUi>
  </div>
</template>

<script setup>
import SubmitAndReviewUi from "./SubmitAndReviewUi.vue";
import { defineProps } from "vue";
defineProps({
  object: {
    type: Array,
  },
});
</script>

<style></style>
