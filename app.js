var converter = require('./app/csvjson-converter');
var fs = require('fs');
var args = process.argv.slice(2); //receive custom params by command line
// [0](open path) [1](save path)

var input_path = 'src/input.csv';
var output_path = 'output.json'
if(args.length){
    if(args[0] != '-s'){
        (args[0] ? input_path = args[0] : ''); //if first arg is not equal -s, open custom csv file
    }
    (args[1] ? output_path = args[1] : ''); //second arg path (w/ file name and extension) to save 
}

converter.toJson(input_path,function(data){
    console.log(data);
    data = JSON.stringify(data);
    fs.writeFile(output_path, data, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Arquivo salvo com sucesso!"); //file saved
    }); 
});
