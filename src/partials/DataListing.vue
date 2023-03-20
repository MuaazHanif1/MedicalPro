<template>
  <div class="listing">
    <div class="row justify-between items-center mb-18">
      <div class="listing-title" v-if="information.heading">{{ information.heading }}</div>
      <div class="row">
        <q-btn v-if="information.createbtn" :to="{ path: information.createbtn.link }" color="white" flat
          class="add-patient-btn" text-color="primary" icon="add" :label="information.createbtn.text">
        </q-btn>
        <q-btn v-if="information.isSimpleButton" color="white" flat class="add-patient-btn" text-color="primary"
          icon="add" @click.stop="emit('toggle-DialogBox')" :label="information.text">
        </q-btn>
      </div>
    </div>
    <slot name="date-slider"></slot>
    <q-table :rows="computedRow" :columns="columns" virtual-scroll v-model:pagination="pagination"
      no-data-label="No data available" :style="computedRow && computedRow.length > 8 ? 'height: 90vh' : ''"
      @request="onRequest" :loading="loading" rows-per-page-label="Showing" row-key="rowIndex"
      class="my-sticky-header-table" flat>
      <template v-slot:body-cell-index="props">
        <q-td :props="props">
          <div>{{ props.rowIndex + 1 }}</div>
        </q-td>
      </template>
      <template v-slot:no-data="{ message }">
        <div class="loading">
          <div v-if="message=='No data available'" class="loading-inner">
            <img :src="require('@/assets/data-loading-icon.svg')" alt="action" />
            <div class="listing-title">{{ message }}</div>
            <q-btn v-if="information.createbtn" :to="{ path: information.createbtn.link }" color="white" flat
              class="add-patient-btn" text-color="primary" icon="add" :label="information.createbtn.text">
            </q-btn>
            <q-btn v-if="information.isSimpleButton" color="white" flat class="add-patient-btn" text-color="primary"
              icon="add" @click.stop="emit('toggle-DialogBox')" :label="information.text">
            </q-btn>
          </div>
          <div v-else class="full-width row flex-left text-primary q-gutter-sm">
            <span>{{ message }}</span>
          </div>
        </div>
      </template>

      <!-- all patients component slot -->
      <!-- patient name column slot for all patient -->
      <template v-slot:body-cell-first_name="props">
        <q-td :props="props">
          <div class="text-subtitle2">{{ props.row.first_name }} {{ props.row.middle_name }} {{ props.row.last_name }}</div>
          <p class="text-caption text-weight-light">{{ props.row.email }}</p>
          <p class="text-caption text-weight-light">{{ props.row.primary_email }}</p>

        </q-td>
      </template>

      <!-- all patients component slot -->
      <!-- patient phone number column slot for all patient -->
      <template v-slot:body-cell-phone_number="props">
        <q-td :props="props">
          <div class="text-subtitle2">
            {{ props.row.country_code }} {{ props.row.phone_number }}
          </div>
        </q-td>
      </template>

      <!-- all patients component slot-->
      <!-- phone verified slot active/inactive  -->
      <template v-slot:body-cell-verified_phone_number="props">
        <q-td :props="props">
          <q-chip :class="
            props.value == true
              ? 'status-chip active'
              : 'status-chip inactive'
          " text-color="white">
            {{ props.value == true ? "Active" : "InActive" }}
          </q-chip>
          <div class="my-table-details">
            {{ props.row.details }}
          </div>
        </q-td>
      </template>

      <!-- all appointments component slot -->
      <!-- patient name for patient id slot for appointments list -->
      <template v-slot:body-cell-patient_id="props">
        <q-td :props="props">
          <div class="text-subtitle2">
            {{ props.row.patient.first_name }} {{ props.row.patient.last_name }}
          </div>
        </q-td>
      </template>

      <!-- all appointments component slot -->
      <!-- patient name for patient id slot for appointments list -->

      <template v-slot:body-cell-doctor_id="props">
        <q-td :props="props">
          <div class="text-subtitle2">
            {{ props.row.doctor.first_name }} {{ props.row.doctor.last_name }}
          </div>
        </q-td>
      </template>

      <!-- all appointments component slot-->
      <!-- for start and end time  -->

      <template v-slot:body-cell-start_time="props">
        <q-td :props="props">
          <div class="text-subtitle2">
            {{ timeFormatFilter(props.row.start_time) }} -
            {{ timeFormatFilter(props.row.end_time) }}
          </div>
        </q-td>
      </template>

      <!-- all appointments component slot-->
      <!-- status slot  -->

      <template v-slot:body-cell-status="props">

        <q-td :props="props">
          <div v-if="props.row.amount">
            <div @click="changeStatus(props.row.id)">
              <q-chip :class="
              props.row.status == true
              ? 'status-chip active'
              : 'status-chip inactive'
              " text-color="white" style="width:100px;">
                <span class="flex justify-center width-100 cursor-pointer">
                  {{ props.row.status ? "Published" : "UnPublished" }}
                </span>
              </q-chip>
            </div>
          </div>
          <div v-else>
            <div>
              <q-chip :class="
              props.row.status == 'Pending'
              ? 'status-chip pending'
              : props.row.status == 'Confirm'
              ? 'status-chip active'
              : 'status-chip inactive'
              " text-color="white">
                {{ props.row.status }}
              </q-chip>
            </div>
            <div class="my-table-details">
              {{ props.row.details }}
            </div>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td v-if="information.detail_page_link" :props="props" class="action-row">
          <img :src="require('@/assets/svg/menu-icon.svg')" alt="action" />
          <q-menu :offset="[80, -15]">
            <q-list>
              <q-item :to="{
                name: information.detail_page_link,
                params: { id: props.row.id },
              }" clickable v-close-popup>
                <q-item-section color="green">View Details</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-td>
        <q-td v-if="information.delete_item_btn" :props="props" class="action-row">
          <q-icon name="delete" size="1.5rem" @click="deleteItem(props.row)"></q-icon>
        </q-td>
      </template>

      <template v-slot:body-cell-specializations="props">
        <q-td :props="props">
          <div v-if="props.row.doctor_specializations && props.row.doctor_specializations.length">
            <div class="text-subtitle2" v-for="(cur, key) in props.row.doctor_specializations.slice(0, 1)" :key="key">{{
            cur.name
            }}
            </div>
            <div class="text-subtitle2" v-if="props.row.doctor_specializations.length > 1">and
              {{ props.row.doctor_specializations.length - 1 }} more
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                <p v-for="(cur, key) in props.row.doctor_specializations" :key="key">{{ cur.name }}</p>
              </q-tooltip>
            </div>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-kyc_status="props">
        <q-td :props="props">
          <div>
            <q-chip :class="
              props.row.kyc_status == 'Accepted' ? 'status-chip active' : 'status-chip status-kyc'
            " text-color="white">
              {{ props.row.kyc_status}}
            </q-chip>
          </div>
        </q-td>
      </template>

      <!--  Doctor Detail section-->
      <!-- slotfrom-slotto   -->
      <template v-slot:body-cell-slotfrom_slotto="props">
        <q-td :props="props">
          <div class="text-subtitle2">{{ props.row.slotfrom_slotto }}</div>
        </q-td>
      </template>
      <!--  Doctor Detail Section-->
      <!-- timefrom_timeto   -->
      <template v-slot:body-cell-timefrom_timeto="props">
        <q-td :props="props">
          <div class="text-subtitle2">{{ props.row.timefrom_timeto }}</div>
        </q-td>
      </template>
      <!--  Doctor Detail Section-->
      <!-- slotfrom-slotto   -->
      <template v-slot:body-cell-slotduration="props">
        <q-td :props="props">
          <div class="text-subtitle2">{{ props.row.slotduration }}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-availabledays="props">
        <q-td :props="props">
          <div class="text-subtitle2">{{ props.row.availabledays }}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-status_doctor_detail="props">
        <q-td :props="props">
          <div
            @click.stop="emit('toggle-PublishedDialogBox',props.row.status_doctor_detail ? 
            'Published' : 'UnPublished',props.row.id)"
            class="cursor-pointer">
            <q-chip :class="
              props.row.status_doctor_detail ? 'status-chip active' : 'status-chip'
            " text-color="white">
              {{ props.row.status_doctor_detail ? "Published" : "UnPublished" }}
            </q-chip>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-active="props">
        <q-td :props="props">
          <div>
            <q-chip :class="
              props.row.is_active ? 'status-chip active' : 'status-chip'
            " text-color="white">
              {{ props.row.is_active ? "Active" : "InActive" }}
            </q-chip>
          </div>
          <div class="my-table-details">
            {{ props.row.details }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-amount="props">
        <q-td :props="props">
          {{props.row.amount}} AED
        </q-td>
      </template>

      <template v-slot:pagination="scope">
        <q-pagination v-model="scope.pagination.page" active-text-color="primary" active-color="paper-white"
          :max="parseInt(scope.pagination.last_page)" @update:model-value="onRequest" :min="1" :max-pages="3"
          boundary-numbers direction-links />
      </template>
    </q-table>
  </div>
</template>
<script setup>
import { defineProps, defineEmits, computed } from "vue";
import { timeFormatFilter } from "@/composables/helper-functions";

const props = defineProps({
  rows: Object,
  columns: Object,
  pagination: Object,
  information: Object,
  loading: {
    default: false,
    type: Boolean,
  },
});
const computedRow = computed(() => props.rows);
const emit = defineEmits(["pagination-data", "toggle-DialogBox", "change-status",
'toggle-PublishedDialogBox','delete-item']);
const pagination = computed(() => props.pagination);
const loading = computed(() => {
  return props.loading;
});
const onRequest = (req) => {
  emit("pagination-data", req);
};

const changeStatus = (req) => {
  emit("change-status", req);
}
const deleteItem = (req) => {
  emit('delete-item',req);
}
</script>

<style scoped lang="scss">
/* status chips start */
:deep .status-chip {
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  color: #ffffff;
  margin-left: -1px;
  height: 28px;
  width: auto !important;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

:deep .inactive {
  background: #b5b7b6;
}

:deep .active {
  background: $primary !important;
  background: #547f6d !important;

  .q-chip__content {
    justify-content: center;
  }
}

:deep .pending {
  background: #d7816a;
}

/* status chips end */
:deep tr {
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid #f6f6f8;
  border-radius: 5px;
}

:deep .add-patient-btn {
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid #f6f6f8;
  border-radius: 4px;
  font-family: "Lato";
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  height: 36px;
  text-transform: capitalize;
}

:deep .add-patient-btn:hover {
  color: white !important;
  background: #547f6d !important;
}

:deep(.q-table__container > div:first-child) {
  background: #f9f9fc;
}

:deep(.my-sticky-header-table tr) {
  line-height: 50px;
  background: #ffffff;
  border: 1px solid #f6f6f8;
  border-radius: 5px;
}

:deep(.my-sticky-header-table thead tr th) {
  position: sticky;
  z-index: 1;
  top: 0;
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 13px;
  line-height: 11px;
  color: #7d8693;
  background: #f9f9fc;
}

:deep(.action-row) {
  cursor: pointer;
}

:deep(.action-row img) {
  position: absolute;
  top: 20px !important;
}

:deep(.q-table--horizontal-separator thead th) {
  border-bottom-width: 0px;
}

/* :deep(.q-table tbody td){
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: #0D0C22;
} */

:deep(.q-table--horizontal-separator tbody tr:not(:last-child) > td, 
.q-table--cell-separator thead th, .q-table--cell-separator tbody tr:not(:last-child) > td) {
  border-bottom-width: 6px;
  border-bottom-color: #f8f9fb;
}

:deep(.text-subtitle2) {
  font-family: "Lato";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 11px;
  color: #0d0c22;
  margin-top: 5px;
}

:deep(.text-weight-light) {
  margin-bottom: 0px;
}

:deep(.listing-title) {
  font-family: "Lato";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  color: #0d0c22;
}

:deep(.status-kyc) {
  border-radius: 10px;
  background: #d7816a !important;
  border-radius: 10px;
  width: auto;
}

.listing {
  margin-top: 16px !important;
  margin-right: 37px !important;
  margin-left: 37px !important;
}

/* .listing .mb-41{
  margin-bottom: 16px;
} */
/* :deep(.text-left){
  padding-left: 7px;
} */

// :deep(thead th){
//   padding-left: 7px;
// }
:deep(.q-table__bottom) {
  background: #f9f9fb;
}

:deep(.q-table__bottom > div:nth-child(2)) {
  position: absolute;
  left: 0px;
  margin-left: 10px;

  .q-table__bottom-item {
    margin-right: 5px;
    font-family: 'Lato';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 11px;
    color: #7D8693;
  }

  .q-field__append {
    padding: 0px;
  }
}

:deep(.q-pagination > button) {
  border-radius: 2px;
  background: white;
}

:deep(.loading) {
  width: 100%;
  display: flex;
  justify-content: center;
}

:deep(.loading-inner) {
  margin-top: 30px;

  img {
    width: 144px;
    margin-left: 20px;
  }

  .listing-title {
    margin: 21px;
    font-weight: 700;
  }

  .add-patient-btn {
    background: $primary;
    color: white !important;
  }
}
</style>
