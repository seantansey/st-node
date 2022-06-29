const { sendMessage } = require('../../routes/messages')
const sendEmail = require('../../nodemailer')
const { mockRequest, mockResponse, mockNext, mockError } = require('./utils')

jest.mock('../../nodemailer/index.js')

describe('/message', () => {
    describe('sendMessage', () => {
        test('should throw error when req has no body', async () => {
            const req = mockRequest({})
            const res = mockResponse()
            const next = mockNext()
            await sendMessage(req, res, next)
            expect(next).toHaveBeenCalledWith(new Error ('Missing required input parameters'))
        })
        test('should throw error when missing input params', async () => {
            const req = mockRequest({ name: 'mockName' })
            const res = mockResponse()
            const next = mockNext()
            await sendMessage(req, res, next)
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
            const next = mockNext()
            await sendMessage(req, res, next)
            expect(sendEmail).toHaveBeenCalledWith({ 
                name: 'mockName',
                email: 'mockEmail',
                subject: 'mockSubject',
                message: 'mockMessage'
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
            const next = mockNext()
            await sendMessage(req, res, next)
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
            const next = mockNext()
            sendEmail.mockImplementationOnce(() => Promise.reject(mockError))
            await sendMessage(req, res, next)
            expect(next).toHaveBeenCalledWith(mockError)
        })
    })
})