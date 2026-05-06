const puppeteer = require('puppeteer-core');

async function monitorRealTime() {
  console.log('🔌 Connecting to Chrome...');
  
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222',
    defaultViewport: null
  });
  
  console.log('✅ Connected! Monitoring console...\n');
  
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/products', { waitUntil: 'networkidle0', timeout: 15000 });
  
  console.log('📱 Page loaded:', page.url(), '\n');
  
  let errorCount = 0;
  let warnCount = 0;
  
  // Listen to all console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    
    if (type === 'error') {
      errorCount++;
      const short = text.substring(0, 200);
      console.log('❌ [ERROR]', short);
    } else if (type === 'warning') {
      warnCount++;
      const short = text.substring(0, 150);
      console.log('⚠️  [WARN]', short);
    } else if (text.includes('Error') || text.includes('failed') || text.includes('Failed')) {
      console.log('📝 [INFO]', short = text.substring(0, 150));
    }
  });
  
  // Listen to page errors
  page.on('pageerror', error => {
    errorCount++;
    console.log('❌ [PAGE ERROR]', error.message.substring(0, 300));
  });
  
  // Listen to request failures
  page.on('requestfailed', request => {
    const failure = request.failure();
    if (failure) {
      errorCount++;
      console.log('❌ [REQUEST FAILED]', request.url(), '-', failure.errorText);
    }
  });
  
  console.log('👀 Watching for errors... (Ctrl+C to stop)\n');
  
  // Keep monitoring
  setInterval(() => {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] Monitoring... (${errorCount} errors, ${warnCount} warnings)`);
  }, 10000);
}

monitorRealTime().catch(e => {
  console.log('Error:', e.message);
  process.exit(1);
});