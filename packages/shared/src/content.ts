console.log("Content script running...")

if (location.protocol === "chrome-extension:") {
  chrome.runtime.onInstalled.addListener(() => {
    console.log("扩展程序已安装");
  });
}