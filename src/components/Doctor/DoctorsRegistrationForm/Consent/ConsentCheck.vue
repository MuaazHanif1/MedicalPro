<template lang="">
  <q-card
    flat
    bordered
    class="my-card rounded-1 q-mb-sm"
    :class="[check.error ? 'border-red' : '']"
  >
    <q-card-section class="">
      <p class="text-subtitle2 text-weight-regular q-mb-sm">
        {{ check.type }}
      </p>
      <p class="text-gray text-body2 q-mb-sm ellipsis-2-lines">
        {{ check.publish_consent_form.content }}
      </p>
    </q-card-section>
    <div class="row justify-between">
      <div class="row q-px-md text-secondary">
        <a
          :href="check.details"
          class="text-secondary text-caption"
          @click.stop="dialBox('eng')"
          >English&nbsp;&nbsp;|</a
        >
        <a
          :href="check.TC"
          class="text-secondary text-caption"
          @click.stop="dialBox('arb')"
          >&nbsp;&nbsp;Arabic</a
        >
      </div>
      <div>
        <q-toggle
          :modelValue="modelValue"
          @update:modelValue="$emit('update:modelValue', $event)"
          @click="toggleConsent(check)"
        />
      </div>
    </div>
  </q-card>
  <q-dialog v-model="dialogBox.isDialogBox">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="text-subtitle2 text-weight-regular">{{ check.type }}</div>
      </q-card-section>

      <q-card-section
        class="q-pt-none text-gray text-body2 dialog-box-line-height"
        :style="contentType"
      >
        {{ dialogBoxContent }}
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="OK" v-close-popup></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { defineProps, defineEmits, ref, computed } from "vue";
import { useDoctorsRegistrationStore } from "@/store/doctors_registration";
const doctorStore = useDoctorsRegistrationStore();
const dialogBox = ref({ isDialogBox: false, dialogBoxType: "eng" });
const dialBox = (type) => {
  dialogBox.value.isDialogBox = true;
  dialogBox.value.dialogBoxType = type;
};
const contentType = computed(() =>
  dialogBox.value.dialogBoxType == "arb" ? { textAlign: "right" } : ""
);
const dialogBoxContent = computed(() => {
  return dialogBox.value.dialogBoxType == "arb"
    ? props.check.publish_consent_form.content_arabic
    : props.check.publish_consent_form.content;
});
const props = defineProps({
  check: Object,
  modelValue: Boolean,
});
const toggleConsent = (consent_form) => {
  if(doctorStore.$state.consent_form.data){
    for(let i=0; i < doctorStore.$state.consent_form.data.length; i++){
   
      if(doctorStore.$state.consent_form.data[i].id == consent_form.id){
        if(props.modelValue){
          doctorStore.$state.consent_form.data[i].is_agree = "DISAGREE";  
        }
        else {
          doctorStore.$state.consent_form.data[i].is_agree = "AGREE";  
        }      
      }
    }
  }
}
defineEmits(["update:modelValue"]);

</script>
<style lang="scss" scoped>
a {
  cursor: pointer;
}
.dialog-box-line-height {
  line-height: 1.6;
}
</style>
