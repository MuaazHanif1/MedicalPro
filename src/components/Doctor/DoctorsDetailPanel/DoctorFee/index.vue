<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <DataListing :rows="doctorFeeInfo" :columns="doctorFeeHeader" :pagination="pagination" :information="information"
        @pagination-data="onRequest" :loading="loading" @change-status="changeStatus"
        @toggle-DialogBox="registerpop = true" class="pt-27"></DataListing>

    <!-- Popup for adding Doctor Fee -->
    <q-dialog v-model="registerpop" no-backdrop-dismiss>
        <q-card class="px-14" style="width: 600px">
            <q-card-section class="row items-center q-pb-none">
                <div class="dark-black medium-font">Add New Fee</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
                <q-form ref="docFeeForm">
                    <div class=" column flex col-sm-6 col-12 self-end">
                        <span class="q-mb-sm input-label">Appointment Fee</span>
                        <q-input @keydown.enter.prevent="validateAndSubmit()" outlined :dense="true" placeHolder="Enter"
                            v-model="docFee" class="pb-0" :rules="[rules.required, rules.number]">
                        </q-input>
                    </div>
                </q-form>
                <div class="flex justify-end mt-28">
                    <q-btn color="primary" :loading="isSpinning" @click="validateAndSubmit()" size="md"
                        class="q-p-md px-20 text-lower-case">
                        Add
                    </q-btn>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
    <!-- Popup for adding doctor -->
    <!-- Popup for changing status -->
    <q-dialog v-model="changeStatusPopup" no-backdrop-dismiss>
        <q-card class="px-14" style="width: 600px">
            <q-card-section class="row items-center q-pb-none">
                <div class="dark-black medium-font">Change Status</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
                <div class=" column flex col-sm-6 col-12 self-end">
                    <FormInput class="col-sm-6 col-12" :class="$q.screen.lt.sm ? 'pr-0 mt-20' : ''" :isInput="false"
                        :option="statusOptions" label="Fee status" inputType="select" v-model="feeActiveStatus" />
                </div>

                <div class="flex justify-end mt-28">
                    <q-btn color="primary" :class="{ 'no-pointer-events': disableStatusEdit}" :loading="isSaving"
                        @click="changeStatusApi()" size="md" class="q-p-md px-20 text-lower-case">
                        Change
                    </q-btn>
                </div>
            </q-card-section>
        </q-card>

    </q-dialog>
    <!-- Popup for changing status -->

    <!-- Popup for notification -->
    <NotifyPopup @close-popup="closePopup()" @btn-click="closePopup()" :modelValue="notifyPopup"
        heading="You cannot change the status of a Published Appointment Fee !" btnText="Continue" btnColor="primary" />
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { usePracticeStore } from "@/store/practice";
import { useDoctorStore } from "@/store/doctor";
import FormInput from "@/partials/FormInput.vue";
import DataListing from "@/partials/DataListing.vue";
import moment from "moment";
// import notify from "@/composables/notify";
import NotifyPopup from "@/partials/NotifyPopup.vue";

//
const notifyPopup = ref(false);

let user = localStorage.getItem("user")
user = JSON.parse(user);
console.log(user.loginUser.role)

// getting the doc ID from the URL
const route = useRoute();

let docId = ref(null);
let selectedIndex = ref(null);
docId = Number(route.params.id);


const statusOptions = [

    {
        name: "Published",
        id: true,
    },
    {
        name: "UnPublished",
        id: false,
    },

];

const feeActiveStatus = ref("");

const practiceStore = usePracticeStore();
const doctorStore = useDoctorStore();
const loading = ref(false);
const registerpop = ref(false);
const changeStatusPopup = ref(false);
const docFeeForm = ref(null);
const doctorFeeInfo = ref([]);
//button spinner
const isSpinning = ref(false);
// doc fee
const docFee = ref(null);
const information = ref({
    heading: "Doctor's Fee",
    isSimpleButton: true,
    text: "Add New Fee",
    // detail_page_link: "doctor-detail",
});
const doctorFeeHeader = [
    { name: "index", label: "No", field: "index", align: "left" },
    {
        name: "created_at",
        label: "Created Date",
        field: "created_at",
        align: "left",
    },
    {
        name: "updated_at",
        label: "Updated Date",
        field: "updated_at",
        align: "left",
    },
    {
        name: "amount",
        label: "Appointment Fee",
        field: "amount",
        align: "left",
    },
    {
        name: "status",
        label: "Status",
        field: "status",
        align: "left",
    },
];

const pagination = ref({
    page: 1,
    rowsPerPage: 15,
    rowsNumber: 15,
    last_page: 1
});


const setDocFreeList = (doctorFeeData) => {
    doctorFeeInfo.value = doctorFeeData.data;
    pagination.value.rowsNumber = doctorFeeData.meta.total;
    pagination.value.page = doctorFeeData.meta.current_page;
    pagination.value.last_page = doctorFeeData.meta.last_page;
    loading.value = false;
}

onMounted(async () => {
    loading.value = true;
    if (user.loginUser.role === "practice") {
        const doctorFeeData = await practiceStore.requestDoctorFeeList(docId, { page: 1, pagination: 15 });
        setDocFreeList(doctorFeeData);
    } else if (user.loginUser.role === "doctor") {
        const doctorFeeData = await doctorStore.requestDoctorFeeList(docId, { page: 1, pagination: 15 });
        setDocFreeList(doctorFeeData);

    }
});

const setDocFeeListPaginatedData = (res) => {
    console.log("ON REQUEST", res);
    doctorFeeInfo.value = [];
    doctorFeeInfo.value = res.data;
    pagination.value.rowsNumber = res.meta.total;
    pagination.value.rowsPerPage = res.meta.per_page;
    pagination.value.page = res.meta.current_page;
    pagination.value.last_page = res.meta.last_page;
    loading.value = false;
}
const onRequest = async (req) => {
    loading.value = true;
    if (user.loginUser.role === "practice") {

        practiceStore.requestDoctorFeeList(docId, {
            page: req.pagination && req.pagination.page ? req.pagination.page : req,
            pagination: req.pagination && req.pagination.rowsPerPage ? req.pagination.rowsPerPage : pagination.value.rowsPerPage,
        })
            .then((res) => {
                setDocFeeListPaginatedData(res);
            });
    } else if (user.loginUser.role === "doctor") {
        doctorStore.requestDoctorFeeList(docId, {
            page: req.pagination && req.pagination.page ? req.pagination.page : req,
            pagination: req.pagination && req.pagination.rowsPerPage ? req.pagination.rowsPerPage : pagination.value.rowsPerPage,
        })
            .then((res) => {
                setDocFeeListPaginatedData(res);
            });
    }
};
/**  Description: this method validates the input field and submits the form to add doctor's fee
 */
const validateAndSubmit = () => {
    docFeeForm.value.validate().then((success) => {
        if (success) {
            // make API call here
            addDocFee();

        }
    });
};

const setAddedDocFee = (doctorFeeData) => {
    unPublishthePublishedDocFee();
    // format date 
    let data = doctorFeeData.data.data;

    data.created_at = moment(data.created_at).format(
        "DD-MM-YYYY"
    );
    data.updated_at = moment(data.created_at).format(
        "DD-MM-YYYY"
    );
    doctorFeeInfo.value.unshift(data);
    registerpop.value = false;
    isSpinning.value = false;
    docFee.value = null;
    console.log('Added doc fee', doctorFeeData);
}
const addDocFee = async () => {
    isSpinning.value = true;
    //

    if (user.loginUser.role === "practice") {
        console.log("DOC ID", docId, user.loginUser.role);
        const doctorFeeData = await practiceStore.addDoctorFee(docId, docFee.value);
        if (doctorFeeData) {
            setAddedDocFee(doctorFeeData);
        }
    } else if (user.loginUser.role === "doctor") {
        console.log("DOC ID", docId, user.loginUser.role);
        const doctorFeeData = await doctorStore.addDoctorFee(docFee.value);
        if (doctorFeeData) {
            setAddedDocFee(doctorFeeData);
        }
    }
}

const changeStatus = (id) => {

    // search by id in the array
    const index = doctorFeeInfo.value.findIndex(x => x.id === id);
    feeActiveStatus.value = doctorFeeInfo.value[index].status;
    selectedIndex.value = index;
    console.log(doctorFeeInfo.value[selectedIndex.value]);
    if (doctorFeeInfo.value[selectedIndex.value].status) {
        console.log("HELLOO");
        // cannot unpublish a published appointment fee
        notifyPopup.value = true;
        // notify("Cannot change the status of a Published Appointment Fee !", "negative", "error");
    } else {
        changeStatusPopup.value = true
    }

}


const changeStatusApi = async () => {
    if (user.loginUser.role === "practice") {
        const response = await practiceStore.updateDoctorFeeStatus(docId, doctorFeeInfo.value[selectedIndex.value].id);
        unPublishthePublishedDocFee();
        // publish the doctor fee
        doctorFeeInfo.value[selectedIndex.value].status = response.data.status
        changeStatusPopup.value = false;
    } else if (user.loginUser.role === "doctor") {
        const response = await doctorStore.updateDoctorFeeStatus(docId, doctorFeeInfo.value[selectedIndex.value].id);
        unPublishthePublishedDocFee();
        // publish the doctor fee
        doctorFeeInfo.value[selectedIndex.value].status = response.data.status
        changeStatusPopup.value = false;
    }
}



const unPublishthePublishedDocFee = () => {
    // search by status in the array and unpublish the publised Doctor Fee
    const index = doctorFeeInfo.value.findIndex(x => x.status === true);
    doctorFeeInfo.value[index].status = false;
}

const disableStatusEdit = computed(() => {
    return feeActiveStatus.value === doctorFeeInfo.value[selectedIndex.value].status ? true : false;
})

const closePopup = () => {
    notifyPopup.value = false;
}

</script>