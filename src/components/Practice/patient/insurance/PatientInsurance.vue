<template lang="">
  <!-- Loading Spinner  -->
  <div class="row justify-center" v-if="loading">
    <q-spinner-dots color="primary" size="3em" :thickness="2" />
  </div>

  <div class="row justify-center" v-else-if="tabs.length == 0">
    <q-btn
      color="light-green"
      text-color="primary"
      unelevated
      icon="add"
      size="md"
      label="Add Insurance Provider"
      no-caps
      @click="toggleDialog(true)"
    />
  </div>

  <!-- Main Content  -->
  <q-splitter
    v-model="splitterModel"
    :horizontal="$q.screen.lt.md ? true : false" :disable="$q.screen.lt.sm ? false : true"
    v-else
  >
    <!-- Left Side Tabs  -->
    <template v-slot:before>
      <q-tabs
        v-model="tab"
        :vertical="$q.screen.lt.md ? false : true"
        :style="$q.screen.lt.md && 'height: 100%'"
        align="left"
        active-color="primary"
        indicator-color="primary"
        class="text-grey-6"
        text-color="grey-4"
      >
        <q-tab
          :name="tab.name"
          v-for="(tab, index) in tabs"
          :key="index"
          class=""
        >
          <template #default>
            <p
              class="text-subtitle1 mb-0 text-weight-medium text-capitalize"
            >
              {{ tab.label }}
            </p>
          </template>
        </q-tab>
      </q-tabs>
    </template>

    <!-- Right Side Tabs  -->
    <template v-slot:after>
      <keep-alive>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          :vertical="$q.screen.lt.md ? false : true"
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel
            :name="each_tab.name"
            class="pa-0 pt-5"
            v-for="(each_tab, index) in tabs"
            :key="index"
          >
            <keep-alive>
              <CompanyInsurances
                :company="each_tab"
                @show-dialog="toggleDialog"
              ></CompanyInsurances>
            </keep-alive>
          </q-tab-panel>
        </q-tab-panels>
      </keep-alive>
    </template>
  </q-splitter>

  <!-- Pop Up Design  -->
  <q-dialog v-model="add" no-backdrop-dismiss>
    <q-card style="width: 600px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold">Add Insurance</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form ref="createForm">
          <div class="row q-col-gutter-sm">
            <div
              class="col-12"
              :class="[add_field.col ? `col-md-${add_field.col}` : 'col-md-6']"
              v-for="(add_field, add_index) in createInputs"
              :key="add_index"
            >
              <keep-alive>
                <FormInput
                  :inputType="add_field.type"
                  :placeHolder="add_field.placeholder"
                  :isInput="
                    add_field.type === 'select' ||
                    add_field.type == 'multi_input'
                      ? false
                      : true
                  "
                  :label="add_field.label"
                  :option="add_field.options"
                  v-model="createModel[add_field.value]"
                  @selected-value="
                    updateModelValue($event, add_field.other_value)
                  "
                  :other_options="add_field.options"
                  :searchUrl="add_field.search_url"
                  :rules="add_field.rules"
                  :suffix="add_field.suffix"
                ></FormInput>
              </keep-alive>
            </div>
          </div>
          <div class="row justify-end mt-20">
            <q-btn
              unelevated
              color="primary"
              label="Add Insurance"
              :loading="adding"
                no-caps
            padding="8px 41px"
              @click="validateAndCreate"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, computed } from "vue";
import { usePracticeStore } from "@/store/practice";
import CompanyInsurances from "@/components/Practice/patient/insurance/CompanyInsurance.vue";
import FormInput from "@/partials/FormInput.vue";
import rules from "@/composables/validation-rules";
import { useUserStore } from "@/store/user";

const userStore = useUserStore();

const splitterModel = ref(20);
const tab = ref("");
const add = ref(false);
const adding = ref(false);
const loading = ref(true);
const practiceStore = usePracticeStore();
const createForm = ref(null);
const createModel = ref({
  insurance_name: null,
  company: null,
  percentage: null,
  amount: null,
});

// Loading All Insurances
practiceStore.getCurrentPatientInsurance(userStore.loginUser.id).then(() => {
  loading.value = false;
});

// Insurance Companies
practiceStore.getCurrentPatientInsuranceCompanies(userStore.loginUser.id).then(() => {
  tab.value = tabs.value[0].name;
  loading.value = false;
});

const tabs = computed(() => practiceStore.getPatientInsuranceAsTabs); //All Tabs
const createInputs = ref([
  {
    label: "Insurance name",
    placeholder: "Enter insurance name",
    value: "insurance_name",
    rules: [rules.required],
  },
  {
    label: "Company name",
    placeholder: "Enter company name",
    value: "company",
    rules: [rules.required],
  },
  {
    label: "Percentage",
    placeholder: "Enter percentage",
    value: "percentage",
    rules: [
      rules.required,
      rules.number,
      (val) => parseInt(val) > 0 || "value must be larger than 0",
      (val) => parseInt(val) <= 100 || "value must be equal or less than 100",
    ],
    suffix: "%",
  },
  {
    label: "Amount",
    placeholder: "Enter amount",
    value: "amount",
    append: "DH",
    rules: [
      rules.required,
      rules.number,
      (val) => parseInt(val) > 0 || "value must be larger than 0",
    ],
    suffix: "DH",
  },
]); // creating insurance structure

/**
 * @param {value} Boolean Data to be deleted
 */
// Toggle Dialog Box
const toggleDialog = (value) => {
  add.value = value;
};

// Create New Insurance
const validateAndCreate = () => {
  createForm.value.validate().then((success) => {
    if (success) {
      adding.value = true;
      practiceStore
        .createCurrentPatientInsurance(
          { ...createModel.value, patient_id: userStore.loginUser.id },
          true
        )
        .then(() => {
          adding.value = false;
          add.value = false;
          createModel.value = {
            insurance_name: null,
            company: null,
            percentage: null,
            amount: null,
          };
          tab.value = tabs.value[0].name;
        });
    }
  });
};
</script>

<style lang="scss" scoped>
:deep .q-tab {
  justify-content: start !important;
  min-height: 40px;
}
:deep .on-left {
    margin-right: 3px;
}
:deep(.q-splitter__after){
  padding-top: 10px;
}
</style>
