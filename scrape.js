const puppeteer = require("puppeteer");
const path = require("path");
const { Logger } = require("util.log");

const log = Logger.instance({
  directory: path.join(__dirname, "logs"),
  toConsole: false,
  colors: false
});

const baseScraper = async baseURL => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(baseURL);
  const price = await page.$eval(".NprOob", span => span.textContent);
  const percentage = await page.$eval("span[class*='CCT9_i-ytLA']", span =>
    span.textContent.trim()
  );

  await browser.close();
  return {
    price,
    percentage
  };
};

//GHS1TM
let target = 1440.0;

const indigoScraper = async idx => {
  console.log("Instance invoked: ", idx);
  const baseURL = "https://www.google.com/search?q=indigo+share";
  const currStockStatus = await baseScraper(baseURL);
  const stockPrice = currStockStatus.price.split(",");
  const formattedPrice = parseFloat(stockPrice[0] + stockPrice[1]);
  if (formattedPrice <= target) {
    log.event(JSON.stringify(currStockStatus));
    target = formattedPrice - 10.0;
  }
  log.info(
    "%s %f %s %f",
    "Current price = ",
    formattedPrice,
    " Target price = ",
    target
  );
};

let idx = 1;

setInterval(() => {
  indigoScraper(idx);
  idx += 1;
}, 20000);
