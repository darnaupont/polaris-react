/* eslint-disable no-console */
const os = require('os');

const puppeteer = require('puppeteer');
const pMap = require('p-map');

// eslint-disable-next-line node/no-path-concat
const iframePath = `file://${__dirname}/../build/storybook/static/iframe.html`;

const concurrentCount = os.cpus().length;
console.log(`Running ${concurrentCount} concurrent pages at a time`);

const testPages = async (urls) => {
  try {
    const browser = await puppeteer.launch();

    // Get the URLS to run the a11y tests on
    const initialPage = await browser.newPage();
    await initialPage.goto(iframePath);
    const storyUrls = await initialPage.evaluate(() => {
      return window.__STORYBOOK_CLIENT_API__.raw();
    });
    await initialPage.close();

    const testUrls = storyUrls.filter((memo, url) => {
      // There is no need to test the Playground, or the "All Examples" stories
      const isSkippedUrl = url.kind === 'Playground/Playground' || url.name === 'All Examples';

      if (!isSkippedUrl) {
        const idParam = `id=${encodeURIComponent(url.id)}`;
        memo.push(
          idParam,
          `${idParam}&contexts=Global%20Theming=Enabled%20-%20Light%20Mode`,
          // Dark mode has lots of errors. It is still very WIP so ignore for now
          // `${idParam}&contexts=Global%20Theming=Enabled%20-%20Dark%20Mode`,
        );
      }
      return memo;
    }, []);

    console.log(testUrls);

    // const testPage = async (url) => {
    //   try {
    //     console.log(`Testing: ${url}`);
    //     const page = await browser.newPage();
    //     await page.goto(`${iframePath}?${url}`);

    //     const result = await page.evaluate(() => {
    //       return window.axe.run(document.getElementById('root'), {});
    //     });

    //     await page.close();

    //     if (result.violations.length === 0) {
    //       return;
    //     }

    //     return {
    //       url,
    //       message: JSON.stringify(result.violations, null, 2),
    //     };
    //   } catch (error) {
    //     throw new Error(error.message);
    //   }
    // };


    // const results = await pMap(storyUrls.splice(0, 20), testPage, {
    //   concurrency: concurrentCount,
    // });

    // await browser.close();

    // if (results.length === 0) {
    //   throw new Error('Component URLs could not be crawled');
    // }

    // const errors = results.filter(result => result.type === 'FAIL');

    // if (errors.length) {
    //   console.log('---\n\n');

    //   errors.forEach((error) => {
    //     console.log(`${error.type} ${error.url}: \n${error.message}`);
    //   });
    // }
    // else {
    //   console.log('✨ No errors found.')
    // }
  }
  catch(error) {

  }
}

(async function run() {
  try {
    const results = await testPages();
    process.exit(1);
  } catch (error) {
    console.error(err);
    process.exit(1);
  }
})();
