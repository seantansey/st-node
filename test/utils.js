const mockRequest = (req) => {
    return req
}

const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
}

const mockNext = () => {
    return jest.fn()
}

const mockError = new Error('mockError')

module.exports = {
    mockRequest,
    mockResponse,
    mockNext,
    mockError
}

