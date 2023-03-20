<template>
  <div
    class="q-pa-md"
    style="display: grid; place-items: center; height: 100vh"
  >
    <q-table
      title="Practice Details Pending List"
      :rows="rows"
      :columns="columns"
      color="primary"
      row-key="name"
      :loading="loading"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="practice_key" :props="props">
            <!-- {{props.row}} -->
            <q-badge color="primary">
              {{ props.row.practice_key }}
            </q-badge>
          </q-td>
          <q-td key="email" :props="props">
            <q-badge color="primary">
              {{ props.row.email }}
            </q-badge>
          </q-td>
          <q-td key="tax_id" :props="props">
            <q-badge color="primary">
              {{ props.row.tax_id }}
            </q-badge>
          </q-td>
          <q-td key="practice_npi" :props="props">
            <q-badge color="primary">
              {{ props.row.practice_npi }}
            </q-badge>
          </q-td>
          <q-td key="practice_taxonomy" :props="props">
            <q-badge color="primary">
              {{ props.row.practice_taxonomy }}
            </q-badge>
          </q-td>
          <q-td key="facility_id" :props="props">
            <q-badge color="primary">
              {{ props.row.facility_id }}
            </q-badge>
          </q-td>
          <q-td key="oid" :props="props">
            <q-badge color="primary">
              {{ props.row.oid }}
            </q-badge>
          </q-td>
          <q-td key="clia_number" :props="props">
            <q-badge color="primary">
              {{ props.row.clia_number }}
            </q-badge>
          </q-td>
          <q-td key="status" :props="props">
            <q-badge color="primary">
              {{ props.row.status }}
            </q-badge>
          </q-td>
          <div class="q-pa-md text-white">
            <q-btn
              color="primary"
              label="Accept"
              @click="requestFunction(props.row, 'Accepted')"
            />
            <q-btn
              color="negative"
              label="Reject"
              @click="requestFunction(props.row, 'Rejected')"
              style="margin-left: 12px"
            />
          </div>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axiosApiClient from "@/axios";

const loading = ref(true);
const columns = ref([
  {
    name: "id",
    label: "Id",
    align: "left",
  },
  {
    name: "practice_key",
    label: "Practice Id",
    align: "left",
  },
  {
    name: "email",
    label: "Email",
    align: "left",
  },
  {
    name: "tax_id",
    label: "Tax Id",
    align: "left",
  },
  {
    name: "practice_npi",
    label: "NPI",
    align: "left",
  },
  {
    name: "practice_taxonomy",
    label: "Taxonomy",
    align: "left",
  },
  {
    name: "facility_id",
    label: "Facility Id",
    align: "left",
  },
  {
    name: "oid",
    label: "OID",
    align: "left",
  },
  {
    name: "clia_number",
    label: "Clia Number",
    align: "left",
  },
  {
    name: "status",
    label: "Status",
    align: "left",
  },
]);
const rows = ref([]);

const requestFunction = (value, status) => {
  axiosApiClient
    .post(
      "/superAdmin/practice-request-response",
      { id: value.id, status: status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    .then(() => {
      location.reload();
    });
};

// api call
onMounted(() => {
  axiosApiClient
    .get("/superAdmin/practice-request", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      rows.value = res.data.data;
      loading.value = false;
    });
});
</script>

