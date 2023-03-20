<template>
  <div class="custom-input-selector">
    <span class="q-mb-sm input-label">{{ label }}</span>
    <div v-if="inputType == 'input'">
      <q-input @update:model-value="dataUpdate" outlined :dense="true" color="gray" v-model="text"
        :placeholder="placeHolder" :rules="rules" :disable="isDisable"></q-input>
    </div>
    <div v-if="inputType == 'input-mask'">
      <q-input @update:model-value="dataUpdate" outlined :dense="true" mask="###-####-#######-#" v-model="text"
        :placeholder="placeHolder" :rules="rules" color="gray"></q-input>
    </div>
    <div v-if="inputType == 'input-append-slot'">
      <q-input outlined color="gray" @update:model-value="dataUpdate" :dense="true" :placeholder="placeHolder"
        v-model="text" :rules="rules">
        <template v-slot:append>
          <div class="flex">
            <span class="border-input-field"></span>
            <span class="font-small pl-10">min</span>
          </div>
        </template>
      </q-input>
    </div>
    <div v-else-if="inputType == 'date'">
      <q-input outlined v-model="text" :placeholder="placeHolder" :dense="true" color="gray">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer" color="primary">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="text" :options="optionsFn" mask="DD MMMM YYYY" @update:model-value="dataUpdate">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div v-else-if="inputType == 'time'">
      <q-input outlined v-model="text" :placeholder="placeHolder" :rules="rules" color="gray" :dense="true">
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="text" :format24h="false" @update:model-value="dataUpdate" now-btn mask="hh:mm A">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div v-else-if="inputType == 'single-selector'">
      <q-select color="gray" outlined :options="filterOptions" :dense="true" use-input input-debounce="0"
        @new-value="createValue" @filter="filterFn" :disable="isDisable" v-model="text"
        :placeholder="text ? '' : placeHolder" :autofocus="false" option-value="id" option-label="name"
        @update:model-value="dataUpdate" :options-dense="true" :rules="rules" emit-value map-options>
        <template v-slot:no-option>
          <q-item :dense="true">
            <q-item-section class="text-grey" :dense="true">
              No results
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:prepend v-if="icon">
          <q-icon name="place" />
        </template>
      </q-select>
    </div>
    <div v-else-if="inputType == 'multi-selector'" class="field-border">
      <q-select outlined :dense="true" v-model="selection" option-value="id" option-label="name" use-input use-chips
        multiple color="primary" :rules="rules" input-debounce="0" @update:model-value="dataUpdate"
        @new-value="createValue" :options="filterOptions" @filter="filterFn"></q-select>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";
import moment from "moment";
import { date } from "quasar";

const props = defineProps({
  rules: Array,
  arrayindex: { default: -1, type: Number },
  label: {
    default: "",
    type: String,
  },
  id: {
    default: "",
    type: String,
  },
  dataModel: {
    default: "",
    type: String,
  },
  placeHolder: {
    default: "",
    type: String,
  },
  inputType: {
    default: "input",
    type: String,
  },
  isDisable: {
    type: Boolean,
    default: false,
  },
  option: {
    type: Array,
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
  dateLimited: {
    type: String,
    default: "",
  },
  defineDateLimit: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["update"]);

const text = ref(props.dataModel);
const filterOptions = ref(props.option);

const selection = ref(props.dataModel);
const dataUpdate = (updatedData) => {
  // getting id only from the array of name and id
  props.inputType == "multi-selector" &&
    Array.isArray(updatedData) &&
    (updatedData = updatedData.map((cur) => cur.id));

  // converting Emirate Number value into Number
  props.label == "Emirate Number" &&
    Number(updatedData) &&
    (updatedData = Number(updatedData));
  props.label == "Emirate Number";

  //converting date format for backend
  const mainProperty = props.mainproperty;
  const property = props.innerProperty;
  const _arrayindex = props.arrayindex;
  emit("update", {
    updatedData,
    property,
    _arrayindex,
    mainProperty,
  });
};

// multi-option selector
const createValue = (val, done) => {
  if (val.length > 2) {
    if (!props.option.includes(val)) {
      done(val, "add-unique");
    }
  }
};
const filterFn = (val, update) => {
  update(() => {
    if (val === "") {
      filterOptions.value = props.option;
    } else {
      const needle = val.toLowerCase();
      filterOptions.value = props.option.filter(
        (v) => v.name.toLowerCase().indexOf(needle) > -1
      );
    }
  });
  //multi-option selector
};
const optionsFn = (d) => {
  if (props.dateLimited == "lower then current date") {
    return (
      d <=
      date.formatDate(
        date.subtractFromDate(Date.now(), { years: 18 }),
        "YYYY/MM/DD"
      )
    ); // date.formatDate(new Date(), "YYYY/MM/DD"); //moment(text.value).format("YYYY/MM/DD"); //date.formatDate(new Date(text.value), "YYYY/MM/DD");
  } else if (props.dateLimited == "upper then current date")
    return d >= moment(props.dataModel).format("YYYY/MM/DD");
  return true;
};
watch(
  () => props.dataModel,
  (valueN) => {
    if (props.inputType == "multi-selector") selection.value = valueN;
    text.value = valueN;
  },
  { deep: true }
);
</script>
<style scoped lang="scss">
:deep .q-field--outlined .q-field__control {
  border-radius: 8px !important;
}

// :deep .q-field--outlined .q-field__control:hover:before {
//   border-color: #d2d5e0 !important ;
// }
:deep .q-field {
  padding-bottom: 0px !important;

  .q-field__bottom {
    display: none !important;
  }
}

:deep .q-field {
  padding-bottom: 0px !important;

  .q-field__bottom {
    display: none !important;
  }
}

:deep .q-field--borderless .q-field__control {

  &:after,
  &:before {
    border: none !important;
  }
}

::v-deep .field-border .q-field__control {
  max-height: 70px !important;
}

::v-deep .field-border .q-field__control-container {
  max-height: 70px !important;
  overflow: scroll;
}
</style>
