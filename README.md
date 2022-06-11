<p align="center">
    <img src="https://i.ibb.co/s6TCpC3/logo.png">
</p>

# Hackathon ESGI/ECITV The Real Final Destination

Subject: Auction feature on WA

Authors: Group4 - LEMOINE Thomas, HARAULT Valentin, LY Céline, PIEDAGNEL Bérenger, BARBE Dylan, COHEN Jérémie

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

### Prerequisites

- Node JS ^14.0 
- NPM

## Installation
Installation steps:

* To run the App,<br>
  **1.** Go to folder ``cd api``, create ``config.json`` file<br>
  **2.** Connect your PostgreSQL database to the config file<br>
  **3.** ``npm install``<br>
  **4.** ``npm start``<br>
  **5.** ``php -S localhost:8000``<br>
