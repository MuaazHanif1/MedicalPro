<template>
  <q-form ref="form" style="width: 600px" class="selector" :class="$q.screen.lt.md ? 'q-mx-auto' : ''" :greedy="true">
    <div class="mb-44">
      <p class="heading lato-heading mb-0">Attach Document</p>
      <p class="lato-sub-heading q-mt-md">
        Please Attach All The Required Documents
      </p>
    </div>

    <div class="">

      <div class="row " :class="$q.screen.lt.sm ? 'q-col-gutter-y-xs' : ''">
        <div class="col-sm-6 col-12">
          <q-file v-model="files1" ref="file"
            accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/pdf,image/png,image/jpeg,image/jpg"
            max-file-size="1048576" class="">
            <template v-slot:default>
              <FiLeUploader :index="index" @delete-file="deleteFile" ref="uploaderComp" :file="files1"
                :fileUploaded="isFile1Uploaded" :fileName="'Emirate'" :fileUploadedName="file1UploadedName">
              </FiLeUploader>
            </template>
          </q-file>
        </div>
        <div class="col-sm-6 col-12">
          <q-file v-model="files2" max-file-size="1048576" ref="file"
            accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/pdf,image/png,image/jpeg,image/jpg"
            class="">
            <template v-slot:default>
              <FiLeUploader :index="index" @delete-file="deleteFile" ref="uploaderComp" :fileUploaded="isFile2Uploaded"
                :fileUploadedName="file2UploadedName" :fileName="'Passport'" :file="files2"></FiLeUploader>
            </template>
          </q-file>
        </div>
      </div>
      <div class="row q-mt-sm" :class="$q.screen.lt.sm ? 'q-col-gutter-y-xs' : ''">
        <div class="col-sm-6 col-12 pr-15">
          <q-file v-model="files3" ref="file"
            accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/pdf,image/png,image/jpeg,image/jpg"
            max-file-size="1048576" class="q-mt-sm">
            <template v-slot:default>
              <FiLeUploader :index="index" @delete-file="deleteFile" ref="uploaderComp" :fileName="'License'"
                :fileUploaded="isFile3Uploaded" :fileUploadedName="file3UploadedName" :file="files3"></FiLeUploader>
            </template>
          </q-file>
        </div>
      </div>
    </div>

    <!-- <p class="text-caption text-red q-mt-sm" v-if="filesToUpload.length === 0">
      Add atleast one document
    </p> -->
  </q-form>
</template>
<script setup>
import { ref, defineExpose, watch, computed, onMounted } from "vue";
import { useDoctorsRegistrationStore } from "@/store/doctors_registration";
//import { createFormData } from "@/composables/useFormData";
import FiLeUploader from "./FileUploader.vue";
import { useQuasar } from "quasar";
onMounted(() => {
  setUpImageUrlForSubmitAndReview();
});
const $q = useQuasar();
const store = useDoctorsRegistrationStore();
let files1 = ref({ name: "Upload Document" });
let files2 = ref({ name: "Upload Document" });
let files3 = ref({ name: "Upload Document" });
//const uploadFiles = [{ name: "filename" },]//
const uploaderComp = ref(null);
const deleteFile = (name) => {
  if (name == "Emirate") {
    files1.value = {
      name: "Upload Document",
    };
    store.doctorRegistrationFormData.attached_documents.emirate_photo_url = "";
  }
  if (name == "Passport") {
    files2.value = { name: "Upload document" };
    store.doctorRegistrationFormData.attached_documents.passport_photo_url = "";
  }
  if (name == "License") {
    files3.value = {
      name: "Upload document",
    };

    store.doctorRegistrationFormData.attached_documents.license_photo_url = "";
  }
};
const uploadFilecheker = () => {
  const emratePhotoUrl =
    store.doctorRegistrationFormData.attached_documents.emirate_photo_url;
  const passportPhotoUrl =
    store.doctorRegistrationFormData.attached_documents.passport_photo_url;
  const licensePhotoUrl =
    store.doctorRegistrationFormData.attached_documents.license_photo_url;
  if (
    (files1.value.__key && files2.value.__key && files3.value.__key) ||
    (emratePhotoUrl && passportPhotoUrl && licensePhotoUrl)
  ) {
    return true;
  }
  return false;
};
const isFile1Uploaded = computed(() => {
  return store.doctorRegistrationFormData.attached_documents
    .emirate_photo_url || files1.value.__key
    ? true
    : false;
});
const isFile2Uploaded = computed(() => {
  return store.doctorRegistrationFormData.attached_documents
    .passport_photo_url || files2.value.__key
    ? true
    : false;
});
const isFile3Uploaded = computed(() => {
  return store.doctorRegistrationFormData.attached_documents
    .license_photo_url || files3.value.__key
    ? true
    : false;
});
const file1UploadedName = computed(() => {
  if (files1.value.__key) return files1.value.name;
  if (store.doctorRegistrationFormData.attached_documents.emirate_photo_url) {
    return "Emirate photo uploaded";
  }
  return "Upload document";
});
const file2UploadedName = computed(() => {
  if (files2.value.__key) return files2.value.name;
  if (store.doctorRegistrationFormData.attached_documents.passport_photo_url) {
    return "Passport photo uploaded";
  }
  return "Upload document";
});
const file3UploadedName = computed(() => {
  if (files3.value.__key) return files3.value.name;
  if (store.doctorRegistrationFormData.attached_documents.license_photo_url) {
    return "license photo uploaded";
  }
  return "Upload document";
});
const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
const setUpImageUrlForSubmitAndReview = () => {
  const types = ["png", "xls", "jpeg", "jpg", "doc", "docx"];
  if (store.doctorRegistrationFormData.attached_documents.emirate_photo_url) {
    store.doctorRegistrationFormData.file_attached.file1.type = types.includes(
      store.doctorRegistrationFormData.attached_documents.emirate_photo_url.slice(
        -3
      )
    )
      ? store.doctorRegistrationFormData.attached_documents.emirate_photo_url.slice(
        -3
      )
      : "pdf";
    store.doctorRegistrationFormData.file_attached.file1.name = "Emirate photo";
    store.doctorRegistrationFormData.file_attached.file1.url = `${process.env.VUE_APP_BACKEND_IMAGE_URL
      }${store.doctorRegistrationFormData.attached_documents.emirate_photo_url.replace(
        "public",
        "storage"
      )}`;
  }
  if (store.doctorRegistrationFormData.attached_documents.passport_photo_url) {
    store.doctorRegistrationFormData.file_attached.file2.type = types.includes(
      store.doctorRegistrationFormData.attached_documents.passport_photo_url.slice(
        -3
      )
    )
      ? store.doctorRegistrationFormData.attached_documents.passport_photo_url.slice(
        -3
      )
      : "pdf";
    store.doctorRegistrationFormData.file_attached.file2.name =
      "Passport photo";
    store.doctorRegistrationFormData.file_attached.file2.url = `${process.env.VUE_APP_BACKEND_IMAGE_URL
      }${store.doctorRegistrationFormData.attached_documents.passport_photo_url.replace(
        "public",
        "storage"
      )}`;
  }
  if (store.doctorRegistrationFormData.attached_documents.license_photo_url) {
    store.doctorRegistrationFormData.file_attached.file3.type = types.includes(
      store.doctorRegistrationFormData.attached_documents.license_photo_url.slice(
        -3
      )
    )
      ? store.doctorRegistrationFormData.attached_documents.license_photo_url.slice(
        -3
      )
      : "pdf";
    store.doctorRegistrationFormData.file_attached.file3.name = "License photo";
    store.doctorRegistrationFormData.file_attached.file3.url = `${process.env.VUE_APP_BACKEND_IMAGE_URL
      }${store.doctorRegistrationFormData.attached_documents.license_photo_url.replace(
        "public",
        "storage"
      )}`;
  }
};
watch(files1, (valueN) => {
  if (valueN.__key) {
    console.log(store.doctorRegistrationFormData.file_attached);
    store.doctorRegistrationFormData.file_attached.file1.size = valueN.size;
    store.doctorRegistrationFormData.file_attached.file1.type =
      valueN.type.split("/")[1];
    store.doctorRegistrationFormData.file_attached.file1.name = valueN.name;
    store.doctorRegistrationFormData.file_attached.file1.url =
      URL.createObjectURL(valueN);

    getBase64(valueN).then((res) => {
      store.doctorRegistrationFormData.attached_documents.emirate_photo_url =
        res;
    });
  }
});
watch(files2, (valueN) => {
  if (valueN.__key) {
    //console.log(store.doctorRegistrationFormData.file_attached);
    store.doctorRegistrationFormData.file_attached.file2.size = valueN.size;
    store.doctorRegistrationFormData.file_attached.file2.type =
      valueN.type.split("/")[1];
    store.doctorRegistrationFormData.file_attached.file2.name = valueN.name;
    store.doctorRegistrationFormData.file_attached.file2.url =
      URL.createObjectURL(valueN);

    getBase64(valueN).then((res) => {
      store.doctorRegistrationFormData.attached_documents.passport_photo_url =
        res;
    });
  }
});
watch(files3, (valueN) => {
  if (valueN.__key) {
    console.log(store.doctorRegistrationFormData.file_attached);
    store.doctorRegistrationFormData.file_attached.file3.size = valueN.size;
    store.doctorRegistrationFormData.file_attached.file3.type =
      valueN.type.split("/")[1];
    store.doctorRegistrationFormData.file_attached.file3.name = valueN.name;

    store.doctorRegistrationFormData.file_attached.file3.url =
      URL.createObjectURL(valueN);

    getBase64(valueN).then((res) => {
      store.doctorRegistrationFormData.attached_documents.license_photo_url =
        res;
    });
  }
});

// const usePickFiles = () => {
//   file.value.pickFiles();
// };

const form = ref(null);

defineExpose({ form, uploadFilecheker });
</script>
<style lang="scss" scoped>
.file-add-icon {
  background: #e5e5e5;
  border-radius: 4px;
  padding: 4px;
}

:deep .q-field__native {
  width: 0px;
}

:deep .q-field__control:after {
  display: none;
}

:deep .q-field--standard .q-field__control:before {
  border-bottom: none;
}

:deep .q-card {
  width: 250px;
  min-height: 100px;
  cursor: pointer;
}

:deep .q-field__input+div {
  display: none;
}
</style>
