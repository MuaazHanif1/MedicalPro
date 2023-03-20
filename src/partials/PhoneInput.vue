<template>
  <q-field v-model="model" outlined :rules="[rules.required, rules.phone]" :disable="is_disabled">
    <template v-slot:default>
      <vue-tel-input v-model="model" @keypress="isNumber($event)" @on-input="upload" @keydown.enter.prevent="onEnter"
        mode="international" :dropdownOptions="dropdownOptions" :disabled="is_disabled"
        v-on:country-changed="countryChanged" placeholder="000-000-0000"
        :defaultCountry="defaultCountry ? parseInt(defaultCountry) : countryKey"></vue-tel-input>
    </template>
  </q-field>
</template>
<script setup>
import { defineEmits, defineProps, ref, onMounted } from "vue";
import { getCurrentCountry } from "@/composables/helper-functions";
const countryKey = ref("PK");
onMounted(() => {
  const currentCountry = getCurrentCountry();
  if (currentCountry) {
    countryKey.value = getCurrentCountry();
  }
});
const props = defineProps({
  modelValue: String,
  is_disabled: {
    type: Boolean,
    default: false,
  },
  defaultCountry: {
    type: String,
  },
});
const dropdownOptions = {
  disabled: false,
  showDialCodeInList: true,
  showDialCodeInSelection: false,
  showFlags: true,
  showSearchBox: true,
  tabindex: 0,
}
const emit = defineEmits(["update:modelValue", "selected-country"]);
const model = ref(props.modelValue);
const upload = () => {
  emit("update:modelValue", model.value);
};
const countryChanged = (country) => {
  emit("selected-country", country);
};
const onEnter = () => {
  emit("searchPatient");
};
const isNumber = (evt) => {
  const keysAllowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+'];
  const keyPressed = evt.key;
  let isInvalid = false;
  if (model.value && keyPressed == '+') {
    const numbers = model.value.split('');
    if (numbers.length > 0) {
      isInvalid = true;
    }
  }
  if (!keysAllowed.includes(keyPressed) || isInvalid) {
    evt.preventDefault();
  }
}
</script>
<style lang="scss" scoped>
:deep .q-field__control {
  min-height: 40px !important;
  height: 40px !important;

  .q-field__marginal {
    height: 40px !important;
  }
}

:deep .q-field__control {
  border-radius: 8px !important;
  padding: 0px 12px 0px 0px !important;
}

:deep .q-field--outlined .q-field__control {
  border-radius: 8px !important;

  &:hover:before {
    border-color: #d2d5e0 !important;
  }
}

:deep .q-field__control {
  color: $text-2 !important;
}

:deep .vue-tel-input {
  height: 40px;
  border-radius: 8px !important;
  border: none;
  align-items: center;
  width: 100%;

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

  .q-field__bottom {
    display: none !important;
  }
}

:deep(.text-negative) {
  color: $negative !important;
}

:deep(.vti__input) {
  background: #f9f9fb;
}
</style>
