#!/usr/bin/env node

/*******************************************************************
 * 
 * 
 ******************************************************************/
"use strict"; 
/******************************************************************/

const checkInputFile = require('./src/processInputArgs').checkInputFile; 
const checkOutputFile = require('./src/processOutputArgs').checkOutputFile; 
const parseArgs = require('./src/parseArgs').parseArgs;
const fileUtils = require('./src/fileUtils').fileUtils
const { parse } = require('path');
const path = require('path')

const app = {
    path: __dirname, 
    errors: {
        invalidArgs : "Invalid Arguments"
    }
}


try {
    parseArgs(app, process.argv)
    if(app.options.help){
        app.options.printUsage()
    }
    if(!app.options.outputPath || !app.options.inputPath ){
        throw app.errors.invalidArgs 
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
    } else {
        console.log(`Using input zip file at ${app.options.inputZipFile}`)
    }
    return checkOutputFile(app)
})
.then( _ => app.pdfTools.createFromLocalFile())
.then( app => app.outStream.saveAsFile(app.options.outputPath))
.then( result => {
    if(app.options.keepZip === false){ //delete the zip file
       return fileUtils.delete(app.options.inputZipFile) 
    } else {
        return 0
    }
})
.then( _ => {
    console.log("pdf successfully created")
    process.exit(0)
})

.catch(err => {
    if(err === app.errors.invalidArgs){
        app.options.printUsage()
    } else {
        console.log("Operation not successful")
        console.log(err); 
    }
})
