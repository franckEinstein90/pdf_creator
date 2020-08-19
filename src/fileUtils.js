"use strict"
const fs = require('fs'); 
const ZIP_FILE = require('is-zip-file');

const fileUtils = (function(){
    const _fileTypes = {
            folder:0, 
            zip:1, 
            error:2
    }
    return {
        zip: _fileTypes.zip, 
        folder: _fileTypes.folder, 
        error: _fileTypes.error,
        exists : function(inputPath){
            return new Promise((resolve)=> {
                fs.access(inputPath, fs.F_OK, (err)=>{
                    if(err) return resolve(false)
                    return resolve(true)
                })
            })
        }, 
        fileType : (path) => {
            return new Promise((resolve, reject) =>{
                ZIP_FILE.isZip(path, function(err, is) {
                    if(err) {
                        if(err.code==="EISDIR"){
                            return resolve(_fileTypes.folder)
                        } else {
                            return resolve(_fileTypes.error)
                        }
                    } else {
                        return resolve(_fileTypes.zip)
                    }
                })
            })
        }, 
        delete : (filePath) => {
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
    }
})(); 

module.exports = {
    fileUtils
}