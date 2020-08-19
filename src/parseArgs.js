"use strict"
const optionDefinitions = [  
    { name: 'inputPath', type: String, multiple: false, alias:'i'}, 
    { name: 'outputPath', type: String, multiple: false, alias:'o'}, 
    { name: 'src', type: String, multiple: true, defaultOption: true }
  ]
const commandLineArgs = require('command-line-args');


const parseArgs = function(app){
    const options = commandLineArgs(optionDefinitions)
    if(options.outputPath === undefined){
       options.outputPath = options.src.pop()
    }
    if(options.inputPath === undefined){
        options.inputPath = options.src.pop()
    }
    app.options = options
    return app
}

module.exports = {
    parseArgs
}