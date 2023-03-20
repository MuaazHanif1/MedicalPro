<template>
  <keep-alive>
    <div class="row justify-center" v-if="loading">
      <q-spinner-dots color="primary" size="3em" :thickness="2" />
    </div>
    <div :class="$q.screen.lt.sm ? 'px-15' : 'px-40'" v-else>
      <!-- detail and edit section component  -->
      <EditableInfo
        :updating="updating"
        @form-submit="saveChanges"
        :information="section"
        :data="data"
        :model="model"
      ></EditableInfo>
      <!-- detail and edit section component  -->
    </div>
  </keep-alive>
</template>
<script setup>
import EditableInfo from "@/partials/EditableInfo.vue";
import { ref, computed } from "vue";
import { usePracticeStore } from "@/store/practice";
import enums from "../../../../composables/enums";
import { useUserStore } from "@/store/user";
const userStore = useUserStore();

const practiceStore = usePracticeStore();
const loading = ref(true);
practiceStore.getCurrentPatientSocialHistory(userStore.loginUser.id).then(() => {
  loading.value = false;
});
const data = computed(() =>
  practiceStore.currentPatient.history.social_history
    ? practiceStore.currentPatient.history.social_history
    : {}
); // patient records for social history
const model = ref({});
const updating = ref(false);
const section = ref([
  {
    heading: "Social History",
    fields: [
      {
        label: "Gender identity",
        value: "gender_identity",
        input: {
          label: "Gender identity",
          placeholder: "Select gender identity",
          type: "select",
          options: enums.gender_identity,
        },
      },
      {
        label: "First name used",
        value: "first_name",
        input: {
          label: "First name",
          placeholder: "Enter first Name",
          type: "text",
          rules: [(val) => (val && val.length <= 29) || false]
        },
      },
      {
        label: "Assigned sex at birth",
        value: "sex_at_birth",
        input: {
          label: "Assigned sex at birth",
          placeholder: "Select assigned sex at birth",
          type: "select",
          options: enums.assigned_sex_at_birth,
        },
      },
      {
        label: "Sexual orientation",
        value: "sexual_orientation",
        input: {
          label: "Sexual orientation",
          placeholder: "Select sexual orientation",
          type: "select",
          options: enums.sexual_orientation,
        },
      },
      {
        label: "Pronoun",
        value: "pronoun",
        input: {
          label: "Pronoun",
          placeholder: "Select pronoun",
          type: "select",
          options: enums.pronoun,
        },
      },
      // {
      //   label: "Suffix",
      //   value: "suffix",
      //   input: {
      //       label: 'Suffix',
      //       placeholder: '',
      //       type: 'text',
      //   }
      // },
    ],
  },
]); // edit and detail section structure

/**
 * @param {updatedData} Array Data to be updated
 */
const saveChanges = (updatedData) => {
  updating.value = true;
  practiceStore
    .updateCurrentPatientSocialHistory({
      ...updatedData,
      patient_id: userStore.loginUser.id,
    })
    .then(() => {
      updating.value = false;
    })
    .catch(() => {
      updating.value = false;
    });
}; // edit record api call
</script>
<style lang="scss">
:deep(.q-icon.on-left) {
  margin-left: 4px;
}
</style>
