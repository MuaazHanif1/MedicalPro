<template lang="">
  <div class="row justify-center" v-if="updating">
    <q-spinner-dots color="primary" size="3em" :thickness="2" />
  </div>
  <div v-else>
    <div v-for="(info, index) in information" :key="index">
      <q-form ref="form" :greedy="true">
        <!-- header  -->
        <h2 class="text-h6">
          {{ info.heading }} &nbsp;
          <q-btn
            class="px-6 mr-10 border-8"
            size="sm"
            unelevated
            color="light-green"
            text-color="primary"
            icon="edit"
            square
            @click="() => (editable = true)"
            v-if="!editable"
          >
          </q-btn>
        </h2>
        <!-- header  -->

        <!-- details view  -->
        <div class="row mt-20" v-if="!editable">
          <div
            class="col-md-6 col-12 row mb-15"
            v-for="(field, index) in info.fields"
            :key="index"
          >
            <div class="col-sm-5 col-xs-6">
              <label class="text-weight-bold">{{ field.label }}:</label>
            </div>
            <div class="col-sm-6 col-xs-6">
              <p
                class="mb-0"
                style="word-break: break-all"
                v-if="field.value in data && field.helper"
              >
                {{
                  data[field.value]
                    ? getName(data[field.value], field.helper)
                    : "-"
                }}
              </p>
              <p
                class="mb-0"
                style="word-break: break-all"
                v-else-if="field.format"
              >
                {{
                  data[field.value]
                    ? $filters.formatDate(data[field.value], field.format)
                    : "-"
                }}
              </p>
              <p
                class="mb-0"
                style="word-break: break-all"
                v-else-if="field.prepend_key"
              >
                {{
                  data[field.value]
                    ? `${data[field.prepend_key]} ${data[field.value]}`
                    : "-"
                }}
              </p>
              <p
                class="mb-0"
                style="word-break: break-all"
                v-else-if="field.value in data"
              >
                {{ data[field.value] ? data[field.value] : "-" }}
              </p>
              <p class="mb-0" style="word-break: break-all" v-else>-</p>
            </div>
          </div>
        </div>
        <!-- details view  -->

        <!-- edit view  -->
        <div class="row mt-10 q-col-gutter-md" v-else>
          <div
            class="col-md-6 col-12"
            v-for="(field, index) in info.fields"
            :key="index"
          >
            <label
              class="q-mb-sm phone-number-label d-block q-pt-none text-caption text-grey-9"
              v-if="field.input.type === 'phone'"
              >{{ field.input.label }}</label
            >
            <CountryPhone
              v-if="field.input.type === 'phone'"
              v-model="returnedData[field.value]"
              :defaultCountry="data[field.country_code]"
              :is_disabled="field.disabled"
              @selected-country="
                (code) =>
                  (returnedData[field.country_code] = `+${code.dialCode}`)
              "
            ></CountryPhone>
            <FormInput
              v-else-if="field.input.next_dropdown_required"
              v-model="returnedData[field.value]"
              :label="field.input.label"
              :inputType="field.input.type"
              :isInput="field.input.type === 'select' ? false : true"
              :option="field.input.type === 'select' ? field.input.options : []"
              :optionvalue="
                field.input.type === 'select' ? field.input.optionvalue : 'id'
              "
              :optionlabel="
                field.input.type === 'select' ? field.input.optionlabel : 'name'
              "
              :rules="field.input.rules"
              :input_mask="field.input.mask || ''"
              @dropdown-value-change="
                dropdownHelper($event, field.input.key),
                  resetfield(field.input.key)
              "
              :placeHolder="field.input.placeholder"
              :max="field.input.max ? field.input.max : null"
            ></FormInput>
            <FormInput
              v-else
              v-model="returnedData[field.value]"
              :placeHolder="field.input.placeholder"
              :label="field.input.label"
              :inputType="field.input.type"
              :input_mask="field.input.mask || ''"
              :isInput="field.input.type === 'select' ? false : true"
              :option="field.input.type === 'select' ? field.input.options : []"
              :optionvalue="
                field.input.type === 'select' ? field.input.optionvalue : 'id'
              "
              :optionlabel="
                field.input.type === 'select' ? field.input.optionlabel : 'name'
              "
              :rules="field.input.rules"
              :max="field.input.max"
            ></FormInput>
          </div>
        </div>
        <div class="row mt-30 justify-between" v-if="editable">
          <q-btn
            flat
            unelevated
            :ripple="false"
            color="primary"
            label="Cancel"
            no-caps
            padding="8px 4px"
            @click="() => (editable = false)"
          />
          <q-btn
            unelevated
            color="primary"
            label="Save"
            padding="8px 41px"
            no-caps
            :loading="updating"
            size="md"
            @click="validateAndSubmit(index)"
          />
        </div>
        <!-- edit view  -->
      </q-form>
    </div>
  </div>
</template>
<script setup>
import { defineProps, ref, defineEmits } from "vue";
import FormInput from "@/partials/FormInput.vue";
import CountryPhone from "@/partials/CountryPhone.vue";
import getName from "@/composables/helper.js";
import dropdownHelper from "@/composables/dropdown-helper";
import { useGeneralStore } from "@/store/general";
const props = defineProps({
  information: Object,
  data: {
    type: Object,
  },
  model: Object,
  disabled: {
    type: Boolean,
    default: false,
  },
  updating: {
    type: Boolean,
    default: false,
  },
});

const generalStore = useGeneralStore();
const emit = defineEmits(["form-submit"]);
const form = ref([]);
const returnedData = ref({ ...props.data }); // edited data
const editable = ref(false);

const resetfield = (key) => {
  if (key == "country_id") {
    returnedData.value.state_id ? (returnedData.value.state_id = "") : "";
    returnedData.value.city_id ? (returnedData.value.city_id = "") : "";
    generalStore.states = [];
    generalStore.cities = [];
  } else if (key == "state_id") {
    returnedData.value.city_id ? (returnedData.value.city_id = "") : "";
    generalStore.cities = [];
  }
};

const validateAndSubmit = (index) => {
  form.value[index].validate().then((success) => {
    if (success) {
      editable.value = false;
      emit("form-submit", returnedData.value);
    }
  });
}; // for emitting edited data
</script>
<style lang="scss" scoped>
:deep .q-field {
  padding-bottom: 0px !important;

  .q-field__bottom {
    display: none !important;
  }
}
:deep .q-hoverable:hover > .q-focus-helper,
:deep .q-focusable:focus > .q-focus-helper {
  opacity: 0 !important;
}

:deep(.q-position-engine) {
  min-width: 24px !important;
}
</style>
