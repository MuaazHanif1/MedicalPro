const error_messages = {
    ERR_NETWORK: 'Network Error',
    404: 'Not Found',
    ERR_BAD_REQUEST: 'Invalid Action',
    ERR_BAD_RESPONSE: 'Invalid Action',
};

const snack_error = (error) => {
    return error_messages[error.code] ? error_messages[error.code] : error.message;
}

export default snack_error;