<template>
  <q-card flat bordered class="my-card border-dashed">
    <q-card-section>
      <div class="row justify-between items-center q-mb-lg">
        <p class="text-body2 q-mb-none">Proof of address</p>
        <!-- delete button  -->
        <q-btn
          size="xs"
          round
          color="grey-4"
          icon="close"
          v-if="progress == 100"
          @click="deleteFile"
        />
        <!-- delete button ends here  -->
      </div>
      <div class="row justify-between">
        <p class="text-caption q-mb-none">Uploading...</p>
        <div class="row">
          <p class="text-caption q-mb-none">
            <span>{{ progress < 100 ? `${progress} %` : "" }}</span> Completed
          </p>
          <q-btn
            size="xs"
            class="q-ml-sm"
            round
            color="primary"
            icon="check"
            v-if="progress == 100"
          />
        </div>
      </div>
      <!-- progress bar  -->
      <q-linear-progress
        animation-speed="0"
        :value="progress / 100"
        color="primary"
        class="q-mt-sm"
      />
      <!-- progress bar ends here  -->
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref, defineExpose, defineProps, defineEmits } from "vue";
import {usePracticeStore} from '@/store/practice.js'
import { createFormData } from "@/composables/useFormData";
import axiosApiClient from '@/axios'

const store = usePracticeStore();
const props = defineProps({
  index: Number,
  file: Object,
});
const emit = defineEmits(['delete-file']);

const progress = ref(0);
const fileToDelete = ref(null)
const upload = () => {
  const formData = createFormData({file_path: props.file});
  axiosApiClient.post("/practice-document/1", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: function (progressEvent) {
      progress.value = parseInt(
        Math.round((progressEvent.loaded / progressEvent.total) * 100)
      );

      return parseInt(
        Math.round((progressEvent.loaded / progressEvent.total) * 100)
      );
    }.bind(this),
  })
  .then((res) => {
    fileToDelete.value = res.data.data.id;
    // return res.data;
  });
};

const deleteFile = () => {
  if (fileToDelete.value) {
    emit('delete-file', props.index)
    store.deleteFile(fileToDelete.value).then((res) => {
      res;
    });
  }
}
defineExpose({ upload });
</script>
<style lang="scss" scoped></style>
