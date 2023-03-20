<template>
    <div>
        <q-card class="my-card" :class="[uncheck ? 'my-card-gray-background' : 'my-card-white-background']"
            @click.stop="$emit('check-notification-detail', { notification_id: notificationId, notification_type: appointmentType, id: appointmentId, index: index, key: objectKey })">
            <q-card-section>
                <q-badge v-show="uncheck" rounded color="primary" floating />
                <h2 class="heading pb-5">{{ heading }}</h2>
                <p class="paragraph ">{{ paragraph }}
                </p>
                <slot name="date-time" class="pb-5"></slot>
                <span class="text-gray">{{ time}}</span>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
defineEmits(['check-notification-detail'])


defineProps({
    heading: {
        type: String,
        default: 'Appointment Setup - ID: 08768 ',
    },
    paragraph: {
        type: String,
        default: "Your appointment has been scheduled with Meagan Joseph on 15th Oct 2022 - 10: 00 PM",
    },
    time: {
        type: String,
        default: "31 Oct, 2022 at 06:37 PM",
    },
    uncheck: {
        type: Boolean,
        default: true
    },
    notificationId: {
        type: String,
    },
    appointmentType: {
        type: String,
    },
    appointmentId: {
        type: String,
    },
    index: {
        type: Number,
    },
    objectKey: {
        type: String,
    }
})
</script>
<style lang="scss" scoped>
.my-card {
    width: 100%;
    border: 1px solid #F6F6F8;
    cursor: pointer;


    .heading {
        font-weight: 700;
        font-size: 14px;
        color: $text;
        line-height: 18px;
    }

    .paragraph {
        font-weight: 400;
        font-size: 14px;
        color: $dark-gray;
    }

    p {
        margin: 0 0 0 0;
    }

    .text-gray {
        font-weight: 400;
        font-size: 13px;
        line-height: 19px;
        color: $text-2
    }

}

.my-card-gray-background {
    background: $gray-light-2;
}

.my-card-white-background {
    background: $white;
}

:deep(.q-badge--floating) {
    top: 20px;
    right: 20px;

}

:deep(.q-badge) {
    padding: 0px 3px;
    min-height: 6px;
}

:deep(.q-card) {
    box-shadow: none;
}

//
</style>
