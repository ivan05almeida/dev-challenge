var PNF = require('google-libphonenumber');
var phoneUtil = PNF.PhoneNumberUtil.getInstance();    
var phoneNumber = phoneUtil.parse('1934519875', 'BR');

module.exports = function(number){
    phoneNumber = phoneUtil.parse(number, 'BR')

    return phoneNumber.values_[1].toString()+phoneNumber.values_[2].toString();
}

