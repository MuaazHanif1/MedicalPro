<template lang="">
<!-- CARD  -->
  <q-card flat bordered class="my-card rounded-1 q-mb-sm" :class="[check.error ? 'border-red' : '']">
    <!-- Heading  -->
    <q-card-section class="">
      <p class="text-subtitle2 text-weight-regular q-mb-sm">
        {{ check.heading }}
      </p>
      <p class="text-gray text-body2 q-mb-sm">{{ check.description }}</p>
    </q-card-section>
    <!-- Heading ends here  -->

    <!-- Detail checkbox and link  -->
    <div class="row justify-between">
      <div class="row q-px-md text-secondary">
        <a :href="check.details" class="text-secondary text-caption"
          >View Details&nbsp;&nbsp;|</a
        >
        <a :href="check.TC" class="text-secondary text-caption"
          >&nbsp;&nbsp;Terms & Conditions</a
        >
      </div>
      <!-- Toggle button  -->
      <div>
        <q-toggle :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" />
      <!-- Toggle button ends here  -->
      </div>
    </div>
    <!-- Detail checkbox and link ends here  -->
  </q-card>
<!-- Card ends here  -->
</template>
<script setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  check: Object,
  modelValue: Boolean,
});
defineEmits(["update:modelValue"]);
</script>
<style lang="scss" scoped></style>
