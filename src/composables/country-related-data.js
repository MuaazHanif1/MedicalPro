const country_data= {
    pakistan: {
        nic: 'CNIC',
        nic_mask: '#####-#######-#',
        nic_placeholder: 'Enter CNIC number',
    },
    uae: {
        nic: 'Emirates ID',
        nic_mask: '###-####-#######-#',
        nic_placeholder: 'Enter emirates id',
    },
    usa: {
        nic: 'SSN',
        nic_mask: '###-##-####',
        nic_placeholder: 'Enter SSN number',
    }
};

const useCountryData = (country, field) => {
    let country_field = country == 'United States' ? 'usa' : country == 'Pakistan' ? 'pakistan' : 'uae';
    return country_data[country_field][field.toLowerCase()]
};

export default useCountryData;