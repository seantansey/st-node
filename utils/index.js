const validURLs = [ 'https://www.seantansey.com' ]

const domainCheck = (req, res, next) => {
    console.log(req.headers.host)
    if (validURLs.includes(req.headers.host)) next()
    else res.status(403).send('You do not have permission to access this information')
}

module.exports = {
    validURLs,
    domainCheck
}