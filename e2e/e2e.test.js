const { fork } = require('child_process');
const puppetteer = require('puppeteer');

jest.setTimeout(30000);

describe('Credit Card Validator form', () => {
    let browser = null;
    let page = null;
    let server = null;
    const baseUrl = 'http://localhost:9000';

    beforeAll(async () => {
        server = fork(`${__dirname}/e2e.server.js`);
        await new Promise((resolve, reject) => {
            server.on('error', reject);
            server.on('message', (message) => {
                if (message === 'ok') {
                    resolve();
                }
            });
        });

        browser = await puppetteer.launch({
            headless: false, // show gui
            slowMo: 150,
        });
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
        server.kill();
    });

    test('Form valid card and system Discover', async () => {
        await page.goto(baseUrl);
    });
});
