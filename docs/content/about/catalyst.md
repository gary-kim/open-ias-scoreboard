---
title: "For Catalyst"
date: 2019-04-22T22:52:53+08:00
weight: 2
---

### Open IAS Scoreboard was originally developed for Singapore American School's Digital Frontiers club by Gary Kim.

This is my first large scale and major program I started and designed to run locally on a computer offline, so a lot of what I learned including all my experience using the Electron APIs, Yarn, and ESLint has come from making this program. In addition, I wanted to try using the Electron API to create a program for a while. That, combined with my philosophy “if it ain’t broke, improve it” made our situation in Digital Frontiers with expensive and buggy scoreboards the perfect problem to tackle with this interest.

#### External Effect

For Digital Frontiers, this will be a big help in the years to come. It will finally allow us to run our scoreboard software on any computer we choose rather then having to get a specific computer that both has a license for the scoreboard software and has the operating system to run the software. In addition to this, the club will no longer be paying around $70 per computer to license the previously used scoreboard software. This will help to save hundreds of dollars a year for the club, enough savings to use to get even better equipment to improve other parts of the livestream such as quality and reliability.

The fact that the software is Free and Open Source has benefits in and of itself as well. This expands the potential audience of the project to anyone in the world that have similar use cases. Unlike a proprietary product, if you have similar requirements to what this program has been designed for, you can add modifications to make the scoreboard work well for you then either use it as is, or if you would like to share the software with others, add your modifications back into my original project. This also means that in the process, Open IAS Scoreboard itself also keeps improving. I would love to see this occur but it will require a lot more work to make the program intuitive for the user but I have confidence that the program will, in part thanks to being open source, be constantly improving overtime.

#### Personal Value

For me, this project represents my attempt to get into developing a program in a way that is both easily understood and maintained by others. To this end, I had to learn about best practices for open source software development projects and specifically what has allowed the sucessful ones to continue to thrive despite large codebases. This seems difficult because from my experience, it is far too easy for a code in a way that makes the code impossible to read for future maintainers. 

I have seen this happen to my own projects. SAS Powerschool Enhancement Suite<sup>1</sup>, another personal project of mine, is a browser extension used by at least 900 different users on 1100 different computers. Far into the development process, I decided being able to have other people help with development would be a great help so I worked to open source the code base so others could contribute their ideas and code. Alas, noone contributed any code, and I know from talking to people that that is in part because the code base is very difficult to read and understand. A problem further compounded by a lack of proper documentation for the project. I wanted to avoid that for Open IAS Scoreboard so from the start of the development process, I tried to learn the strategies that are used to prevent this from occuring.

The development process of Open IAS Scoreboard has taught me a lot about how it is that large codebases can still be maintained for a long time by many people who didn't have any involvement in the original development process. Looking at projects such as rclone and Nextcloud, it is clear that a lot of work goes into make the codebase understandable and easy to maintain for new developers who would like to get into development. These large projects use many different techniques such as unit tests<sup>2</sup>, continuous integration<sup>3</sup>, and simply writing detailed and helpful documentation so that the changes made previously can be easily understood by developers that come to maintain the project later.

While developing Open IAS Scoreboard, I happened to be contributing some code for rclone and I found, first hand, how useful having proper documentation for what everything in the code does is to others that come along later to help maintain code that was written by someone else. This helped me greatly in tracing back along function calls to try to find where a certain bug is occuring. As part of the code contribution that I made, I also added unit tests<sup>2</sup>. The idea is that when in the future when someone else tries to improve or change that part of the code, they can run the unit test to make sure that the feature has not been accidently broken. 

- <sup>1</sup> [SAS Powerschool Enhancement Suite](https://gschool.ydgkim.com/saspowerschool/)
- <sup>2</sup> Unit tests are test cases that can be run against the code to make sure that any changes made has not caused a regression.
- <sup>3</sup> From [Wikipedia](https://en.wikipedia.org/wiki/Continuous_integration): continous integration is the practice of merging all developer working copies to a shared mainline several times a day. 