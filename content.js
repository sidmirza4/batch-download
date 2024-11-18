// Find all links on the page
const links = Array.from(document.querySelectorAll('a'))
  .map((link) => link.href)
  .filter((href) => href.includes("https://fuckingfast.co/"));

if (links.length > 0) {
  console.log("Found links:", links);

  // Send these links to the background script
  chrome.runtime.sendMessage({ type: "foundLinks", data: links });
} else {
  console.log("No matching links found.");
}
