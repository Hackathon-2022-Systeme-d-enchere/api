<p align="center">
    <img src="https://i.ibb.co/s6TCpC3/logo.png">
</p>

# Hackathon ESGI/ECITV The Real Final Destination

Subject: Auction feature on WA
Authors: Group4 - HARAULT Valentin, LY Céline, PIEDAGNEL Bérenger, BARBE Dylan, COHEN Jérémie

## Problem
The idea we present is to create an auction feature on WorkAdventure.

## Proposed Solution
* A platform where the auctioneer can set up auctions
* Any authorized user can place bids and view the bidding updates realtime on WorkAdventure game.
* Dynamic auction closing based on last bid time.

## Features
* Auctioneer signup and set up the site's look and feel.
* Create new auctions (specify minimum bid amount, duration, slot start time)
* Only one super admin (username: admin, password: admin1234)
* View all auctions, bids and products on administration
* Real time updates for Biddings placed by various users on WordAdventure game.

## POC
* In POC, we have created a NodeJS based application which connects to PostgreSQL Database.
* Real time update of bidding dashboard is enabled usin Socket.IO
* We were able to build an Auction engine with Dynamic Closing and Real time events.
* We have built a single monolithic application.

## Future Enhancements
1. Enable multi-currancy - White labelling to allow auctioneers to sign up and set up landing page and create auctions on their behalf.
2. Integrate with third party Payment Gateway for settling auctions.
3. Enable notification
4. Microservices implementation
5. CI/CD pipelines for deployments


## Technology Stack
* A VueJS frontend website
* Backend - NodeJS
* Authentication - JWT
* Database - PostgreSQL
* Real time event handling - Socket.IO

## How it Works
### How the data is accessed
* All auctions
    * NodeJS connects to Redis Cloud database. Frontend communicates with NodeJS backend through API calls.
    * GET : /api/auctions fetches all the keys from Auctions Hash
    * NodeJS uses 'redis' module to work with Redis Cloud. The redis client is created using the Redis credentials and hmget() equivalent of HMGET command is used to get data from Redis database.
* Each auction
    * GET : /api/auctions/{auctionId} fetches each auction item by id
    * NodeJS uses 'redis' module to work with Redis Cloud. The redis client is created using the Redis credentials and hmget() equivalent of HMGET command is used to get data from Redis database.
* All bidding data of an auction item
    * GET : /api/bidding/{auctionId}
    * NodeJS uses 'redis' module to work with Redis Cloud. The redis client is created using the Redis credentials and hmget() equivalent of HMGET command is used to get data from Redis database.
* Profile settings
    * GET : /api/settings
    * NodeJS uses 'redis' module to work with Redis Cloud. The redis client is created using the Redis credentials and get() equivalent of GET command is used to get data from Redis database.
* User info
    * GET : /api/users/{email}
    * NodeJS uses 'redis' module to work with Redis Cloud. The redis client is created using the Redis credentials and hmget() equivalent of HMGET command is used to get data from Redis database.

## Installation
Installation steps:
### Prerequisites

- Node JS ^14.0 
- NPM

* To run the App,<br>
  **1.** npm install.<br>
  **2.** npm start.<br>
