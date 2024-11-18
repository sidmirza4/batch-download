let storedLinks = [];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url?.includes("https://fitgirl-repacks.site/")
  ) {
    console.log("Tab with target endpoint opened:", tab.url);

    // Inject content script to fetch links
    chrome.scripting.executeScript(
      {
        target: { tabId },
        files: ["content.js"],
      },
      () => console.log("Content script injected.")
    );
  }
});

// Listen for links from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "foundLinks") {
    storedLinks = message.data;
    sendResponse({ success: true, message: "Links stored successfully." });
  } else if (message.type === "download") {
    // Trigger downloads for stored links
    if (storedLinks.length === 0) {
      console.log("No links to download.");
      sendResponse({ success: false, message: "No links to download." });
    } else {
      console.log("Starting downloads for:", storedLinks);

      // Open each link in a new tab
      storedLinks.forEach((url) => {
        chrome.tabs.create({ url }, (tab) => {
          // Inject a script into the newly opened tab to click the download button
          chrome.scripting.executeScript(
            {
              target: { tabId: tab.id },
              func: clickDownloadButton,
            },
            () => {
              console.log(`Download button clicked in tab with URL: ${url}`);
            }
          );
        });
      });
      sendResponse({ success: true, message: "Downloads started." });
    }
  }

  return true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "closeTab" && sender.tab) {
    chrome.tabs.remove(sender.tab.id, () => {
      console.log(`Closed tab with ID: ${sender.tab.id}`);
    });
  }
});

function clickDownloadButton() {
  // Assuming the download button has a class 'link-button' (adjust as needed)
  const downloadButton = document.querySelector(".link-button");
  if (downloadButton) {
    downloadButton.click();

    setTimeout(() => {
      chrome.runtime.sendMessage({ type: "closeTab" });
    }, 2000);
  } else {
    console.log("Download button not found.");
  }
}
