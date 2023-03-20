<template>
    <!-- Popup for adding Doctor Fee -->
    <q-dialog  persistent>
        <q-card class="px-14" style="width: 600px">
            <q-card-section class="row items-center justify-end q-pb-none">
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
                <div class="flex column items-center container">
                    <img src="@/assets/svg/alert-notification.svg" />
                    <span v-if="heading" class="font-weight-600 font-size-17 dark-black mt-20 text-center">
                        {{heading}}</span>
                    <span v-if="text" class="font-size-14 dark-grey mt-8 text-center" :class="
                    $q.screen.lt.sm ? '':'mx-40'
                    ">{{text}}</span>
                    <div class="action">
                        <q-btn v-close-popup size="md" class="q-p-md mt-20 mb-20  text-lower-case">
                            Cancel
                        </q-btn>
                        <q-btn @click="onClick()" :color="btnColor" size="md" class="q-p-md mt-20 mb-20  text-lower-case">
                            {{btnText}}
                        </q-btn>
                    </div>
                    
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>
<script setup>
import { defineProps, defineEmits } from "vue";

const emit = defineEmits([
    "btn-click"
]);

defineProps({
    heading: {
        type: String
    },
    headingStyle: {
        type: String
    },
    text: {
        type: String
    },
    btnText: {
        type: String
    },
    btnColor: {
        type: String,
        default:'primary'
    }
});


const onClick = () => {
    emit("btn-click");
}

</script>

<style lang="scss" scoped>

</style>