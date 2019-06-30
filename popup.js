// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
//flipkart=0, snapdeal=1, amazon=2
/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;
    var website = -1;
    url = url.replace("http://www.", "");
    url = url.replace("https://www.", "");
    url = url.replace("https://", "");
    url = url.replace("http://", "");
    if(!url.startsWith("youtube.com") && !url.startsWith("youtu.be")) {
      url = "";
      renderStatus('Currently only works for a youtube page');
      return;
    }
    else if(url.startsWith("youtube.com")) {
      website = 0;
    }
    else if(url.startsWith("youtu.be")) {
      website = 0;
    }

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url,website);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

function getResultUrl(vid, website, callback, errorCallback) {
  var searchUrl = "http://3.19.72.76:8087/comments/wc/" + vid;
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  // The Google image search API responds with JSON, so let Chrome parse it.
  // x.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  x.send();
  x.responseType = 'json';
  x.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = x.response;
    if (!response) {
      errorCallback('No response');
      return;
    }
    var result = response;
    
    // console.assert(
    //     !isNaN(parseInt(advice)) && !isNaN(parseInt(confidence)),
    //     'Unexpected respose from Search API!');
    console.log(result)
    callback(result);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  //x.send();
}

function getTopicModelResultUrl(vid, website, callback, errorCallback) {
  var searchUrl = "http://3.19.72.76:8087/comments/tm/" + vid;
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  // The Google image search API responds with JSON, so let Chrome parse it.
  // x.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  x.send();
  x.responseType = 'json';
  x.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = x.response;
    if (!response) {
      errorCallback('No response');
      return;
    }
    var result = response;

    // console.assert(
    //     !isNaN(parseInt(advice)) && !isNaN(parseInt(confidence)),
    //     'Unexpected respose from Search API!');
    console.log(result)
    callback(result);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  //x.send();
}

function getSentimentAnalysisResultUrl(vid, website, callback, errorCallback) {
  var searchUrl = "http://3.19.72.76:8087/comments/sa/" + vid;
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  // The Google image search API responds with JSON, so let Chrome parse it.
  // x.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  x.send();
  x.responseType = 'json';
  x.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = x.response;
    if (!response) {
      errorCallback('No response');
      return;
    }
    var result = response;

    // console.assert(
    //     !isNaN(parseInt(advice)) && !isNaN(parseInt(confidence)),
    //     'Unexpected respose from Search API!');
    console.log(result)
    callback(result);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  //x.send();
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}


document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url,website) {    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {website: website}, function(response) {

        //if(!resp || !resp.price) return;
        // var price = response.price;

        if(website == 0) {
          console.log(website)
          var vid = url.indexOf('?');
          url = url.substr(vid+1);
          var paramsArr = url.split("&");
          vid = "";
          for(var i = 0; i < paramsArr.length; i++) {
            if((paramsArr[i].split("="))[0] == "v") {
              vid = (paramsArr[i].split("="))[1];
              break;
            }
          }
          console.log(vid)
        }

        renderStatus('Performing analytics for ' + vid);

        getResultUrl(vid, website, function(result) {

          renderStatus('Analyzing video ' + vid);
          var imageResult = document.getElementById('word-count');
          imageResult.innerHTML = "Results: " + JSON.stringify(result);
          imageResult.hidden = false;
        }, function(errorMessage) {
          renderStatus('Cannot return word count results. ' + errorMessage);
          } 
        );
        getTopicModelResultUrl(vid, website, function(result) {

          renderStatus('Analyzing video ' + vid);
          var imageResult = document.getElementById('topic-model');
          imageResult.innerHTML = "Results: " + JSON.stringify(result);
          imageResult.hidden = false;
        }, function(errorMessage) {
          renderStatus('Cannot return topic model results. ' + errorMessage);
          }
        );
        getSentimentAnalysisResultUrl(vid, website, function(result) {

          renderStatus('Analyzing video ' + vid);
          var imageResult = document.getElementById('sentiment-analysis');
          imageResult.innerHTML = "Results: " + JSON.stringify(result);
          imageResult.hidden = false;
        }, function(errorMessage) {
          renderStatus('Cannot return sentiment analysis results. ' + errorMessage);
          }
        );

      });
    });
    
  });
});
