// ============================================
// OMAR ALFAWZAN — SITE DATA
// Updated to first-person storytelling
// ============================================

const siteData = {

  // ── BIOGRAPHY TIMELINE ──────────────────
  timeline: [
    {
      year: "2014 — King Saud University",
      title: "Where It All Began",
      body: "I chose Computer Information Systems at KSU with a broad curiosity about technology. The major opened doors across many areas and it was during those early years that the idea of cloud computing started to spark.",
      big: false
    },
    {
      year: "May 2017 — Al Tayyar Travel Group",
      title: "First Steps in Networking",
      body: "A short but foundational internship for me configuring switches and routers, and securing networks via VLANs and firewalls. It was my first real taste of hands-on infrastructure.",
      big: false
    },
    {
      year: "Jul 2017 — Dell EMC Co-op",
      title: "A Cloud Clicks Into Place",
      body: "The co-op at Dell EMC changed everything for me. Working with enterprise storage systems—VMAX, Unity, VNX and cloud infrastructure opened a whole new world.",
      big: false
    },
    {
      year: "2017–2018 — KSU Graduation Project",
      title: "Building Real Things",
      body: "While still a student, I co-developed a <strong>Real Estate iOS app</strong> as my graduation project applying four years of knowledge to solve a real problem for property seekers in Saudi Arabia. It was my first taste of building something from scratch that people could actually use.",
      big: false
    },
    {
      year: "Jul 2018 — IBM",
      title: "The IBM Chapter: Workshops, Containers & Watson",
      body: "Straight out of university, I landed a Developer Advocate role at IBM a graduate program. Over the next year, I delivered <strong>35+ workshops</strong> for the IBM Cloud community, set up a private cloud with RHEL 7, Docker, and Kubernetes, and built chatbots with Watson Assistant and Node.js. This was the year everything accelerated for me.",
      big: true
    },
    {
      year: "2019 — ElHaq",
      title: "The Entrepreneurial Itch",
      body: "The IBM energy spilled outside work for me. I co-built <strong>ElHaq</strong> an iOS app to track cinema ticket releases the moment Saudi Arabia opened its cinemas.",
      big: false
    },
    {
      year: "Aug 2019 — solutions by stc",
      title: "Into the Business Side of Cloud",
      body: "I joined solutions by stc as a <strong>Business Development Specialist</strong> developing competitive analysis for digital products, managing cloud service partners in the stc marketplace, and arranging meetups and webinars for cloud and IoT portfolios.",
      big: false
    },
    {
      year: "Aug 2020 — thecoffeestores.com",
      title: "A Side Project for Coffee Lovers",
      body: "I built and launched <strong>thecoffeestores.com</strong> a website for anyone who wanted to discover coffee shops and specialty beans. It became a directory for the Saudi coffee community, connecting curious buyers with the right stores and roasters. This was a passion project that combined my love for building products with my love for good coffee.",
      big: false
    },
    {
      year: "Sep 2021 — solutions by stc",
      title: "From Business Development to Product Manager",
      body: "I was promoted to <strong>Product Manager</strong> developing a new DRaaS product on top of stc cloud, managing VDC, Co-Location, and FWaaS portfolios, and driving product enhancements through sales engagement.",
      big: false
    },
    {
      year: "Mar 2023 — Mobily",
      title: "Leading Cloud Products at Scale",
      body: "I joined Mobily as <strong>DC & Cloud Solutions Principal</strong> managing the full cloud product portfolio including Public Cloud, DRaaS, and Co-location. I developed the Cloud Partnership Program and Cloud Life Cycle Process, while driving competitive improvements and sales effectiveness.",
      big: false
    },
    {
      year: "Sep 2024 — SITE",
      title: "Where Business Meets Technical",
      body: "Years of being a PM taught me the business side of cloud but I felt something was missing. I kept finding myself in pre-sales meetings, helping the team convince customers, and realizing I wanted to be closer to that world. SITE was the opportunity I needed. For the first time, I owned both ends—shaping the solution before the deal and delivering it after. The technical depth I'd been building for years finally had room to breathe. I led the migration of <strong>15,000 email users and 400+ virtual machines</strong> to the cloud, and I've started running proof of concepts for <strong>LLMs, RAG, and agentic AI</strong> turning what customers heard about into something they could actually see and touch.",
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
      description: "When Saudi Arabia opened its cinemas in 2019, getting a good seat was nearly impossible. Tickets would sell out within minutes of release and there was no easy way to track them. <strong>I built ElHaq to solve that.</strong> The app monitored ticket distribution websites and alerted users the moment tickets dropped so you never had to refresh a page again. I built the iOS app while the backend ran on IBM Cloud.",
      learned: "Building a product under real demand pressure watching users actually need something I built is a different kind of motivation. It taught me how to ship fast, keep backend infrastructure lean on cloud, and the satisfaction of solving a problem that genuinely annoyed people (including myself).",
      link: null,
      linkLabel: null
    },
    {
      emoji: "☕",
      bannerClass: "banner-coffee",
      tags: ["Web App", "Directory"],
      year: "2020",
      name: "The Coffee Stores",
      description: "I built and launched <strong>thecoffeestores.com</strong> a website for anyone who wanted to discover coffee shops and specialty beans in Saudi Arabia. It’s a go-to directory for the local coffee community, helping curious buyers find the right stores, roasters, and beans without the guesswork.",
      learned: "This project taught me how to take an idea from zero to a live product solo from building the site to thinking about how people actually discover and use it. It also reinforced how much a niche, passionate community appreciates a product built specifically for them.",
    },
    {
      emoji: "🎙️",
      bannerClass: "banner-podcast",
      tags: ["Podcast", "Entrepreneurship"],
      year: "Paused",
      name: "شلون تبدأ؟ — How Do You Start?",
      description: "I launched this Arabic podcast to focus on <strong>entrepreneurship and the first steps of building something</strong>. The name says it all How do you start? because that's always the hardest part. I explored the stories of people who took the leap, built companies, and figured things out along the way. It's currently paused, but the conversations were real.",
      learned: "Hosting a podcast taught me how to ask better questions, really listen, and distill complex journeys into honest conversations. It also made me appreciate how much courage it takes to start and that there's no single right way to do it.",
      link: "https://creators.spotify.com/pod/profile/chlontbda/",
      linkLabel: "🎧 Listen on Spotify ↗"
    },
    {
      emoji: "🏠",
      bannerClass: "banner-restate",
      tags: ["iOS App", "Graduation Project"],
      year: "2017–2018",
      name: "Real Estate iOS App",
      description: "I built this as a graduation project at King Saud University to tackle the frustrating experience of <strong>searching for properties in Saudi Arabia</strong>. Customers had too many friction points lack of information, poor listings, and no easy way to browse or filter. The app brought it all together in a clean mobile experience.",
      learned: "This was my first full product from idea to shipped app. It taught me the full development cycle, the gap between what you design in theory and what users actually need, and how to collaborate under deadlines. It also planted the seed for me to think about products, not just code.",
      link: null,
      linkLabel: null
    }
  ]
};