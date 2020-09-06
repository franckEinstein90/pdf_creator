"use strict";
const parseArgs = require('./parseArgs').parseArgs;

const initApp = function( app ){
    try {
        parseArgs( app )
        if(app.options.help){
            app.options.printUsage(); 
        }
        if(!app.options.outputPath || !app.options.inputPath ){
            throw app.errors.invalidArgs 
        }
        require('./pdf.js').initPDFTools( app ) //init for adobeSDK
        return app; 

    } catch(err){
        console.log(err)
        process.exit(1)
    }
}

module.exports = {
    initApp
}