<template>
    <section class="mt-30 ml-26 width-100">
        <q-splitter v-model="splitterValue" :disable="true">
            <template v-slot:before>
                <q-tabs v-model="tab" vertical align="left" active-color="primary" indicator-color="primary"
                    class="text-grey-6">
                    <q-tab class="tab text-graphite" v-for="(tab, index) in tabs" :key="index" :name="tab.name"
                        :class="{}">
                        <template #default>
                            <p class="text-subtitle1 mb-0 text-capitalize">
                                {{ tab.label }}
                            </p>
                        </template>
                    </q-tab>
                </q-tabs>
            </template>

            <template v-slot:after>
                <div>
                    <q-tab-panels v-model="tab" animated class="tab-panel" swipeable inline-label outside-arrows
                        mobile-arrows transition-prev="jump-up" transition-next="jump-up">
                        <q-tab-panel name="departments" class="pt-0 ml-18 row">
                            <keep-alive>
                                <Department />
                            </keep-alive>
                        </q-tab-panel>
                        <q-tab-panel name="roles" class="pt-0 row scroll-y" style="overflow-x: hidden">
                            <keep-alive>
                                <ManageRoles />
                            </keep-alive>
                        </q-tab-panel>

                    </q-tab-panels>
                </div>
            </template>
        </q-splitter>
    </section>
</template>

<script setup>
import { ref } from "vue";
import Department from "./Department.vue";
import ManageRoles from "./ManageRoles.vue";
const splitterValue = ref(15);
const tab = ref("departments");

const tabs = ref([
    {
        label: "Departments",
        name: "departments",
    },
    {
        label: "Roles",
        name: "roles",
    },

]);
</script>
<style lang="scss" scoped>
:deep .q-tab {
    justify-content: start !important;
    min-height: 35px;
    font-weight: 600;
}

:deep(.q-panel) {
    overflow-x: hidden;
    overflow-y: auto;
}
</style>
