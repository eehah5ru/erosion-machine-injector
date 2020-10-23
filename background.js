// function listener(details) {
//   // let filter = browser.webRequest.filterResponseData(details.requestId);
//   // let decoder = new TextDecoder("utf-8");
//   // let encoder = new TextEncoder();

//   // console.log("listener");

//   // filter.ondata = event => {
//   //   console.log("ondata");

//   //   let str = decoder.decode(event.data, {stream: true});
//   //   // Just change any instance of Example in the HTTP response
//   //   // to WebExtension Example.
//   //   str = str.replace(/EEEFFF/g, 'FFFEEE');
//   //   filter.write(encoder.encode(str));
//   //   filter.disconnect();
//   // };

//   // return {};

//   let r = {};

//   if (details.url.includes(".png?")) {
//     _.merge(r, probablyReplace());
//   }
//   // let url = browser.extension.getURL("images/one.png");
//   // console.log(details.type);
//   // console.log(details.url);

//   // console.log("redirecting: " + details.url);
//   // console.log("new target: " + url);

//   // return {redirectUrl: url};
//   return r;
// }

// // browser.webRequest.onBeforeRequest.addListener(
// //
// // types: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/ResourceType
// //
// browser.webRequest.onBeforeSendHeaders.addListener(
//   listener,
//   {urls: ["https://cdn-1.matterport.com/models/*", "https://heatmap-external-*.strava.com/tiles/*", "https://heatmap-external-a.strava.com/tiles-auth/*", "https://heatmap-external-b.strava.com/tiles-auth/*", "https://heatmap-external-c.strava.com/tiles-auth/*"], types: ["xmlhttprequest", "image"]},
//   ["blocking"]
// );


function injectJs(tabId, filePath) {
  return browser.tabs.executeScript(tabId, {file: filePath})
    .then((r) => {
      console.log('[injectJs]', 'injected', filePath);
      return r;
    });
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const log = _.partial(console.log, '[inject]');

  if (_.chain(changeInfo).get('status', '').eq('complete').value()) {
    //return browser.tabs.executeScript(tabId, {file: '/content_scripts/runtime-main.js'})
    return browser.tabs.executeScript(tabId, {code: "document.body.insertAdjacentHTML(\"afterbegin\", \"<div id='root'></div>\")"})
      .then(() => log('root was injected'))
      .then(() => {
        return browser.tabs.executeScript(tabId, {file: '/content_scripts/runtime-main.js'});
      })
      .then(() => log('runtime was injected'))
      .then(() => {
        return browser.tabs.executeScript(tabId, {file: '/content_scripts/vendors-main.js'});
      })
      .then(() => log('vendors were injected'))
      .then(() => {
        return browser.tabs.executeScript(tabId, {file: '/content_scripts/main-chunk.js'});
      })
      .then(() => log('main was injected'))
      .then(() => {
        return browser.tabs.insertCSS(tabId, {file: browser.extension.getURL("content_css/erosion-machine-timeline.css")});
      })
      .then(() => log('css was injected'))
      .catch((e) => { console.error("[injecting]", e); });

      // .then(() => {
      //   return browser.tabs.executeScript(tabId, {file: '/content_scripts/vendors-main.js'});
      // })
      // .then(() => {
      //   return browser.tabs.executeScript(tabId, {file: '/content_scripts/main-chunk.js'});
      // })
      // .catch((e) => { console.error("[inject-js-scripts]", e); });

    // injectJs(tabId, '/content_scripts/runtime-main.js')
    //   .then(() => { return injectJs(tabId, '/content_scripts/vendors-main.js'); })
    //   .then(() => { return injectJs(tabId, '/content_scripts/main-chunk.js'); })
    //   .catch((e) => { console.error("[inject-js-scripts]", e); });
  }
});
