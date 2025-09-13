console.log("内容脚本正在运行...")

chrome.runtime.onInstalled.addListener(() => {
  console.log("扩展程序已安装")
})
