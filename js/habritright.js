(function(){
	var $entryInfo,
		$messageForm;
	
	if( $entryInfo = $('div.entry-info')[0] ){// Only on post pages
		$('body').keyup(function(event){
			if(event.ctrlKey == true && event.keyCode == 13){// Ctrl+Enter
				
				var selection = document.getSelection(),
					selectionText = selection.toString().replace(/(^ (.*) $|^ | $)/, '$2');// Remove spaces
					$selectionParent = $(selection.baseNode.parentElement);
					
				// Only if selection is in div.content
				if($selectionParent.is('div.content') || $selectionParent.parents('div.content')[0]){
					
					
					// Get author
					var author = $('div.entry-info-wrap div.author span').text(),
					
					// post title
						title = $('span.topic').text(),
						
					// URL
						url = document.URL.replace(/(.*)\/.*$/, '$1/'), // without "#habracut" and others
					
					// user
						username = $('div.header a.habrauser').text(),
					
					// type
						isPhrase = / /.test(selectionText),
					
					// and sentence
						selectionSentenceBeginning = 
							selection.extentNode.data.lastIndexOf('. ', selection.extentOffset) + 2,
						selectionSentenceEnd = 
							(selection.extentNode.data.indexOf('. ', selection.baseOffset) > 0) ? 
							selection.extentNode.data.indexOf('. ', selection.baseOffset) + 1 :
							selection.extentNode.data.length,
						selectionSentence = 
							selection.extentNode.data
								.substring(selectionSentenceBeginning, selectionSentenceEnd)
								.replace(/[ ()-+]+$/, '');// Remove characters from the end
					

					var typo = {
						author: author, 
						title: title,
						url: url,
						username: username, 
						isphrase: isPhrase, 
						word: selectionText,
						sentence: selectionSentence
					};
					
										
					chrome.extension.sendRequest({
						type: 'sendMessage',
						typo: typo
					});
					
				}
			}
		});
	}
	
	if( $messageForm = $('#write-post')[0]){
		
		chrome.extension.onRequest.addListener(
			function(request, sender, sendResponse){
				
				if(request.type == 'sendTypo'){
					
					// Set subj
					$('#subj').val( request.message.title );
					
					// Calculate caret position
					var caret = request.message.text.indexOf('!!!');
					$('#htmlarea')
						.val( request.message.text.replace('!!!', '') )[0]
						.setSelectionRange(caret, caret);
					
				}
				
			}
		);
		
		chrome.extension.sendRequest({type: 'getMessage'});
	}
})();