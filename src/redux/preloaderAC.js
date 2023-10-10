const IS_LOADING = 'IS_LOADING';
const SUCCESS_LOADING = 'SUCCESS_LOADING';
const ERROR_LOADING = 'ERROR_LOADING';

const isLoading = function () {
    return {
        type: IS_LOADING
    }
};

const successLoading = function () {
    return {
        type: SUCCESS_LOADING
    }
};

const errorLoading = function () {
    return {
        type: ERROR_LOADING
    }
};

export {isLoading, successLoading, errorLoading, IS_LOADING, SUCCESS_LOADING, ERROR_LOADING};

