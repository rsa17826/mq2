const fs = require("fs")
const path = require("path")
const puppeteer = require("puppeteer")
const { Jimp } = require("jimp")

const TARGET_URL = "http://mathquest2.localhost/"
const DEST_DIR = "./map"

// Target background colors in Hex (Jimp reads them as 0xRRGGBBAA)
const TARGET_COLORS = [
  0x212a33ff, // #212A33
  0x111619ff, // #111619
]

function isTargetColor(pixelColor) {
  const rgb = pixelColor & 0xffffff00
  return TARGET_COLORS.some((target) => (target & 0xffffff00) === rgb)
}

// Your list of positions [north, east]
const allpos = [
  // [10, 10],
  // [10, 11],
  // [10, 12],
  // [10, 13],
  // [10, 14],
  // [10, 15],
  // [10, 16],
  // [10, 17],
  // [10, 18],
  // [10, 19],
  // [10, 20],
  // [10, 21],
  // [10, 3],
  // [10, 4],
  // [10, 5],
  // [10, 6],
  // [10, 7],
  // [10, 8],
  // [10, 9],
  // [11, 10],
  // [11, 11],
  // [11, 12],
  // [11, 13],
  // [11, 14],
  // [11, 15],
  // [11, 16],
  // [11, 17],
  // [11, 18],
  // [11, 19],
  // [11, 20],
  // [11, 4],
  // [11, 5],
  // [11, 6],
  // [11, 7],
  // [11, 8],
  // [11, 9],
  // [12, 10],
  // [12, 11],
  // [12, 12],
  // [12, 13],
  // [12, 14],
  // [12, 15],
  // [12, 16],
  // [12, 17],
  // [12, 18],
  // [12, 19],
  // [12, 20],
  // [12, 4],
  // [12, 5],
  // [12, 6],
  // [12, 7],
  // [12, 8],
  // [12, 9],
  // [13, 10],
  // [13, 11],
  // [13, 12],
  // [13, 13],
  // [13, 14],
  // [13, 15],
  // [13, 16],
  // [13, 17],
  // [13, 18],
  // [13, 19],
  // [13, 20],
  // [13, 21],
  // [13, 3],
  // [13, 4],
  // [13, 5],
  // [13, 6],
  // [13, 7],
  // [13, 8],
  // [13, 9],
  // [14, 10],
  // [14, 11],
  // [14, 12],
  // [14, 13],
  // [14, 14],
  // [14, 15],
  // [14, 17],
  // [14, 18],
  // [14, 19],
  // [14, 20],
  // [14, 21],
  // [14, 3],
  // [14, 4],
  // [14, 5],
  // [14, 6],
  // [14, 7],
  // [14, 8],
  // [14, 9],
  // [15, 10],
  // [15, 11],
  // [15, 12],
  // [15, 13],
  // [15, 14],
  // [15, 15],
  // [15, 16],
  // [15, 17],
  // [15, 18],
  // [15, 19],
  // [15, 20],
  // [15, 21],
  // [15, 22],
  // [15, 6],
  // [15, 7],
  // [15, 8],
  // [15, 9],
  // [16, 10],
  // [16, 11],
  // [16, 12],
  // [16, 13],
  // [16, 14],
  // [16, 15],
  // [16, 17],
  // [16, 18],
  // [16, 19],
  // [16, 20],
  // [16, 21],
  // [16, 22],
  // [16, 5],
  // [16, 6],
  // [16, 7],
  // [16, 8],
  // [16, 9],
  // [17, 10],
  // [17, 11],
  // [17, 12],
  // [17, 13],
  // [17, 14],
  // [17, 15],
  // [17, 17],
  // [17, 18],
  // [17, 19],
  // [17, 20],
  // [17, 21],
  // [17, 22],
  // [17, 3],
  // [17, 4],
  // [17, 5],
  // [17, 6],
  // [17, 7],
  // [17, 8],
  // [17, 9],
  // [18, 12],
  // [18, 13],
  // [18, 17],
  // [18, 18],
  // [18, 19],
  // [18, 20],
  // [18, 21],
  // [18, 3],
  // [18, 5],
  // [18, 6],
  // [18, 7],
  // [18, 8],
  // [18, 9],
  // [19, 10],
  // [19, 11],
  // [19, 12],
  // [19, 13],
  // [19, 14],
  // [19, 17],
  // [19, 19],
  // [19, 20],
  // [19, 21],
  // [19, 3],
  // [19, 5],
  // [19, 7],
  // [19, 8],
  // [19, 9],
  // [20, 10],
  // [20, 11],
  // [20, 12],
  // [20, 13],
  // [20, 14],
  // [20, 20],
  // [20, 3],
  // [20, 4],
  // [20, 5],
  // [20, 6],
  // [20, 7],
  // [20, 8],
  // [20, 9],
  // [21, 10],
  // [21, 11],
  // [21, 12],
  // [21, 13],
  // [21, 14],
  // [21, 15],
  // [21, 16],
  // [21, 17],
  // [21, 18],
  // [21, 3],
  // [21, 4],
  // [21, 5],
  // [21, 6],
  // [21, 7],
  // [21, 8],
  // [21, 9],
  // [22, 10],
  // [22, 11],
  // [22, 13],
  // [22, 14],
  // [22, 15],
  // [22, 16],
  // [22, 17],
  // [22, 18],
  // [22, 19],
  // [22, 3],
  // [22, 4],
  // [22, 5],
  // [22, 6],
  // [22, 7],
  // [22, 8],
  // [23, 10],
  // [23, 11],
  // [23, 13],
  // [23, 14],
  // [23, 15],
  // [23, 16],
  // [23, 17],
  // [23, 18],
  // [23, 3],
  // [23, 4],
  // [23, 5],
  // [23, 6],
  // [23, 7],
  // [23, 8],
  // [24, 12],
  // [24, 13],
  // [24, 14],
  // [24, 15],
  // [24, 16],
  // [24, 17],
  // [24, 18],
  // [24, 3],
  // [24, 4],
  // [24, 5],
  // [24, 6],
  // [24, 7],
  // [24, 8],
  // [25, 12],
  // [25, 13],
  // [25, 14],
  // [25, 15],
  // [25, 17],
  // [25, 18],
  // [25, 3],
  // [25, 4],
  // [25, 5],
  // [25, 6],
  // [25, 7],
  // [25, 8],
  // [26, 12],
  // [26, 13],
  // [26, 14],
  // [26, 17],
  // [26, 18],
  // [26, 3],
  // [26, 4],
  // [26, 5],
  // [26, 6],
  // [26, 7],
  // [26, 8],
  // [27, 12],
  // [27, 13],
  // [27, 14],
  // [27, 15],
  // [27, 17],
  // [27, 18],
  // [28, 11],
  // [28, 12],
  // [28, 13],
  // [28, 14],
  // [28, 15],
  // [609, 610],
  // [609, 611],
  // [609, 612],
  // [609, 613],
  // [609, 614],
  // [609, 615],
  // [609, 616],
  // [610, 610],
  // [610, 611],
  // [610, 612],
  // [610, 613],
  // [610, 614],
  // [610, 615],
  // [610, 616],
  // [611, 612],
  // [611, 613],
  // [611, 614],
  // [611, 615],
  // [611, 616],
  // [6, 11],
  // [612, 612],
  // [612, 613],
  // [612, 615],
  // [6, 12],
  // [6, 13],
  // [6, 14],
  // [6, 4],
  // [6, 7],
  // [6, 8],
  // [6, 9],
  // [705, 711],
  // [706, 709],
  // [706, 710],
  // [706, 711],
  // [706, 712],
  // [707, 709],
  // [707, 710],
  // [707, 711],
  // [707, 712],
  // [708, 709],
  // [708, 710],
  // [708, 711],
  // [708, 712],
  // [709, 709],
  // [709, 710],
  // [709, 711],
  // [709, 712],
  // [710, 710],
  // [7, 10],
  // [7, 11],
  // [7, 12],
  // [7, 13],
  // [7, 14],
  // [7, 17],
  // [7, 18],
  // [7, 3],
  // [7, 4],
  // [7, 5],
  // [7, 6],
  // [7, 7],
  // [7, 8],
  // [7, 9],
  // [8, 11],
  // [8, 12],
  // [8, 13],
  // [8, 15],
  // [8, 16],
  // [8, 17],
  // [8, 18],
  // [8, 19],
  // [8, 20],
  // [8, 3],
  // [849, 849],
  // [849, 850],
  // [8, 4],
  // [-850, -849],
  // [850, 849],
  // [850, 850],
  // [850, 851],
  // [8, 5],
  // [8, 6],
  // [8, 7],
  // [8, 8],
  // [8, 9],
  // [9, 10],
  // [9, 11],
  // [9, 12],
  // [9, 13],
  // [9, 15],
  // [9, 16],
  // [9, 17],
  // [9, 18],
  // [9, 19],
  // [9, 20],
  // [9, 3],
  // [9, 4],
  // [9, 5],
  // [9, 6],
  // [9, 7],
  // [9, 8],
  // [9, 9],
  // [18, 10],
  // [18, 11],
  // [8, 10],
  // [6, 10],
  [500, 500],
  [499, 500],
  [498, 500],
  [498, 499],
  [499, 499],
  [500, 499],
  [501, 499],
  [502, 499],
  [502, 498],
  [501, 498],
  [500, 498],
  [499, 498],
  [498, 498],
  [498, 501],
  [498, 502],
  [499, 502],
  [500, 502],
  [501, 502],
  [502, 502],
  [502, 501],
  [501, 501],
  [500, 501],
  [499, 501],
  [500, 500],
  [502, 500],
]
// NOTE use when screenshotting
// player.realeast=player.realnorth=20;player.food.fill(99);player.skills.fill(1000);player.skillPoints+=999999;console.log=log=warn=error=_apOrigLog=window.apChatLog=()=>{};manager.revealIcon.set_x(-999);manager.tBoxUsed.fill(0);manager.quest.fill(9999)
// Helper for delaying execution to let the game render frames
const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms))

async function runMapAutomation() {
  let browser
  try {
    // 1. Ensure directory exists
    if (!fs.existsSync(DEST_DIR)) {
      fs.mkdirSync(DEST_DIR, { recursive: true })
    }

    // 2. Connect to Chrome
    console.log("[*] Connecting to browser...")
    browser = await puppeteer.connect({
      browserURL: "http://127.0.0.1:9222",
      defaultViewport: null,
    })

    const pages = await browser.pages()
    const page = pages.find((p) => p.url().includes(TARGET_URL))

    if (!page) {
      console.error(`[-] Could not find tab: ${TARGET_URL}`)
      return
    }

    const canvas = await page.$("canvas")
    if (!canvas) {
      console.error("[-] Canvas element not found on page.")
      return
    }

    console.log(
      `[*] Starting map generation loop for ${allpos.length} positions...`,
    )

    // 3. Iterate over all positions sequentially
    for (const [north, east] of allpos) {
      const destFileName = `${north},${east}.jpg`
      const destPath = path.join(DEST_DIR, destFileName)

      // Skip already processed positions
      if (fs.existsSync(destPath)) {
        console.log(
          `[-] File already exists for (${north}, ${east}). Skipping.`,
        )
        continue
      }

      console.log(
        `[*] Moving to position: North ${north}, East ${east}`,
      )

      // Update game state via page execution context
      await page.evaluate(
        (e, n) => {
          if (
            typeof manager !== "undefined" &&
            typeof test !== "undefined"
          ) {
            manager.realeast = e
            manager.realnorth = n
            test.newScreen()
          } else {
            throw new Error(
              "Game context variables 'manager' or 'test' are missing.",
            )
          }
        },
        east,
        north,
      )

      // Give the canvas a tiny window to finish rendering the new map frame
      await sleep(100)

      // Take the screenshot buffer
      const screenshotBuffer = await canvas.screenshot({
        type: "png",
      })

      // Process image trimming with Jimp
      const image = await Jimp.read(screenshotBuffer)
      const width = image.bitmap.width
      const height = image.bitmap.height

      let topTrim = 40
      let rightTrim = width - 180
      const leftTrim = 1

      const finalWidth = rightTrim - leftTrim
      const finalHeight = height - topTrim

      if (finalWidth <= 0 || finalHeight <= 0) {
        console.error(
          `[-] Calculated dimensions invalid for position (${north}, ${east})`,
        )
        continue
      }

      // image.crop({
      //   x: leftTrim,
      //   y: topTrim,
      //   w: finalWidth,
      //   h: finalHeight,
      // })

      await image.write(destPath)
      console.log(`[+] Saved: ${destPath}`)
    }

    console.log("[+] All positions processed successfully!")
  } catch (error) {
    console.error("[-] Error running automation:", error.message)
  } finally {
    if (browser) {
      await browser.disconnect()
      console.log("[*] Disconnected from browser.")
    }
  }
}

// Start the sequence directly
runMapAutomation()
