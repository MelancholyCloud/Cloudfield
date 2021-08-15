<p align="center">
<br/>
<a href="https://discord.gg/skyblocks">
  <img alt="Skyblock Services Discord Server" width="100px" src="https://i.imgur.com/hn7WY4f.gif" />
</a>
</p>

# Cloudfield
[Discord](https://discord.gg/skyblocks)
## Introduction
This is a project that aims to be the best flipping and endpoint utility for Hypixel Skyblock available!

## Information
There are currently 1 free endpoints, 2 paid endpoints, and no applications. To access the paid endpoints and applications requires an API key and access which you will receive after purchasing them. You can purchase the endpoints at my [Ko-Fi](https://ko-fi.com/skyblock) page! Make sure to add your Discord username and / or user ID as the note.
### Pricing
* $5 / 1 Month
* $10 / 2 Months
* $25 / 3 Months | Most Value!
* $50 / Lifetime

## Endpoint Information
Base link: `https://Cloudfield.neonrainbow.repl.co`
### Free Endpoints
* `/fsnipes`
  * Displays detected snipes. (3 Snipes / Minute)
### Paid Endpoints
* `/snipes`
  * Displays detected snipes. (75 Snipes / Minute)
* `/newauctions`
  * Displays all new auctions.
### Endpoint Parameters
#### Optional
* `?key=`
  * string : The API key received by me. If you don't have one, contact me through the [Discord](https://discord.gg/skyblocks)! Required for paid endpoints.

## Setup : TODO
1. Setup
    - [x] New Auction Detection
    - [x] Sniper
    - [x] Host
    - [x] Endpoints

## Back-End : TODO
1. Sniper
    - [ ] Support for enchantment books, potions, runes, pets
    - [ ] Sync to API updates
    - [ ] Queue system to prevent overflow
    - [ ] Keep snipes found in older operations if they havent been taken or expired
2. Endpoints
    - [x] IP Bans
    - [x] Rate Limiter
    - [x] Free Sniper Endpoint
    - [ ] Production and Development (prod / dev) branches of the endpoints
    - [ ] Seperate endpoint (possibly) that checks the auction house completely for snipes, rather than just new auctions, will be the same endpoint as normal snipes if the operation is not too demanding.
    - [ ] Connect DB to endpoints
    - [ ] ?query, ?sort, ?filter, ?limit
3. Extras
    - [x] Log File
    - [ ] Database
    - [ ] GraphQL
4. Optional
    - [ ] Custom Domain
    
## Front-End : TODO
1. Minecraft
    - [ ] Sniper Mod
    - [ ] Sniper Client
2. 3rd Party
    - [ ] Desktop App
    - [ ] Discord Bot
    - [ ] Discord Webhook
