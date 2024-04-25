# Personal Website

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

I am by no means a professional or experienced front end developer.
Although I am mainly interested in systems operating systems and
experienced in system programming at the network level, I have always been
totally blown away by a great portfolio website. In these examples, you
see the talent, complexity, and design sense of these developers. JavaScript
and its friends often get a bad rap on tech YouTube and other social media
sites, but its been the JS community that has informed many recent
developments in systems programming. Namely, the adoption of a first class
package manager in Rust. I also believe JS devs helped popularize the concept
of linting and formatting dotfiles.

This is my foray into web development. The main technologies used here, and
that make this site possible, are NextJS, TailwindCSS, and FramerMotion.
For hosting, I am using Vercel, and my personal domains I license manually
on Route53.

- <https://michaelfortunato.dev>
- Dev: <https://personal-website-git-dev-michael-fortunatos-projects.vercel.app>

## Building Good Git Habits

- <https://www.conventionalcommits.org/en/v1.0.0/>

## Useful Resources

1. shad-ui theme generator: <https://shadcn-ui-theme-generator.vercel.app>
2. shad-ui theme generator: <https://dizzy.systems/editor>
3. Typescript cheatsheet: <https://react-typescript-cheatsheet.netlify.app/docs/react-types/componentprops>

## Designing The Database To Count Unique Visitors

First, there were a couple of pre-built options I considered.
The first was using Google Analytics, which up until this commit,
I had been using.

The other option was to use [Goat Counter](https://www.goatcounter.com/).
This would almost certainly provide a better implementation than I could do,
but I want full control and to let users know exactly how I am collecting their
data. So I am going to roll my own counter.

### Using Postgresql To Track Unique Visits

Lets say we want to track the visits to page `blog/post1.html`.
If a device makes a GET request to `post1`, that is counted as a visit.
A device needs an IP to be identified, but it also probably needs other attributes.
For instance, an iPhone and Mac connecting to `post1` on the same network
will have the same IP. Unfortunately no other identifiers at Layer 3 can be
used to identify the device. I could rely on some `x-` headers.
Anything at Layer 2 or 1 will have device identifiers about the last node,
not the connecting computer.

That aside, let's just use the IP.

But what if the same IP requests `post1`, waits a few days, and then requests
`post1` again? I'd like to count that as a unique read.

Lets go with this schema?

| IP         | Page  | Last Visit TS     |
| ---------- | ----- | ----------------- |
| 10.0.0.154 | page1 | 06/1/24 - 10:30AM |

OK, so I will index on (IP, Page), and for each request,
check the `Last Visit TS`. If the value is non null and is at least 12 hours
in the past, I will update the unique visits counter.

One thing is that it would be nice if the request happened async for the client.
