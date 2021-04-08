import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class AppService {
  delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  async crawl(tick: string): Promise<string> {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(process.env.URL, {
      waitUntil: 'networkidle2',
    });
    await page.$eval('.main-search', (form) => (form as HTMLElement).click());
    // await page.$eval('.input-form', (form) => (form as HTMLElement).click());
    await page.keyboard.press('Enter');
    await this.delay(1000);
    await page.keyboard.type(tick);
    await page.waitForSelector('.Typeahead-suggestion');
    await page.$eval('.Typeahead-suggestion', (form) =>
      (form as HTMLElement).click(),
    );
    await page.waitForSelector('#earning-section > div.list > ul');
    await this.delay(1000);

    const dividends = await page.evaluate(() => {
      const divs = [];
      const nav = document.querySelector('#earning-section > div.list > ul')
        .children;

      // ignores the first and last element because it is not pages
      for (let index = 1; index < nav.length - 1; index++) {
        const page = nav[index];
        const rows = (document.querySelector(
          '#earning-section > div.list > div > div:nth-child(2) > table',
        ).children[1] as HTMLTableElement).rows;
        for (let index = 0; index < rows.length; index++) {
          const element = rows[index];
          divs.push({
            type: element.cells[0]?.innerText.split('\n')[0],
            dataCom: element.cells[1]?.innerText,
            dataPagamento: element.cells[2]?.innerText,
            value: parseFloat(
              element.cells[3]?.innerText.split('\n')[0].replace(',', '.'),
            ),
          });
        }
        (page as HTMLElement).click();
      }
      return divs;
    });

    if (dividends) {
      console.log(dividends);
    }

    // await browser.close();
    return '';
  }
}
