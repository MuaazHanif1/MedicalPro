<template lang="">
  <div class="row justify-center py-10" v-if="loading">
    <q-spinner-dots color="primary" size="3em" :thickness="2" />
  </div>
  <div class="px-30 py-20" v-else>
    <h6 class="text-h6 text-weight-medium mb-40">Detail Overview</h6>

    <div class="bg-white rounded-borders sticky-div items-center">
      <div class="row justify-between px-30 pb-30 pt-25 ">
        <div class="row q-gutter-lg items-center">
          <q-avatar rounded size="80px">
            <img
              :src="practiceStore.currentStaff.profile_photo_url"
              v-if="practiceStore.currentStaff.profile_photo_url"
            />
            <img src="@/assets/man.png" v-else />
          </q-avatar>
          <div>
            <p class="text-h6 text-weight-bold mb-0">
              {{ practiceStore.getStaffFullName }}
            </p>
            <p
              class="doctor-sub-heading mb-3 ellipsis"
              style="max-width: 300px"
            >
              {{ practiceStore.currentStaff.employee_type.name }},
              {{ practiceStore.currentStaff.department.name }} |
              {{ practiceStore.currentStaff.role }}
            </p>
            <p class="mb-0">
              <q-icon name="email" color="primary" size="16px" />
              <span class="doctor-sub-heading va-top"
                >&nbsp;&nbsp;{{ practiceStore.currentStaff.email }}</span
              >
            </p>
            <p class="mb-0">
              <q-icon name="call" color="primary" size="16px" />
              <span class="doctor-sub-heading va-top"
                >&nbsp;&nbsp;{{
                  `${practiceStore.currentStaff.country_code_phone_number} ${practiceStore.currentStaff.phone_number}`
                }}</span
              >
            </p>
          </div>
          <q-btn-dropdown
            split
            style="align-self: flex-start"
            flat
            no-caps
          >
            <template v-slot:label>
              <q-chip
                :color="
                  practiceStore.currentStaff.is_active ? 'primary' : 'grey-4'
                "
                :text-color="
                  practiceStore.currentStaff.is_active ? 'white' : 'primary'
                "
              >
                {{
                  practiceStore.currentStaff.is_active ? "Active" : "In-Active"
                }}
              </q-chip>
            </template>

            <q-list>
              <q-item
                clickable
                v-close-popup
                @click="changeStatus(1)"
                :disable="practiceStore.currentStaff.is_active == 1"
              >
                <q-item-section>
                  <q-item-label>Active</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                v-close-popup
                @click="changeStatus(0)"
                :disable="!practiceStore.currentStaff.is_active"
              >
                <q-item-section>
                  <q-item-label>In-Active</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>

        <q-btn
          style="align-self: flex-start"
          icon="edit"
          color="grey-3"
          text-color="primary"
          size="sm"
          padding="4px 4px"
          :to="{name: 'update-staff'}"
        ></q-btn>
      </div>
    </div>

    <div class="bg-white rounded-borders mt-25 pb-30">
      <keep-alive>
        <StaffInformation></StaffInformation>
      </keep-alive>
    </div>
  </div>
</template>
<script setup>
import StaffInformation from "@/components/Practice/staff/StaffInformation.vue";
import { usePracticeStore } from "@/store/practice.js";
import { useRoute } from "vue-router";
import { ref } from "vue";

const route = useRoute();
const practiceStore = usePracticeStore();
const loading = ref(true);

practiceStore.getSingleStaff(route.params.id).then(() => {
  loading.value = false;
});

const changeStatus = (status) => {
  practiceStore.updateStaffStatus({ user_id: route.params.id, status: status });
};
</script>

<style lang="scss" scoped>
.sticky-div {
  position: sticky;
  top: 0;
  z-index: 4;
}
:deep(.q-btn.non-selectable) {
  padding-inline: 0px;

  &.q-hoverable:hover > .q-focus-helper,
  &.q-focusable:focus > .q-focus-helper {
    opacity: 0 !important;
  }
}
</style>
