console.log("Content script running...")

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed")
})
