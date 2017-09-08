var fs = require('fs');
var formatJson = require('./format-json');
var emailValidator = require('email-validator');
var numberParser = require('./number-parse');

module.exports = {
    toJson: function(csvfile_path,callback){
        var csv = fs.readFileSync(csvfile_path, { encoding : 'utf8'});
        return callback(csvToJson(csv));
    }
}

function csvToJson(csv){
    var regExp = new RegExp(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/g);
    var expQuote = new RegExp(/(["'])(?:.)*?\1/g);

    var lines= csv.split("\n");
    var headers = lines[0].split(regExp).map(function(item){
        return item.replace(/[\"\r]/g, ""); 
    }); //split all headers ignoring strings with comma inside quotes and removing quotes
    var result = [];

    //for each header insert value
    for(var i=1;i<lines.length;i++){
        var obj = {};
        var currentline = lines[i].split(regExp);
        for(var j=0; j<currentline.length; j++){
            currentline[j] = currentline[j].replace(/[\"\r]/g, "").split(new RegExp(/\s?[,/]\s?(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/g));
            if(obj[headers[j]]){ //if key already exists (like class)
                obj[headers[j]] = mergeValues(obj[headers[j]],currentline[j]); //merge values
                if(headers[j] == 'class'){
                    obj.renameKey('class','classes');
                }
            }else{
                ( currentline[j].length>1 ? obj[headers[j]] = currentline[j] : obj[headers[j]] = currentline[j][0]); //obj follow pattern
            }
        }
        result.push(obj);
    }

    result = validateJson(result);
    return formatJson(result);
}


function mergeValues(val1,val2) {
    if(val1 == ''){
        return val2;
    }
    if(val2 == ''){
        return val1;
    }
    if(!Array.isArray(val1)){
        val1 = val1.split(); //trick to transform string to array
    }
    if(!Array.isArray(val2)){
        val2 = val2.split(); //trick to transform string to array
    }
    return val1.concat(val2);
}

Object.prototype.renameKey = function (key, newName) {
   if (this.hasOwnProperty(key)) { //check for errors
       this[newName] = this[key]; //create new key
       delete this[key]; //delete old one
   }
   return this;
};


function validateJson(obj){
    var tagRegex = new RegExp(/[,]?\s/g);
    
    for(var i=0;i<obj.length;i++){
        Object.keys(obj[i]).forEach(function(key) {
            var key_type = key.split(tagRegex)[0];
            switch (key_type) {
                case 'phone':
                    obj[i][key] = parseNumber(obj[i][key]);
                    break;
                case 'email':
                    obj[i][key] = parseEmail(obj[i][key]);
                    break;
            }
        })
    }
    return obj;
}



function parseNumber(phone){
    phone = phone.replace(/\D/g,'');
    if(phone != "" && (phone.length >=8 && phone.length <= 12)){
        return numberParser(phone);
    }else{
        return '';
    }
}

function parseEmail(email){
    console.log(email);
    if(Array.isArray(email)){
        email.forEach(function(item){
            if(emailValidator.validate(item) == false){
                item = '';
            }
        })
        return  email;
    }
    if(emailValidator.validate(email) == false){
        return '';
    }else{
        return email;
    }
}
