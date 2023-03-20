<template>
  <div class="row items-center no-wrap mt-10">
    <div class="col-sm-2 col-xs-2 col-md-2 col-lg-1 col-xl-1">
      <q-icon :name="`img:${require('@/assets/files/' + fileType + '.png')}`" size="40px"
        class="material-symbols-outlined"></q-icon>
    </div>
    <div class="col-6 ml-4">
      <div class="row items-center">
        <div>{{ value }}</div>
        <a class="ml-5 link" target="_blank" :href="url" v-if="value">View</a>
      </div>
    </div>
  </div>
</template>

<script setup>
// import pdf from "@/assets/files/pdf 1.png";
import { defineProps, computed } from "vue";
const props = defineProps({
  path: {
    type: String,
  },
});
const types = ["png", "xls", "jpeg", "jpg", "doc", "docx"];

const url = computed(() => {
  //console.log(process.env.VUE_APP_BACKEND_IMAGE_URL)
  return `https://dev.icarepro.health/backend/${props.path}`//`https://dev-icare.developers.studio/backend/${props.path}`;
});
const value = computed(() => props.path && props.path.split("documents/")[1]);
const fileType = computed(() =>
  props.path && types.includes(props.path.slice(-3))
    ? props.path.slice(-3)
    : "pdf"
);
</script>

<style scoped lang="scss">
.link {
  cursor: pointer;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  color: $secondary;
}
</style>
