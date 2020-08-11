# pdf_creator
pdf cli tool - creates a pdf from a static web site

You need to get credentials from Adobe to use their sdk, can be had at this address: https://www.adobe.io/apis/documentcloud/dcsdk/gettingstarted.html
Then, obtain, and place the files: pdftools-api-credentials.json and private.key in the top level of the project. 

A web site is packaged in a folder containing an index.html file (see staticSite folder) - Then, you need to create a zip file from that folder and pass it as input to the program. 

pdf_tool [input file path][output_file_path]


