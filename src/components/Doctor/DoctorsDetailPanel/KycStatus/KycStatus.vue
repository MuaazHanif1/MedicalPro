<template>
    <div class="height row items-center justify-center">
        <div class="rejected">
            <div class="image row items-center justify-center">
                <q-icon :name="`img:${require('@/assets/'+ kycImage)}`" size="100px" class="material-symbols-outlined">
                </q-icon>
            </div>
            <div class="kyc-status row items-center justify-center mt-20">
                <span>{{`KYC verification ${kycStatusMessage}`}}</span>
            </div>
            <div class="kyc-messags row items-center justify-center mt-10">
                <span>{{kycMessags}}</span>
            </div>
            <!-- <div class="kyc-link row items-center justify-center mt-30">
                <a href="">Send another KYC link</a>
            </div> -->
        </div>
    </div>
</template>
  
<script setup>
import { defineProps, computed } from "vue";
const props = defineProps({
    kycStatusMessage: {
        default: 'rejected',
        type: String
    }
})
const kycImage = computed(() => {
    return props.kycStatusMessage.toLocaleLowerCase() == 'accepted' ? 'success-popup-icon.png' : 'unsuccess-popup-icon.png'
})
const kycMessags = computed(() => {
    return props.kycStatusMessage.toLocaleLowerCase() == 'accepted' ? '' : 'Please confrim your identification'
})
</script>
  
<style lang="scss" scoped>
.height {
    height: 40vh;
}

a {
    font-weight: 400;
    font-size: 14px;
    color: $primary;
}

.kyc-status {
    font-weight: 600;
    font-size: 16px;
    color: $black-1
}

.messags {
    color: $dark-gray;
    font-size: 14px;
    font-weight: 400;
}
</style>

  