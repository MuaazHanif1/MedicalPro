import { useGeneralStore } from "@/store/general";
import { useDoctorsRegistrationStore } from "@/store/doctors_registration";
const storeGeneral = useGeneralStore();
const doctorStore = useDoctorsRegistrationStore();
export default function getName (id,helpername) {
    
    if(helpername == 'getLanguage'){
        return storeGeneral.languages.find(x => x.id === id)?.language;
    }
    else if(helpername == 'getRace'){
        return storeGeneral.races.find(x => x.id === id)?.name;
    }
    else if(helpername == 'getEthnicity'){
        return storeGeneral.ethnicities.find(x => x.id === id)?.name;
    }
    else if(helpername == 'getCountry'){
        return storeGeneral.countries.find(x => x.id === id)?.name;
    }
    else if(helpername == 'getState'){  
        return storeGeneral.states.find(x => x.id === id)?.name;
    }
    else if(helpername == 'getCity'){
        return storeGeneral.cities.find(x => x.id === id)?.name;
    }
    else if(helpername == 'getAllergy'){
        return storeGeneral.allergy_reactions.find(x => x.id === id)?.name;
    }
    else if(helpername == 'getRelation'){
        return storeGeneral.family_relations.find(x => x.id === id)?.relationship;
    }
    else if(helpername == 'getSpecialization'){
        return doctorStore.specialization_option.find(x => x.id === id)?.name;
    }
    
    
}

