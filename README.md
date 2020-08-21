# pdfKreater
is a pdf cli tool that produces pdf files from static web sites. It takes a folder that contains an index.html file and other site assets as input, and outputs that file in its pdf version

pdfKreater uses Adobe Document SDK, which requires credentials that can be obtained for free this address: https://www.adobe.io/apis/documentcloud/dcsdk/gettingstarted.html

Once obtained, place the files pdftools-api-credentials.json and private.key in the root 
this project. 


npm install
node index.js [static site folder][output pdf file path][args]

args: 
    -z keeps the intermediary zip file 


make it into a cli-tool with npm link


