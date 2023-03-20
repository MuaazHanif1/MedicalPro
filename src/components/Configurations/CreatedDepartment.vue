<template>
    <section class="mt-30 width-100">
        <div class="row flex justify-between">
            <div class="dark-black medium-font font-weight-600" style="
            text-transform:capitalize ;
            font-size: 18px;
            ">
                {{ deptName }}
            </div>

            <span @click="openEmployeeDialog()"
                class="add-employee medium-font row flex cursor-pointer items-center mt-10">
                <q-icon name="add_circle"></q-icon>
                <p class="pl-5  ma-0 font-small">Add Employee Type</p>
            </span>
        </div>
        <!-- displaying the employee types
        -->
        <div class="row mt-16 flex items-center">
            <template :key="index" v-for="(chip, index) in employeeTypeArray">
                <div id="parent" class="row mt-10" :class="{
                    'col-4': $q.screen.width >= 1220 && $q.screen.width <= 1600,
                    'col-6': $q.screen.width >= 750 && $q.screen.width <= 1220,
                }">
                    <span :class="chip.status ? 'dark-grey'
                    : 'grey'" class="emp-type-name" style="
                    text-overflow: ellipsis;
                    overflow: hidden;
                    ">
                        {{ chip.name }}
                        <q-tooltip v-if="checkOverflow(chip.name)">
                            {{ chip.name }}
                        </q-tooltip>
                    </span>
                    <span class="ml-21 hidden-child">
                        <q-icon @click="openEmployeeEditDialog(index)" class="cursor-pointer icon" name="edit"></q-icon>
                        <!-- <q-icon @click="openEmployeeDeleteDialog(index)" class="cursor-pointer icon" name="delete">
                        </q-icon> -->
                        <q-icon @click="openEmployeeStatusDialog(index)" class="cursor-pointer icon" name="visibility">
                        </q-icon>
                    </span>
                </div>
            </template>
        </div>
    </section>

    <!-- Popup for creating an employee type -->
    <q-dialog v-model="employeeDialog" no-backdrop-dismiss>
        <q-card class="px-14" style="width: 600px">
            <q-card-section class="row items-center q-pb-none">
                <div class="dark-black medium-font">Add Employee Type</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
                <q-form ref="employeeForm" class="row flex items-center justify-between">
                    <!-- departmentName -->
                    <div class=" column flex col-12">
                        <span class="q-mb-sm input-label">Employee type</span>
                        <q-input @keydown.enter.prevent="
                            onEnter()
                        " outlined :dense="true" placeHolder="Enter employee type" v-model="employeeType" class="pb-0">
                            <template v-slot:append>
                                <div class="flex">
                                    <span class="border-input-field"></span>
                                    <div :class="{ 'no-pointer-events': error !== 'error' && error !== '' }"
                                        @click="addChips()" class="medium-font flex cursor-pointer items-center ml-5">
                                        <q-icon class="color-green" name="add_circle"></q-icon>
                                        <!-- <p class="pl-5 color-green ma-0 font-small">Add</p> -->
                                    </div>
                                </div>
                            </template>
                        </q-input>
                    </div>
                </q-form>
                <!-- show error if any -->
                <span class="text-danger" v-if="
                employeeType !== '' && error !== '' && error !== 'error'">{{ error
                }}</span>

                <!-- show Chips -->
                <div class="mt-30 bg-white rounded-borders col-12 text-area-chip">

                    <template :key="index" v-for="(chip, index) in employeeTypeChipsArray">
                        <q-chip class="light-green-chip">{{ chip.name }}
                            <span>
                                <q-icon @click="deleteChip(index)" class="color-green" name="close"></q-icon>
                            </span>
                        </q-chip>
                    </template>
                </div>

                <div class="flex justify-end mt-28">
                    <q-btn :disable="employeeTypeChipsArray.length === 0" :loading="isSaving"
                        @click="displayEmployeeTypes()" size="md" color="primary" label="Create"
                        class="q-p-md px-20 text-lower-case" />

                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
    <!-- Popup for creating an employee type -->

    <!-- Popup for Deleting an employee type -->

    <q-dialog v-model="employeeDeleteDialog" no-backdrop-dismiss>
        <q-card class="px-14" style="width: 600px">
            <q-card-section class="row items-center q-pb-none">
                <div class="dark-black medium-font">Delete Employee Type</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
                <q-form class="row flex items-center">
                    <span> Do you really want to delete {{ employeeTypeArray[selectedEmployeeTypeIndex].name }} employee
                        Type
                        ?</span>
                </q-form>


                <div class="flex justify-end mt-28">
                    <q-btn :disable="employeeTypeChipsArray.length === 0" :loading="isSaving"
                        @click="deleteEmployeeType()" size="md" class="q-p-md px-20 text-lower-case">
                        Delete
                    </q-btn>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>

    <!-- Popup for editing a employeeType Name -->
    <q-dialog v-model="employeeEditDialog" no-backdrop-dismiss>
        <q-card class="px-14" style="width: 600px">
            <q-card-section class="row items-center q-pb-none">
                <div class="dark-black medium-font">Edit Employee Type</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
                <q-form ref="editEmployeeForm">
                    <!-- employeeTypeName -->
                    <div class=" column flex col-sm-6 col-12 self-end">
                        <span class="q-mb-sm input-label">Employee type</span>
                        <q-input outlined :dense="true" :rules="[rules.required]" v-model="employeeEditInput"
                            class="pb-0">
                        </q-input>
                    </div>
                </q-form>

                <!-- show error if any -->
                <span class="text-danger" v-if="
                employeeEditInput !== '' && error !== '' && error !== 'error'">{{ error
                }}</span>
                <div class="flex justify-end mt-28">
                    <q-btn color="primary" :loading="isSaving" @click="editEmployeeType()" size="md"
                        :class="{ 'no-pointer-events': employeeTypeArray[selectedEmployeeTypeIndex].name.toLowerCase() === employeeEditInput.toLowerCase() || error !== 'error' && error !== '' }"
                        class="q-p-md px-20 text-lower-case">
                        Edit
                    </q-btn>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
    <!-- Popup for editing a employeeType -->
    <!-- Popup for changing a employeeType Status -->
    <q-dialog v-model="employeeStatusDialog" no-backdrop-dismiss>
        <q-card class="px-14" style="width: 600px">
            <q-card-section class="row items-center q-pb-none">
                <div class="dark-black medium-font">Change Employee Type Status</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
                <div class=" column flex col-sm-6 col-12 self-end">
                    <FormInput class="col-sm-6 col-12" :class="$q.screen.lt.sm ? 'pr-0 mt-20' : ''" :isInput="false"
                        :option="statusOptions" label="Employee status" inputType="select"
                        v-model="employeeTypeActiveStatus" />
                </div>

                <div class="flex justify-end mt-28">
                    <q-btn color="primary" :loading="isSaving" @click="changeEmployeeTypeStatus()" size="md"
                        class="q-p-md px-20 text-lower-case">
                        Change
                    </q-btn>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
    <!-- Popup for changing a employeeType Status -->


</template>

<script setup>
import { defineProps } from "vue";
import { ref, watch } from "vue";
import { useDepartmentStore } from "@/store/department";
import FormInput from "@/partials/FormInput.vue";

const props = defineProps({
    deptName: {
        type: String,
    },
    deptId: {
        type: Number,
    },
    employeeType: {
        type: Array
    }

});


// store
const store = useDepartmentStore();

// empolyee type edit Dialog
const employeeTypeActiveStatus = ref(null);

const statusOptions = [
    // {
    //     id: "",
    //     name: "Select Employee Type Status",
    // },
    {
        name: "Active",
        id: true,
    },
    {
        name: "Inactive",
        id: false,
    },

];


// loader
const isSaving = ref(false);

// employeeSelected
const selectedEmployeeTypeIndex = ref(null);

// employee Dialog
const employeeDialog = ref(false);

// employee Delete Dialog
const employeeDeleteDialog = ref(false);

// empolyee type edit Dialog
const employeeEditDialog = ref(false);

// empolyee type edit Dialog
const employeeStatusDialog = ref(false);

// edit employee field model
const employeeEditInput = ref(null);

//add employee Form
const employeeForm = ref(null);

//edit employee Form
const editEmployeeForm = ref(null);

// Add Employee Type Dialog
const employeeType = ref("");

/**  Description: this method opens the Add Employee Type Dialog
 */
const openEmployeeDialog = () => {
    employeeDialog.value = true;
}

/**  Description: this method closes the Add Employee Type Dialog
 * It resets the Epmloye Type Chips (not showing the added employee types in the chips box)
 */
const closeEmployeeDialog = () => {
    employeeDialog.value = false;
    employeeTypeChipsArray.value = [];

}

// Will be used in futuer
/**  Description: this method opens the Delete Employee Type Dialog
 * It selects the employee type that is going to be deleted
 */
// const openEmployeeDeleteDialog = (index) => {
//     selectedEmployeeTypeIndex.value = index;
//     employeeDeleteDialog.value = true;

// }

// Will be used in futuer
/**  Description: this method closes the Delete Employee Type Dialog
 */
// const closeEmployeeDeleteDialog = () => {
//     employeeDeleteDialog.value = false;
// }

/**  Description: this method opens the Edit Employee Type Dialog
 * It selects the employee type whose name is going to be edited
 * It resets the Dialog's input field
 * @param {index} Number Employee Type ID
 */
// Edit Employee Type Dialog
const openEmployeeEditDialog = (index) => {
    selectedEmployeeTypeIndex.value = index;
    employeeEditInput.value = employeeTypeArray.value[index].name;
    employeeEditDialog.value = true;

}

/**  Description: this method closes the Edit Employee Type Dialog
 */
const closeEmployeeEditDialog = () => {
    employeeEditDialog.value = false;
}

/**  Description: this method opens the Edit Status Employee Type Dialog
 * It selects the employee type whose status is going to be edited
 * @param {index} Number Employee Type ID
 */
const openEmployeeStatusDialog = (index) => {
    selectedEmployeeTypeIndex.value = index;
    console.log("EMPLOYEETYPEARRRAY Status", employeeTypeArray.value[index].status);
    employeeTypeActiveStatus.value = employeeTypeArray.value[index].status == 1 ? true : false;
    employeeStatusDialog.value = true;

}

/**  Description: this method closes the Status Employee Type Dialog
 */
const closeEmployeeStatusDialog = () => {
    employeeStatusDialog.value = false;
}

const employeeTypeChipsArray = ref([]);

/**  Description: this method add chips in the text area of the Employee Type Dialog
 * Only gets executed when there's no error
 */
const onEnter = () => {
    if (error.value === 'error' || error.value === "") {
        addChips()
    }
}
/**  Description: this method add chips in the text area of the Employee Type Dialog
 * Only gets executed if there are chips to be added
 * After adding the chips, it resets the input field, so user can enter more chips
 */
const addChips = () => {

    if (employeeType.value === "") {
        return;
    }

    employeeTypeChipsArray.value.push(
        {
            name: employeeType.value,
            status: true
        }

    );
    // reset the input field
    employeeType.value = "";

    console.log("CHIPS", employeeTypeChipsArray.value)

}

// error
const error = ref("error");


/**  Description: this watcher shows error if user is going to add duplicate employee types
 * Only gets executed if there are chips to be added
 */
watch(employeeType, (newValue) => {
    // check if the the chip is already added
    if (newValue !== "") {
        let resumeChecking = true;

        if (employeeTypeArray.value.length !== 0) {

            for (let index = 0; index < employeeTypeArray.value.length; index++) {
                console.log("newValue", newValue, "employeeTypeArray",
                    employeeTypeArray.value[index].name);
                if (employeeTypeArray.value[index].name.toLowerCase() === newValue.toLowerCase()) {
                    error.value = "This Type is already added !";
                    console.log("THIS TYPE IS ALREADY ADDED")
                    resumeChecking = false;
                    break;
                } else {
                    console.log("UNIQUE,employeeTypeArray");
                    error.value = "";
                }
            }
        }
        if (resumeChecking && employeeTypeChipsArray.value.length !== 0) {

            for (let index = 0; index < employeeTypeChipsArray.value.length; index++) {
                console.log("newValue", newValue, "employeeTypeChipsArray",
                    employeeTypeChipsArray.value[index].name);
                if (employeeTypeChipsArray.value[index].name.toLowerCase() === newValue.toLowerCase()) {
                    error.value = "This Type is already added !";
                    console.log("THIS TYPE IS ALREADY ADDED")
                    break;
                } else {
                    console.log("UNIQUE,employeeTypeChipsArray");
                    error.value = "";
                }
            }

        }
    }

})

/**  Description: this method deletes employee type chip
 */
const deleteChip = (index) => {
    employeeTypeChipsArray.value.splice(index, 1);
    // employeeTypeArray.value.splice(index, 1);
}

// employee Type array
const employeeTypeArray = ref(props.employeeType.length !== 0 ? props.employeeType : []);

/**  Description: this method adds the employee types and show them
 * It stores the added employee chips in the database (makes the api call)
 * On successful response, it shows the added employee types
 */
const displayEmployeeTypes = async () => {
    isSaving.value = true;
    let tempArr = [];

    employeeTypeChipsArray.value.forEach((employeeType,) => {
        console.log(employeeType.name
            , "data I want to push");
        tempArr.push(employeeType.name);

    })
    // add employe Types in the Department
    const response = await store.addEmployeesDept(props.deptId, tempArr);
    if (response) {
        //  add the chips to the employee Types
        employeeTypeArray.value = [...employeeTypeArray.value, ...response];
        console.log(employeeTypeArray.value);
        closeEmployeeDialog();
        isSaving.value = false;
    }

}
// Will be used in future
/**  Description: this method deletes the employee type
 */
// const deleteEmployeeType = () => {
//     isSaving.value = true;
//     // delete the chip and data
//     employeeTypeChipsArray.value.splice(selectedEmployeeTypeIndex.value, 1);
//     employeeTypeArray.value.splice(selectedEmployeeTypeIndex.value, 1);
//     closeEmployeeDeleteDialog();
//     isSaving.value = false;
//     selectedEmployeeTypeIndex.value = null;
// }

/**  Description: this method edits the employee type's Name
 * It validates if user has added the correct employee Type
 */
const editEmployeeType = () => {
    editEmployeeForm.value.validate().then((success) => {
        if (success) {
            updateEmployeeStatusName(
                employeeTypeArray.value[selectedEmployeeTypeIndex.value].id,
                employeeEditInput.value,
                employeeTypeArray.value[selectedEmployeeTypeIndex.value].status
            )
        }

    });
}
/**  Description: this method edits the employee type's Status
 */
const changeEmployeeTypeStatus = () => {
    updateEmployeeStatusName(
        employeeTypeArray.value[selectedEmployeeTypeIndex.value].id,
        employeeTypeArray.value[selectedEmployeeTypeIndex.value].name,
        employeeTypeActiveStatus.value
    )

}


/**  Description: this method updates an employee type name and status in the respective department
     * After successful backend response, it updates the employee type status and anme, closes the edit name and status dialog boxes and resets the loader and input field
     * @param {employID} String Employee ID
     * @param {employName} String Employee Type Name
     * @param {employName} String Employee Type Status
    */
const updateEmployeeStatusName = async (employID, employName, employStatus) => {
    isSaving.value = true;

    const response = await store.updateEmployeeNameAndStatus(employID, employName, employStatus);
    if (response) {
        // update name and status
        employeeTypeArray.value[selectedEmployeeTypeIndex.value].name = response.name;
        // employeeTypeChipsArray.value[selectedEmployeeTypeIndex.value] = response.name;
        employeeTypeArray.value[selectedEmployeeTypeIndex.value].status = response.status;

        // close dialogs and reset input field
        closeEmployeeEditDialog();
        closeEmployeeStatusDialog();
        isSaving.value = false;
        employeeEditInput.value = null;

    }
}

/**  Description: this watcher shows error if user is going to add duplicate employee types
 */
watch(employeeEditInput, (newValue) => {
    // do 
    console.log("WATCH",
        employeeTypeArray.value[selectedEmployeeTypeIndex.value]
    )
    if (employeeTypeArray.value[selectedEmployeeTypeIndex.value].name.toLowerCase() === String(newValue).toLowerCase()) {
        // do not show any error
        error.value = "";
        console.log("DONOT SHOW ANY ERROR");
    }
    // check if the the chip is already added
    else if (newValue !== "") {
        if (employeeTypeArray.value.length !== 0) {


            for (let index = 0; index < employeeTypeArray.value.length; index++) {
                console.log("newValue", newValue, "employeeTypeArray",
                    employeeTypeArray.value[index].name);
                if (employeeTypeArray.value[index].name.toLowerCase() === String(newValue).toLowerCase()) {
                    error.value = "This Type is already added !";
                    console.log("THIS TYPE IS ALREADY ADDED")
                    break;
                } else {
                    console.log("UNIQUE,employeeTypeArray");
                    error.value = "";
                }
            }


        }

    }

})

/**  Description: this method checks the length of employee type name and decides whether to show the toolstip or not
 */
const checkOverflow = (name) => {
    let nameLength = [...name].length;
    if (nameLength >= 23) {
        return true;
    } else {
        return false;
    }
}

watch(employeeTypeChipsArray, (newValue) => {
    console.log("EMPLOYEE TYPE CHIPS ARRAY WATCHER", newValue);
})

console.log('PROPS', props, props.employeeType.length);
</script>

<style scoped lang="scss">
.light-green-chip {
    background: #EBF0EE !important;
    color: $primary;
    cursor: pointer;

}

.text-area-chip {
    border: 1px solid #d2d5e0 !important;
    max-height: 92px;
    height: 92px;
    overflow-y: scroll;

}

:deep .icon {
    color: #B5BAC1;
    font-size: 15px;
    padding-right: 10px;
    cursor: pointer;
}

:deep .icon:hover {
    color: $primary;
    cursor: pointer;
}

:deep .bg-negative {
    color: #EBF0EE;
}

.grey {
    color: #B5BAC1;
}

.container {
    max-height: 600px !important;
    overflow-y: scroll;
}

#parent .hidden-child {
    visibility: hidden;
}

#parent:hover .hidden-child {
    visibility: visible;
}

.border-input-field {
    border-left: 1px solid #9b96a0;
    font-size: $medium-font;
}

:deep .add-employee {
    color: #A1A8B1;
}

:deep .add-employee:hover {
    color: $primary;
}

.emp-type-name {
    max-width: 180px !important;
}
</style>