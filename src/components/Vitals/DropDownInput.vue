<template>
  <q-select
    borderless
    :dense="true"
    v-model="measureHeightUnitsModel"
    :options="measureHeightUnits"
  ></q-select>
</template>
<script setup>
const measureHeightUnitsModel = "ft/in";
const measureHeightUnits = ["cm", "in", "ft/in"];
</script>

<style lang="scss" scoped>
:deep .q-field--outlined .q-field__control::before {
  border: none !important;
}
:deep .q-field--outlined.q-field--highlighted .q-field__control::after {
  border: none !important;
}
:deep
  .q-field__control
  .q-field--outlined.q-field--highlighted
  .q-field__control::after {
  border: none !important;
}
</style>
