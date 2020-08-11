"use strict"; 
const PDFToolsSdk = require('@adobe/documentservices-pdftools-node-sdk'); 
const path = require("path"); 
const setCustomOptions = (htmlToPDFOperation) => {
    // Define the page layout, in this case an 8 x 11.5 inch page (effectively portrait orientation).
    const pageLayout = new PDFToolsSdk.CreatePDF.options.PageLayout();
    pageLayout.setPageSize(8, 11.5);

    // Set the desired HTML-to-PDF conversion options.
    const htmlToPdfOptions = new PDFToolsSdk.CreatePDF.options.html.CreatePDFFromHtmlOptions.Builder()
        .includesHeaderFooter(true)
        .withPageLayout(pageLayout)
        .build();
    htmlToPDFOperation.setOptions(htmlToPdfOptions);
};
const initPDFTools = function(app){
    let pdfTools = {
        jsonCredentialsFileName: "pdftools-api-credentials.json"
    }
    pdfTools.credentials =  PDFToolsSdk.Credentials
    .serviceAccountCredentialsBuilder()
    .fromFile(path.join(app.path, pdfTools.jsonCredentialsFileName))
    .build();    // Create an ExecutionContext using credentials and create a new operation instance.

    pdfTools.executionContext = PDFToolsSdk.ExecutionContext.create(pdfTools.credentials)
    pdfTools.htmlToPDFOperation = PDFToolsSdk.CreatePDF.Operation.createNew();

    // Set operation input from a source file.
    pdfTools.createFromLocalFile = function(inputFile){
        const input = PDFToolsSdk.FileRef.createFromLocalFile(inputFile)
        this.htmlToPDFOperation.setInput(input); 
        setCustomOptions(this.htmlToPDFOperation);
        return this.htmlToPDFOperation.execute(this.executionContext)
    }      
    app.pdfTools = pdfTools

}


module.exports = {
    initPDFTools
}