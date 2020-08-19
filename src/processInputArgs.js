"use strict"

const fs = require('fs');
;
const archiver = require('archiver')
const { isDeepStrictEqual } = require('util');
const fileUtils = require('./fileUtils').fileUtils; 

const isValidInputFolder = async function(path){
    //checks folder exists
    //checks folder contains a file named 'index.html'
    return new Promise((resolve, reject) => {
        return resolve(true)
    })
}

const convertFolderToZipFile = function(inputFolderPath){  
    return isValidInputFolder(inputFolderPath)
    .then(resultCheck => {
        if(resultCheck === false) throw "Invalid folder"
        let zipFilePath = `${inputFolderPath}.zip` 
        return new Promise((resolve, reject)=>{
            let output = fs.createWriteStream(zipFilePath)
            output.on('close',_ => {
                console.log("finished creating zip source file")
                return resolve(zipFilePath)
            })
            output.on('end', _ => console.log("finished reading source info"))
            let archive = archiver('zip', {
                zlib: {level:9}
            })
            archive.on('warning', err => console.log(err))
            archive.on('error', err => reject(err))
            archive.pipe(output)
            archive.directory(inputFolderPath, false)
            archive.finalize()
        })
    })
}


const checkInputFile = async function( app ){
    return fileUtils.exists(app.options.inputPath)
    .then( result => {
        if(!result) throw "Unable to find source file/folder"
        return fileUtils.fileType(app.options.inputPath)
    })
    .then( fileType => {
        if(fileType === fileUtils.zip) {
            return true
        }
        if(fileType === fileUtils.folder) {
            return convertFolderToZipFile(app.options.inputPath)
            .then(validatedZipFile => {
                app.options.inputZipFile = validatedZipFile
                return app 
            })
        }
        throw "Invalid zip file"
    })
}



module.exports = {
    checkInputFile
}