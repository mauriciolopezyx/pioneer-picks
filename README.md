# Pioneer Picks

[![Preview of the app](https://i.gyazo.com/0ebbfd0f58ff67602ab336ee7b7c4a0b.gif)](https://gyazo.com/0ebbfd0f58ff67602ab336ee7b7c4a0b)

## Overview

Pioneer Picks is a CSUEB student-only app designed to help students make more informed choices in planning their semesters. Features include browsing courses (by subject included), viewing and create professor reviews, viewing courses a professor teaches, and more.

[**Available on the App Store**](https://apps.apple.com/us/app/pioneer-picks/id6755741774)

## Technical Architecture 
* **React Native with Expo:** Used to serve the frontend interface and integrate development and production builds with App Store Connect
* **Spring Boot:** Used to serve the main RESTful API for the frontend. Uses Spring Session with Redis to hold stateful sessions
* **Node.js and Discord.js:** Used to serve new content requests from users to a discord channel via webhook as messages, such as professor or course requests
* **GitHub Actions:** Used to create a CI pipeline in pushing repoistory code to Elastic Container Registry as docker images
* **Elastic Container Service:** Used to serve the backend images in production via task definitions and tasks
