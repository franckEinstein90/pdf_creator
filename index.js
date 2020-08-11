#!/usr/bin/env node
"use strict"; 
const checkInputFile = require('./src/checkArgs').checkInputFile; 
const checkOutputFile = require('./src/checkArgs').checkOutputFile; 

let outErrors = (function(){
    return {
        InputFileNotFound: "Input zip file couldn't be found"
    }
})(); 

const inOut = {
    inputFile: null, 
    outputFile: null
}
let app = {
    path: __dirname
}
try {
    require('./src/pdf.js').initPDFTools(app)
    if(process.argv.length < 3){
        throw "invalid arguments"
    }
} catch(err){
    console.log(err)
    process.exit(1)
}

checkInputFile(process.argv[2])
.then( result =>{
    if(!result){
        throw "Unable to find input zip file"
    }
    return checkOutputFile(process.argv[3])
})
.then( stat => {
        inOut.inputFile = process.argv[2]
        inOut.outputFile = process.argv[3]
        return app.pdfTools.createFromLocalFile(inOut.inputFile)
    })
.then( result =>{
        result.saveAsFile(inOut.outputFile)
        console.log("pdf successfully created")
        process.exit(0)
    })
.catch(err => {
        console.log("Operation not successful")
        console.log(err); 
    })
