<template lang="">
  <div class="px-30 pt-30">
    <!-- Heading and button -->
    <div class="row justify-between items-center mb-20  pt-13">
      <p class="text-h6 mb-0">All Employees</p>
      <div class="row">
        <q-btn
          color="white"
          text-color="primary"
          unelevated
          icon="add"
          size="md"
          label="Register New Employee "
          no-caps
          padding="6px 16px"
          :to="{ name: 'staff-registration' }"
          style="font-size: 12px; font-weight: bold;"
        />
      </div>
    </div>
    <!-- Heading and button -->

    <!-- Table structure -->
    <q-table
      flat
      square
      :table-header-style="{ backgroundColor: '#F9F9FB' }"
      :table-style="{ backgroundColor: '#F9F9FB' }"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :loading="loading"
      v-model:pagination="pagination"
      class="my-sticky-header-table"
    >
      <!-- if no data available -->
      <template v-slot:no-data v-if="!loading">
        <div class="full-width row flex-center text-accent q-gutter-sm">
          <q-icon size="2em" color="primary" name="sentiment_dissatisfied" />
          <span class="text-primary"> No data available... </span>
        </div>
      </template>

      <template v-slot:no-data v-else>
        <div class="full-width row flex-center text-accent q-gutter-sm"></div>
      </template>
      <!-- if no data available -->

      <!-- rows structure -->
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            <p class="mb-0">
              {{ `${props.row.first_name} ${props.row.last_name}` }}
            </p>
            <p class="mb-0 text-grey-7 truncate-field">{{ props.row.email }}</p>
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.department.name }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.employee_type.name }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.role }}
          </q-td>
          <q-td key="name" :props="props">
            <q-chip
              :color="props.row.is_active ? 'primary' : 'grey-4'"
              :text-color="props.row.is_active ? 'white' : 'primary'"
            >
              {{ props.row.is_active ? 'Active' : "In-Active" }}
            </q-chip>
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.created_at }}
          </q-td>
          <q-td key="name" :props="props">
            <img :src="require('@/assets/svg/menu-icon.svg')" alt="action" />
            <q-menu :offset="[50, -20]">
              <q-list>
                <q-item
                  :to="{ name: 'staff-details', params: { id: props.row.id } }"
                  clickable
                  v-close-popup
                >
                  <q-item-section color="green">View Details</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-td>
        </q-tr>
      </template>
      <!-- rows structure -->

      <!-- Pagination slot  -->
      <template v-slot:pagination="scope">
        <q-pagination
          v-model="scope.pagination.page"
          color="grey-6"
          active-text-color="primary"
          active-color="paper-white"
          :max="parseInt(scope.pagination.pagesNumber)"
          :min="1"
          :max-pages="4"
          @update:model-value="paginateTo($event)"
          boundary-numbers
          unelevated=""
          direction-links
        />
      </template>
      <!-- Pagination slot  -->
    </q-table>
    <!-- Table structure -->
  </div>
</template>
<script setup>
import { computed, ref, watch } from "vue";
import { usePracticeStore } from "@/store/practice";

const practiceStore = usePracticeStore();
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
});
practiceStore.getAllStaff().then(() => {
  loading.value = false;
  pagination.value.pagesNumber = practiceStore.staff.meta.last_page;
  pagination.value.rowsPerPage = practiceStore.staff.meta.per_page;
  pagination.value.page = practiceStore.staff.meta.current_page;
});
const loading = ref(true);
const columns = [
  {
    name: "name",
    label: "Employee Name",
    align: "left",
    field: "name",
  },
  { align: "left", label: "ID", field: "calories" },
  { align: "left", label: "Department", field: "Debt" },
  { align: "left", label: "Type", field: "carbs" },
  { align: "left", label: "Role", field: "protein" },
  { align: "left", label: "Status", field: "sodium" },
  { align: "left", label: "Created at", field: "calcium" },
  // { align: "left", label: "Action", field: "iron" },
];
const rows = computed(() => practiceStore.staff.data);
practiceStore.getAllDepartments();
practiceStore.getAllRole();

/**
 * function for pagination
 * @param {Number} value 
 */
const paginateTo = (value) => {
  loading.value = true;
  practiceStore.getAllStaff(value, pagination.value.rowsPerPage).then(() => {
    loading.value = false;
  });
};

/**
 * watcher for table num of rows change
 */
watch(
  () => pagination.value.rowsPerPage,
  (newValue) => {
    loading.value = true;
    practiceStore.getAllStaff(1, newValue).then(() => {
      loading.value = false;
      pagination.value.pagesNumber = practiceStore.staff.meta.last_page;
    });
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
:deep(.q-table--horizontal-separator tbody tr:not(:last-child) > td),
:deep(.q-table--horizontal-separator thead th) {
  border-bottom-width: 10px;
}
:deep(.q-table tr) {
  background: white;
  border-radius: 8px;
}
:deep(.q-table thead),
:deep(.q-table tr),
:deep(.q-table th),
:deep(.q-table td) {
  border-color: rgb(249 249 251);
}

:deep(.q-table__bottom) {
  background: $paper-white;
  border-top: none;
}
:deep(.q-table__container) {
  max-height: 80vh;
}

.truncate-field {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 150px;
}

.my-sticky-header-table {
  :deep(thead tr th) {
    position: sticky;
    z-index: 1;
  }

  :deep(thead tr:first-child th) {
    top: 0;
  }
  :deep(&.q-table--loading thead tr:last-child th ){
    top: 48px;
  }
}

:deep(.q-table__separator){
  display: none;
}

:deep(.q-table__bottom){
  justify-content: space-between;

  .q-table__separator{
    display: none;
  }
}
</style>
