"use strict"

const fs = require('fs');
const ZIP_FILE = require('is-zip-file');
const isZipFile = function(path){
    return new Promise((resolve, reject) =>{
        ZIP_FILE.isZip(path, function(err, is) {
            if(err) {
                return resolve(false)
            } else {
                return resolve(true)
            }
        })
    })
}
const checkFileExists = function(inputPath){
    return new Promise((resolve, reject)=> {
        fs.access(inputPath, fs.F_OK, (err)=>{
            if(err) return resolve(false)
            return resolve(true)
        })
    })
}
const deleteFile = function(filePath){
    console.log("File exists, deleting."); 
    return new Promise((resolve, reject)=>{
        fs.unlink(filePath, (err)=>{
            if(err) {
                return reject( "Unable to delete file")
            }
            return resolve(true)
        })
    })
}
const checkInputFile = function(inputPath){
    return checkFileExists(inputPath)
    .then(ok=>{
        if(ok){
            return isZipFile(inputPath)
        }
        else {
            throw "Input file doesn't exist"
        }
    })
    .then(ok =>{
        if(ok) return ok
        throw "Invalid zip file"
    })
}
const checkOutputFile = async function(outputPath){
    return checkFileExists(outputPath)
    .then(result => {
        if(result) {
            return deleteFile(outputPath) //file exists, delete
        }
        return outputPath
    })
}


module.exports = {
    checkInputFile, 
    checkOutputFile
}