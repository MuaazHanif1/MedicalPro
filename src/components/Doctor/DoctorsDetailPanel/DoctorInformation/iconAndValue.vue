<template>
  <div class="row items-center">
    <div class="col-2">
      <div class="icon-background row justify-center items-center">
        <q-icon :name="icon" />
      </div>
    </div>
    <div class="col-6">
      <div class="heading ellipsis">{{ heading }}</div>
      <div class="property-value color ">{{ value }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
defineProps({
  icon: {
    type: String,
    default: "smartphone",
  },
  heading: {
    type: String,
    default: "heading",
  },
  value: {
    type: String,
    default: "value",
  },
});
</script>

<style lang="scss" scoped>
.heading {
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  /* identical to box height */
  color: $text-2;
  text-transform: capitalize;
}

.color {
  color: $text;
}
</style>
