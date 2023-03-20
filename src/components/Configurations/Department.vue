<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div v-if="isLoading" class=" width-100 justify-center items-center flex">
        <q-spinner-dots color="primary" size="2em" :thickness="2" />
    </div>
    <section v-else class="width-100 mr-24 container">
        <div class="dark-black medium-font mt-4 font-weight-700">All Departments</div>
        <span class="absolute-right mr-24" style="max-height: 0px;">
            <q-btn @click="openDeptDialog()" no-caps text-color="primary" class="add-patient-btn" unelevated icon="add"
                size="md" label="Create new department" />
        </span>
        <!-- Popup for creating a department -->
        <q-dialog v-model="deptDialog" no-backdrop-dismiss>
            <q-card class="px-14" style="width: 600px">
                <q-card-section class="row items-center q-pb-none">
                    <div class="dark-black medium-font">Create New Department</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-card-section>
                    <q-form ref="deptForm">
                        <!-- departmentName -->
                        <div class=" column flex col-sm-6 col-12 self-end">
                            <span class="q-mb-sm input-label">Department name</span>
                            <q-input @keydown.enter.prevent="validateAndSubmit()" outlined :dense="true"
                                placeHolder="Enter Department Name" v-model="deptName" class="pb-0"
                                :rules="[rules.required, rules.alphabets]">
                            </q-input>
                        </div>
                    </q-form>
                    <div class="flex justify-end mt-28">
                        <q-btn color="primary" :loading="isSpinning" @click="validateAndSubmit()" size="md"
                            class="q-p-md px-20 text-lower-case">
                            Create
                        </q-btn>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>
        <!-- Popup for creating a department -->
        <template :key="dept" v-for="(dept, index) in deptArray">
            <q-separator v-if="index !== 0" class="width-auto my-30" />
            <CreatedDepartment :deptId="dept.id" :deptName="dept.name" :employeeType="dept.employee_type" />
        </template>
    </section>

</template>
<script setup>
import { ref, onMounted } from "vue";
import CreatedDepartment from "./CreatedDepartment.vue";
import { useDepartmentStore } from "@/store/department";


//button spinner
const isSpinning = ref(false);

// loader
const isLoading = ref(false);

// store
const store = useDepartmentStore();

// departments array
const deptArray = ref([]);

// dept ID
// const id = ref(null);

// dept Name
const deptName = ref("");
// dept Dialog
const deptDialog = ref(false);



const deptForm = ref(null);


/**  Description: this method opens the Department Dialog
 */
const openDeptDialog = () => {
    deptDialog.value = true;
}
/**  Description: this method closes the Department Dialog
 */
const closeDeptDialog = () => {
    deptDialog.value = false;
}

/**  Description: this method validates the input field and submits the form to add department
 */
const validateAndSubmit = () => {
    deptForm.value.validate().then((success) => {
        if (success) {
            // make API call here
            addDepartment();

        }
    });
};

/**  Description: this method makes the API call to add the department
 */
const addDepartment = async () => {
    isSpinning.value = true;
    const response = await store.addDepartment(deptName.value);

    if (response) {

        // id.value = response.data.data.id;
        deptArray.value.unshift({
            name: deptName.value,
            id: response.data.data.id,
            employee_type: [],
        })
        // add department id

        // clear the input field value
        deptName.value = "";
        // close the prompt
        closeDeptDialog();
        isSpinning.value = false;
    } else {
        // clear the input field value
        deptName.value = "";
        isSpinning.value = false;
    }

}
/**  Description: this method gets all the departments along with their respective employee types
 */
onMounted(async () => {
    isLoading.value = true;
    const response = await store.getAllDeptsWithEmployees();
    if (response) {
        deptArray.value = response;
        isLoading.value = false;

    }
})

</script>
<style scoped lang="scss">
.container {
    max-height: 540px !important;
    overflow-y: scroll;
    margin-bottom: 36px;
}

:deep .add-patient-btn {
    box-sizing: border-box;
    background: #ffffff;
    border: 1px solid #f6f6f8;
    border-radius: 4px;
    font-family: "Lato";
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 14px;
    height: 36px;
    z-index: 10;
}

:deep .add-patient-btn:hover {
    color: white !important;
    background: #547f6d !important;
}
</style>