/**
 * Delays program execution.
 * @func sleep
 * @example
 * // Delays program execution for 5000 ms
 * sleep(5000)
 * @param {number} ms - Milliseconds to delay
 */
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
/**
 * Finds difference between 2 arrays based on the uuid property; not backwards compatible.
 * @func diffArr
 * @example
 * // Result: [{uuid: 2}]
 * var arr1 = [{uuid: 3}, {uuid: 1}]
 * var arr2 = [{uuid: 1}, {uuid: 2}]
 * var diff = diffArr(arr1, arr2, 'uuid')
 * @param {Array} arr1 - Array 1
 * @param {Array} arr2 - Array 2
 * @param {string} property - Object property to compare arrays with
 */
function diffArr (arr1, arr2, property) {
  const arr1Set = new Set(arr1.map(item => item[property]))
  const notInArr1 = arr2.filter(e => !arr1Set.has(e[property]))
  return notInArr1
}
/**
 * Gets the sum of the entire given array
 * @func sumArr
 * @example
 * // Result: 46
 * var arr = [30, 16]
 * sumArr(arr)
 * @param {Array} arr - Array to find sum of
 */
function sumArr (arr) {
  let sum = arr.reduce((a, b) => a + b, 0)
	return sum
}
/**
 * Finds n random elements from the given array
 * @func getRandom
 * @example
 * // Result: [3, 1, 4]
 * var arr1 = [1, 2, 3, 4, 5]
 * getRandom(arr1, 3)
 * @param {Array} arr - Array to get random elements from
 * @param {number} n - Number of random elements to get from given array
 */
function getRandom (arr, n) {
  arr = [...arr]
  let items = []
  for (let j = 0; j < n; j++) {
    let i = Number.parseInt(Math.random() * arr.length)
    let item = arr[i]
    arr.splice(i, 1)
    items.push(item)
  }
  return items
}
/**
 * Generates a new API key.
 * @func genKey
 * @example
 * // Result: 62a4cb99-6564-495a-b07e-70b6537259c9
 * genKey()
 */
function genKey () {
  const key = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) % 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return key
}

const chalk = require('chalk')

const fs = require('fs')

const express = require('express')
const app = express()

app.enable("trust proxy")
const path = require('path')
const favicon = require('serve-favicon')
const morgan = require('morgan')
const slowDown = require("express-slow-down")
const rateLimit = require("express-rate-limit")
const ipfilter = require('express-ipfilter').IpFilter
app.use(
  favicon(path.join('images', 'favicon.ico')),
  morgan(':date | :remote-addr :method :url :status :res[content-length] - :response-time ms', {
    stream: fs.createWriteStream('./access.log', { flags: 'a' })
  }),
  morgan('dev'),
  slowDown({
    delayAfter: 20,
    delayMs: 1000,
    maxDelayMs: 10000
  }),
  rateLimit({
    max: 30,
    message: {
      success: false,
      cause: 'You\'ve been rate-limited.'
    }
  }),
  ipfilter(process.env.BANNED, {
    log: false,
    trustProxy: true
  })
)

const got = require('got')
let snipes = []
let snipeProfit = 0
async function sniper () {
  if (newAuctions.length !== 0) {
    let snipesSave = []
    let estimatedProfit = 0
    let firstItem = true
    try {
      const res = await got(process.env.API1, { responseType: 'json' })
      newAuctions.forEach((item) => {
        let itemArray = []
        let costArray = []
        itemArray = res.body.filter(auctionItem => auctionItem.item_id === item.item_id)
        if (itemArray.length >= 5) {
          itemArray.forEach((auctionItem) => {
            costArray.push(auctionItem.starting_bid)
          })
          costArray.sort((a, b) => { return a - b })
          estimatedProfit = costArray[1] - item.starting_bid
          if (estimatedProfit > 10000) {
            if (firstItem) {
              snipesSave = snipes
              snipes = []
              firstItem = false
            }
            snipes.push(item)
            if (item.starting_bid !== item.price && !item.price) {
              Object.defineProperty(item, 'price',
                Object.getOwnPropertyDescriptor(item, 'starting_bid'))
              delete item.starting_bid
            }
            item.lbin = costArray[1]
            item.estimated_profit = estimatedProfit
          }
        }
      })
      if (snipes.length === 0) {
        snipes = snipesSave
        snipesSave = []
      } else {
        snipes.sort((a, b) => (a.estimated_profit > b.estimated_profit) ? -1 : 1)
      }
      console.log(chalk.blue(`${snipes.length} snipes saved...`))
      profitArray = []
      snipes.forEach((item) => {
        profitArray.push(item.estimated_profit)
      })
      snipeProfit = sumArr(profitArray)
      console.log(chalk.magentaBright(`
|----------------------|
 Tiny - 10k: ${profitArray.filter(cost => cost >= 10000).length}
 Small - 100k: ${profitArray.filter(cost => cost >= 100000).length}
 Medium - 1m: ${profitArray.filter(cost => cost >= 1000000).length}
 Big - 10m: ${profitArray.filter(cost => cost >= 10000000).length}
 Best Snipe: ${Math.max(...profitArray)}
 Total Profit: ${snipeProfit}
|----------------------|`))
    } catch (err) {
      console.log(chalk.red(`G3 Error: ${err.message}`))
    }
  }
}

let newAuctions = []
async function auctions () {
  let auctionsSave1 = []
  let auctionsSave2 = []
  let start = 0
  let end = 0
  let time = 0
  while (true) {
    start = Date.now()
    console.log(chalk.green('Starting detection process...'))
    try {
      const res = await got(process.env.API1, { responseType: 'json' })
      if (auctionsSave1.length === auctionsSave2.length) {
        auctionsSave1 = res.body
      } else {
        auctionsSave1 = auctionsSave2
      }
      console.log(chalk.blue(`${auctionsSave1.length} auctions saved... (1/3)`))
    } catch (err) {
      console.log(chalk.red(`G1 Error: ${err.message}`))
    }
    end = Date.now()
    time = end - start
    if (time > 60000) { time = 0 }
    await sleep(60000 - time)
    start = Date.now()
    try {
      const res = await got(process.env.API1, { responseType: 'json' })
      auctionsSave2 = res.body
      console.log(chalk.blue(`${auctionsSave2.length} auctions saved... (2/3)`))
      if (auctionsSave1.length !== auctionsSave2.length) {
        newAuctions = diffArr(auctionsSave1, auctionsSave2, 'uuid')
        console.log(chalk.blue(`${newAuctions.length} new auctions saved... (3/3)`))

        sniper()
      } else {
        console.log(chalk.red('No detected changes. Detection stopped.'))
      }
    } catch (err) {
      console.log(chalk.red(`G2 Error: ${err.message}`))
    }
    end = Date.now()
    time = end - start
    if (time > 60000) { time = 0 }
    await sleep(60000 - time)
  }
}
auctions()

const keys = process.env.KEYS
// 0 | Admin Key | ∞ / ∞ / ∞
// 1 | 231537550450229249 | 11 / 14 / 21
const keyError = {
  success: false,
  cause: 'Missing or invalid key!'
}

app.get('/', (req, res) => {
  res.json({
    success: false,
    cause: 'Not a valid endpoint!',
    free_endpoints: ['/fsnipes'],
    paid_endpoints: ['/newauctions', '/snipes']
  })
})

// Free Endpoints
app.get('/fsnipes', (req, res) => {
  res.json({
    success: true,
    snipes: getRandom(snipes, 3)
  })
})

// Paid Endpoints
app.get('/newauctions', (req, res) => {
  if (keys.indexOf(req.query.key) >= 0) {
    res.json({
      success: true,
      new_auctions: newAuctions
    })
  } else {
    res.json(keyError)
  }
})

app.get('/snipes', (req, res) => {
  if (keys.indexOf(req.query.key) >= 0) {
    res.json({
      success: true,
      total_profit: snipeProfit,
      snipes: snipes
    })
  } else {
    res.json(keyError)
  }
})

app.listen(process.env.PORT, () => {
  console.log(chalk.cyan('Server started.'))
})
