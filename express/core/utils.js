const crypto = require('crypto');

module.exports = {
    generateToken: cb => {
        crypto.randomBytes(48, function (err, buffer) {
            if (!err && typeof cb == 'function')
                cb(buffer.toString('hex'));
            else
                cb(false);
        });
    }
};