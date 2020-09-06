#!/usr/bin/env node

/*******************************************************************
 * 
 * 
 ******************************************************************/
"use strict"; 
/******************************************************************/

const checkInputFile = require('./src/processInputArgs').checkInputFile; 
const checkOutputFile = require('./src/processOutputArgs').checkOutputFile; 

const fileUtils = require('./src/fileUtils').fileUtils; 
const { parse } = require('path');
const path = require('path')

const app = {
    path: __dirname, 
    errors: {
        invalidArgs : "Invalid Arguments"
    }
}

require('./src/init.js').initApp( app ); 
checkInputFile(app)
.then( app =>{
    if(!app.options.inputZipFile){
        throw "Unable to find input zip file"
    } else {
        console.log(`Using input zip file at ${app.options.inputZipFile}`)
    }
    return checkOutputFile(app)
})

.then( app.pdfTools.createFromLocalFile )
.then( app => app.outStream.saveAsFile( app.options.outputPath ) ) 
.then( _ => {
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
