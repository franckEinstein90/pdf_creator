"use strict"
const optionDefinitions = [  
    { name: 'help', type: Boolean, multiple: false, alias:'h'}, 
    { name: 'inputPath', type: String, multiple: false, alias:'i'}, 
    { name: 'keepZip', type:Boolean, multiple:false, alias: 'z'},
    { name: 'outputPath', type: String, multiple: false, alias:'o'}, 
    { name: 'src', type: String, multiple: true, defaultOption: true }
  ]
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage'); 
const sections = [
    {
      header: 'pdf_creator',
      content: 'Generates pdf files from static html sites as input'
    },
    {
      header: 'Options',
      optionList: [
        {
          name: '-i',
          typeLabel: '{underline file}',
          description: 'The input to process.'
        },
        {
          name: '-o',
          typeLabel: '{underline file}',
          description: 'The resulting pdf output.'
        },
        {
          name: 'help',
          description: 'Prints this usage guide.'
        }
      ]
    }
  ]
const usage = commandLineUsage(sections)

const parseArgs = function(app){
    const options = commandLineArgs( optionDefinitions ); 
    options.keepZip = options.keepZip || false;
    if(!('src' in options)){
        options.src = []
    }
    if(options.outputPath === undefined && options.src.length > 0) options.outputPath = options.src.pop(); 
    if(options.inputPath === undefined && options.src.length > 0) options.inputPath = options.src.pop(); 
     
    options.printUsage = ()=>{
        console.log( usage )
    } 
    app.options = options; 
    return app
}

module.exports = {
    parseArgs
}