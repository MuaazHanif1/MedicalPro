import { useGeneralStore } from "@/store/general";
const storeGeneral = useGeneralStore();
export default function dropdownHelper (id,type) {
    if(type == 'country_id'){
        return storeGeneral.getStateRequest(id);
    }
    else if(type == 'state_id'){
        return storeGeneral.getCityRequest(id);
    }
    else if(type == 'home_country'){
        return storeGeneral.getStateRequest(id);
    }
    else if(type == 'home_state'){
        return storeGeneral.getCityRequest(id);
    }
    
}

