const group = require("../models").Group;
const ErrorResponse = require('../utils/error');
const SuccessResponse = require("../utils/success")

module.exports = {
    async adminMiddleware (req, res, next)  {
        try{
            const groupCollection = await group.findByPk(req.params.groupId)
            if (req.user.id === groupCollection.userId) {
                return next(new ErrorResponse(`You do not have the right perform this action`, 401));
            }
            return next();
        }
        catch(error){
            return next(new ErrorResponse(e.message, 500));
        }
    }
}


// module.exports = adminMiddleware ;