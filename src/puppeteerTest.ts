import { Request, Response } from 'express';
import puppeteer, { BoundingBox, ElementHandle, Page, WaitForOptions } from "puppeteer";
import * as dotenv from 'dotenv'
import {scrollPageToBottom}  from 'puppeteer-autoscroll-down'
dotenv.config()

const INSTAGRAM_FIRST_URL = "https://www.instagram.com/"
const INSTAGRAM_MY_ID = process.env.INSTA_ACCOUNT as string
const INSTAGRAM_PASSWORD = process.env.INSTA_PASSWORD as string

const DEMO_SEARCH_ID = "iinoten"

const SEARCH_FOROWWER_TIME = 10

const waitOptions: {[key: string]: string[]} = {
    waitUntil: ['load', 'networkidle2']
}

const ScrollOption: { [key: string]: number } = {
  scrollTop: -500
}

export const main = async () => {
  const browser = await puppeteer.launch({
    headless: false
  })
  const page = await browser.newPage()
  await page.goto(INSTAGRAM_FIRST_URL)
  await page.waitForSelector('input[name="username"]', {visible: true});
  await page.type('input[name="username"]', INSTAGRAM_MY_ID)
  await page.type('input[name="password"]', INSTAGRAM_PASSWORD)
  await Promise.all([
      await page.click('button[type="submit"]'),
      await page.waitForNavigation(waitOptions),
  ])
  await page.goto(`${INSTAGRAM_FIRST_URL}/${DEMO_SEARCH_ID}/followers`)
  await page.waitForSelector(`body>div:nth-child(n)>div:nth-child(2)>div:nth-child(1)>div:nth-child(3)>div>div>div>div>div>div>div>div>div>div:nth-child(2)>div>div>div:nth-child(2)>div>div>div:last-child`)
  await page.waitForTimeout(4000)
  let isDone = false
  let repeatScrollCount = 0
  while (!isDone) {
    await page.evaluate(() => {
      const name = document.querySelector('body>div:nth-child(n)>div:nth-child(2)>div:nth-child(1)>div:nth-child(3)>div>div>div>div>div>div>div>div>div>div:nth-child(2)>div>div>div:nth-child(2)>div>div>div:last-child');
      if(name == null) return
      name.scrollIntoView();
    })
  await page.waitForTimeout(2000)
  repeatScrollCount += 1
  
  if(repeatScrollCount >= SEARCH_FOROWWER_TIME) isDone = true
}
  
  // スクロールしたいセレクタ
  // body>div:nth-child(n)>div:nth-child(2)>div:nth-child(1)>div:nth-child(3)>div>div>div>div>div>div>div>div>div>div:nth-child(2)>div>div>div:nth-child(2)

  // 最後のセレクタ
  // body>div:nth-child(n)>div:nth-child(2)>div:nth-child(1)>div:nth-child(3)>div>div>div>div>div>div>div>div>div>div:nth-child(2)>div>div>div:nth-child(2)>div>div>div:last-child
  await page.waitForTimeout(1000)
  //await page.evaluate(() => {
  //  document.getElementsByClassName('')
  //})
  //await page.$eval(`//*div/div/div[3]/div/div/div[1]/div/div[2]/div/div/div/div/div[2]/div/div/div[2]/div//div[last()]`, (dom) => { dom.scrollIntoView() });
  //await page.waitForNavigation(waitOptions),
      //await page.waitForSelector("#mount_0_0_6l > div > div > div:nth-child(3) > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div.x7r02ix.xf1ldfh.x131esax.xdajt7p.xxfnqb6.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe > div > div > div._aano > div:nth-child(1) > div > div:nth-child(1) > div")
  /*
  await page.waitForTimeout(2000)
  const laterButton = await page.$x("//button[contains(., '後で')]");
  await (laterButton[0] as ElementHandle<Element>).click()
  await page.waitForTimeout(1000)
  await page.click("div.x9f619.x1n2onr6.x1ja2u2z > div > div > div > div.x78zum5.xdt5ytf.x10cihs4.x1t2pt76.x1n2onr6.x1ja2u2z > div.x9f619.xvbhtw8.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.x1q0g3np.xqjyukv.x1qjc9v5.x1oa3qoh.x1qughib > div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1.x1dr59a3.xixxii4.x13vifvy.xeq5yr9.x1n327nk > div > div > div > div > div.x1iyjqo2.xh8yej3 > div:nth-child(2) > span > div > a")
  await page.waitForTimeout(500)
  await page.type('input[aria-label="検索語句"]', 'iinoten')
  */
  console.log("complete")


  // トップページの記事タイトルを列挙する
  const titles = await page.$$eval('h2', list => list.map(e => e.textContent))
  //await browser.close()
  console.log(titles)
}

main()
