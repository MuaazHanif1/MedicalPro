<template lang="">
  <q-drawer
    @update:model-value="$emit('drawerChanged', $event)"
    :model-value="drawerOpen"
    side="left"
    class="bg-off-white row column no-wrap"
    show-if-above
    bordered
    :breakpoint="1023"
  >
    <!-- looping over navs  -->
    <div v-for="(nav, index) in navs" :key="index" class="mb-15">
      <h6 class="text-subtitle2 text-blue-grey-5 px-12 mb-5 mt-3">
        {{ nav.heading }}
      </h6>
      <!-- for child navs  -->
      <MenuTree :nav_links="nav.links"></MenuTree>
      <!-- for child navs  -->
    </div>
    <!-- looping over navs  -->
  </q-drawer>
</template>
<script setup>
import { ref, defineProps, onMounted } from "vue";
import MenuTree from "@/partials/MenuTree.vue";
import { useGeneralStore } from "@/store/general";

onMounted(() => {
  const storeGeneral = useGeneralStore();
  // if(!storeGeneral.$state.countries.length){
  storeGeneral.getLanguages();
  storeGeneral.getRace();
  storeGeneral.getEthnicity();
  storeGeneral.getCountryRequest();
  // }
});

defineProps({
  width: {
    type: String,
    default: "300px",
  },
  drawerOpen: {
    type: Boolean,
    default: true,
  },
});
const navs = ref([
  {
    heading: "OVERVIEW",
    links: [
      {
        title: "Dashboard",
        link: "/dashboard",
        icon: "pie",
        children: [],
      },
      {
        title: "My Profile",
        link: "/profile",
        icon: "aid",
        children: [],
      },
      {
        title: "Appointments",
        link: "/appointments",
        icon: "calendar",
        children: [],
      },
      {
        title: "Settings",
        link: "/settings",
        icon: "setting",
        children: [],
      }
    ],
  },

]); // sidebar content

</script>
<style lang="scss" scoped>
:deep .q-drawer {
  width: v-bind(width) !important;

  .q-drawer__content {
    padding: 14px;
  }

  & .q-item {
    padding: 0px;

    .q-item__section {
      color: $text;
      position: relative;
    }

    &:hover .q-focus-helper {
      background: $light-green !important;
      border-radius: 4px;
      opacity: 1;

      &::before,
      &::after {
        background: transparent;
      }
    }
  }
}

:deep(.q-router-link--active .q-focus-helper) {
  background: $light-green !important;
  border-radius: 4px;
  opacity: 1;

  &::before,
  &::after {
    background: transparent;
  }
}

:deep .q-list>.q-item {
  padding: 12px 12px !important;
}

:deep .q-list>.q-expansion-item {
  padding: 0px 12px !important;
}

:deep .q-list>.q-expansion-item>.q-expansion-item__container>.q-item {
  padding: 12px 12px;
  margin: 0px -12px;
}

:deep .q-item {
  min-height: auto !important;
}

:deep .q-expansion-item {
  hr {
    display: none;
  }

  // .q-list .q-item {
  //   padding: 12px 0px 12px !important;
  //   margin: 0px -34px 0px -12px;
  // }
}

body.screen--sm {
  :deep .q-focus-helper {
    height: 24px !important;
  }
}

:deep .q-expansion-item {
  :deep .q-drawer .q-item:hover .q-focus-helper {
    opacity: 0px !important;
  }
}
</style>
