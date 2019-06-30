chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log(sender.tab ?
    //             "from a content script:" + sender.tab.url :
    //             "from the extension");
    if (request.website == 0)
      sendResponse({price: (document.getElementsByClassName("selling-price omniture-field"))[0].innerHTML});
  	else if(request.website == 1)
  		sendResponse({price: (document.getElementsByClassName("payBlkBig"))[0].innerHTML});
  	else
  		return;
  });