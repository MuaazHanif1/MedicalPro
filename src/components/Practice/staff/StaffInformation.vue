<template>
  <div>
    <!--Doctor Detail Personal Information Start Here --->
    <q-form
      ref="form"
      class="full-width overflow-auto"
      :class="$q.screen.lt.md ? 'q-mx-auto' : ''"
    >
      <div class="mt-27 px-20">
        <span class="doctor-detail-information-heading">
          Personal Information
        </span>
        <div
          class="row"
          :class="[
            $q.screen.lt.sm
              ? 'q-col-gutter-y-xs q-mt-lg'
              : 'q-col-gutter-x-lg q-mt-md',
          ]"
        >
          <div
            class="col-md-5 row"
            v-for="(detail, index) in details"
            :key="index"
          >
            <div class="col-sm-4">
              <label class="text-weight-bold mb-5 d-block"
                >{{ detail.label }}:</label
              >
            </div>
            <div class="col-sm-6">
              <p class="mb-5" v-if="detail.value in staff && detail.helper">
                {{
                  staff[detail.value]
                    ? getName(staff[detail.value], detail.helper)
                    : "-"
                }}
              </p>
              <p class="mb-5" v-else-if="detail.value in staff">
                {{ staff[detail.value] ? staff[detail.value] : "-" }}
              </p>
              <p class="mb-5" v-else></p>
            </div>
          </div>
        </div>
      </div>

      <q-separator class="mt-40" />

      <!--Doctor Detail Personal Information End Here --->

      <!--**********************************************--->
      <!--Doctor Detail Contact Information StartHere --->
      <div class="mt-29 px-20">
        <span class="doctor-detail-information-heading">
          Contact Information
        </span>
        <div class="row q-mt-md q-col-gutter-y-md">
          <div
            class="col-sm-6 col-md-3 col-12 col-xl-3"
            v-for="contact_data in contact_info"
            :key="contact_data"
          >
            <div class="row items-center">
              <div class="col-2">
                <div class="icon-background row justify-center items-center">
                  <q-icon :name="contact_data.icon" />
                </div>
              </div>
              <div class="col-6">
                <div class="heading ellipsis">{{ contact_data.label }}</div>
                <div class="property-value color ellipsis">
                  {{ staff[contact_data.value] || "-" }}
                </div>
              </div>
            </div>
            <q-tooltip>
              {{ staff[contact_data.value] || "-" }}
            </q-tooltip>
          </div>
        </div>
      </div>
      <q-separator class="mt-40" />

      <!-- {{ isOverflown(practiceStore.currentDoctor.data.secondary_email) }} -->
      <!--********************************************--->
      <!--Doctor Detail Contact Information EndHere --->

      <!--Doctor Detail Current Address Start Here --->

      <div class="mt-29 px-20">
        <span class="doctor-detail-information-heading"> Current Address </span>
        <div
          class="row"
          :class="[
            $q.screen.lt.sm
              ? 'q-col-gutter-y-xs q-mt-lg'
              : 'q-col-gutter-x-lg q-mt-md',
          ]"
        >
          <div
            class="col-md-5 row"
            v-for="(current, index) in current_address"
            :key="index"
          >
            <div class="col-sm-4">
              <label class="text-weight-bold mb-5 d-block"
                >{{ current.label }}:</label
              >
            </div>
            <div class="col-sm-6">
              <p class="mb-5" v-if="current.value in staff && current.helper">
                {{
                  staff[current.value]
                    ? getName(staff[current.value], current.helper)
                    : "-"
                }}
              </p>
              <p
                class="mb-5"
                v-else-if="current.nested_key && current.value in staff"
              >
                {{
                  staff[current.value][current.nested_key]
                    ? staff[current.value][current.nested_key]
                    : "-"
                }}
              </p>
              <p class="mb-5" v-else-if="current.value in staff">
                {{ staff[current.value] ? staff[current.value] : "-" }}
              </p>
              <p class="mb-5" v-else></p>
            </div>
          </div>
        </div>
      </div>
      <q-separator class="mt-40" />

      <!--Doctor Detail Current Address End Here --->

      <!--********************************************--->

      <!--Doctor Detail Hometown Address Start Here --->

      <div class="mt-29 px-20">
        <span class="doctor-detail-information-heading">
          Hometown Address
        </span>
        <div
          class="row"
          :class="[
            $q.screen.lt.sm
              ? 'q-col-gutter-y-xs q-mt-lg'
              : 'q-col-gutter-x-lg q-mt-md',
          ]"
        >
          <div
            class="col-md-5 row"
            v-for="(home, index) in home_address"
            :key="index"
          >
            <div class="col-sm-4">
              <label class="text-weight-bold mb-5 d-block"
                >{{ home.label }}:</label
              >
            </div>
            <div class="col-sm-6">
              <p class="mb-5" v-if="home.value in staff && home.helper">
                {{
                  staff[home.value]
                    ? getName(staff[home.value], home.helper)
                    : "-"
                }}
              </p>
              <p
                class="mb-5"
                v-else-if="home.nested_key && home.value in staff"
              >
                {{
                  staff[home.value][home.nested_key]
                    ? staff[home.value][home.nested_key]
                    : "-"
                }}
              </p>
              <p class="mb-5" v-else-if="home.value in staff">
                {{ staff[home.value] ? staff[home.value] : "-" }}
              </p>
              <p class="mb-5" v-else></p>
            </div>
          </div>
        </div>
      </div>

      <!--Doctor Detail Hometown Address End Here --->
      <!--********************************************--->
      <q-separator class="mt-40" />

      <div class="mt-29 px-20">
        <span class="doctor-detail-information-heading"> Generate Login </span>
        <div
          class="row"
          :class="[
            $q.screen.lt.sm
              ? 'q-col-gutter-y-xs q-mt-lg'
              : 'q-col-gutter-x-lg q-mt-md',
          ]"
        >
          <div class="col-md-5 row">
            <div class="col-sm-5">
              <label class="text-weight-bold mb-5 d-block"
                >Login link sent on:</label
              >
            </div>
            <div class="col-sm-6">
              <p class="mb-5">
                {{ staff.credentials_send_at || "-" }}
              </p>
            </div>
          </div>

          <div class="col-md-5 row">
            <div class="col-sm-4">
              <label class="text-weight-bold mb-5 d-block"
                >Password reset:</label
              >
            </div>
            <div class="col-sm-6">
              <p class="mb-5">
                <q-chip
                :color="
                  staff.is_active ? 'primary' : 'grey-4'
                "
                :text-color="
                  staff.is_active ? 'white' : 'primary'
                "
              >
                {{
                  staff.is_active ? "Complete" : "Incomplete"
                }}
              </q-chip>
              <q-btn flat label="Resend link" no-caps padding="0px 10px 0px 10px" to=""></q-btn>
              </p>
            </div>
          </div>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { computed, ref } from "vue";
import { usePracticeStore } from "@/store/practice.js";
import getName from "@/composables/helper";
const $q = useQuasar();
const practiceStore = usePracticeStore();

const details = ref([
  {
    label: "First name",
    value: "first_name",
  },
  {
    label: "Middle name",
    value: "middle_name",
  },
  {
    label: "Last name",
    value: "last_name",
  },
  {
    label: "DOB",
    value: "dob",
  },
  {
    label: "Gender",
    value: "gender",
  },
]);

const contact_info = ref([
  {
    label: "Primary email",
    value: "email",
    icon: "email",
  },
  {
    label: "Secondary email",
    value: "secondary_email",
    icon: "email",
  },
  {
    label: "Primary phone",
    value: "phone_number",
    icon: "call",
  },
  {
    label: "Secondary phone",
    value: "secondary_phone_number",
    icon: "call",
  },
]);

const current_address = ref([
  {
    label: "Address 1",
    value: "current_address_1",
  },
  {
    label: "Address 2",
    value: "current_address_2",
  },
  {
    label: "Country",
    value: "current_country_id",
    nested_key: "name",
  },
  {
    label: "State",
    value: "current_state_id",
    nested_key: "name",
  },
  {
    label: "City",
    value: "current_city_id",
    nested_key: "name",
  },
  {
    label: "Zip code",
    value: "current_zip_code",
  },
]);

const home_address = ref([
  {
    label: "Address 1",
    value: "home_address_1",
  },
  {
    label: "Address 2",
    value: "home_address_2",
  },
  {
    label: "Country",
    value: "home_town_country_id",
    nested_key: "name",
  },
  {
    label: "State",
    value: "home_town_state_id",
    nested_key: "name",
  },
  {
    label: "City",
    value: "home_town_city_id",
    nested_key: "name",
  },
  {
    label: "Zip code",
    value: "home_zip_code",
  },
]);
const staff = computed(() => practiceStore.currentStaff);
</script>

<style></style>
