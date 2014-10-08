chrome.devtools.inspectedWindow.onResourceContentCommitted.addListener(function(event, content) {
	var updateFile = function updateFile() {

		var fileAbsUrl = "REPLACE-FILE-URL";
		var fileContent = "REPLACE-CONTENT";
		var unescapedFileContent = unescape(fileContent);

	    var clientContext = new SP.ClientContext.get_current();
	    
	    var relUrl = fileAbsUrl.replace(_spPageContextInfo.siteAbsoluteUrl.replace(_spPageContextInfo.siteServerRelativeUrl, ''),'');
	    var file = clientContext.get_site().get_rootWeb().getFileByServerRelativeUrl(relUrl); 
	    var listItem = file.get_listItemAllFields();
		var list = listItem.get_parentList();
	                
		var fileCreateInfo = new SP.FileCreationInformation();
	        fileCreateInfo.set_url(fileAbsUrl);
	        fileCreateInfo.set_content(new SP.Base64EncodedByteArray());
	        fileCreateInfo.set_overwrite(true);

	        for (var i = 0; i < unescapedFileContent.length; i++) {
	    
	            fileCreateInfo.get_content().append(unescapedFileContent.charCodeAt(i));
	        }
	    
	     var existingFile = list.get_rootFolder().get_files().add(fileCreateInfo);
	                
		clientContext.load(existingFile);
		clientContext.executeQueryAsync(onRequestSucceeded, onRequestFailed);        
	};

	var onRequestSucceeded = function onRequestSucceeded() {
		alert('File saved succesfully!');
	};

	var onRequestFailed = function onRequestFailed(sender, args) {
	    alert(args.get_message());
	};

	var script = updateFile + " " + onRequestSucceeded + " " + onRequestFailed;
	script = script.replace("REPLACE-FILE-URL", event.url);
	script = script.replace("REPLACE-CONTENT", escape(content));
	script = script + " updateFile();";

	chrome.devtools.inspectedWindow.eval(script);
});
