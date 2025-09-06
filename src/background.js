chrome.tabs.onCreated.addListener(function(tab) {
  // 监听新标签页创建事件
  console.log("新标签页创建！");

  // 创建一个新标签页，并设置其 URL 为 Google 首页
  chrome.tabs.create({ url: "https://www.google.com" });
});
