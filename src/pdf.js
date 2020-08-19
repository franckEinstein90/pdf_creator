"use strict"; 
const PDFToolsSdk = require('@adobe/documentservices-pdftools-node-sdk'); 
const path = require("path");


const setCustomOptions = (htmlToPDFOperation) => {
    // Define the page layout, in this case an 8 x 11.5 inch page (effectively portrait orientation).
    const pageLayout = new PDFToolsSdk.CreatePDF.options.PageLayout();
    pageLayout.setPageSize(8, 11.5);

    // Set the desired HTML-to-PDF conversion options.
    const htmlToPdfOptions = new PDFToolsSdk.CreatePDF.options.html.CreatePDFFromHtmlOptions.Builder()
        .includesHeaderFooter(false)
        .withPageLayout(pageLayout)
        .build();
    htmlToPDFOperation.setOptions(htmlToPdfOptions);
};

const pdfTools = function( app ){
    let adobeApiCredentialsPath = app.options.adobeApiCredentialsPath || "pdftools-api-credentials.json"
    let credentials =  PDFToolsSdk.Credentials
    .serviceAccountCredentialsBuilder()
    .fromFile(path.join(app.path, adobeApiCredentialsPath))
    .build();    // Create an ExecutionContext using credentials and create a new operation instance.
    const executionContext = PDFToolsSdk.ExecutionContext.create(credentials)
    const htmlToPDFOperation = PDFToolsSdk.CreatePDF.Operation.createNew();
    return {
        createFromLocalFile: function(){
            const input = PDFToolsSdk.FileRef.createFromLocalFile(app.options.inputZipFile)
            htmlToPDFOperation.setInput(input); 
            setCustomOptions(htmlToPDFOperation);
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