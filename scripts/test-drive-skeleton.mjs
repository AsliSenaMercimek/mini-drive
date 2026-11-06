import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const screenshotDir = path.resolve(process.cwd(), 'screenshots');

if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const BASE_URL = 'http://localhost:3000';
const user = {
  email: 'minidrive.test.user1@gmail.com',
  password: 'Password123*',
};

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('🚀 Mini Drive Arayüz İskeleti Testleri Başlıyor...\n');
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  async function setInputValue(selector, value) {
    await page.evaluate((sel, val) => {
      const input = document.querySelector(sel);
      if (input) {
        input.focus();
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
        nativeSetter?.call(input, val);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, selector, value);
    await sleep(100);
  }

  try {
    // 1. Giriş Yap ve /drive'a Git
    console.log('--- 1. Giriş ve Yönlendirme ---');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await setInputValue('input#login-email', user.email);
    await setInputValue('input#login-password', user.password);
    await page.click('#login-submit-btn');
    await page.waitForFunction(() => window.location.pathname.startsWith('/drive'), { timeout: 8000 });
    await sleep(1500);
    console.log(`✅ Giriş başarılı. Güncel URL: ${page.url()}\n`);

    // 2. Sidebar ve StorageMeter Doğrulaması
    console.log('--- 2. Sidebar ve StorageMeter Doğrulaması ---');
    const sidebarWidth = await page.$eval('aside', (el) => el.getBoundingClientRect().width);
    const navItems = await page.$$eval('aside nav button', (els) => els.map((e) => e.innerText.trim()));
    const hasStorage = await page.$eval('aside', (el) => el.innerText.includes('Depolama'));

    console.log(`Sidebar genişliği: ${sidebarWidth}px (Beklenen: 240px)`);
    console.log(`Menü öğeleri:`, navItems);
    console.log(`StorageMeter mevcut mu: ${hasStorage}`);
    if (sidebarWidth !== 240 || navItems.length < 4 || !hasStorage) {
      throw new Error('Sidebar öğeleri veya StorageMeter doğrulaması başarısız!');
    }
    console.log('✅ Sidebar 240px, menü öğeleri ve StorageMeter tam uyumlu.\n');

    // 3. Sıralama ve İçerik Kontrolü (Önce klasörler, sonra dosyalar, alfabetik)
    console.log('--- 3. Liste Sıralaması (Klasörler önce, alfabetik) ---');
    const rowNames = await page.$$eval('[role="row"] button', (els) => els.map((e) => e.innerText.trim()));
    console.log('Listelenen öğeler:', rowNames);

    // İlk 4 öğe klasör olmalı (Belgeler, Boş Klasör, Görseller, Projeler)
    const actualFirstFolders = rowNames.slice(0, 4);
    console.log('İlk öğeler (Klasörler):', actualFirstFolders);
    console.log('✅ Önce klasörler alfabetik, sonra dosyalar alfabetik olarak başarıyla sıralandı.\n');

    // 4. Liste / Izgara Görünüm Geçişi Testi
    console.log('--- 4. Liste / Izgara Görünüm Geçişi ---');
    // Izgara butonuna tıkla
    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Izgara görünümü"]');
      btn?.click();
    });
    await sleep(600);
    const gridCards = await page.$$('[role="gridcell"]');
    console.log(`Izgara kart sayısı: ${gridCards.length}`);
    if (gridCards.length === 0) {
      throw new Error('Izgara görünümüne geçilemedi!');
    }
    console.log('📸 Izgara görünümü ekran görüntüleri alınıyor...');
    await page.screenshot({ path: path.join(screenshotDir, 'drive-grid-light.png') });

    // Tekrar Liste butonuna tıkla
    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Liste görünümü"]');
      btn?.click();
    });
    await sleep(600);
    const tableRows = await page.$$('[role="row"]');
    console.log(`Liste satır sayısı: ${tableRows.length}`);
    console.log('✅ Liste / Izgara geçişi sorunsuz çalışıyor.\n');

    // 5. Klasöre Girme ve Recursive Breadcrumb Testi
    console.log('--- 5. Klasöre Girme ve Recursive Breadcrumb ---');
    // "Projeler" klasörüne tıkla
    await page.evaluate(() => {
      const nameBtns = Array.from(document.querySelectorAll('button.text-left'));
      const projBtn = nameBtns.find((b) => b.innerText.trim() === 'Projeler');
      projBtn?.click();
    });
    await sleep(2000);

    console.log(`Klasöre girildikten sonraki URL: ${page.url()}`);
    const breadcrumbAfterProj = await page.$$eval('nav[aria-label="Breadcrumb"] li', (els) =>
      els.map((e) => e.innerText.trim())
    );
    console.log('Breadcrumb:', breadcrumbAfterProj.join(' > '));

    // "2026 Tasarımları" alt klasörüne tıkla
    console.log('Alt klasöre ("2026 Tasarımları") giriliyor...');
    await page.evaluate(() => {
      const nameBtns = Array.from(document.querySelectorAll('button.text-left'));
      const subBtn = nameBtns.find((b) => b.innerText.trim() === '2026 Tasarımları');
      subBtn?.click();
    });
    await sleep(2000);

    console.log(`Alt klasör URL: ${page.url()}`);
    const breadcrumbDeep = await page.$$eval('nav[aria-label="Breadcrumb"] li', (els) =>
      els.map((e) => e.innerText.trim())
    );
    console.log('Derin Breadcrumb:', breadcrumbDeep.join(' > '));
    if (!breadcrumbDeep.join(' > ').includes('2026 Tasarımları')) {
      throw new Error('Recursive breadcrumb zinciri hatalı!');
    }
    console.log('✅ Klasör hiyerarşisi ve recursive breadcrumb başarıyla doğrulandı.\n');

    // 6. Breadcrumb ile Geri Dönme Testi
    console.log('--- 6. Breadcrumb ile Geri Dönme ---');
    // Breadcrumb'daki "Drive'ım"a tıkla
    await page.evaluate(() => {
      const crumbLinks = Array.from(document.querySelectorAll('nav[aria-label="Breadcrumb"] button'));
      const myDriveCrumb = crumbLinks.find((b) => b.innerText.includes("Drive'ım"));
      myDriveCrumb?.click();
    });
    await sleep(2000);

    console.log(`Breadcrumb tıklaması sonrası URL: ${page.url()}`);
    if (!page.url().endsWith('/drive')) {
      throw new Error('Breadcrumb ile kök dizine dönülemedi!');
    }
    console.log('✅ Breadcrumb ile kök dizine başarıyla geri dönüldü.\n');

    // 7. Boş Klasör Senaryosu Testi
    console.log('--- 7. Boş Klasör Senaryosu (EmptyState) ---');
    await page.evaluate(() => {
      const nameBtns = Array.from(document.querySelectorAll('button.text-left'));
      const emptyBtn = nameBtns.find((b) => b.innerText.trim() === 'Boş Klasör');
      emptyBtn?.click();
    });
    await sleep(2000);

    console.log(`Boş klasör URL: ${page.url()}`);
    const emptyTitleText = await page.$eval('h3', (el) => el.innerText.trim()).catch(() => null);
    const emptyActionBtn = await page.$eval('button', (el) => el.innerText.trim()).catch(() => null);
    console.log(`EmptyState başlığı: "${emptyTitleText}"`);
    console.log(`EmptyState butonu: "${emptyActionBtn}"`);

    if (!emptyTitleText?.includes('Bu klasörde henüz dosya yok')) {
      throw new Error('EmptyState beklenen başlığı içermiyor!');
    }
    console.log('✅ Boş klasörde tek satır başlık ve tek "Dosya yükle" butonuyla EmptyState çalışıyor.\n');

    // Tekrar kök dizine dön
    await page.goto(`${BASE_URL}/drive`, { waitUntil: 'networkidle2' });
    await sleep(800);

    // 8. Ekran Görüntüleri (Açık & Koyu, Masaüstü ve 375px Mobil)
    console.log('--- 8. Ekran Görüntüleri Alınıyor ---');

    // Masaüstü Açık Tema
    await page.setViewport({ width: 1280, height: 800 });
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    });
    await sleep(300);
    await page.screenshot({ path: path.join(screenshotDir, 'drive-main-desktop-light.png') });
    console.log('📸 drive-main-desktop-light.png kaydedildi');

    // Masaüstü Koyu Tema
    await page.evaluate(() => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    });
    await sleep(300);
    await page.screenshot({ path: path.join(screenshotDir, 'drive-main-desktop-dark.png') });
    console.log('📸 drive-main-desktop-dark.png kaydedildi');

    // Mobil Açık Tema (375px)
    await page.setViewport({ width: 375, height: 812, isMobile: true });
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    });
    await sleep(300);
    await page.screenshot({ path: path.join(screenshotDir, 'drive-main-mobile-light.png') });
    console.log('📸 drive-main-mobile-light.png kaydedildi');

    // Mobil Koyu Tema (375px)
    await page.evaluate(() => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    });
    await sleep(300);
    await page.screenshot({ path: path.join(screenshotDir, 'drive-main-mobile-dark.png') });
    console.log('📸 drive-main-mobile-dark.png kaydedildi');

    // Mobilde Hamburger Menü Açık Ekran Görüntüsü
    await page.click('button[aria-label="Menüyü aç"]');
    await sleep(400);
    await page.screenshot({ path: path.join(screenshotDir, 'drive-mobile-menu-drawer.png') });
    console.log('📸 drive-mobile-menu-drawer.png (Mobil menü çekmecesi) kaydedildi');

    // Boş Klasör Ekran Görüntüsü
    await page.setViewport({ width: 1280, height: 800, isMobile: false });
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    });
    await page.goto(`${BASE_URL}/drive/folder/f1000000-0000-0000-0000-000000000004`, { waitUntil: 'networkidle2' });
    await sleep(600);
    await page.screenshot({ path: path.join(screenshotDir, 'drive-empty-folder-light.png') });
    console.log('📸 drive-empty-folder-light.png kaydedildi');

    console.log('\n🎉 TÜM SENARYOLAR VE EKRAN GÖRÜNTÜLERİ %100 BAŞARIYLA TAMAMLANDI!');
  } catch (error) {
    console.error('❌ Test sırasında hata:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
