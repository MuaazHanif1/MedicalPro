<template>
  <q-form ref="form" style="max-width: 600px" class="full-width selector" :class="$q.screen.lt.md ? 'q-mx-auto' : ''">
    <div class="mb-44">
      <p class="heading lato-heading">Attach Document</p>
      <p class="lato-sub-heading q-mt-md">
        Please Attach All The Required Documents
      </p>
    </div>

    <div class="row q-mt-lg" :class="$q.screen.lt.sm ? 'q-col-gutter-y-xs' : ''">
      <div class="col-sm-6 col-12 pr-15" v-for="(fileToUpload, index) in filesToUpload" :key="index">
        <!-- File uploader component  -->
        <FiLeUploader :index="index" v-model="filesToUpload" @delete-file="deleteFile" ref="uploaderComp"
          :file="fileToUpload"></FiLeUploader>
        <!-- File uploader component ends here  -->
      </div>
    </div>

    <!-- File input feild  -->
    <q-file v-model="files" bg-color="white" label="Add another Document" ref="file"
      accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/pdf,image/png,image/jpeg,image/jpg"
      max-file-size="5242880" class="q-mt-lg">
      <template v-slot:prepend>
        <q-icon class="file-add-icon" color="primary" name="add" @click="usePickFiles" />
      </template>
    </q-file>
    <!-- file input feild ends here  -->
    <p class="text-caption text-red q-mt-sm" v-if="filesToUpload.length === 0">
      Add atleast one document
    </p>
  </q-form>
</template>
<script setup>
import { ref, watch, nextTick, defineExpose } from "vue";
import FiLeUploader from "./FileUploader.vue";
import { usePracticeStore } from "@/store/practice";
import { useQuasar } from "quasar";

const $q = useQuasar();
const file = ref(null);
const files = ref(null);
const uploaderComp = ref(null);
const storePractice = usePracticeStore();
const filesToUpload = ref([]);

watch(files, () => {
  imageFileForReviewAndSubmit(files.value)
  filesToUpload.value.push(files.value);
  nextTick(() => {
    uploaderComp.value[filesToUpload.value.length - 1].upload();
  });
});

const usePickFiles = () => {
  file.value.pickFiles();
};
const imageFileForReviewAndSubmit = (data) => {
  storePractice.practiceRegistrationFormData.file_attached.push({
    type: data.type.split("/")[1],
    size: data.size,
    name: data.name,
    url: URL.createObjectURL(data),
  })
};
const deleteFile = (index) => {
  filesToUpload.value.splice(index, 1);
};
const form = ref(null);

defineExpose({ form, filesToUpload });
</script>
<style lang="scss" scoped>
.file-add-icon {
  background: #e5e5e5;
  border-radius: 4px;
  padding: 4px;
}
</style>
