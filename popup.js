document.getElementById("download").addEventListener("click", () => {
  // Send a message to the background script to start downloads
  chrome.runtime.sendMessage({ type: "download" }, (response) => {
    const status = document.getElementById("status");
    if (response && response.success) {
      status.textContent = "Downloads started successfully.";
    } else {
      status.textContent = response.message || "An error occurred.";
    }
  });
});
