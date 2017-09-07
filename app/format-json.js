var lodash = require('lodash');
;


module.exports = function(jsonObj){
    jsonObj = lodash.orderBy(jsonObj,'eid','asc'); //sort by eid for larger lists
    mergeObjs(jsonObj);
    for(var i=0;i<jsonObj.length;i++){
        jsonObj[i] = formatJson(jsonObj[i]);
    }

    return jsonObj;
}

function formatJson(obj){
    var result = {};
    var tagRegex = new RegExp(/[,]?\s/g);
    Object.keys(obj).forEach(function(key) {
        var splitted_keys = key.split(tagRegex);
        if(splitted_keys.length>1){
            if(obj[key] != ""){
                if(result.hasOwnProperty('addresses') == false){
                    result['addresses'] = [];
                }
                if(lodash.find(result['addresses'], ['address',obj[key]]) != undefined){
                    var exist = lodash.find(result['addresses'], ['address',obj[key]]);
                    for(var i=1;i<splitted_keys.length;i++){
                        exist['tags'].push(splitted_keys[i]);
                    }
                }else{
                    var address = {};
                    address['type'] = splitted_keys[0];
                    address['tags'] = [];
                    for(var i=1;i<splitted_keys.length;i++){
                        address['tags'].push(splitted_keys[i]);
                    }
                    if(Array.isArray(obj[key])){
                        obj[key].forEach(function(item){
                            var address_aux = JSON.parse(JSON.stringify(address));
                            address_aux['address'] = item;
                            result['addresses'].push(address_aux);
                        })
                        
                    }else{
                        address['address'] = obj[key];
                        result['addresses'].push(address);
                    }
                }
            }
        }else{
            if(['see_all','invisible'].indexOf(key) != -1){ //see_all and invsible are required (type: boolean)
                if(obj[key] == "" || obj[key] == "0" || obj[key] == "no"){
                    result[key] = false;
                }else if(obj[key] == "1" || obj[key] == "yes"){
                    result[key] = true;
                }else{
                    result[key] = false;
                }
            }else{
                if(obj[key] != ""){
                    result[key] = obj[key];
                }
            }
        }
    });
    return result;
}

function mergeObjs(jsonObj){
    var i = 0;
    while(i<jsonObj.length){
        if(jsonObj[i+1]){
            if(jsonObj[i].eid == jsonObj[i+1].eid){
                Object.keys(jsonObj[i]).forEach(function(key) {
                    jsonObj[i][key] = mergeValues(jsonObj[i][key], jsonObj[i+1][key]);
                })
                jsonObj.splice([i+1],1);;
            }
        }
        i++;
    }
    return jsonObj;
}


function mergeValues(val1,val2) {
    if(val1 != val2){
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
    }else{
        return val1; //if equal keep original
    }
}
