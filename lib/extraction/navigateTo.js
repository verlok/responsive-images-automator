export default async function navigateTo(page, pageUrl) {
  console.log(`Navigating to ${pageUrl}...`);
  await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 0 });
}
