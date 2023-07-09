import { Request, Response } from 'express';
import puppeteer, { BoundingBox, ElementHandle, Page, WaitForOptions } from "puppeteer";
import * as dotenv from 'dotenv'
import {scrollPageToBottom}  from 'puppeteer-autoscroll-down'
dotenv.config()

const INSTAGRAM_FIRST_URL = "https://www.instagram.com/"
const INSTAGRAM_MY_ID = process.env.INSTA_ACCOUNT as string
const INSTAGRAM_PASSWORD = process.env.INSTA_PASSWORD as string

const ONEPAGE_VIEW_SCROLL_FOLLOWER_COUNT = 10

const waitOptions: {[key: string]: string[]} = {
    waitUntil: ['load', 'networkidle2']
}

const ScrollOption: { [key: string]: number } = {
  scrollTop: -500
}

export const getFollowerDataFromInstagramApp = async (searchID: string) => {
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
  await page.goto(`${INSTAGRAM_FIRST_URL}/${searchID}`)
  await page.waitForSelector('body>div:nth-child(2)>div>div>div:nth-child(2)>div>div>div>div>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section>main>div>header>section>ul>li:nth-child(2)>a>span>span')
  await page.waitForTimeout(2000)
  const followersCnt = parseInt(await page.$eval('body>div:nth-child(2)>div>div>div:nth-child(2)>div>div>div>div>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>section>main>div>header>section>ul>li:nth-child(2)>a>span>span',
      list => list.textContent)as string)
  
  await page.goto(`${INSTAGRAM_FIRST_URL}/${searchID}/followers`)
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
  if(repeatScrollCount > (followersCnt/ONEPAGE_VIEW_SCROLL_FOLLOWER_COUNT + 2)) isDone = true
}
  const followers = await page.$$eval(
    'body>div:nth-child(n)>div:nth-child(2)>div:nth-child(1)>div:nth-child(3)>div>div>div>div>div>div>div>div>div>div:nth-child(2)>div>div>div:nth-child(2)>div>div>div>div>div>div>div:nth-child(2)>div>div>span:nth-child(1)',
    list => list.map(e => e.textContent))
  // スクロールしたいセレクタ
  // body>div:nth-child(n)>div:nth-child(2)>div:nth-child(1)>div:nth-child(3)>div>div>div>div>div>div>div>div>div>div:nth-child(2)>div>div>div:nth-child(2)

  // 最後のセレクタ
  // body>div:nth-child(n)>div:nth-child(2)>div:nth-child(1)>div:nth-child(3)>div>div>div>div>div>div>div>div>div>div:nth-child(2)>div>div>div:nth-child(2)>div>div>div:last-child
  await page.waitForTimeout(1000)
  console.log("complete")
}
