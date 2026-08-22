// prettier-ignore
const ASSETS = ["/","/MQ2.js","/main.css","/owo.js","/newelem.js","/ap/apClient.js","/ap/aplog.js","/ap/archipelago_manifest.js","/ap/hintTracker.js","/ap/htmlStorage.js","/ap/item_tracker.js","/ap/logic.js","/ap/map.js","/ap/queststate.js","/ap/roomgraph.js","/ap/tracker.js","/draw.js","/overlay.js","/manifest.json","/BOOTERZZ.woff2","/fonts/Asimov.woff","/fonts/DevinneSwash.woff","/loadBar.png?602385","/V9Preloader.png?602385","/img/battleDais.png?602385","/img/bomb.png?602385","/img/butArrowMap.png?602385","/img/butBuy10.png?602385","/img/butCancel.png?602385","/img/butExit.png?602385","/img/butHunt.png?602385","/img/butInput.png?602385","/img/butKeyboardGuide.png?602385","/img/butLegions.png?602385","/img/butNext.png?602385","/img/butNo.png?602385","/img/butPlus.png?602385","/img/butPrev.png?602385","/img/butReset.png?602385","/img/butRings.png?602385","/img/butSell10.png?602385","/img/ButtonSide.png?602385","/img/butYes.png?602385","/img/coin.png?602385","/img/compassRose.png?602385","/img/confuseIcon.png?602385","/img/desktop.png?602385","/img/diamond.png?602385","/img/EventIcon.png?602385","/img/iPad.png?602385","/img/MagicKeyGuideBox.png?602385","/img/manaShard.png?602385","/img/PixelBlack.png?602385","/img/PixelDarkBlue.png?602385","/img/PixelGrass.png?602385","/img/PixelGrey.png?602385","/img/PixelLightBrown.png?602385","/img/PixelOcean.png?602385","/img/PixelOrange.png?602385","/img/PixelPurple.png?602385","/img/PixelWhite.png?602385","/img/sellArmorBut.png?602385","/img/sellWeapBut.png?602385","/img/ShardEffect.png?602385","/img/SheetArmor.png?602385","/img/SheetBoy.png?602385","/img/SheetBoy2.png?602385","/img/SheetBuildings.png?602385","/img/SheetCanyon.png?602385","/img/SheetCave.png?602385","/img/SheetChests.png?602385","/img/SheetCliff.png?602385","/img/SheetDesert.png?602385","/img/SheetDungeon.png?602385","/img/SheetFence.png?602385","/img/SheetFlame.png?602385","/img/SheetFood.png?602385","/img/SheetGauges.png?602385","/img/SheetGirl.png?602385","/img/SheetGirl2.png?602385","/img/SheetGrassPath.png?602385","/img/SheetGroundTiles.png?602385","/img/SheetGuardChar.png?602385","/img/SheetIcons.png?602385","/img/SheetLava.png?602385","/img/SheetLegions.png?602385","/img/SheetLightning.png?602385","/img/SheetMagic.png?602385","/img/SheetMagicKeys.png?602385","/img/SheetMalMorra.png?602385","/img/SheetMapChar.png?602385","/img/SheetMobs.png?602385","/img/SheetMobs2.png?602385","/img/SheetNinja.png?602385","/img/SheetPeople.png?602385","/img/SheetPeople2.png?602385","/img/SheetRings.png?602385","/img/SheetSkills.png?602385","/img/SheetSmoke.png?602385","/img/SheetSmokeMob.png?602385","/img/SheetTitle.png?602385","/img/SheetTitles.png?602385","/img/SheetTitles2.png?602385","/img/SheetTundra.png?602385","/img/SheetWater.png?602385","/img/SheetWeapons.png?602385","/img/sign.png?602385","/img/SlotBlank.png?602385","/img/SlotEquipped.png?602385","/img/SlotFoodBlank.png?602385","/img/SunDial.png?602385","/img/TreeLeaves.png?602385","/img/TreeStump.png?602385","/img/TreeTrunk.png?602385","/img/WarpEffect.png?602385","/img/Well.png?602385","/img/Window.png?602385","/img/WindowMess.png?602385","/img/windowPrize.png?602385","/img/WindowProb.png?602385","/fonts/Asimov.eot?602385","/fonts/Asimov.svg?602385","/fonts/Asimov.woff?602385","/fonts/DevinneSwash.eot?602385","/fonts/DevinneSwash.svg?602385","/fonts/DevinneSwash.woff?602385","/favicon.ico","/icon-512.png","/sounds/batWinMP3.mp3","/sounds/butPressMP3.mp3","/sounds/levelUpMP3.mp3","/sounds/defeatedMP3.mp3","/sounds/magicPressMP3.mp3","/sounds/armor.mp3","/sounds/weaponSound.mp3","/sounds/buySound.mp3","/sounds/chestSound.mp3","/sounds/coinSound.mp3","/sounds/diamondSound.mp3","/sounds/explode.mp3","/sounds/foodSound.mp3","/sounds/errorMP3b.mp3","/sounds/corBlade.mp3","/sounds/corThud.mp3","/sounds/corBow.mp3","/sounds/setBomb.mp3","/sounds/upgrade.mp3","/sounds/skillSound.mp3","/sounds/attBonMP3.mp3","/sounds/crystalBlueWarp.mp3","/sounds/ring.mp3","/sounds/boltSound.mp3","/images/GameMapWorld.jpg","/sounds/BattleTheme.mp3","/sounds/WorldTheme3.mp3","/sounds/DungeonTheme2.mp3","/sounds/UnbrokenTheme.mp3",]
// Install Service Worker and cache core assets
self.addEventListener("install", (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open("cache").then((cache) => {
      return Promise.all(
        ASSETS.map((url) => {
          return cache.add(url.split("?")[0]).catch((err) => {
            console.error("❌ Failed to cache asset:", url, err)
          })
        }),
      )
    }),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim())
})

let cache = null
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return
  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(event.request)
        // 🛑 Treat Nginx error status codes as failures
        if (
          networkResponse.status === 502 ||
          networkResponse.status === 504
        ) {
          throw new Error(`Gateway error: ${networkResponse.status}`)
        }
        if (
          /^https?:\/\/([^\/]+\.)?(127.0.0.1|localhost)/.test(
            event.request.url,
          )
        ) {
          cache ??= await caches.open("cache")
          const cloned = networkResponse.clone()
          event.waitUntil(
            cache.put(event.request.url.split("?")[0], cloned),
          )
        }
        return networkResponse
      } catch (err) {
        let res = getCached(event.request.url)
        if (res) return res
        console.error(
          `failed to get cached file!!!`,
          event.request.url,
          err,
        )
        throw err
      }
    })(),
  )
})

async function getCached(url) {
  cache ??= await caches.open("cache")
  const cachedResponse = await cache.match(url.split("?")[0])
  return cachedResponse
}
