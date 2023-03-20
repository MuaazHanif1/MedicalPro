<template>
  <div>
    <div class="row mt-13">
      <span class="col-6 firstName">{{ firstname.replaceAll("_", " ") }}</span>
      <span class="col-6 lastName">{{ lastname }}</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
defineProps({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
});
</script>

<style>
.firstName {
  font-family: "Lato";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  /* identical to box height */

  text-transform: capitalize;

  /* Text */

  color: #0d0c22;
}
.lastName {
  font-family: "Lato";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  /* identical to box height */

  text-transform: capitalize;

  /* Text 2 */

  color: #7d8693;
}
</style>
