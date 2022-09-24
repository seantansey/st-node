const { authorizeAPIKey } = require('../../middleware/authorizeAPIKey')
const db = require('../../db')
const bcrypt = require('bcrypt')
const { mockRequest, mockResponse, mockNext, mockError } = require('../utils')

jest.mock('bcrypt')
jest.mock('../../db/index.js')

describe('middleware: authorizeAPIKey', () => {
    test('should throw error if no credentials', async () => {
        const req = mockRequest({
            headers: {}
        })
        const res = mockResponse()
        const next = mockNext()
        await authorizeAPIKey(req, res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            status: 401,
            message: "Unauthorized: missing required credentials"
        })
    })

    test('should throw error if no app id', async () => {
        const req = mockRequest({
            headers: {
                'x-api-key': 'mockAPIKey'
            }
        })
        const res = mockResponse()
        const next = mockNext()
        await authorizeAPIKey(req, res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            status: 401,
            message: "Unauthorized: missing required credentials"
        })
    })

    test('should throw error if no api key', async () => {
        const req = mockRequest({
            headers: {
                'x-app-id': 'mockAppId'
            }
        })
        const res = mockResponse()
        const next = mockNext()
        await authorizeAPIKey(req, res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            status: 401,
            message: "Unauthorized: missing required credentials"
        })
    })


    test('should throw error if app id does not exist', async () => {
        db.query.mockImplementationOnce(() => Promise.reject(mockError))

        const req = mockRequest({
            headers: {
                'x-app-id': 'mockAppId',
                'x-api-key': 'mockAPIKey'
            }
        })
        const res = mockResponse()
        const next = mockNext()
        await authorizeAPIKey(req, res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            status: 401,
            message: "Unauthorized: app id not recognized"
        })
    })

    test('should throw error if error occurs during bycrpt comparison', async () => {
        db.query.mockImplementation(() => Promise.resolve({
            rows: [
                { key: 'mockKey' }
            ]
        }))
        bcrypt.compare.mockImplementation(() => Promise.reject(mockError))

        const req = mockRequest({
            headers: {
                'x-app-id': 'mockAppId',
                'x-api-key': 'mockAPIKey'
            }
        })
        const res = mockResponse()
        const next = mockNext()
        await authorizeAPIKey(req, res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            status: 401,
            message: "Unauthorized: error processing credentials"
        })
    })

    test('should throw error if error if api key is not authorized', async () => {
        db.query.mockImplementation(() => Promise.resolve({
            rows: [
                { key: 'mockKey' }
            ]
        }))
        bcrypt.compare.mockImplementation(() => Promise.resolve(false))

        const req = mockRequest({
            headers: {
                'x-app-id': 'mockAppId',
                'x-api-key': 'mockAPIKey'
            }
        })
        const res = mockResponse()
        const next = mockNext()
        await authorizeAPIKey(req, res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            status: 401,
            message: "Unauthorized: api key not authorized to perform this action"
        })
    })

    test('should call next', async () => {
        db.query.mockImplementation(() => Promise.resolve({
            rows: [
                { key: 'mockKey' }
            ]
        }))
        bcrypt.compare.mockImplementation(() => Promise.resolve(true))

        const req = mockRequest({
            headers: {
                'x-app-id': 'mockAppId',
                'x-api-key': 'mockAPIKey'
            }
        })
        const res = mockResponse()
        const next = mockNext()
        await authorizeAPIKey(req, res, next)
        expect(next).toHaveBeenCalled()
    })
})