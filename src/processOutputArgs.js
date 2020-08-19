"use strict"
const fileUtils = require('./fileUtils').fileUtils; 

const checkOutputFile = async function(app){
    return fileUtils.exists(app.options.outputPath)
    .then(fileExists => {
        if(fileExists) {
            fileUtils.delete(app.options.outputPath) //file exists, delete
            .then(_ => app)
        } 
        return app
    })
}

module.exports = {
    checkOutputFile
}