const adminRoute = require('./admin.routes')

const combineRoutes = (app) => {
    app.use('/api/admin', adminRoute)
}

module.exports = combineRoutes