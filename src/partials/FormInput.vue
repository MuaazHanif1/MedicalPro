<template>
  <div class="custom-input-selector">
    <span class="q-mb-sm input-label">{{ label }}</span>
    <div v-if="isInput && inputType == 'date'">
      <!-- <p>{{ date_input }}</p> -->
      <q-input ref="date_input" @focus="restrictFocus" :modelValue="modelValue" hide-bottom-space="" :placeholder="placeHolder" :disable="isDisable"
        :bottom-slots="true" :suffix="suffix" mask="date" @update:modelValue="
          $emit('update:modelValue', $event), inputValue($event)
        " outlined :rules="rules">
        <q-popup-proxy class="mydatepopup" cover ref="qDateProxy1" style="max-width: 290px;" transition-show="scale" transition-hide="scale">
          <q-date :modelValue="modelValue" :options="dateLimiting" :rules="rules" @update:modelValue="
            $emit('update:modelValue', $event),
              inputValue($event),
              $refs.qDateProxy1.hide()
          ">
            <div class="row items-center">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer"> </q-icon>
        </template>
      </q-input>
    </div>
    <!-- if filed is simple input field  -->
    <div v-else-if="isInput">
      <q-input @keydown.enter.prevent="onEnter" @update:modelValue="
        inputValue($event, true)
      " :mask="input_mask" outlined :dense="true" :disable="isDisable" :type="inputType == 'textarea' ? 'textarea' : inputType"
        :placeholder="placeHolder" :rules="isDepended ? [...rules] : rules" :bottom-slots="true"
        :modelValue="modelValue" hide-bottom-space="" :suffix="suffix">
        <template v-slot:append v-if="isPassword">
          <q-icon :name="inputType == 'password' ? 'visibility_off' : 'visibility'" class="cursor-pointer"
            @click="showPassword" />
        </template>
        <!-- <template v-slot:error> </template> -->
      </q-input>
    </div>
    <!-- if filed is simple input field  -->
    <!-- if filed is multi input field  -->
    <div class="" v-else-if="inputType == 'multi_input'">
      <q-input class="custom-input-select" outlined @update:modelValue="
        $emit('update:modelValue', $event), inputValue($event)
      " :rules="rules" :modelValue="modelValue" no-error-icon>
        <template v-slot:append>
          <q-select borderless @update:modelValue="updateUnit()"  class="no-outline" option-label="name" option-value="id" v-model="res_model"
            :options="other_options" :dense="true" :disable="isDisable" :options-dense="true" :for="'for'" emit-value
            map-options>
          </q-select>
        </template>
      </q-input>
    </div>
    <!-- if filed is multi input field  -->
    <!-- if filed is select input field  -->
    <div v-else>
      <q-select outlined :options="options" :dense="true" :readonly="isDisable || option.length == 0" :option-value="optionvalue" :loading="false"
        :option-disable="opt => Object(opt) === opt ? opt.inactive === true : false" :option-label="optionlabel"
        @update:modelValue="
          $emit('update:modelValue', $event), selectOptionValue($event)
        " :modelValue="modelValue" :options-dense="true" :rules="[...rules]" :for="'for'" emit-value map-options
        @filter="filterFn" use-input :placeholder="modelValue ? '' : placeHolder">
        <template v-slot:prepend v-if="icon">
          <q-icon name="place" />
        </template>
      </q-select>
    </div>
    <!-- if filed is select input field  -->
  </div>
</template>
<script setup>
import { defineProps, defineEmits, ref, watch, } from "vue";
import axiosApiClient from "@/axios";

const emit = defineEmits([
  "update:modelValue",
  "dropdown-value-change",
  "input-value",
  "selected-value",
  "update:multi_select_value"
]);
const res_model = ref();
const props = defineProps({
  select_default_value: {
    type: String,
    default: ''
  },
  input_mask: {
    type: String,
    default: '',
  },
  max: {
    type: [String, Date, Number],
    default: null,
  },
  min: {
    type: [String, Date, Number],
    default: null,
  },
  rules: {
    type: Array,
    default: () => [],
  },
  modelValue: [String, Boolean, Number],
  multi_select_value: [String, Boolean, Number],
  arrayindex: { default: -1, type: Number },
  suffix: {
    type: String,
    default: null,
  },
  label: {
    default: "",
    type: String,
  },
  id: {
    default: 0,
    type: Number,
  },
  dataModel: {
    default: "",
    type: String,
  },
  inputType: {
    default: "text",
  },
  isPassword: {
    default: false,
  },
  placeHolder: {
    default: "",
    type: String,
  },
  isInput: {
    default: true,
    type: Boolean,
  },
  isDisable: {
    type: Boolean,
    default: false,
  },
  option: {
    type: Array,
  },
  optionlabel: {
    type: String,
    default: "name",
  },
  optionvalue: {
    type: String,
    default: "id",
  },
  mainproperty: {
    default: "none",
  },
  icon: {
    default: false,
    type: Boolean,
  },
  innerProperty: {
    default: "",
    type: String,
  },
  dependentRule: {
    default: [],
  },
  dependentOn: {
    type: [String, Boolean, Number],
    default: null,
  },
  isDepended: {
    type: Boolean,
    default: false,
  },
  searchUrl: {
    type: String,
    default: null,
  },
  other_value: {
    type: String,
    default: null,
  },
  other_options: {
    type: Array,
    default: () => [],
  },
});

const date_input = ref(null);
let sbwopass = false;
const options = ref(props.option);
const showPassword = () => {
  sbwopass = !sbwopass;
  emit("show-password", sbwopass);
};

const selectOptionValue = (id) => {
  emit("dropdown-value-change", id);
}; // on selecting new value
const inputValue = (data, masking = false) => {
  if (masking) {
    // alert('hi')
    let un_masked = data.replaceAll('-', '');
    emit('update:modelValue', un_masked);
  } else {
    emit('update:modelValue', data);
  }
}; // on input function
const filterFn = (val, update) => {
  if (val === "" && !props.searchUrl) {
    update(() => {
      options.value = props.option;
      // here you have access to "ref" which
      // is the Vue reference of the QSelect
    });
    return;
  } else if (props.searchUrl) {
    update(() => {
      axiosApiClient.post(`${props.searchUrl}`, { search: val }).then((res) => {
        options.value = res.data.data.data;
      });
    });
  } else {
    update(() => {
      const needle = val.toLowerCase();
      options.value = options.value.filter(
        (v) => v.name.toLowerCase().indexOf(needle) > -1
      );
    });
  }
}; // filtering search filed options

const dateLimiting = (date) => {
  if (props.max && props.min) {
    return date <= props.max && date >= props.min;
  } else if (props.min) {
    return date >= props.min;
  } else if (props.max) {
    return date <= props.max;
  }
  return true;
};

watch(res_model, (newModel) => {
  emit("selected-value", newModel);
});
// on enter emit function
const onEnter = () => {
  emit("forminputonEnter");
};

const restrictFocus = () => {
  date_input.value.blur();
}

const updateUnit = () => {
  return
}
</script>
<style>
  .mydatepopup{
    min-width: 24px !important;
  }
</style>
<style scoped lang="scss">
:deep(.q-field--outlined .q-field__control) {
  border-radius: 8px !important;
}

:deep(.q-field__control) {
  color: $text-2;
}

:deep(.q-field--outlined .q-field__control:hover:before) {
  border-color: #d2d5e0 !important;
}
</style>
<style lang="scss" scoped>
:deep(.q-field--outlined>.q-field__control) {
  border-radius: 8px !important;
}

:deep(.q-textarea .q-field__control) {
  height: auto !important;
}

:deep(.q-field__control) {
  color: $text-2;
  height: 40px;
}

:deep(.q-field--outlined .q-field__control:hover:before) {
  border-color: #d2d5e0 !important;
}

:deep(.q-field__marginal) {
  height: 40px;
}

:deep(.custom-input-select .q-field__append) {
  width: 70px;
  border-left: 1px solid $grey-5;

  .q-anchor--skip{
    border-left: none;
  }

  .q-field__control {
    width: 58px;
  }
}

:deep(.q-field--borderless .q-field__control) {

  &:after,
  &:before {
    border: none !important;
  }

  .q-field__control-container {
    flex-basis: 72px;
  }

  .q-field__append {
    justify-content: space-around;
  }
}

:deep(.q-menu .q-item__label) {
  text-transform: capitalize;
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

  .q-field__append {
    .q-field__native {
      span {
        white-space: pre-wrap;
        overflow: auto;
        text-overflow: initial;
      }
    }
  }

  .q-field__bottom {
    display: none !important;
  }
}
</style>