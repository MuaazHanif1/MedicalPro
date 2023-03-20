<template>
  <div class="container">
    <!-- <div class="absolute-right" @click="addAnotherVital">
      <q-btn class="add-bp-btn mr-15" text-color="primary" flat color="white" icon="add" :label="'Add ' + heading">
      </q-btn>
    </div> -->
    <div class="column" :class="{ 'mt-40': $q.screen.width < 600 }">
      <template :key="index" v-for="(vital, index) in vitalsData">
        <q-separator v-if="index !== 0" class="width-auto my-30" />

        <div class="row mb-10 justify-between">
          <span class="row">
            <h6>{{ heading }}</h6>
            <!-- <span class="medium-font" @click="editVital(index)">
              <q-icon class="color-green cursor-pointer ml-25 edit-icon" name="edit"></q-icon>
            </span> -->
          </span>
        </div>
        <div class="row">
          <template :key="index" v-for="(info, index) in enums.vitalEnums[vitalType]">
            <div v-if="info.id === 'updated_at'" class="mt-7 row col-12 col-sm-6">
              <span class="col-6 dark-black">{{ info.name }}:</span>
              <span class="col-6 dark-grey">{{
              vital[info.id] ? moment(vital[info.id]).format("DD MMM YYYY") : '-'
              }}</span>
            </div>

            <div class="mt-7 row col-12 col-sm-6" v-else-if="info.id === 'not_performed'">
              <span class="col-6 dark-black">{{ info.name }}:</span>
              <span class="col-6 dark-grey">{{
              vital["reason"] ? vital["reason"] : "-"
              }}</span>
            </div>

            <div v-else class="mt-7 row col-12 col-sm-6">
              <span class="col-6 dark-black">{{ info.name }}:</span>
              <span class="col-6 dark-grey">{{
              vital[info.id] ? vital[info.id] : "-"
              }}</span>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
import { defineEmits, defineProps, onMounted, ref } from "vue";
import { useVitalsStore } from "@/store/vitals";
import moment from "moment";
import enums from "./enums";

defineEmits(["show-create-vital"]);

const props = defineProps({
  heading: {
    type: String,
    default: "Blood Pressure",
  },
  vitalType: {
    type: String,
    default: "bloodPressure",
  },
});

// store
const store = useVitalsStore();

//
const isVital = ref(false);

const vitalsData = ref([]);
// get the update to date vitals here
onMounted(() => {
  vitalsData.value = store.$state[props.vitalType];
  console.log("////VitalsDta", store.$state, vitalsData.value.length);
  // if there's no vital
  // route the user to create vital section
  if (vitalsData.value.length === 0) {
    vitalsData.value = [{}]
    // addAnotherVital();
    isVital.value = true;
  }
});

/**  Description: this method loads the editable vital view.
    * @param {index} Number Data to be edited
     */

/**  Description: this method shows the vital creation view.
     */
// const addAnotherVital = () => {
//   emit("show-create-vital");
// };
</script>
<style lang="scss" scoped>
:deep .add-bp-btn {
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid #f6f6f8;
  border-radius: 4px;
  font-family: "Lato";
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  text-transform: capitalize;
}

:deep .add-bp-btn:hover {
  color: white !important;
  background: #547f6d !important;
}

.container {
  max-height: 350px !important;
  height: 350px !important;
}

:deep .edit-icon {
  background: #ebf0ee;
  border-radius: 8px;
  font-size: 18px;
  padding: 5px;
  cursor: pointer;
}

.width-50 {
  width: 50vw;
}
</style>
