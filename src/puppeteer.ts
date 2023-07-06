import { Request, Response } from 'express';
import puppeteer from "puppeteer";

export const main = async (req: Request, res: Response) => {
  const browser = await puppeteer.launch({
    headless: 'new'
  })
  const page = await browser.newPage()
  await page.goto("https://zenn.dev")

  // トップページの記事タイトルを列挙する
  const titles = await page.$$eval('h2', list => list.map(e => e.textContent))
  await browser.close()
  await res.send(titles)
}
