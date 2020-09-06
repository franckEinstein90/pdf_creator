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

const convertFolderToZipFile = function( app ){ 

    const inputFolderPath = app.options.inputPath; 
    return isValidInputFolder(inputFolderPath)
    .then(resultCheck => {
        if(resultCheck === false) throw "Invalid folder"
        const zipFilePath = `${inputFolderPath.replace(/[\/\\]$/,"")}.zip` 
        app.report(`Creating new zip source file at ${zipFilePath}`)

        return new Promise((resolve, reject)=>{

            const output = fs.createWriteStream(zipFilePath)
            output.on('close',_ => {
                app.report(`\tCreated new zip source file ${zipFilePath}`)
                return resolve(zipFilePath)
            })
            output.on('end', _ => app.report("Finished reading source info"))

            const archive = archiver('zip', {
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

    return fileUtils.exists( app.options.inputPath )
    .then( result => {
        if(!result) throw "Unable to find source file/folder"
        return fileUtils.fileType(app.options.inputPath)
    })
    .then( fileType => {
        if(fileType === fileUtils.zip) return true
        if(fileType === fileUtils.folder) {
            return convertFolderToZipFile(app )
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