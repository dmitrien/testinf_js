const { fork } = require('child_process');
const puppetteer = require('puppeteer');

jest.setTimeout(30000);

describe('Credit Card Validator form', () => {
    let browser = null;
    let page = null;
    let server = null;
    let testForm;
    let inputCard;
    let btnChecked;
    let statusResult;
    let statusCrad;
    let systemCard;
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
        await page.goto(baseUrl);
        testForm = await page.$('.container');
        inputCard = await testForm.$('#cardNumber');
        btnChecked = await testForm.$('#checkerButton');
        statusResult = await page.$('.result');
        statusCrad = await statusResult.$('p:nth-child(1)');
        systemCard = await statusResult.$('p:nth-child(2)');
    });

    afterAll(async () => {
        await browser.close();
        server.kill();
    });

    test('Form valid card and system Discover', async () => {
        await page.goto(baseUrl);
        await page.waitFor('.container');
        await inputCard.fill('6011111111111117');
        await btnChecked.click();

        await statusCrad.content('Номер карты действителен.');
        await systemCard.content('Система: Discover');
    });

    test('Form valid card and fail system', async () => {
        await page.goto(baseUrl);
        await page.waitFor('.container');

        await inputCard.fill('385543567567565677868');
        await btnChecked.click();

        await statusCrad.content('Номер карты действителен.');
        await systemCard.content('Система карты не опознана!');
    });

    test('Form fail card and fail system', async () => {
        await page.goto(baseUrl);
        await page.waitFor('.container');

        await inputCard.fill('564564676654');
        await btnChecked.click();

        await statusCrad.content('Номер карты недействителен.');
        await systemCard.content('Система карты не опознана!');
    });
});
