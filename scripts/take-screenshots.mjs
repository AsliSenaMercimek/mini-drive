import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const ARTIFACT_DIR = "/Users/aslisenamercimek/.gemini/antigravity/brain/fef39be6-e592-4f31-ab7f-458c007b5b2b";
const PUBLIC_DIR = path.resolve("./public");

async function capture() {
  if (!fs.existsSync(ARTIFACT_DIR)) {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1280,
    height: 1000,
    deviceScaleFactor: 2,
  });

  // 1. Light Mode Capture
  console.log("Navigating to http://localhost:3000/design in Light Mode...");
  await page.goto("http://localhost:3000/design", { waitUntil: "networkidle0" });

  await page.evaluate(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    // Trigger toast test
    const btn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Toast Testi"));
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  const lightPathArtifact = path.join(ARTIFACT_DIR, "design-light.png");
  const lightPathPublic = path.join(PUBLIC_DIR, "design-light.png");

  console.log("Capturing Light Mode screenshot with Toast & Upload Panel...");
  await page.screenshot({ path: lightPathArtifact, fullPage: true });
  fs.copyFileSync(lightPathArtifact, lightPathPublic);
  console.log("Saved Light Mode screenshot:", lightPathArtifact);

  // 2. Dark Mode Capture
  console.log("Switching to Dark Mode...");
  await page.evaluate(() => {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
    // Trigger toast test for dark mode view
    const btn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Toast Testi"));
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  const darkPathArtifact = path.join(ARTIFACT_DIR, "design-dark.png");
  const darkPathPublic = path.join(PUBLIC_DIR, "design-dark.png");

  console.log("Capturing Dark Mode screenshot with dark cards, dark rows, Toast & Upload Panel...");
  await page.screenshot({ path: darkPathArtifact, fullPage: true });
  fs.copyFileSync(darkPathArtifact, darkPathPublic);
  console.log("Saved Dark Mode screenshot:", darkPathArtifact);

  // 3. Also capture a viewport-sized desktop overview (above the fold)
  console.log("Capturing viewport desktop overviews...");
  const darkOverviewArtifact = path.join(ARTIFACT_DIR, "design-dark-overview.png");
  await page.screenshot({ path: darkOverviewArtifact, fullPage: false });

  // Switch back to light for light overview
  await page.evaluate(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  });
  await new Promise((r) => setTimeout(r, 400));
  const lightOverviewArtifact = path.join(ARTIFACT_DIR, "design-light-overview.png");
  await page.screenshot({ path: lightOverviewArtifact, fullPage: false });

  await browser.close();
  console.log("All screenshots captured successfully!");
}

capture().catch((err) => {
  console.error("Failed to capture screenshots:", err);
  process.exit(1);
});
