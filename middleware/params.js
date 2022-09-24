

const validateParams = ({ body }, params) => {
    if (!body || !params.every((param) => body[param])) {
        return new Error('Missing required parameters')
    }
}


module.exports = {
    validateParams
}