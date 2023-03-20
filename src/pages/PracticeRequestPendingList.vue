<template>
  <div
    class="q-pa-md"
    style="display: grid; place-items: center; height: 100vh"
  >
    <q-table
      title="Practice Request Register Pending List"
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
          <q-td key="practice_name" :props="props">
            <!-- {{props.row}} -->
            <q-badge color="primary">
              {{ props.row.practice_name }}
            </q-badge>
          </q-td>
          <q-td key="country_code" :props="props">
            <q-badge color="primary">
              {{ props.row.country_code }}
            </q-badge>
          </q-td>
          <q-td key="phone_number" :props="props">
            <q-badge color="primary">
              {{ props.row.phone_number }}
            </q-badge>
          </q-td>
          <q-td key="first_name" :props="props">
            <q-badge color="primary">
              {{ props.row.first_name }}
            </q-badge>
          </q-td>
          <q-td key="middle_name" :props="props">
            <q-badge color="primary">
              {{ props.row.middle_name }}
            </q-badge>
          </q-td>
          <q-td key="last_name" :props="props">
            <q-badge color="primary">
              {{ props.row.last_name }}
            </q-badge>
          </q-td>
          <q-td key="email" :props="props">
            <q-badge color="primary">
              {{ props.row.email }}
            </q-badge>
          </q-td>
          <q-td key="designation" :props="props">
            <q-badge color="primary">
              {{ props.row.designation }}
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
              style="margin-left: 12px;" 
            />
            <q-btn
              color="negative"
              label="Reject"
              @click="requestFunction(props.row, 'Rejected')"
              style="margin-left: 12px; margin-top: 10px;"
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
    name: "practice_name",
    label: "Practice Name",
    align: "left",
  },
  {
    name: "country_code",
    label: "Country Code",
    align: "left",
  },
  {
    name: "phone_number",
    label: "Phone Number",
    align: "left",
  },
  {
    name: "first_name",
    label: "First Name",
    align: "left",
  },
  {
    name: "middle_name",
    label: "Middle Name",
    align: "left",
  },
  {
    name: "last_name",
    label: "Last Name",
    align: "left",
  },
  {
    name: "email",
    label: "Email",
    align: "left",
  },
  {
    name: "designation",
    label: "Designation",
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
      "/superAdmin/initial-practice-response",
      { id: value.id, status: status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    .then((res) => {
      console.log(res);
      location.reload();
    });
};

// api call
onMounted(() => {
  axiosApiClient
    .get("/superAdmin/initial-practice-request", {
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

