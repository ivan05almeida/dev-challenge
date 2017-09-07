var converter = require('./app/csvjson-converter');
var fs = require('fs');

converter.toJson('src/input.csv',function(data){
    console.log(data);
    data = JSON.stringify(data);
    fs.writeFile("output.json", data, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
    
        console.log("The file was saved!");
    }); 
});
