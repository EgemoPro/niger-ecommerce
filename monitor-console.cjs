const puppeteer = require('puppeteer-core');

async function testRequests() {
  console.log('🔌 Connecting to Chrome...');
  
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222',
    defaultViewport: null
  });
  
  console.log('✅ Connected!');
  
  const page = await browser.newPage();
  
  // Enable detailed logging
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('ERROR') || text.includes('Failed') || text.includes('401') || text.includes('500') || text.includes('Axios')) {
      console.log('📝 [CONSOLE]', text.substring(0, 300));
    }
  });
  
  page.on('pageerror', error => {
    console.log('❌ [PAGE ERROR]', error.message.substring(0, 300));
  });
  
  page.on('requestfailed', request => {
    console.log('❌ [REQUEST FAILED]', request.url(), '-', request.failure().errorText);
  });
  
  // Navigate to app (will trigger API calls after login)
  console.log('📱 Loading app...');
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'domcontentloaded', timeout: 10000 });
  
  console.log('✅ Page loaded. Waiting for API calls...');
  console.log('👀 Watch console for API errors...\n');
  
  // Wait for API calls to complete
  await new Promise(r => setTimeout(r, 15000));
  
  console.log('\n✅ Test complete');
  
  await browser.disconnect();
  process.exit(0);
}

testRequests().catch(e => {
  console.log('Error:', e.message);
  process.exit(1);
});