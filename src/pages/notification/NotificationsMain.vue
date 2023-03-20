<template>
    <div class="row justify-center py-10" v-if="isPageLoad">
        <q-spinner-dots color="primary" size="3em" :thickness="2" />
    </div>
    <div class="mx-30" v-else>
        <div v-for="(value, key) in data" :key="key">
            <div class="mt-20 dark-black fs-20 font-weight-600">{{ key }}</div>
            <section class="mt-20" v-for="(element, index) in value" :key="index">
                <NotificationTemplate @check-notification-detail="checkDetail" :heading="element.data.title"
                    :objectKey="key" :index="index"
                    :appointmentId="element.data.appointment_id ? element.data.appointment_id : ''"
                    :paragraph="element.data.body" :time="timeAndDateFormat(element.created_at)"
                    :uncheck="element.read_at == null" :notificationId="element.id"
                    :appointmentType="element.data.type">
                    <template #date-time v-if="element.data.new_time && element.data.old_time">
                        <div class="paragraph"><span class="time-heading">New time :</span> {{ element.data.new_time }}
                        </div>
                        <div class="paragraph"><span class="time-heading">Old time :</span> {{ element.data.old_time }}
                        </div>
                    </template>
                </NotificationTemplate>

            </section>

        </div>
        <div class="mt-20 dark-black fs-20 font-weight-600 row justify-center items-center" v-if="data.length == 0">No
            Notification !</div>
        <div class="flex justify-center items-center py-20"
            v-show="paginationScrollOption.totalNumberOfCall >= paginationScrollOption.intialCall">
            <q-btn color="primary" @click="onRequest" style="width: 150px" :loading="isloading"
                v-show="pagination.totalrow > 10">
                Load More
                <!-- <template v-slot:loading>         
                    <q-spinner-hourglass class="on-left" />
                    Loading...
                </template> -->
            </q-btn>
        </div>
    </div>
</template>

<script setup>
import NotificationTemplate from "@/partials/Notification/NotificationTemplate.vue";
import { onMounted, ref } from 'vue'
import { usePatientStore } from '@/store/patient'
import { useRouter } from "vue-router";
import useEmitter from "@/composables/useEmitter";
import moment from "moment";
//import { response } from "express";
onMounted(() => {
    isPageLoad.value = true
    store.getNotificationsDoctor({ page: pagination.value.page, perPage: pagination.value.rowsPerPage }).then(response => {
        if (response.status == 200) {
            isPageLoad.value = false
            delete response.data.data.data.unread
            delete response.data.data.data.google_calendar
            delete response.data.data.data.outlook_calendar
            data.value = response.data.data.data
            pagination.value.totalrow = response.data.data.total
            pagination.value.rowsPerPage = pagination.value.rowsPerPage + 10
            paginationScrollOption.value.totalNumberOfCall = ((response.data.data.total / 10) + '').includes('.') ? hasHasValue(response.data.data.total / 10) : (response.data.data.total / 10)
        }

    })
})
// pagination.value.rowsNumber = returnedData.meta.total;
//   pagination.value.rowsPerPage = returnedData.meta.per_page == pagination.value.rowsNumber ? 0 : returnedData.meta.per_page; // 0 value-- > consider as show all row at one page. 
//   pagination.value.page = returnedData.meta.current_page;
//   pagination.value.last_page = returnedData.meta.last_page;
const data = ref('')
// const isUnChecked = ref(true)
const pagination = ref({ page: 1, rowsPerPage: 10, totalrow: 0 })
const store = usePatientStore()
const route = useRouter()
const emitter = useEmitter();
const paginationScrollOption = ref({ totalNumberOfCall: 1, intialCall: 1, hashValue: '' })
const isloading = ref(false)
const isPageLoad = ref(false)
const checkDetail = (object) => {
    object.notification_type.includes('appointment') && route.push({ name: 'appointment-detail', params: { id: object.id } })
    object.notification_type.includes('prescription') && route.push({ name: 'appointment-detail', params: { id: object.id } })
    object.notification_type.includes('registration') && route.push({ path: '/settings/check', })
    store.setNotificationsRead(object.notification_id).then(response => {
        emitter.emit("notification-update", { unread: response.data.data, ...object });

    })

}
const onRequest = () => {
    if (paginationScrollOption.value.totalNumberOfCall > paginationScrollOption.value.intialCall) {
        moreNotificationLoad()
        paginationScrollOption.value.intialCall++
    }
    else if (paginationScrollOption.value.totalNumberOfCall <= paginationScrollOption.value.intialCall && paginationScrollOption.value.hashValue) {
        paginationScrollOption.value.hashValue = ''
        moreNotificationLoad()
        paginationScrollOption.value.intialCall++
    }

}
const hasHasValue = (number) => {
    paginationScrollOption.value.totalNumberOfCall = Number(`${(number + '').split('.')[0]}`)
    const hasHashValue = Number(`0.${(number + '').split('.')[1]}`)
    paginationScrollOption.value.hashValue = hasHashValue
    return paginationScrollOption.value.totalNumberOfCall

}
const moreNotificationLoad = () => {
    isloading.value = true
    store.getNotificationsDoctor({ page: pagination.value.page, perPage: pagination.value.rowsPerPage }).then(response => {
        if (response.status == 200) {
            delete response.data.data.data.unread
            delete response.data.data.data.google_calendar
            delete response.data.data.data.outlook_calendar
            data.value = response.data.data.data
            pagination.value.rowsPerPage = pagination.value.rowsPerPage + 10
        }

    }).finally(() => {
        isloading.value = false
    })
}
const timeAndDateFormat = (data) => `${moment(data).format('Do MMM, YYYY')} at ${moment(data).format('h:mm a')}`
</script>
<style lang="scss" scoped>
.paragraph {
    font-weight: 400;
    font-size: 14px;
    color: $dark-gray;

    .time-heading {
        font-weight: 700;
    }
}
</style>