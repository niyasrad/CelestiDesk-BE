const adminRoute = require('./admin.routes')
const employeeRoute = require('./employee.routes')

const combineRoutes = (app) => {
    app.use('/api/admin', adminRoute)
    app.use('/api/employee', employeeRoute)
}

module.exports = combineRoutes