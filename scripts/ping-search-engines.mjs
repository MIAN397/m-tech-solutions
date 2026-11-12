// Submits all canonical M-Tech Solutions URLs to IndexNow (Bing, ChatGPT Search / OAI-SearchBot, Copilot, Yandex, Seznam, Naver)
const HOST = 'mtechsolutions.online';
const KEY = 'mtech8f9a2b4c1d3e5f7a';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const URL_LIST = [
  `https://${HOST}/`,
  `https://${HOST}/erp-software`,
  `https://${HOST}/pos-system`,
  `https://${HOST}/services`,
  `https://${HOST}/portfolio`,
  `https://${HOST}/faq`,
  `https://${HOST}/contact`,
  `https://${HOST}/llms.txt`,
  `https://${HOST}/llms-full.txt`,
  `https://${HOST}/index.md`,
];

async function submitIndexNow() {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URL_LIST,
  };

  for (const endpoint of [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
  ]) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });
      console.log(`[IndexNow] ${endpoint} -> HTTP ${res.status}`);
    } catch (err) {
      console.warn(`[IndexNow] ${endpoint} warning:`, err.message);
    }
  }
}

submitIndexNow();
