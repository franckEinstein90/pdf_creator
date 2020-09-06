"use strict"; 
const PDFToolsSdk = require('@adobe/documentservices-pdftools-node-sdk'); 
const path = require("path");

const setCustomOptions = (htmlToPDFOperation, app) => {

    // Define the page layout, 
    let defaultPageSize = app.options.defaultPageSize || [8, 11.5]
    app.report(`Creating file in format '${defaultPageSize.join(' x ')}'\n`); 
    const pageLayout = new PDFToolsSdk.CreatePDF.options.PageLayout();
    pageLayout.setPageSize(...defaultPageSize);

    // Set the desired HTML-to-PDF conversion options.
    const htmlToPdfOptions = new PDFToolsSdk.CreatePDF.options.html.CreatePDFFromHtmlOptions.Builder()
        .includesHeaderFooter(false)
        .withPageLayout(pageLayout)
        .build();

    htmlToPDFOperation.setOptions(htmlToPdfOptions);

}

const pdfTools = function( app ){

    const adobeApiCredentialsPath = app.options.adobeApiCredentialsPath || "pdftools-api-credentials.json"; 
    const credentials =  PDFToolsSdk.Credentials
        .serviceAccountCredentialsBuilder()
        .fromFile(path.join(app.path, adobeApiCredentialsPath))
        .build();    // Create an ExecutionContext using credentials and create a new operation instance.

    const executionContext = PDFToolsSdk.ExecutionContext.create(credentials)
    const htmlToPDFOperation = PDFToolsSdk.CreatePDF.Operation.createNew();

    return {
        createFromLocalFile: function(){
            const input = PDFToolsSdk.FileRef.createFromLocalFile(app.options.inputZipFile)
            htmlToPDFOperation.setInput(input); 
            setCustomOptions(htmlToPDFOperation, app );
            return htmlToPDFOperation.execute(executionContext)
            .then( outStream => {
                app.outStream = outStream
                return app
            })
        }
    }
}


const initPDFTools = function(app){
    app.pdfTools = pdfTools(app); 
    return app
}


module.exports = {
    initPDFTools
}