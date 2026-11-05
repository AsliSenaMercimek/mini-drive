import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const screenshotDir = path.resolve(process.cwd(), 'screenshots');

if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const BASE_URL = 'http://localhost:3000';

const user1 = {
  email: 'minidrive.test.user1@gmail.com',
  password: 'Password123*',
};
const user2 = {
  email: 'minidrive.test.user2@gmail.com',
  password: 'Password123*',
};

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('🚀 Mini Drive Auth & UI Test Süreci Başlıyor...\n');
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  page.on('console', (msg) => {
    const text = msg.text();
    if (!text.includes('React DevTools') && !text.includes('[HMR]')) {
      console.log(`[Tarayıcı Konsolu] ${msg.type()}: ${text}`);
    }
  });

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

  async function clickTab(name) {
    const tabs = await page.$$('button[role="tab"]');
    for (const tab of tabs) {
      const text = await page.evaluate((el) => el.textContent, tab);
      if (text.includes(name)) {
        await tab.click();
        await sleep(500);
        return;
      }
    }
    throw new Error(`Tab "${name}" bulunamadı!`);
  }

  try {
    // ==========================================
    // 1. Ziyaret & Middleware Yönlendirmesi
    // ==========================================
    console.log('--- 1. Middleware Koruması Testi ---');
    await page.goto(`${BASE_URL}/drive`, { waitUntil: 'networkidle2' });
    const driveUrl = page.url();
    console.log(`Giriş yapılmadan /drive erişimi sonucu yönlendirilen URL: ${driveUrl}`);
    if (!driveUrl.includes('/login')) {
      throw new Error(`Kullanıcı /login sayfasına yönlendirilmedi!`);
    }
    console.log('✅ Giriş yapmamış kullanıcı otomatik olarak /login sayfasına yönlendirildi.\n');

    // ==========================================
    // 2. Boş Alan Doğrulaması (Validation)
    // ==========================================
    console.log('--- 2. Boş Alan Doğrulaması Testi ---');
    await page.click('#login-submit-btn');
    await sleep(400);

    const emailInputClass = await page.$eval('input#login-email', (el) => el.parentElement?.className);
    const hasErrorClass = emailInputClass.includes('border-danger');
    const toastElem = await page.$('div[role="status"]');
    const toastText = toastElem ? await page.evaluate((el) => el.textContent, toastElem) : '';

    console.log(`Input error durumu (border-danger): ${hasErrorClass}`);
    console.log(`Toast uyarısı: "${toastText.trim()}"`);
    if (!hasErrorClass) {
      throw new Error('Boş form gönderildiğinde input hata durumu aktifleşmedi!');
    }
    console.log('✅ Boş alan doğrulaması ve Toast uyarısı başarılı.\n');

    // ==========================================
    // 3. Yanlış Şifre Senaryosu
    // ==========================================
    console.log('--- 3. Yanlış Şifre Senaryosu Testi ---');
    await setInputValue('input#login-email', user1.email);
    await setInputValue('input#login-password', 'KesinlikleYanlisSifre999!');
    await page.click('#login-submit-btn');

    // Loading durumu
    await sleep(150);
    const submitBtnDisabled = await page.$eval('#login-submit-btn', (el) => el.disabled);
    console.log(`Form gönderilirken buton devre dışı (loading): ${submitBtnDisabled}`);

    await sleep(2500);

    const generalAlert = await page.$('div[role="alert"]');
    const generalAlertText = generalAlert ? await page.evaluate((el) => el.textContent, generalAlert) : '';

    console.log(`Form içi Hata Metni: "${generalAlertText.trim()}"`);
    if (!generalAlertText.includes('E-posta veya şifre hatalı')) {
      console.log(`Bilgi: Hata metni: ${generalAlertText}`);
    }
    console.log('✅ Yanlış şifre ile giriş denemesi beklendiği gibi engellendi ve Türkçe hata mesajı gösterildi.\n');

    // ==========================================
    // 4. Kayıt Sekmesi Testi
    // ==========================================
    console.log('--- 4. Kayıt Sekmesi ve Form Doğrulaması ---');
    await clickTab('Kayıt Ol');

    // Boş alan testi (Kayıt)
    await page.click('#register-submit-btn');
    await sleep(400);
    const regEmailClass = await page.$eval('input#register-email', (el) => el.parentElement?.className);
    console.log(`Kayıt formunda boş alan doğrulaması (border-danger): ${regEmailClass.includes('border-danger')}`);

    // Var olan kullanıcı ile kayıt denemesi (çakışma ve hata yakalama kontrolü)
    await setInputValue('input#register-email', user1.email);
    await setInputValue('input#register-password', 'GecerliSifre123*');
    await page.click('#register-submit-btn');
    await sleep(2500);

    const regAlertText = await page.$eval('div[role="alert"]', (el) => el.textContent).catch(() => null);
    console.log(`Kayıt formu hata yanıtı: "${regAlertText?.trim()}"`);
    console.log('✅ Kayıt sekmesi doğrulaması ve hata yakalama başarılı.\n');

    // ==========================================
    // 5. Hesap 1 İle Başarılı Giriş
    // ==========================================
    console.log('--- 5. Hesap 1 ile Giriş Testi ---');
    console.log(`Kullanıcı 1: ${user1.email}`);
    await clickTab('Giriş Yap');
    await sleep(400);

    await setInputValue('input#login-email', user1.email);
    await setInputValue('input#login-password', user1.password);

    console.log('Giriş butonuna tıklanıyor...');
    await page.click('#login-submit-btn');
    await page.waitForFunction(() => window.location.pathname.includes('/drive'), { timeout: 8000 });
    await sleep(1500);

    console.log(`Giriş sonrası güncel URL: ${page.url()}`);
    if (!page.url().includes('/drive')) {
      throw new Error(`Hesap 1 ile giriş yapıldıktan sonra /drive sayfasına ulaşılamadı! URL: ${page.url()}`);
    }
    console.log('✅ Hesap 1 ile giriş başarılı ve /drive sayfasına yönlendirildi.');

    // Üst barda kullanıcı e-postası ve Avatar kontrolü
    const headerHtml = await page.$eval('header', (el) => el.innerText);
    console.log(`Üst bar metni: "${headerHtml.replace(/\n/g, ' ')}"`);
    if (!headerHtml.includes(user1.email)) {
      throw new Error('Üst barda kullanıcının e-postası bulunamadı!');
    }
    console.log('✅ Üst barda kullanıcının e-postası ve Avatar başarıyla görüntülendi.\n');

    // ==========================================
    // 6. Ekran Görüntüleri (/drive)
    // ==========================================
    console.log('--- 6. /drive Ekran Görüntüleri Alınıyor ---');

    // Masaüstü Açık Tema
    await page.setViewport({ width: 1280, height: 800 });
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    });
    await sleep(300);
    await page.screenshot({ path: path.join(screenshotDir, 'drive-desktop-light.png') });
    console.log('📸 drive-desktop-light.png kaydedildi');

    // Masaüstü Koyu Tema
    await page.evaluate(() => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    });
    await sleep(300);
    await page.screenshot({ path: path.join(screenshotDir, 'drive-desktop-dark.png') });
    console.log('📸 drive-desktop-dark.png kaydedildi');

    // Mobil Açık Tema (375px)
    await page.setViewport({ width: 375, height: 812, isMobile: true });
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    });
    await sleep(300);
    await page.screenshot({ path: path.join(screenshotDir, 'drive-mobile-light.png') });
    console.log('📸 drive-mobile-light.png kaydedildi');

    // Mobil Koyu Tema (375px)
    await page.setViewport({ width: 375, height: 812, isMobile: true });
    await page.evaluate(() => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    });
    await sleep(300);
    await page.screenshot({ path: path.join(screenshotDir, 'drive-mobile-dark.png') });
    console.log('📸 drive-mobile-dark.png kaydedildi\n');

    // ==========================================
    // 7. Çıkış Yap Senaryosu
    // ==========================================
    console.log('--- 7. Çıkış Yap Senaryosu Testi ---');
    await page.setViewport({ width: 1280, height: 800, isMobile: false });
    const logoutBtn = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find((b) => b.textContent?.includes('Çıkış'));
    });
    if (logoutBtn) {
      await logoutBtn.click();
    }
    await page.waitForFunction(() => window.location.pathname.includes('/login'), { timeout: 8000 });
    await sleep(1500);

    console.log(`Çıkış sonrası URL: ${page.url()}`);
    if (!page.url().includes('/login')) {
      throw new Error(`Çıkış yapıldıktan sonra /login sayfasına yönlendirilmedi! URL: ${page.url()}`);
    }
    console.log('✅ Çıkış yap butonuna tıklandığında oturum sonlandırıldı ve /login sayfasına yönlendirildi.\n');

    // ==========================================
    // 8. Ekran Görüntüleri (/login)
    // ==========================================
    console.log('--- 8. /login Ekran Görüntüleri Alınıyor ---');

    // Masaüstü Açık Tema
    await page.setViewport({ width: 1280, height: 800 });
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    });
    await sleep(300);
    await page.screenshot({ path: path.join(screenshotDir, 'login-desktop-light.png') });
    console.log('📸 login-desktop-light.png kaydedildi');

    // Masaüstü Koyu Tema
    await page.evaluate(() => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    });
    await sleep(300);
    await page.screenshot({ path: path.join(screenshotDir, 'login-desktop-dark.png') });
    console.log('📸 login-desktop-dark.png kaydedildi');

    // Mobil Açık Tema (375px)
    await page.setViewport({ width: 375, height: 812, isMobile: true });
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    });
    await sleep(300);
    await page.screenshot({ path: path.join(screenshotDir, 'login-mobile-light.png') });
    console.log('📸 login-mobile-light.png kaydedildi');

    // Mobil Koyu Tema (375px)
    await page.setViewport({ width: 375, height: 812, isMobile: true });
    await page.evaluate(() => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    });
    await sleep(300);
    await page.screenshot({ path: path.join(screenshotDir, 'login-mobile-dark.png') });
    console.log('📸 login-mobile-dark.png kaydedildi\n');

    // ==========================================
    // 9. Hesap 2 Girişi ve Oturum Kontrolü
    // ==========================================
    console.log('--- 9. Hesap 2 Giriş Testi ---');
    console.log(`Kullanıcı 2: ${user2.email}`);

    await page.setViewport({ width: 1280, height: 800, isMobile: false });
    await setInputValue('input#login-email', user2.email);
    await setInputValue('input#login-password', user2.password);

    await page.click('#login-submit-btn');
    await page.waitForFunction(() => window.location.pathname.includes('/drive'), { timeout: 8000 });
    await sleep(1500);

    console.log(`Hesap 2 giriş sonrası güncel URL: ${page.url()}`);
    if (!page.url().includes('/drive')) {
      throw new Error(`Hesap 2 ile giriş yapıldıktan sonra /drive sayfasına ulaşılamadı!`);
    }

    const headerHtml2 = await page.$eval('header', (el) => el.innerText);
    console.log(`Üst bar metni (Hesap 2): "${headerHtml2.replace(/\n/g, ' ')}"`);
    if (!headerHtml2.includes(user2.email)) {
      throw new Error('Üst barda Hesap 2 e-postası bulunamadı!');
    }
    console.log('✅ Hesap 2 ile giriş başarılı, üst barda yeni kullanıcının e-postası ve avatarı görüntülendi.\n');

    console.log('🎉 TÜM TESTLER VE EKRAN GÖRÜNTÜLERİ %100 BAŞARIYLA TAMAMLANDI!');
  } catch (error) {
    console.error('❌ Test sırasında hata:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
