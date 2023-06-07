const { chromium } = require("playwright");

(async () => {
  // Use headless browser (for speed purposes)
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    // Use userAgent to prevent websites from blocking requests
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
  });
  const page = await context.newPage();

  // Navigate to the website
  await page.goto(
    "https://kbopub.economie.fgov.be/kbopub/zoekactiviteitform.html?gemeente3=&gemeente2=&gemeente1=&gemeente0=&keuzeopzloc=postnr&_ondNP=on&vest=true&filterEnkelActieve=true&ondNP=true&_ondRP=on&postnummer1=9100&postnummer2=&postnummer3=&ondRP=true&_filterEnkelActieve=on&nacecodes=56101&postnummer4=&actionLu=Zoek&page=1&_vest=on"
  );

  // Extract the rows of the table
  const rows = await page.$$eval("table tbody tr", (els) =>
    els.map((el) => {
      const columns = el.querySelectorAll("td");
      const linkElement = columns[3]?.querySelector("a");
      const link = linkElement ? linkElement.getAttribute("href") : "";
      return {
        naam: columns[4]?.textContent.trim() || "",
        ondernemingsnummer: columns[2]?.textContent.trim() || "",
        link,
      };
    })
  );

  console.log(rows);

  await browser.close();
})();
