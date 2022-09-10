const { generateAccessToken } = require('../../routes/authentication')
const db = require('../../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { mockRequest, mockResponse, mockNext, mockError } = require('./utils')

jest.mock('bcrypt')
jest.mock('jsonwebtoken')
jest.mock('../../db/index.js')

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

describe('/authenticate', () => {
    describe('generateAccessToken', () => {
        test('should throw error when req has no body', async () => {
            const req = mockRequest({})
            const res = mockResponse()
            const next = mockNext()
            await generateAccessToken(req, res, next)
            expect(next).toHaveBeenCalledWith(new Error ('Missing required parameters'))
        })
        test('should throw error when missing input params', async () => {
            const req = mockRequest({ username: 'mockUsername' })
            const res = mockResponse()
            const next = mockNext()
            await generateAccessToken(req, res, next)
            expect(next).toHaveBeenCalledWith(new Error ('Missing required parameters'))
        })
        test('should call db.query method with params', async () => {
            const req = mockRequest({ 
                body: {
                    username: 'mockUsername',
                    password: 'mockPassword'
                }
            })
            const res = mockResponse()
            const next = mockNext()
            await generateAccessToken(req, res, next)
            expect(db.query).toHaveBeenCalledWith({ 
                text: 'SELECT * FROM users WHERE username = $1',
                values: [ 'mockUsername' ]
            })
        })
        test('on success should respond with correct status and json', async () => {
            bcrypt.compare.mockImplementation(() => Promise.resolve())
            jwt.sign.mockImplementation(() => 'mockToken')
            const req = mockRequest({ 
                body: {
                    username: 'mockUsername',
                    password: 'mockPassword'
                }
            })
            const res = mockResponse()
            const next = mockNext()
            await generateAccessToken(req, res, next)
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({ token: 'mockToken' })

        })
        test('should catch any errors on password comparison', async () => {
            bcrypt.compare.mockImplementation(() => Promise.reject(mockError))
            const req = mockRequest({ 
                body: {
                    username: 'mockUsername',
                    password: 'mockPassword'
                }
            })
            const res = mockResponse()
            const next = mockNext()
            await generateAccessToken(req, res, next)
            expect(next).toHaveBeenCalledWith(mockError)
        })
    })
})