<template lang="">
  <div class="col-12">
    <!-- Heading and button -->
    <div class="row justify-between items-center mb-20">
      <p class="text-h6 mb-0">Roles And Permissions</p>
      <div class="row">
        <q-btn
          color="paper-white"
          text-color="primary"
          unelevated
          icon="add"
          size="md"
          label="Create New Role"
          no-caps
          padding="6px 12px"
          @click="() => (add = true)"
        />
      </div>
    </div>
    <!-- Heading and button -->

    <!-- Table structure -->
    <q-table
      flat
      square
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
              {{ `${props.row.id}` }}
            </p>
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="name" :props="props">
            {{ $filters.formatDate(props.row.created_at, "DD MMM YYYY") }}
          </q-td>
          <q-td key="name" :props="props">
            {{ $filters.formatDate(props.row.updated_at, "DD MMM YYYY") }}
          </q-td>
          <q-td key="name" :props="props">
            <q-btn
              unelevated
              rounded
              size="sm"
              color="paper-white"
              text-color="primary"
              no-caps=""
              label="Assign Permissions"
              style="font-size: 12px"
              @click="
                updateModal(props.row.name, props.row.id, props.row.permissions)
              "
            />
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
        <!-- Pagination slot  -->
      </template>
    </q-table>
    <!-- Table structure -->
  </div>

  <q-dialog v-model="add" no-backdrop-dismiss>
    <q-card
      style="max-width: 600px; width: 450px; padding: 0px 40px"
      class="px-15"
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold">Create New Role</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form ref="createForm" :greedy="true">
          <div class="row q-col-gutter-md mb-10">
            <div
              class="col-12"
              :class="[add_field.col ? `col-md-${add_field.col}` : 'col-md-6']"
              v-for="(add_field, add_index) in createInputs"
              :key="add_index"
            >
              <FormInput
                :inputType="add_field.type"
                :isInput="add_field.type === 'select' ? false : true"
                :label="add_field.label"
                :option="add_field.options"
                v-model="createModel[add_field.value]"
                :rules="add_field.rules"
                :placeHolder="add_field.placeholder"
              ></FormInput>
            </div>
          </div>

          <div class="row justify-end mt-25">
            <q-btn
              unelevated
              color="primary"
              no-caps
              label="Create"
              padding="8px 41px"
              :loading="adding"
              @click="validateAndCreate"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="addPermissions" no-backdrop-dismiss>
    <q-card
      style="max-width: 600px; width: 450px; padding: 0px 40px"
      class="px-15"
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold">Assign Permissions</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form ref="createForm" :greedy="true">
          <div class="row q-col-gutter-md mb-10">
            <div class="col-12">
              <FormInput
                inputType="text"
                :isInput="true"
                label="Role name"
                v-model="updateModel.name"
                :isDisable="false"
              ></FormInput>
            </div>
          </div>

          <div class="row">
            <div class="col-12 row justify-between items-center mt-5 mb-4">
              <p class="mb-0 font-weight-bold">Permissions</p>
              <q-checkbox
                v-model="selectAll"
                size="xs"
                @click="selectOrUnselect"
                :label="selectAll ? 'Unselect all' : 'Select all'"
                color="Primary"
              />
            </div>
            <div
              class="col-md-6"
              v-for="(permission, index) in permissions"
              :key="index"
            >
              <q-checkbox
                v-model="permissionsModel"
                size="xs"
                :val="permission.id" class='text-capitalize'
                :label="permission.name.replaceAll('-',' ')"
                color="Primary"
              />
            </div>
          </div>

          <div class="row justify-end mt-25">
            <q-btn
              :disabled="permissionsModel.length == 0"
              unelevated
              color="primary"
              no-caps
              label="Create"
              padding="8px 41px"
              :loading="assigning"
              @click="assignPermissions"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { computed, ref, watch } from "vue";
import { usePracticeStore } from "@/store/practice";
import rules from "@/composables/validation-rules";
import FormInput from "@/partials/FormInput.vue";

const practiceStore = usePracticeStore();
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
});
practiceStore.getPracticeRoles().then(() => {
  loading.value = false;
  pagination.value.pagesNumber = practiceStore.roles.meta.last_page;
  pagination.value.rowsPerPage = practiceStore.roles.meta.per_page;
  pagination.value.page = practiceStore.roles.meta.current_page;
});
const selectAll = ref(false);
practiceStore.getPracticePermissions();
const add = ref(false);
const addPermissions = ref(false);
const adding = ref(false);
const assigning = ref(false);
const loading = ref(true);
const createForm = ref(null);
const permissions = computed(() => practiceStore.permissions.data);
const updateModel = ref({
  name: "",
  id: "",
});
const createInputs = ref([
  {
    label: "Role name",
    placeholder: "Enter role name",
    value: "name",
    col: "12",
    rules: [rules.required],
  },
]);
const createModel = ref({});
const columns = [
  {
    name: "name",
    label: "No.",
    align: "left",
    field: "name",
  },
  { align: "left", label: "Role", field: "calories" },
  { align: "left", label: "Created at", field: "Debt" },
  { align: "left", label: "Updated at", field: "carbs" },
  { align: "left", label: "Action", field: "iron" },
];

const permissionsModel = ref([]);
const rows = computed(() => practiceStore.roles.data);
practiceStore.getAllDepartments();
practiceStore.getPracticeRoles();

const updateModal = (value, id, permissionsOfRole) => {
  permissionsModel.value = [];
  permissionsOfRole.forEach((roleP) => {
    permissionsModel.value.push(roleP.id);
  });
  addPermissions.value = true;
  updateModel.value.id = id;
  updateModel.value.name = value;
};
/**
 * creating new record
 */
const validateAndCreate = () => {
  createForm.value.validate().then((success) => {
    if (success) {
      adding.value = true;
      practiceStore
        .addRole({ ...createModel.value }, true)
        .then(() => {
          adding.value = false;
          practiceStore.getPracticeRoles().then(() => {
            loading.value = false;
            pagination.value.pagesNumber = practiceStore.roles.meta.last_page;
            pagination.value.rowsPerPage = practiceStore.roles.meta.per_page;
            pagination.value.page = practiceStore.roles.meta.current_page;
            add.value = false;
          createModel.value = {};
          });
        })
        .catch(() => {
          adding.value = false;
        });
    }
  });
};

/**
 * creating new record
 */
const assignPermissions = () => {
  assigning.value = true;
  practiceStore
    .setRolePermissions({
      permission_ids: [...permissionsModel.value],
      role_id: updateModel.value.id,
      role_name: updateModel.value.name,
    })
    .then(() => {
      assigning.value = false;
      addPermissions.value = false;
    })
    .catch(() => {
      assigning.value = false;
    });
};

/**
 * function for pagination
 * @param {Number} value
 */
const paginateTo = (value) => {
  loading.value = true;
  practiceStore
    .getPracticeRoles(value, pagination.value.rowsPerPage)
    .then(() => {
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
    practiceStore.getPracticeRoles(1, newValue).then(() => {
      loading.value = false;
      pagination.value.pagesNumber = practiceStore.roles.meta.last_page;
    });
  },
  { deep: true }
);

const selectOrUnselect = () => {
  if (selectAll.value) {
    permissions.value.forEach((p) => {
      permissionsModel.value.push(p.id);
    });
  } else {
    permissionsModel.value = [];
  }
};

watch(
  () => permissionsModel.value.rowsPerPage,
  () => {
    if (permissionsModel.value.length == permissions.value.length) {
      selectAll.value = true;
    } else {
      selectAll.value = false;
    }
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
:deep(.q-table--horizontal-separator tbody tr:not(:last-child) > td),
:deep(.q-table--horizontal-separator thead th) {
  //   border-bottom-width: 10px;
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
  background: $white;
  border-top: none;
}
:deep(.q-table__container) {
  max-height: 70vh;
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
  :deep(&.q-table--loading thead tr:last-child th) {
    top: 48px;
  }
}
:deep .q-icon.on-left {
  margin-right: 4px;
}

:deep(.q-table__bottom){
  justify-content: space-between;

  .q-table__separator{
    display: none;
  }
}
</style>
