<template>
  <q-form :greedy="true" ref="form" class="full-width overflow-auto" style="max-width: 600px;" :class="$q.screen.lt.md ? 'q-mx-auto' : ''">
    <div v-for="(object, index) in contactFieldData" :key="index">
      <ContactPerson
        :index="index"
        @deleteaddress="deleteAddressField"
        :object="object"
        :mainproperty="mainproperty"
      ></ContactPerson>
    </div>
    <div class="row q-mt-lg">
      <div class="col-12">
        <div class="drop-down row justify-center items-center">
          <span
            class="drop-down-button row justify-center items-center"
            @click.stop="addAddressField"
          >
            <i><q-icon name="add" :size="'sm'" :color="'green-10'" /></i
          ></span>
          <span class="q-ml-md drop-down-button-text"
            >Add another contact details</span
          >
        </div>
      </div>
    </div>
  </q-form>
</template>

<script setup>
import { defineProps, computed, defineExpose, ref } from "vue";
import { usePracticeStore } from "@/store/practice";
import ContactPerson from "./ContactPerson.vue";
const props = defineProps({
  array: {
    type: Array,
  },
  mainproperty: {
    type: String,
    default: "none",
  },
});

const form = ref(null);

const store = usePracticeStore();
const contactFieldData = computed(() => {
  return props.array;
});

const addAddressField = () => {
  store.addingContactArrayMoreField();
};

const deleteAddressField = () => {
};

defineExpose({
  form,
});
</script>
<style scoped lang="scss">
.heading {
  font-family: "lato";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  /* identical to box height */

  /* Text */

  color: #0d0c22;
}
.sub-heading {
  font-family: "lato";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 12px;
  /* identical to box height, or 92% */

  text-transform: capitalize;

  /* Text 2 */

  color: #7d8693;
}
.drop-down {
  height: 57px;
  border: 1px dashed #d2d5e0;
  border-radius: 12px;
}
.drop-down-button {
  width: 34px;
  height: 34px;
  left: 168px;
  top: 11.5px;
  background: #ecefed;
  border-radius: 12px;
  cursor: pointer;
  .drop-down-button-text {
    font-family: "lato";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 140%;
    color: #0d0c22;
  }
}
</style>
