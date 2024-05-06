# NjordBreeze - Wind Edition

## Project Description

Write a brief description of your application here. The description should provide an overview of the application features, its purpose, and how it achieves the objective of the assignment. Discuss the dataset used and why it was chosen.

Describe the insights you are providing through your interactive visualization. Highlight the questions this project is intended to answer or the insights you aim to provide.

---
Built upon the NjordBeeze API, or at least the insights gained while developing said API, NjordBreeze - Wind Edition is a graphical representation wind speed and directions at multiple weather stations included in SMHI Open Data.

By having fetched historical data for more than 200 stations the application can show speed and direction for every hour starting in late december 2023. The dataset is constructed by fetching different parameters from SMHI Open Data API and combine those into an Elastic Search index. The quality of the dataset is assured by the SMHI, and it continues to be updated. Since I'm interested in working with publicly accessible information I found this one of particular interest since there is a lot of opportunities to make interesting visualizations.

## Core Technologies

Include a list of the main technologies used in your project. Explain why you decided to use these technologies and what benefits they have provided in accomplishing your goals. This can include the backend framework, data analysis and processing tools, data visualization library, frontend technology, and deployment platform.

---
I've chosen to continue using express.js as my backend, mostly since this is what I'm most familiar with and since I was not able to learn anything new at this point due to time restraints.

For data handling I choose Elastic Search, since it seemed to meet my requirements (being rather easy to learn and responds quickly).

The visualization is done by leaflet, for maps. Originally I intended to show wind speed as a heat map, but having trouble with the tools I opted for a marker, with the added benefit of showing direction.

Frontend is built using simple but modern javascript. Mostly cause I've grown tired of fighting with frame works as React and Next.js and needed a "quick and dirty" solution.

The application and API is deployed under one of my own domains on a server owned by the company Inleed. Elastic Search is deployed as a Docker container, the server is nginx and I use pm2 to keep the backend running.

## How to Use

This section should contain instructions for how to use your application. Explain the controls used in your visualization and how to interact with it to uncover different insights. Providing screenshots and/or gifs can greatly help users understand how to use your application.
---

The application is a simple one page with some possibilities for user interactions. The main part is the map, centered on Sweden. Using the controls the user can start the visualization, as well as pause, resume and restart it.

## Link to the Deployed Application

https://svenssonom.se/njordbreeze-we/

## Additional features

Explain how you have addressed the assignment requirements. If you've added any custom functionality, discuss them in this section and link to the specific issues you have closed.



## Acknowledgements

Include a list of resources you found helpful, attributions, or shoutouts here.