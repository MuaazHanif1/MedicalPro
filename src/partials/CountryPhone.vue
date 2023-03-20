<template>
  <q-field outlined :rules="validation_rules" :disable="is_disabled" :modelValue="modelValue">
    <template v-slot:default>
      <vue-tel-input v-model="model" @on-input="upload" mode="international" :disabled="is_disabled"
        @country-changed="countryChanged" :dropdownOptions="dropdownOptions"
        :defaultCountry="parseInt(defaultCountry)"></vue-tel-input>
    </template>
  </q-field>
</template>
<script setup>
import { defineEmits, defineProps, ref, computed } from "vue";
// import rules from "@/composables/validation-rules";

const props = defineProps({
  modelValue: {
    type: String,
    default: '',

  },
  is_disabled: {
    type: Boolean,
    default: false,
  },
  defaultCountry: {
    type: String,
    default: "+92",
  },
  vRules: {
    type: Array,
    default: () => [],
  }
});
const dropdownOptions = {
  disabled: false,
  showDialCodeInList: true,
  showDialCodeInSelection: false,
  showFlags: true,
  showSearchBox: true,
  tabindex: 0,
}
const validation_rules = computed(() => [(val) => (!val || val.length < 200) || false, ...props.vRules]);
const emit = defineEmits(["update:modelValue", "selected-country"]);
const model = ref(props.modelValue);

const upload = (value, s) => {
  let nationalNumber = s.nationalNumber || '';
  console.log(nationalNumber);
  emit("update:modelValue", nationalNumber);
}; // returning model value
const countryChanged = (country) => {
  emit("selected-country", country);
}; // emitting country code 
</script>
<style lang="scss" scoped>
:deep(.q-field__control) {
  min-height: 40px !important;
  height: 40px !important;

  .q-field__marginal {
    height: 40px !important;
  }
}

:deep(.q-field__control) {
  border-radius: 8px !important;
  padding: 0px 12px 0px 0px !important;
}

:deep(.q-field--outlined .q-field__control) {
  border-radius: 8px !important;

  &:hover:before {
    border-color: #d2d5e0 !important;
  }
}

:deep(.q-field__control) {
  color: $text-2;
}

:deep(.vue-tel-input) {
  height: 40px;
  border-radius: 8px !important;
  border: none;
  align-items: center;
  width: 100%;
  padding-left: 4px;

  &:focus-within {
    box-shadow: none !important;
    border-color: transparent;
  }

  input {
    height: 38px;
  }
}

:deep(.q-field) {
  padding-bottom: 0px !important;
  overflow: hidden;

  .q-field__native {
    flex-wrap: nowrap;

    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .q-field__bottom {
    display: none !important;
  }
}
</style>
