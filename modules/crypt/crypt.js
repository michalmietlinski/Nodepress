var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  try {
            var dec = decipher.update(text,'hex','utf8');
            dec += decipher.final('utf8');
            return dec;
        } catch (ex) {
            console.log('failed');
            return;
        }
}

module.exports.encrypt=encrypt;
module.exports.decrypt=decrypt;
