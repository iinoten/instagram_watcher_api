import { Request, Response } from 'express';
import puppeteer, { ElementHandle, WaitForOptions } from "puppeteer";
import * as dotenv from 'dotenv'
dotenv.config()

const INSTAGRAM_FIRST_URL = "https://www.instagram.com/"
const INSTAGRAM_MY_ID = process.env.INSTA_ACCOUNT as string
const INSTAGRAM_PASSWORD = process.env.INSTA_PASSWORD as string

const waitOptions: {[key: string]: string} = {
    waitUntil: 'load'
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
  await page.waitForTimeout(2000)
  const laterButton = await page.$x("//button[contains(., '後で')]");
  await (laterButton[0] as ElementHandle<Element>).click()
  await page.waitForTimeout(1000)
  await page.click("div.x9f619.x1n2onr6.x1ja2u2z > div > div > div > div.x78zum5.xdt5ytf.x10cihs4.x1t2pt76.x1n2onr6.x1ja2u2z > div.x9f619.xvbhtw8.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.x1q0g3np.xqjyukv.x1qjc9v5.x1oa3qoh.x1qughib > div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1.x1dr59a3.xixxii4.x13vifvy.xeq5yr9.x1n327nk > div > div > div > div > div.x1iyjqo2.xh8yej3 > div:nth-child(2) > span > div > a")
  console.log("complete")


  // トップページの記事タイトルを列挙する
  const titles = await page.$$eval('h2', list => list.map(e => e.textContent))
  //await browser.close()
  console.log(titles)
}

main()