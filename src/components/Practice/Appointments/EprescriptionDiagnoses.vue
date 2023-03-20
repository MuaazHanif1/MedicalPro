<template>
    <div class="q-pl-lg">
        <div class="heading-section">
            <div class="title">Diagnoses & Medicine</div>
            <q-btn color="white" flat class="add-patient-btn" @click="generatePrescription" text-color="primary" label="Generate Prescription" />
        </div>
        <div v-if="loading">
            <div class="justify-center items-center vertical-middle flex">
                <q-spinner-dots color="primary" size="3em" :thickness="2" />
            </div>
        </div>
        <div class="row"> 
            <div class="col-md-10 col-12">  
                <q-list padding bordered class="rounded-borders col-md-12" v-for="drug in selected_medicines" :key="drug">
                    <q-expansion-item group="eprescriptions"  dense 
                    :label="drug.drug_name ? drug.drug_name : drug.name"
                    @show="drugDetail(drug)">
                        <template v-slot:header>
                            <q-item-section class="drug-name">
                                {{drug.drug_name ? drug.drug_name : drug.name}}
                            </q-item-section>
                        </template>
                        <q-card>
                            <q-card-section>
                                <div class="row medicine-detail">
                                    <div class="col-2"><p>Sig</p></div>
                                    <div class="col-1"> <p><span>{{ drugs_to_apply.includes(drug_detail.type) ? 'Apply' :'Take'}}</span></p> </div>
                                    <div class="col-1 number-input"><q-input readonly outlined placeholder="1" value="1" v-model="drug_detail.quantity" type="number" ></q-input></div>
                                    <div class="col-2"><q-input outlined v-model="drug_detail.type" disable readonly></q-input></div>
                                    <div class="col-2">
                                        <q-select class="select-input" readonly outlined :options="drug.drug_strength ? drug.drug_strength : drug.all_drug_strength " v-model="drug_detail.strength_value" :dense="true" option-label="drug_strength"
                                            option-value="id"></q-select>
                                    </div>
                                    <div class="col-3">
                                        <q-select class="select-input" readonly outlined :options="enums.repetitions" v-model="drug_detail.repetition" :dense="true"></q-select>
                                    </div>
                                    <div class="col-3"></div>
                                    <div><p>by {{drug_detail.intake ? drug_detail.intake :drug_detail?.drug?.intake}} </p></div>
                                    <div class="col-3" v-if="!drugs_to_apply.includes(drug_detail.type)">
                                        <q-select outlined :options="enums.when" readonly v-model="drug_detail.when"  :dense="true" option-label="name"
                                            option-value="name"></q-select>
                                    </div>
                                    <div><p>for</p></div>
                                    <div class="col-1 number-input">
                                        <q-input outlined v-model="drug_detail.for_days" readonly type="number"></q-input>
                                    </div>
                                    <div class="col-1"><p>days</p></div>
                                
                                </div>
                                <div class="row medicine-detail">
                                    <div class="col-2"><p>Quantity</p></div>
                                    <div class="col-1"> <p><span>Take</span></p> </div>
                                    <div class="col-1"><q-input outlined placeholder="1" value="1" disable readonly v-model="drug_detail.quantity_total"></q-input></div>
                                    <div class="col-2"><q-input outlined v-model="drug_detail.type" disable readonly></q-input></div>
                                    <div class="col-1 number-input"><q-input readonly class="numeric-input" outlined type="number" v-model="drug_detail.refill"></q-input></div>
                                    <div class="col-1"><p>refills</p></div>
                                    <div class="col-2"><q-checkbox readonly disable v-model="drug_detail.dispense_as_written" label="DAW" /></div>
                                
                                </div>
                                <div class="row medicine-detail">
                                    <div class="col-2 q-mt-sm">Interal Note</div>
                                    <div class="col-8 q-mt-sm">
                                        <q-input outlined readonly v-model="drug_detail.internal_note" type="textarea"></q-input>
                                    </div>
                                    <div class="col-2"></div>
                                    <div class="col-2 q-mt-sm">Note to Pharmacy</div>
                                    <div class="col-8 q-mt-sm">
                                        <q-input outlined readonly v-model="drug_detail.note_to_pharmacy" type="textarea"></q-input>
                                    </div>
                                    <div class="col-2"></div>
                                    <div class="col-2 q-mt-sm">Note to Patient</div>
                                    <div class="col-8 q-mt-sm">
                                        <q-input outlined readonly v-model="drug_detail.note_to_patient" type="textarea"></q-input>    
                                    </div>
                                    <div class="col-2"></div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </q-expansion-item>
                </q-list>
            </div>
        </div>
    </div>
</template>
<script setup>
import {onMounted, ref} from "vue";
import {useGeneralStore} from "@/store/general";
import enums from "@/composables/enums";
import { useRoute } from "vue-router";
import { usePracticeStore } from "@/store/practice";

const route = useRoute();
const generalStore = useGeneralStore();
const selected_medicines = ref([]);
const practiceStore = usePracticeStore();
const loading = ref(false);
const drug_detail = ref([]);
const drugs_to_apply = ref([
    'Spray',
    'Plasma',
    'Topical',
    'Serum',
    'Plasma/Topical/Serum'
]);

onMounted( async ()=>{
    fetchEPreseciption();
})

//fetch already saved prescreptions
const fetchEPreseciption = async () => {
    loading.value = true;
    const prescreptions =  await generalStore.getEPrescriptionById(route.params.id);
    loading.value = false;
    selected_medicines.value = [];
    if(prescreptions){
        selected_medicines.value = [...prescreptions,...selected_medicines.value];
    }
}


// set drug object
const drugDetail = (drug) => {
    drug_detail.value = drug;
}


const generatePrescription = () => {
    practiceStore.generatePrescription(route.params.id).then(() => {       
    })
}
</script>
<style lang="scss" scoped>
:deep(.search-medicine .q-field){
    min-width: 566px !important;
    margin-top: 6px;
    height: 40px;
    border: 1px solid #D2D5E0;
    border-radius: 8px;
}
:deep(.rounded-borders){
    min-width: 400px;
    border: 1px solid white !important;
    background: #F9F9FB;
    margin-top: 8px;
}
:deep(.q-card__section){
    background: #F9F9FB;
}
:deep(.q-focus-helper){
    background: none;
}
:deep(.drug-name){
    color: $primary;
}
:deep(.medicine-detail .q-field__control){
    height: 40px;
    margin:5px;
}
:deep(.medicine-detail p){
    margin-top: 10px;
}

:deep(.drug-detail-edit){
    display: flex;
    flex-wrap: wrap;
}
:deep(.drug-detail-edit p){
    padding: 5px;
}
:deep(.drug-detail-edit .q-field__control){
    height: 40px;
    margin-left: 20px;
    margin-bottom: 20px;
}
// :deep(.numeric-input){
//     width: 55px;
// }
// :deep(.select-input){
//     min-width: 140px;
// }
// :deep(.q-expansion-item__toggle-icon){
//     display: none;
// }
:deep(.q-textarea .q-field__control){
    height: 60px;
}
:deep(.when-field){
    margin-left: 29px;
}
// :deep(.text-subtitle1){
//     height: 22px;
//     width: 178px;
// }
:deep(.title){
    width: 178px;
    height: 22px;
    font-family: 'Lato';
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    display: flex;
    align-items: center;
    color: #0D0C22;
    margin-bottom: 25px;
}
:deep(.label-input){
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    color: #505050;
}
:deep(.q-focus-helper){
    background: yellow;
}
:deep(.q-expansion-item .q-focus-helper ) {
    visibility: hidden;
}
:deep(.rounded-borders .action){
    display: flex;
    width: 100%;
    justify-content: space-between;
    .q-btn {
     height: 40px;
     width: 90px;
     border-radius: 6px;   
    }
    .delete{
        background: grey;
        color: white;
    }
}
:deep(.number-input){
    min-width: 75px;
}
:deep(.heading-section){
    display: flex;
    justify-content: space-between;


    @media (max-width: 600px) {
        display: block !important;
    }
    .q-btn {
        // width: 142px;
        // height: 36px;
        background: #F9F9FB;
        border: 1px solid #F6F6F8;
        border-radius: 4px;
        text-transform: capitalize;
    }
}
</style>