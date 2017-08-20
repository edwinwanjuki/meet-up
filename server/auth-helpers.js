const jwt = require('jwt-simple');
const moment = require('moment');
const User = require('./models/user');

const secret = '55dae4bf-7c17-4a7f-986c-1a0f3f20cd2f';

function createToken(user) {
    const payload = {
        exp: moment().add(14, 'days').unix(),
        iat: moment().unix(),
        userId: user.id,
        username: user.name
    }

    return jwt.encode(payload, secret);
}

function decodeToken(token, callback) {
    const payload = jwt.decode(token, secret);
    const now = moment().unix();
    if (now > payload.exp) callback('Token has expired.');
    else callback(null, payload);    
}

function ensureAuthenticated(req, res, next) {
    if (!(req.headers && req.headers.authorization)) {
      return res.status(400).json({
        status: 'Please log in'
      });
    }
    // decode the token
    const header = req.headers.authorization.split(' ');
    const token = header[0];

    decodeToken(token, (err, payload) => {
      console.log(payload);  
      if (err) {
        return res.status(401).json({
            status: 'Token has expired'
        });
      } else {
        return User.findOne({"_id": payload.userId}, (err, user) => {
            if(err) {
                res.status(500).json({
                    status: 'error'
                });
            }
            next();
        });
      }
    });
}

module.exports = { createToken, decodeToken, ensureAuthenticated};