// ============================================
// OMAR ALFAWZAN — SITE DATA
// Updated to first-person storytelling
// ============================================

const siteData = {

  // ── BIOGRAPHY TIMELINE ──────────────────
  timeline: [
    {
      year: "2014 — King Saud University",
      title: "Where Curiosity Turned Into Direction",
      body: "I entered King Saud University to study Computer Information Systems with a broad interest in technology, but it didn’t take long for cloud and infrastructure to stand out. Those years gave me more than technical foundations they shaped the way I think about systems, business needs, and how technology can solve real problems.",
      big: false
    },
    {
      year: "May 2017 — Al Tayyar Travel Group",
      title: "First Exposure to Real Infrastructure",
      body: "My internship at Al Tayyar gave me my first practical experience with enterprise networking. I worked on configuring switches and routers and learned the basics of network segmentation and security through VLANs and firewalls. It was a short experience, but it gave me an early appreciation for how critical strong infrastructure is behind every service.",
      big: false
    },
    {
      year: "Jul 2017 — Dell EMC Co-op",
      title: "The Moment Cloud Became Serious for Me",
      body: "My co-op at Dell EMC was a turning point. Working around enterprise storage platforms like VMAX, Unity, and VNX exposed me to the scale, architecture, and complexity of real cloud infrastructure. It was the first time I saw how the underlying layers of storage, compute, and design come together to power enterprise environments.",
      big: false
    },
    {
      year: "2017–2018 — KSU Graduation Project",
      title: "Building Something People Could Actually Use",
      body: "For my graduation project, I co-developed a <strong>Real Estate iOS app</strong> designed to improve the property search experience in Saudi Arabia. It was my first real end-to-end product experience taking an idea, shaping the user journey, and building something intended for real people rather than just academic evaluation.",
      big: false
    },
    {
      year: "Jul 2018 — IBM",
      title: "Acceleration Through Advocacy, Platforms & Cloud",
      body: "Joining IBM as a Developer Advocate gave me momentum early in my career. I delivered <strong>35+ workshops</strong> to the IBM Cloud community, worked with private cloud environments using RHEL, Docker, and Kubernetes, and built chatbot solutions with Watson Assistant and Node.js. It was a fast, demanding chapter that sharpened both my communication skills and my technical confidence.",
      big: false
    },
    {
      year: "2019 — ElHaq",
      title: "Building Around a Real Market Moment",
      body: "When cinemas reopened in Saudi Arabia, I co-built <strong>ElHaq</strong> to help users track ticket releases the moment they became available. It was a timely product built around a real user frustration. That experience deepened my understanding of speed, relevance, and how satisfying it is to build something that solves a problem people genuinely feel.",
      big: false
    },
    {
      year: "Aug 2019 — solutions by stc",
      title: "Moving Into the Commercial Side of Cloud",
      body: "At solutions by stc, I stepped into business development and began working closer to cloud portfolios, partner ecosystems, and digital product strategy. I contributed to competitive analysis, managed relationships across the cloud marketplace, and supported portfolio growth through events, partnerships, and market-facing activities.",
      big: false
    },
    {
      year: "Aug 2020 — thecoffeestores.com",
      title: "A Side Project Shaped by Community Thinking",
      body: "I launched <strong>thecoffeestores.com</strong> as a directory for coffee shops, specialty beans, and roasters in Saudi Arabia. It combined product building with community understanding identifying a niche audience, solving a discovery problem, and creating a platform around genuine interest rather than corporate requirements.",
      big: false
    },
    {
      year: "Sep 2021 — solutions by stc",
      title: "From Product Support to Product Ownership",
      body: "I was promoted to <strong>Product Manager</strong>, where I took ownership of cloud-related portfolios including DRaaS, VDC, Co-location, and FWaaS. This chapter taught me how to think beyond features into lifecycle, value proposition, sales enablement, and how products evolve based on both market pressure and customer demand.",
      big: false
    },
    {
      year: "Mar 2023 — Mobily",
      title: "Expanding Into Portfolio Leadership",
      body: "At Mobily, I took on a broader role as <strong>DC & Cloud Solutions Principal</strong>, leading the cloud product portfolio across areas such as Public Cloud, DRaaS, and Co-location. I worked on partnership models, lifecycle processes, and portfolio development with a stronger focus on scale, structure, and business impact.",
      big: false
    },
    {
      year: "Sep 2024 — SITE",
      title: "Where Business, Delivery & Technical Depth Converged",
      body: "Joining SITE felt like the point where the different parts of my career finally came together. Product management had given me strong business grounding, but I wanted to be closer to technical shaping, customer conversations, and real delivery ownership. At SITE, I found that space. For the first time, I was able to connect both sides helping define the solution before the deal and leading the technical path after it. I’ve supported major cloud migrations, including the movement of <strong>15,000 email users and 400+ virtual machines</strong>, while also driving proof of concepts around <strong>LLMs, RAG, and agentic AI</strong>. This role reflects how I work best: close to customers, close to delivery, and close to the technology itself.",
      big: true
    }
   ],

  // ── PROJECTS ────────────────────────────
  projects: [
    {
      emoji: "🎟️",
      bannerClass: "banner-elhaq",
      tags: ["iOS App", "IBM Cloud"],
      year: "2019",
      name: "ElHaq — تطبيق الحق",
      description: "When Saudi Arabia opened its cinemas in 2019, getting a good seat was nearly impossible. Tickets would sell out within minutes, and there was no simple way to track when new seats were released. <strong>I built ElHaq to solve that.</strong> The app monitored ticketing websites and alerted users the moment tickets dropped, so they no longer had to keep refreshing pages manually. I built the iOS experience while the backend ran on IBM Cloud.",
      learned: "This project taught me what it feels like to build under real demand pressure. It pushed me to move fast, keep the backend lean, and focus on solving a problem people genuinely cared about. More than anything, it showed me how rewarding it is when something you build becomes immediately useful.",
      link: null,
      linkLabel: null
    },
    {
      emoji: "☕",
      bannerClass: "banner-coffee",
      tags: ["Web App", "Directory"],
      year: "2020",
      name: "The Coffee Stores",
      description: "I built and launched <strong>thecoffeestores.com</strong> as a discovery platform for coffee shops, specialty beans, and roasters in Saudi Arabia. The goal was simple: make it easier for people to find the right places, products, and brands without the usual guesswork. It was a focused product built for a niche but passionate community.",
      learned: "This project taught me how to take an idea from zero to a live product on my own from building the site to thinking through how users would actually discover and use it. It also reinforced something important: when you build for a real community with clear needs, even a simple product can create strong value.",
      link: null,
      linkLabel: null
    },
    {
      emoji: "🎙️",
      bannerClass: "banner-podcast",
      tags: ["Podcast", "Entrepreneurship"],
      year: "Paused",
      name: "شلون تبدأ؟ — How Do You Start?",
      description: "I launched this Arabic podcast around <strong>entrepreneurship and the difficult first step of building something</strong>. The name captured the core question I wanted to explore: how do people actually begin? Through the podcast, I spoke about early-stage ideas, founder journeys, and the uncertainty that comes with starting. It is currently paused, but the conversations were honest and meaningful.",
      learned: "Hosting a podcast taught me how to ask better questions, listen more carefully, and turn complex personal journeys into clear, relatable conversations. It also reminded me that starting is rarely neat or linear and that there is real value in documenting the messy part of growth.",
      link: "https://creators.spotify.com/pod/profile/chlontbda/",
      linkLabel: "🎧 Listen on Spotify ↗"
    },
    {
      emoji: "🏠",
      bannerClass: "banner-restate",
      tags: ["iOS App", "Graduation Project"],
      year: "2017–2018",
      name: "Real Estate iOS App",
      description: "I built this as my graduation project at King Saud University to improve the experience of <strong>searching for properties in Saudi Arabia</strong>. At the time, the user journey was full of friction limited information, poor listing quality, and weak browsing and filtering options. The app aimed to bring those pieces together into a cleaner, more practical mobile experience.",
      learned: "This was my first real product journey from concept to working app. It taught me the full development cycle, the difference between what looks good in theory and what users actually need, and how to build collaboratively under deadlines. It also planted the seed for how I think about products today not just as software, but as experiences designed around real problems.",
      link: null,
      linkLabel: null
    }
  ]
};
