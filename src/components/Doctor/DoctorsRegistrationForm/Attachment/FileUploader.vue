<template>
  <q-card flat bordered class="my-card border-dashed">
    <q-card-section>
      <div class="row justify-between items-center q-mb-lg">
        <p class="text-body2 q-mb-none">{{ fileName }}</p>
        <q-btn size="6px" round color="grey-4" icon="close" v-if="fileUploaded" @click.stop="deleteFile" />
      </div>
      <div class="row justify-between items-center">
        <span class="text-caption q-mb-none text-overflow">
          {{ fileUploadedName }}
        </span>
        <div>
          <q-btn size="6px" class="q-ml-sm" round color="primary" icon="check" v-if="fileUploaded" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { defineProps, defineEmits } from "vue";
//import { usePracticeStore } from "@/store/practice.js";
//import { createFormData } from "@/composables/useFormData";
//import axiosApiClient from "@/axios";

//const store = usePracticeStore();
const props = defineProps({
  index: Number,
  file: Object,
  fileName: String,
  fileUploaded: Boolean,
  fileUploadedName: String,
  //progress: Number,
});
const emit = defineEmits(["delete-file"]);

//const fileToDelete = ref(null);

// const upload = () => {
//   const formData = createFormData({ file_path: props.file });
//   axiosApiClient
//     .post("/practice-document/1", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//       onUploadProgress: function (progressEvent) {
//         progress.value = parseInt(
//           Math.round((progressEvent.loaded / progressEvent.total) * 100)
//         );

//         return parseInt(
//           Math.round((progressEvent.loaded / progressEvent.total) * 100)
//         );
//       }.bind(this),
//     })
//     .then((res) => {
//       fileToDelete.value = res.data.data.id;
//       // return res.data;
//     });
// };

const deleteFile = () => {
  emit("delete-file", props.fileName);
};
// defineExpose({ upload });
</script>
<style lang="scss" scoped>
.text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
