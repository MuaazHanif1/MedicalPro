<template>
  <div class="row no-wrap mt-13">
    <div class="col-4 property-name">{{ `${fieldname} :` }}</div>
    <div class="col-6 property-value">{{ fieldvalue }}</div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
defineProps(["fieldname", "fieldvalue"]);
</script>

<style>
</style>
