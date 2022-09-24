const { authorizeAdmin } = require('../../middleware/authorizeAdmin')
const db = require('../../db')
const bcrypt = require('bcrypt')
const { mockRequest, mockResponse, mockNext, mockError } = require('../utils')

jest.mock('bcrypt')
jest.mock('../../db/index.js')

describe('middleware: authorizeAdmin', () => {
    test('should throw error if no credentials', async () => {
        const req = mockRequest({
            headers: {}
        })
        const res = mockResponse()
        const next = mockNext()
        await authorizeAdmin(req, res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            status: 401,
            message: "Unauthorized: missing required credentials"
        })
    })

    test('should throw error if wrong authorization format', async () => {
        const req = mockRequest({
            headers: {
                authorization: 'Basic'
            }
        })
        const res = mockResponse()
        const next = mockNext()
        await authorizeAdmin(req, res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            status: 401,
            message: "Unauthorized: missing required credentials"
        })
    })


    test('should throw error if user does not exist', async () => {
        db.query.mockImplementationOnce(() => Promise.reject(mockError))

        const req = mockRequest({
            headers: {
                authorization: 'Basic bW9ja1VzZXI6bW9ja1Bhc3N3b3Jk'
            }
        })
        const res = mockResponse()
        const next = mockNext()
        await authorizeAdmin(req, res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            status: 401,
            message: "Unauthorized: user not found"
        })
    })

    test('should throw error if error occurs during bycrpt comparison', async () => {
        db.query.mockImplementation(() => Promise.resolve({
            rows: [
                {
                    id: 'mockId',
                    username: 'mockUsername',
                    password: 'mockHashPassword',
                    created_at: 'mockDate'
                }
            ]
        }))
        bcrypt.compare.mockImplementation(() => Promise.reject(mockError))

        const req = mockRequest({
            headers: {
                authorization: 'Basic bW9ja1VzZXI6bW9ja1Bhc3N3b3Jk'
            }
        })
        const res = mockResponse()
        const next = mockNext()
        await authorizeAdmin(req, res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            status: 401,
            message: "Unauthorized: error processing credentials"
        })
    })

    test('should throw error if error if user is not authorized', async () => {
        db.query.mockImplementation(() => Promise.resolve({
            rows: [
                {
                    id: 'mockId',
                    username: 'mockUsername',
                    password: 'mockHashPassword',
                    created_at: 'mockDate'
                }
            ]
        }))
        bcrypt.compare.mockImplementation(() => Promise.resolve(false))

        const req = mockRequest({
            headers: {
                authorization: 'Basic bW9ja1VzZXI6bW9ja1Bhc3N3b3Jk'
            }
        })
        const res = mockResponse()
        const next = mockNext()
        await authorizeAdmin(req, res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            status: 401,
            message: "Unauthorized: you are not authorized to perform this action"
        })
    })

    test('should call next', async () => {
        db.query.mockImplementation(() => Promise.resolve({
            rows: [
                {
                    id: 'mockId',
                    username: 'mockUsername',
                    password: 'mockHashPassword',
                    created_at: 'mockDate'
                }
            ]
        }))
        bcrypt.compare.mockImplementation(() => Promise.resolve(true))

        const req = mockRequest({
            headers: {
                authorization: 'Basic bW9ja1VzZXI6bW9ja1Bhc3N3b3Jk'
            }
        })
        const res = mockResponse()
        const next = mockNext()
        await authorizeAdmin(req, res, next)
        expect(next).toHaveBeenCalled()
    })
})