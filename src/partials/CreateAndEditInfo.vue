<template>
  <div>
    <div>
      <q-form ref="form" :greedy="true">
        <!-- Header  -->
        <div class="row justify-between">
          <h2 class="text-h6 items-center row">
            <span
              style="
                white-space: nowrap;
                overflow: hidden;
                display: block;
                text-overflow: ellipsis;
                max-width: 350px;
              "
              class="text-capitalize"
              >{{ heading }}
              <q-tooltip>
                {{ heading }}
              </q-tooltip></span
            >
            &nbsp;
            <!-- <q-btn
              class="px-6 ml-10 border-8"
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
            <q-btn
              class="px-6 mx-10 border-8"
              size="sm"
              unelevated
              color="light-green"
              text-color="primary"
              icon="delete"
              square
              @click="$emit('delete-record', { ...data })"
            >
            </q-btn> -->
          </h2>
          <!-- <div
            v-if="canAdd"
            :style="$q.screen.lt.sm ? 'order: -1;  margin-bottom: 10px' : ''"
          >
            <q-btn
              color="light-green"
              text-color="primary"
              unelevated
              icon="add"
              size="md"
              :label="addTitle"
              no-caps
              @click="$emit('add-dialog', !add)"
            />
          </div> -->
        </div>
        <!-- Header  -->

        <!-- slot for details  -->
        <div class="mt-20" v-if="!editable">
          <slot name="details" :info="info" :data="data"></slot>
        </div>
        <!-- slot for details  -->

        <!-- slot for edit  -->
        <div class="mt-10 q-col-gutter-md" v-else>
          <slot
            name="edit"
            :info="info"
            :data="data"
            :returnedData="returnedData"
          ></slot>
        </div>
        <div class="row mt-20 mb-25 justify-between" v-if="editable">
          <q-btn
            flat
            color="primary"
            label="Cancel"
            padding="8px 4px"
            no-caps
            @click="() => (editable = false)"
          />
          <q-btn
            unelevated
            color="primary"
            label="Save"
            padding="8px 41px"
            no-caps
            @click="validateAndSubmit"
          />
        </div>
        <!-- slot for edit  -->
      </q-form>
    </div>
  </div>
</template>
<script setup>
import { defineProps, ref, defineEmits, defineExpose, computed } from "vue";

const props = defineProps({
  heading: {
    type: String,
  },
  info: Object,
  data: {
    type: Object,
  },
  model: Object,
  disabled: {
    type: Boolean,
    default: false,
  },
  canAdd: {
    type: Boolean,
    default: false,
  },
  addTitle: {
    type: String,
    default: "Add new",
  },
});

// const add = ref(false);
const emit = defineEmits(["form-submit", "add-dialog", "delete-record"]);
const form = ref();
const temp = computed(() => props.data);
const returnedData = ref(temp);
const editable = ref(false);

const validateAndSubmit = () => {
  form.value.validate().then((success) => {
    if (success) {
      editable.value = false;
      emit("form-submit", returnedData.value);
    }
  });
};

/**
 * adding in array for multiple records
 * @param {key} key array key
 * @param {model} Array array to be inserted
 */
const addInData = (key, model) => {
  model.deletable_id = returnedData.value[key].length
    ? returnedData.value[key][returnedData.value[key].length - 1].id
      ? returnedData.value[key][returnedData.value[key].length - 1].id + 1
      : returnedData.value[key][returnedData.value[key].length - 1]
          .deletable_id + 1
    : 1;
  returnedData.value[key].push(model);
};

/**
 * deleting from array of multiple records
 * @param {key} key array key
 * @param {index} Number array key index
 */
const deleteInData = (key, index) => {
  returnedData.value[key] = returnedData.value[key].filter((a) => {
    if (a.id) {
      return a.id != index;
    } else {
      return a.deletable_id != index;
    }
  });
};

defineExpose({
  addInData,
  deleteInData,
});
</script>
<style lang="scss" scoped>
:deep .on-left {
  margin-right: 3px;
}

</style>
