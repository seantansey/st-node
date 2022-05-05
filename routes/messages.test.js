const { getAllMessages, postMessage }= require('./message')
const sendEmail = require('../nodemailer')
const db = require('../db')

jest.mock('../nodemailer/index.js')
jest.mock('../db/index.js')

const mockRequest = (body) => {
    return body
}

const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
}

const mockError = new Error('mockError')

describe('/message', () => {
    describe('getAllMessages', () => {
        test('should return data from db', async () => {
            db.query.mockImplementationOnce(() => Promise.resolve({
                rows: [1,2,3]
            }))
            const req = mockRequest()
            const res = mockResponse()
            const next = jest.fn()
            await getAllMessages(req, res, next)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith([1,2,3])
        })
        test('should catch any errors', async () => {
            db.query.mockImplementationOnce(() => Promise.reject(mockError))
            const req = mockRequest()
            const res = mockResponse()
            const next = jest.fn()
            await getAllMessages(req, res, next)
            expect(next).toHaveBeenCalledWith(mockError)
        })
    })

    describe('postMessage', () => {
        test('should throw error when req has no body', async () => {
            const req = mockRequest({})
            const res = mockResponse()
            const next = jest.fn()
            await postMessage(req, res, next)
            expect(next).toHaveBeenCalledWith(new Error ('Missing required input parameters'))
        })
        test('should throw error when missing input params', async () => {
            const req = mockRequest({ name: 'mockName' })
            const res = mockResponse()
            const next = jest.fn()
            await postMessage(req, res, next)
            expect(next).toHaveBeenCalledWith(new Error ('Missing required input parameters'))
        })
        test('should call sendEmail with params', async () => {
            const req = mockRequest({ 
                body: {
                    name: 'mockName',
                    email: 'mockEmail',
                    subject: 'mockSubject',
                    message: 'mockMessage'
                }
            })
            const res = mockResponse()
            const next = jest.fn()
            await postMessage(req, res, next)
            expect(sendEmail).toHaveBeenCalledWith({ 
                name: 'mockName',
                email: 'mockEmail',
                subject: 'mockSubject',
                message: 'mockMessage'
            })
        })
        test('should call db.transact method with params', async () => {
            const req = mockRequest({ 
                body: {
                    name: 'mockName',
                    email: 'mockEmail',
                    subject: 'mockSubject',
                    message: 'mockMessage'
                }
            })
            const res = mockResponse()
            const next = jest.fn()
            await postMessage(req, res, next)
            expect(db.transact).toHaveBeenCalledWith({ 
                text: 'INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4)',
                values: [ 'mockName', 'mockEmail', 'mockSubject', 'mockMessage']
            })
        })
        test('on success should call res.status and res.json', async () => {
            const req = mockRequest({ 
                body: {
                    name: 'mockName',
                    email: 'mockEmail',
                    subject: 'mockSubject',
                    message: 'mockMessage'
                }
            })
            const res = mockResponse()
            const next = jest.fn()
            await postMessage(req, res, next)
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({ status: 'success' })
        })
        test('should catch any errors', async () => {
            const req = mockRequest({ 
                body: {
                    name: 'mockName',
                    email: 'mockEmail',
                    subject: 'mockSubject',
                    message: 'mockMessage'
                }
            })
            const res = mockResponse()
            const next = jest.fn()
            sendEmail.mockImplementationOnce(() => Promise.reject(mockError))
            await postMessage(req, res, next)
            expect(next).toHaveBeenCalledWith(mockError)
        })
    })
})