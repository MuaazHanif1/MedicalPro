<template>
  <q-layout view="hHh lpR fFf">
    <DashboardHeader @toggle-drawer="toggleDrawer"></DashboardHeader>
    <DashboardSidebar
      :drawerOpen="leftDrawerOpen"
      @drawerChanged="leftDrawerOpen = $event"
      width="219px"
    ></DashboardSidebar>
    <q-page-container :class="[$q.screen.lt.md ? '' : 'pl-219', 'scrollable']">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import DashboardSidebar from "@/partials/DashboardSidebar.vue";
import DashboardHeader from "@/partials/DashboardHeader.vue";

const $q = useQuasar();
const leftDrawerOpen = ref(true);
onMounted(() => {
  if ($q.screen.lt.md) {
    leftDrawerOpen.value = false;
  }
});
//   watch(
//     () => $q.screen,
//     (newScreen) => {
//       if ($q.screen.lt.md) {
//         leftDrawerOpen.value = false;
//       }
//     },
//     {
//       deep: true,
//     }
//   );

const toggleDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>

<style lang="scss" scoped>
.q-layout {
  background: $paper-white !important;
}
</style>
