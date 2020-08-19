#!/usr/bin/env node
"use strict"; 
const checkInputFile = require('./src/processInputArgs').checkInputFile; 
const checkOutputFile = require('./src/processOutputArgs').checkOutputFile; 
const parseArgs = require('./src/parseArgs').parseArgs;

const { parse } = require('path');
const path = require('path')

const app = {
    path: __dirname
}


try {
    parseArgs(app, process.argv)
    if(app.options.outputPath === undefined || app.options.inputPath === undefined){
        throw "invalid arguments"
    }
    require('./src/pdf.js').initPDFTools(app) //init for adobeSDK
} catch(err){
    console.log(err)
    process.exit(1)
}
checkInputFile(app)
.then( app =>{
    if(!app.options.inputZipFile){
        throw "Unable to find input zip file"
    }
    return checkOutputFile(app)
})
.then(_ => app.pdfTools.createFromLocalFile())
.then( app => app.outStream.saveAsFile(app.options.outputPath))
.then( result => {
    console.log("pdf successfully created")
    process.exit(0)
})
.catch(err => {
        console.log("Operation not successful")
        console.log(err); 
})
