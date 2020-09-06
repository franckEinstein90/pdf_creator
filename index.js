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
    if( app.options.inputZipFile === false ) throw "Unable to find or create input zip file"
    app.report(`\tUsing input zip file ${app.options.inputZipFile}`)
    return checkOutputFile( app )
})

.then( app.pdfTools.createFromLocalFile )
.then( app => app.outStream.saveAsFile( app.options.outputPath ) ) 
.then( _ => app.options.keepZip ? 0 : fileUtils.delete(app.options.inputZipFile))
.then( _ => {
    app.report(`\tPDF file ${app.options.outputPath} successfully created`)
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
