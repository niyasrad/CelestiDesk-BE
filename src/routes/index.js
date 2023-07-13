const adminRoute = require('./admin.routes')
const employeeRoute = require('./employee.routes')
const requestRoute = require('./request.routes')
const transactionRoute = require('./transaction.routes')

const combineRoutes = (app) => {
    app.use('/api/admin', adminRoute)
    app.use('/api/employee', employeeRoute)
    app.use('/api/request', requestRoute)
    app.use('/api/transaction', transactionRoute)
}

module.exports = combineRoutes