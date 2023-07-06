import { Request, Response } from 'express';
import puppeteer from "puppeteer";
import * as dotenv from 'dotenv'
dotenv.config()

const INSTAGRAM_FIRST_URL = "https://www.instagram.com/"
const INSTAGRAM_MY_ID = process.env.INSTA_ACCOUNT as string
const INSTAGRAM_PASSWORD = process.env.INSTA_PASSWORD as string

export const main = async () => {
  const browser = await puppeteer.launch({
    headless: false
  })
  const page = await browser.newPage()
  await page.goto(INSTAGRAM_FIRST_URL)
  await page.waitForSelector('input[name="username"]', {visible: true});
  await page.type('input[name="username"]', INSTAGRAM_MY_ID)
  await page.type('input[name="password"]', INSTAGRAM_PASSWORD)
  await page.click('button[type="submit"]')

  // トップページの記事タイトルを列挙する
  const titles = await page.$$eval('h2', list => list.map(e => e.textContent))
  //await browser.close()
  console.log(titles)
}

main()