<template>
    <DataListing :rows="doctorOffDates" :columns="offDaysHeader" :pagination="pagination" :information="information"
      :loading="loading" @pagination-data="onRequest" @deleteItem="deleteItem" @toggle-DialogBox="toggleDialogBox" class="pt-27">
    </DataListing>
    <q-dialog v-model="adddatespopup" no-backdrop-dismiss>
        <q-card class="px-14" style="width: 600px">
            <q-card-section class="row items-center q-pb-none">
                <div class="dark-black medium-font">Add Off Dates</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
                <q-form ref="offDateForm">
                    <div class="col-sm-6 col-12">
                        <span class="color-green mr-14 font-size-16 font-weight-600">Select Dates</span>
                        <q-icon size="1rem" name="event" class="calendar-icon" color="primary">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="days" multiple mask="YYYY-MM-DD" :options="disableSavedandPreviousDates">
                                <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                            </q-date>
                            </q-popup-proxy>
                        </q-icon>
                    </div>
                </q-form>
                <span  v-for="day in days" :key="day">
                    <q-chip>{{day}}</q-chip>
                </span>
                <div class="flex justify-end mt-28">
                    <q-btn color="primary" :loading="isSpinning" @click="saveOfDates()" size="md"
                        class="q-p-md px-20 text-lower-case">
                        Add
                    </q-btn>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
    <NotifyPopup v-model="sure_to_delete" :heading="'Are you sure you want to delete?'" 
      @btn-click="confirmDelection" :btnText="'Confirm'"></NotifyPopup>
  </template>
  
<script setup>
  import { onMounted, ref } from "vue";
  import { usePracticeStore } from "@/store/practice";
  import DataListing from "@/partials/DataListing.vue";
  import NotifyPopup from "@/partials/NotifyPopup.vue"
  import notify from "@/composables/notify";
  import { useRoute } from "vue-router";
  import { date } from "quasar";

  const route = useRoute();
  
  const store = usePracticeStore();
  const doctorOffDates = ref([]);
  const loading = ref(false);
  const adddatespopup = ref(false);
  const days = ref([]);
  const deleting_item = ref('');
  const disabledates = ref ([]);
  const sure_to_delete = ref (false);
  const information = ref({
    heading: "Off Dates",
    isSimpleButton: true,
    text: "Add Off Date",
    // detail_page_link: "patient-detail",
    detail_page_btn: "patient-detail",
    delete_item_btn:true
  });
  const offDaysHeader = [
    { name: "index", label: "Sr. #", field: "index", align: "left" },
    // {
    //   name: "id",
    //   label: "Id",
    //   field: "id",
    //   align: "left",
    // },
    {
      name: "date",
      label: "Date",
      field: "date",
      align: "left",
    },
    {
      name: "created_at",
      label: "Created at",
      field: "created_at",
      align: "left",
    },
    { name: "actions", label: "Action", field: "actions", align: "left" },
  ];
  const pagination = ref({
    page: 1,
    rowsPerPage: 15,
    rowsNumber: 15,
    last_page: 1
  });
  onMounted(() => {
      loading.value = true;
      getDoctors();
      loading.value = false;
  });

  const onRequest = async (req) => {
    loading.value = true;
    store.getDoctorOffDates({
        doctor_id:route.params.id,
        page: req.pagination && req.pagination.page ? req.pagination.page : req,
        pagination: req.pagination && req.pagination.rowsPerPage ? req.pagination.rowsPerPage : pagination.value.rowsPerPage
    }).then((res) => {
      doctorOffDates.value = [];
      doctorOffDates.value = res.data;
      disabledates.value = [];
      disabledates.value = doctorOffDates.value.map(item => { return  item.date });
      pagination.value.rowsNumber = res.meta.total;
      pagination.value.rowsPerPage = res.meta.per_page;
      pagination.value.page = res.meta.current_page;
      pagination.value.last_page = res.meta.last_page;
      loading.value = false;
    })
    .catch((error)=>{
      console.log(error);
      loading.value = false;
    });
  
  };

  const toggleDialogBox = () => {
    adddatespopup.value = true;
  }
  const saveOfDates = async () => {
    if(days.value && days.value.length){
        loading.value = true;
        const response = await store.practiceCreateDoctorOffDays({doctor_id:route.params.id,dates:days.value});
        if(response && response.data && response.data.length){
          notify('Off days added','primary');
        }
        adddatespopup.value = false;
        days.value = [];
        getDoctors();
        loading.value = false;
    }
    else {
        notify('Select atleast one date','negative');
    }
  }
  const deleteItem = (data) => {
    deleting_item.value = data;
    sure_to_delete.value = true;
    
  }
  const disableSavedandPreviousDates = (date1) => {
    const datefromcalender = date.formatDate(date1,"YYYY-MM-DD");
    if (disabledates.value.includes(datefromcalender) || datefromcalender < date.formatDate(Date.now(),"YYYY-MM-DD")){
      return false;
    }
    else {
      return true;
    } 
  }

  const getDoctors = async () => {
    const offdates = await store.getDoctorOffDates(
        {   doctor_id:route.params.id,
            pagination:pagination.value.rowsPerPage,
            page:1
        });
      if(offdates){
        doctorOffDates.value = offdates.data;
        disabledates.value = doctorOffDates.value.map(item => { return  item.date });
        pagination.value.rowsNumber = offdates.meta.total;
        pagination.value.page = offdates.meta.current_page;
        pagination.value.last_page = offdates.meta.last_page;
      } 
  }

  const confirmDelection = () => {
    store.deleteDoctorOffDate({ids:[deleting_item.value.id]}).then(() => {
      sure_to_delete.value = false;
      getDoctors();
      notify("off day deleted successfully",'negative');
    })
  }

  </script>