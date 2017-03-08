/* node script to combine files*/

var fs = require("fs");

var contentEncoding='utf8'

var content='';
function main()
{
	var sourceFiles=['partials/header.js',
					'partials/constants.js',
					'partials/logging.js',
					'partials/browser_detection.js',
					'partials/models.js',
					'partials/plugin_functions_header.js',
					'partials/plugin_functions_01.js',
					'partials/plugin_functions_footer.js',
					'partials/plugin_injection.js',
					'partials/footer.js'];
	for(var i=0;i<sourceFiles.length;i++)
	{
		console.log('Reading file ',sourceFiles[i]);
		content+=readFile(sourceFiles[i]);
		content+='\n';
	}
	writeFile('gridsheet.dist.js',content);
};


function readFile(fileName)
{
	return fs.readFileSync(fileName, contentEncoding);
};

function writeFile (filename,content) {
	console.log('Writing file ',filename);
	fs.writeFile(filename, content, contentEncoding, function(){console.log('Done writing file');});
}




main();