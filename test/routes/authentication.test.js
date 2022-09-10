const { generateAccessToken } = require('../../routes/authentication')
const db = require('../../db')
const { mockRequest, mockResponse, mockNext, mockError } = require('./utils')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

jest.mock('../../db/index.js')

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
            db.query.mockImplementationOnce(() => Promise.resolve({
                rows: [
                    {
                        id: 'mockId',
                        username: 'mockUsername',
                        password: 'mockHashPassword',
                        created_at: 'mockDate'
                    }
                ]
            }))
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
        // test('on success should call res.status', async () => {
        //     db.query.mockImplementationOnce(() => Promise.resolve({
        //         rows: [
        //             {
        //                 id: 'mockId',
        //                 username: 'mockUsername',
        //                 password: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vY2tVc2VybmFtZSIsImlhdCI6MTY2Mjc3MDI2NX0.DYzOJMnefmrw3z9xQ3D2PsL34I_SrX8oxjXenB1h83U',
        //                 created_at: 'mockDate'
        //             }
        //         ]
        //     }))


        //     const req = mockRequest({ 
        //         body: {
        //             username: 'mockUsername',
        //             password: 'mockPassword'
        //         }
        //     })
        //     const res = mockResponse()
        //     const next = mockNext()
        //     await generateAccessToken(req, res, next)
        //     expect(res.status).toHaveBeenCalledWith(201)
        // })
        // test('should catch any errors', async () => {
        //     db.query.mockImplementationOnce(() => Promise.resolve({
        //         rows: [
        //             {
        //                 id: 'mockId',
        //                 username: 'mockUsername',
        //                 password: 'mockHashPassword',
        //                 created_at: 'mockDate'
        //             }
        //         ]
        //     }))
        //     const req = mockRequest({ 
        //         body: {
        //             username: 'mockUsername',
        //             password: 'mockPassword'
        //         }
        //     })
        //     const res = mockResponse()
        //     const next = mockNext()
        //     bycrypt.compare.mockImplementationOnce(() => Promise.reject(mockError))
        //     await postMessage(req, res, next)
        //     expect(next).toHaveBeenCalledWith(mockError)
        // })
    })
})