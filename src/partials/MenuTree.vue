<template lang="">
  <q-list v-for="link in nav_links" :key="link">
    <q-item
      :to="{
        path: link.children.length === 0 && link.link !== '' && link.link,
      }"
      clickable
      manual-focus
      v-if="link.children.length === 0"
    >
      <!-- if no child navs  -->
      <template v-slot:default>
        <q-item-section avatar>
          <IconSvg
            :type="route.path.includes(link.link)?`${link.icon}-g`:link.icon"
            activeColor="#1c159b"
            color="#7d8693"
            :active="route.path.includes(link.link)"
          ></IconSvg>
        </q-item-section>

        <q-item-section class="text-subtitle2">{{ link.title }}</q-item-section>
      </template>

      <!-- if have child navs  -->
      <!-- <template v-slot:default v-else>
    </template> -->
    </q-item>

    <q-expansion-item expand-separator icon="" label="" caption="" v-else>
      <template v-slot:header>
        <q-item-section avatar>
          <IconSvg
            :type="link.icon"
            activeColor="#1c159b"
            color="#7d8693"
            :active="route.path === link.link ? true : false"
          ></IconSvg>
        </q-item-section>

        <q-item-section class="text-subtitle2">{{ link.title }}</q-item-section>
      </template>
      <template v-slot:default>
        <q-list>
          <q-item
            :to="{ path: child.link }"
            clickable
            v-for="child in link.children"
            :key="child"
            exact
          >
            <q-item-section avatar> </q-item-section>
            <q-item-section class="text-subtitle2">{{
              child.title
            }}</q-item-section>
          </q-item>
        </q-list>
      </template>
    </q-expansion-item>
  </q-list>
</template>
<script setup>
import { defineProps } from "vue";
import IconSvg from "@/partials/IconSvg.vue";
import { useRoute } from "vue-router";

defineProps({
  nav_links: Array,
});

const route = useRoute();
</script>
<style scoped lang="scss">
:deep(.q-item__section--avatar){
  min-width: auto;
}
</style>
