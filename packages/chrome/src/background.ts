console.log('后台脚本正在运行...')

chrome.runtime.onInstalled.addListener(() => {
  console.log('扩展程序已安装')
})
