#!/usr/bin/env python3
"""Generate the Arabic (RTL) pages under /ar/ from the English pages.

Run after editing an English page:  python scripts/build_arabic.py

Every English string listed here must exist in its source page; if one is
missing the build stops, so a changed English page is never half-translated.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

MONTHS = {
    "Jan": "يناير", "Feb": "فبراير", "Mar": "مارس", "Apr": "أبريل", "May": "مايو", "Jun": "يونيو",
    "Jul": "يوليو", "Aug": "أغسطس", "Sep": "سبتمبر", "Oct": "أكتوبر", "Nov": "نوفمبر", "Dec": "ديسمبر",
}

# ---------------------------------------------------------------- shared
COMMON = [
    ('<a class="skip-link" href="#main-content">Skip to Content</a>',
     '<a class="skip-link" href="#main-content">تخطَّ إلى المحتوى</a>'),
    ('aria-label="Primary navigation"', 'aria-label="التنقل الرئيسي"'),
    ('<div class="nav-name">Omar Alfawzan</div>', '<div class="nav-name">عمر الفوزان</div>'),
    ('aria-label="Toggle color theme"', 'aria-label="تبديل المظهر"'),
    ('© 2026 Omar Alfawzan · oalfawzan.sa · <a href="/privacy/">Privacy</a>',
     '© 2026 عمر الفوزان · oalfawzan.sa · <a href="/privacy/" hreflang="en">الخصوصية (بالإنجليزية)</a>'),
    ('<meta property="og:locale" content="en_US">',
     '<meta property="og:locale" content="ar_SA">\n    <meta property="og:locale:alternate" content="en_US">'),
    ('<meta property="og:site_name" content="Omar Alfawzan">', '<meta property="og:site_name" content="عمر الفوزان">'),
]

# Menu labels: each page has exactly one active tab, so these are applied
# where present and then checked for leftovers.
NAV = [
    ('aria-current="page">Home</a>', 'aria-current="page">الرئيسية</a>'),
    ('class="btn-sm">Home</a>', 'class="btn-sm">الرئيسية</a>'),
    ('aria-current="page">Experience</a>', 'aria-current="page">الخبرات</a>'),
    ('class="btn-sm">Experience</a>', 'class="btn-sm">الخبرات</a>'),
    ('aria-current="page">Blog</a>', 'aria-current="page">المدونة</a>'),
    ('class="btn-sm">Blog</a>', 'class="btn-sm">المدونة</a>'),
    ('aria-current="page">Social</a>', 'aria-current="page">الصور</a>'),
    ('class="btn-sm">Social</a>', 'class="btn-sm">الصور</a>'),
]
NAV_LEFTOVER = re.compile(r'class="btn-sm[^"]*"[^>]*>(Home|Experience|Blog|Social)</a>')

# ---------------------------------------------------------------- home
HOME = [
    ("<title>Omar Alfawzan | Cloud Technical Lead, Pre-Sales & Delivery</title>",
     "<title>عمر الفوزان | Cloud Technical Lead، ما قبل البيع والتنفيذ</title>"),
    ('content="Omar Alfawzan | Cloud Technical Lead, Pre-Sales & Delivery"',
     'content="عمر الفوزان | Cloud Technical Lead، ما قبل البيع والتنفيذ"'),
    ('content="Omar Alfawzan is a Cloud Technical Lead in Riyadh, Saudi Arabia, with 8+ years in cloud transformation, pre-sales, solution architecture and service delivery."',
     'content="عمر الفوزان، Cloud Technical Lead في الرياض، بخبرة تزيد على 8 سنوات في التحول السحابي وما قبل البيع وتصميم الحلول وتقديم الخدمات."'),
    ('content="Omar Alfawzan, Cloud Technical Lead"', 'content="عمر الفوزان، Cloud Technical Lead"'),
    ('alt="Omar Alfawzan" width="120"', 'alt="عمر الفوزان" width="120"'),
    ("<h1>Omar <em>Alfawzan</em></h1>", "<h1>عمر <em>الفوزان</em></h1>"),
    ('<p class="hero-role">Cloud Technical Lead<span class="hero-role-sep"> | </span><span class="hero-role-rest">Pre-Sales, Architecture &amp; Delivery</span></p>',
     '<p class="hero-role">Cloud Technical Lead<span class="hero-role-sep"> | </span><span class="hero-role-rest">ما قبل البيع، تصميم الحلول والتنفيذ</span></p>'),
    ('<p class="hero-sub">8+ years helping organisations in Saudi Arabia shape, win, and deliver their move to the cloud, from the first workshop to production.</p>',
     '<p class="hero-sub">أكثر من 8 سنوات أساعد الجهات في السعودية على رسم انتقالها إلى السحابة والفوز بمشاريعها وتنفيذها، من أول ورشة عمل حتى التشغيل الفعلي.</p>'),
    ('class="cta-primary">Get in touch</a>', 'class="cta-primary">تواصل معي</a>'),
    ('class="cta-secondary">View experience</a>', 'class="cta-secondary">استعرض الخبرات</a>'),
    ('id="worked-title">Worked with</h2>', 'id="worked-title">عملت مع</h2>'),
    ('aria-label="SITE experience"', 'aria-label="خبرتي في SITE"'),
    ('aria-label="Mobily experience"', 'aria-label="خبرتي في موبايلي"'),
    ('aria-label="solutions by stc experience"', 'aria-label="خبرتي في solutions by stc"'),
    ('aria-label="IBM experience"', 'aria-label="خبرتي في IBM"'),
    ('id="summary-title">Summary</h2>', 'id="summary-title">نبذة</h2>'),
    ("Cloud Technical Lead with 8+ years of experience helping customers move to the cloud and get the most value from it. I work across pre-sales, solution design, delivery, and cloud product management, from writing proposals and running workshops to executing migrations and managing cloud products and services.",
     "أعمل Cloud Technical Lead بخبرة تزيد على 8 سنوات في مساعدة العملاء على الانتقال إلى السحابة وتحقيق أقصى قيمة منها. أعمل في ما قبل البيع وتصميم الحلول والتنفيذ وإدارة المنتجات السحابية، بدءًا من كتابة العروض وإدارة ورش العمل وصولًا إلى تنفيذ عمليات الترحيل وإدارة المنتجات والخدمات السحابية."),
    ("My experience covers cloud architecture, adoption, governance, security, and cross-functional collaboration across infrastructure, applications, databases, networking, security, and operations teams. I focus on aligning cloud solutions with business requirements while ensuring scalability, security, operational efficiency, and long-term value.",
     "تشمل خبرتي معمارية السحابة وتبنّيها وحوكمتها وأمنها، والعمل المشترك مع فرق البنية التحتية والتطبيقات وقواعد البيانات والشبكات والأمن والعمليات. أركّز على مواءمة الحلول السحابية مع متطلبات الأعمال، مع ضمان قابلية التوسع والأمان والكفاءة التشغيلية والقيمة على المدى الطويل."),
    ("I also have hands-on experience with containers, AI, automation, and cloud infrastructure, along with strong knowledge of CCoE principles, cloud governance frameworks, operating models, standards, and enterprise cloud adoption.",
     "ولدي خبرة عملية في الحاويات والذكاء الاصطناعي والأتمتة والبنية التحتية السحابية، إلى جانب معرفة عميقة بمبادئ مركز التميز السحابي (CCoE) وأطر الحوكمة السحابية ونماذج التشغيل والمعايير وتبنّي السحابة على مستوى المؤسسات."),
    ('id="biography-title">Biography</h2>', 'id="biography-title">السيرة</h2>'),
    # timeline
    ("2014 · King Saud University", "2014 · جامعة الملك سعود"),
    ("Where Curiosity Turned Into Direction", "حين تحوّل الفضول إلى اتجاه"),
    ("I entered King Saud University to study Computer Information Systems with a broad interest in technology, but it didn’t take long for cloud and infrastructure to stand out. Those years gave me more than technical foundations they shaped the way I think about systems, business needs, and how technology can solve real problems.",
     "التحقت بجامعة الملك سعود لدراسة نظم المعلومات الحاسوبية باهتمام واسع بالتقنية، ولم يمضِ وقت طويل حتى برزت أمامي الحوسبة السحابية والبنية التحتية. منحتني تلك السنوات أكثر من أساس تقني، فقد شكّلت طريقة تفكيري في الأنظمة واحتياجات الأعمال، وكيف يمكن للتقنية أن تحل مشكلات حقيقية."),
    ("May 2017 · Al Tayyar Travel Group", "مايو 2017 · مجموعة الطيار للسفر"),
    ("First Exposure to Real Infrastructure", "أول احتكاك حقيقي بالبنية التحتية"),
    ("My internship at Al Tayyar gave me my first practical experience with enterprise networking. I worked on configuring switches and routers and learned the basics of network segmentation and security through VLANs and firewalls. It was a short experience, but it gave me an early appreciation for how critical strong infrastructure is behind every service.",
     "منحني تدريبي في مجموعة الطيار أول تجربة عملية مع شبكات المؤسسات. عملت على إعداد المحولات والموجّهات، وتعلمت أساسيات تقسيم الشبكات وتأمينها عبر الشبكات الافتراضية (VLANs) والجدران النارية. كانت تجربة قصيرة، لكنها أعطتني مبكرًا تقديرًا لأهمية البنية التحتية القوية خلف كل خدمة."),
    ("Jul 2017 · Dell EMC Co-op", "يوليو 2017 · تدريب تعاوني في Dell EMC"),
    ("The Moment Cloud Became Serious for Me", "اللحظة التي أصبحت فيها السحابة أمرًا جادًا"),
    ("My co-op at Dell EMC was a turning point. Working around enterprise storage platforms like VMAX, Unity, and VNX exposed me to the scale, architecture, and complexity of real cloud infrastructure. It was the first time I saw how the underlying layers of storage, compute, and design come together to power enterprise environments.",
     "كان تدريبي التعاوني في Dell EMC نقطة تحوّل. العمل حول منصات التخزين المؤسسية مثل VMAX وUnity وVNX عرّفني على حجم البنية التحتية السحابية الحقيقية ومعماريتها وتعقيدها. كانت أول مرة أرى فيها كيف تجتمع طبقات التخزين والحوسبة والتصميم لتشغيل بيئات المؤسسات."),
    ("2017-2018 · KSU Graduation Project", "2017-2018 · مشروع التخرج في جامعة الملك سعود"),
    ("Building Something People Could Actually Use", "بناء شيء يستخدمه الناس فعلًا"),
    ("For my graduation project, I co-developed a <strong>Real Estate iOS app</strong> designed to improve the property search experience in Saudi Arabia. It was my first real end-to-end product experience taking an idea, shaping the user journey, and building something intended for real people rather than just academic evaluation.",
     "في مشروع تخرجي شاركت في تطوير <strong>تطبيق iOS للعقارات</strong> يهدف إلى تحسين تجربة البحث عن العقارات في السعودية. كانت أول تجربة منتج متكاملة لي: أخذ فكرة، ورسم رحلة المستخدم، وبناء شيء موجّه لأشخاص حقيقيين وليس للتقييم الأكاديمي فقط."),
    ("Jul 2018 · IBM", "يوليو 2018 · IBM"),
    ("Acceleration Through Advocacy, Platforms & Cloud", "انطلاقة عبر التوعية التقنية والمنصات والسحابة"),
    ("Joining IBM as a Developer Advocate gave me momentum early in my career. I delivered <strong>35+ workshops</strong> to the IBM Cloud community, worked with private cloud environments using RHEL, Docker, and Kubernetes, and built chatbot solutions with Watson Assistant and Node.js. It was a fast, demanding chapter that sharpened both my communication skills and my technical confidence.",
     "منحني انضمامي إلى IBM بصفة Developer Advocate دفعة قوية في بداية مسيرتي. قدّمت <strong>أكثر من 35 ورشة عمل</strong> لمجتمع IBM Cloud، وعملت على بيئات سحابية خاصة باستخدام RHEL وDocker وKubernetes، وبنيت حلول محادثة آلية باستخدام Watson Assistant وNode.js. كانت مرحلة سريعة ومليئة بالتحديات، صقلت مهاراتي في التواصل وثقتي التقنية."),
    ("2019 · ElHaq", "2019 · تطبيق الحق"),
    ("Building Around a Real Market Moment", "بناء منتج حول لحظة حقيقية في السوق"),
    ("When cinemas reopened in Saudi Arabia, I co-built <strong>ElHaq</strong> to help users track ticket releases the moment they became available. It was a timely product built around a real user frustration. That experience deepened my understanding of speed, relevance, and how satisfying it is to build something that solves a problem people genuinely feel.",
     "عندما عادت دور السينما في السعودية، شاركت في بناء <strong>تطبيق الحق</strong> لمساعدة المستخدمين على متابعة طرح التذاكر لحظة توفرها. كان منتجًا في توقيته الصحيح، مبنيًا حول إحباط حقيقي يعيشه المستخدمون. عمّقت التجربة فهمي لأهمية السرعة والملاءمة، ولمتعة بناء شيء يحل مشكلة يشعر بها الناس فعلًا."),
    ("Aug 2019 · solutions by stc", "أغسطس 2019 · solutions by stc"),
    ("Moving Into the Commercial Side of Cloud", "الانتقال إلى الجانب التجاري من السحابة"),
    ("At solutions by stc, I stepped into business development and began working closer to cloud portfolios, partner ecosystems, and digital product strategy. I contributed to competitive analysis, managed relationships across the cloud marketplace, and supported portfolio growth through events, partnerships, and market-facing activities.",
     "في solutions by stc انتقلت إلى تطوير الأعمال، وبدأت العمل عن قرب مع المحافظ السحابية ومنظومات الشركاء واستراتيجية المنتجات الرقمية. ساهمت في تحليل المنافسين، وأدرت العلاقات في السوق السحابي، ودعمت نمو المحفظة من خلال الفعاليات والشراكات والأنشطة الموجهة للسوق."),
    ("Aug 2020 · thecoffeestores.com", "أغسطس 2020 · thecoffeestores.com"),
    ("A Side Project Shaped by Community Thinking", "مشروع جانبي بروح المجتمع"),
    ("I launched <strong>thecoffeestores.com</strong> as a directory for coffee shops, specialty beans, and roasters in Saudi Arabia. It combined product building with community understanding identifying a niche audience, solving a discovery problem, and creating a platform around genuine interest rather than corporate requirements.",
     "أطلقت <strong>thecoffeestores.com</strong> دليلًا للمقاهي والبن المختص والمحامص في السعودية. جمع المشروع بين بناء المنتج وفهم المجتمع: تحديد جمهور متخصص، وحل مشكلة الاكتشاف، وبناء منصة قائمة على شغف حقيقي لا على متطلبات مؤسسية."),
    ("Sep 2021 · solutions by stc", "سبتمبر 2021 · solutions by stc"),
    ("From Product Support to Product Ownership", "من دعم المنتج إلى امتلاكه"),
    ("I was promoted to <strong>Product Manager</strong>, where I took ownership of cloud-related portfolios including DRaaS, VDC, Co-location, and FWaaS. This chapter taught me how to think beyond features into lifecycle, value proposition, sales enablement, and how products evolve based on both market pressure and customer demand.",
     "تمت ترقيتي إلى <strong>Product Manager</strong>، وتوليت مسؤولية محافظ سحابية تشمل DRaaS وVDC والاستضافة المشتركة (Co-location) وFWaaS. علّمتني هذه المرحلة التفكير فيما وراء الخصائص: دورة حياة المنتج، والقيمة المقدّمة، وتمكين المبيعات، وكيف تتطور المنتجات تحت ضغط السوق وطلب العملاء."),
    ("Mar 2023 · Mobily", "مارس 2023 · موبايلي"),
    ("Expanding Into Portfolio Leadership", "التوسع نحو قيادة المحفظة"),
    ("At Mobily, I took on a broader role as <strong>DC & Cloud Solutions Principal</strong>, leading the cloud product portfolio across areas such as Public Cloud, DRaaS, and Co-location. I worked on partnership models, lifecycle processes, and portfolio development with a stronger focus on scale, structure, and business impact.",
     "في موبايلي توليت دورًا أوسع بصفة <strong>DC &amp; Cloud Solutions Principal</strong>، وقدت محفظة المنتجات السحابية في مجالات مثل السحابة العامة وDRaaS والاستضافة المشتركة. عملت على نماذج الشراكة وعمليات دورة الحياة وتطوير المحفظة، بتركيز أكبر على التوسع والتنظيم والأثر على الأعمال."),
    ("Sep 2024 · SITE", "سبتمبر 2024 · SITE"),
    ("Where Business, Delivery & Technical Depth Converged", "حيث التقت الأعمال والتنفيذ والعمق التقني"),
    ("Joining SITE felt like the point where the different parts of my career finally came together. Product management had given me strong business grounding, but I wanted to be closer to technical shaping, customer conversations, and real delivery ownership. At SITE, I found that space. For the first time, I was able to connect both sides helping define the solution before the deal and leading the technical path after it. I’ve supported major cloud migrations, including the movement of <strong>15,000 email users and 400+ virtual machines</strong>, while also driving proof of concepts around <strong>LLMs, RAG, and agentic AI</strong>. This role reflects how I work best: close to customers, close to delivery, and close to the technology itself.",
     "شعرت عند انضمامي إلى SITE أن الجوانب المختلفة من مسيرتي اجتمعت أخيرًا. منحتني إدارة المنتجات أساسًا قويًا في الأعمال، لكنني أردت أن أكون أقرب إلى التشكيل التقني والحوار مع العملاء وامتلاك التنفيذ الفعلي، ووجدت هذه المساحة في SITE. ولأول مرة أصبحت أربط الجانبين: أساعد في تعريف الحل قبل الصفقة، وأقود المسار التقني بعدها. دعمت عمليات ترحيل سحابية كبرى، منها نقل <strong>15,000 مستخدم للبريد الإلكتروني وأكثر من 400 خادم افتراضي</strong>، إلى جانب قيادة نماذج إثبات مفهوم في <strong>النماذج اللغوية الكبيرة (LLMs) وRAG والذكاء الاصطناعي الوكيلي</strong>. يعكس هذا الدور الطريقة التي أعمل بها في أفضل حالاتي: قريبًا من العملاء، وقريبًا من التنفيذ، وقريبًا من التقنية نفسها."),
    # projects
    ('id="projects-title">Personal Projects</h2>', 'id="projects-title">مشاريع شخصية</h2>'),
    ('<span class="ptag">iOS App</span>', '<span class="ptag">تطبيق iOS</span>'),
    ('<span class="ptag">Web App</span>', '<span class="ptag">تطبيق ويب</span>'),
    ('<span class="ptag">Directory</span>', '<span class="ptag">دليل</span>'),
    ('<span class="ptag">Podcast</span>', '<span class="ptag">بودكاست</span>'),
    ('<span class="ptag">Entrepreneurship</span>', '<span class="ptag">ريادة أعمال</span>'),
    ('<span class="ptag year">Paused</span>', '<span class="ptag year">متوقف حاليًا</span>'),
    ('<span class="ptag">Graduation Project</span>', '<span class="ptag">مشروع تخرج</span>'),
    ("<span>What I Learned</span>", "<span>ما تعلّمته</span>"),
    ('<h3 class="project-name">ElHaq (تطبيق الحق)</h3>', '<h3 class="project-name">تطبيق الحق (ElHaq)</h3>'),
    ('<h3 class="project-name">The Coffee Stores</h3>', '<h3 class="project-name">متاجر القهوة (The Coffee Stores)</h3>'),
    ('<h3 class="project-name">شلون تبدأ؟ (How Do You Start?)</h3>', '<h3 class="project-name">بودكاست شلون تبدأ؟</h3>'),
    ('<h3 class="project-name">Real Estate iOS App</h3>', '<h3 class="project-name">تطبيق العقارات على iOS</h3>'),
    ("When Saudi Arabia opened its cinemas in 2019, getting a good seat was nearly impossible. Tickets would sell out within minutes, and there was no simple way to track when new seats were released. <strong>I built ElHaq to solve that.</strong> The app monitored ticketing websites and alerted users the moment tickets dropped, so they no longer had to keep refreshing pages manually. I built the iOS experience while the backend ran on IBM Cloud.",
     "عندما افتتحت السعودية دور السينما في 2019، كان الحصول على مقعد جيد شبه مستحيل. كانت التذاكر تنفد خلال دقائق، ولم تكن هناك طريقة سهلة لمعرفة وقت طرح مقاعد جديدة. <strong>بنيت تطبيق الحق لحل هذه المشكلة.</strong> كان التطبيق يراقب مواقع بيع التذاكر وينبّه المستخدمين لحظة طرحها، فلم يعودوا بحاجة إلى تحديث الصفحات يدويًا. بنيت تجربة iOS بينما عمل الخادم على IBM Cloud."),
    ("This project taught me what it feels like to build under real demand pressure. It pushed me to move fast, keep the backend lean, and focus on solving a problem people genuinely cared about. More than anything, it showed me how rewarding it is when something you build becomes immediately useful.",
     "علّمني هذا المشروع شعور البناء تحت ضغط طلب حقيقي. دفعني إلى التحرك بسرعة، وإبقاء الخادم بسيطًا، والتركيز على حل مشكلة يهتم بها الناس فعلًا. والأهم أنه أراني كم هو مجزٍ أن يصبح ما تبنيه مفيدًا من اللحظة الأولى."),
    ("I built and launched <strong>thecoffeestores.com</strong> as a discovery platform for coffee shops, specialty beans, and roasters in Saudi Arabia. The goal was simple: make it easier for people to find the right places, products, and brands without the usual guesswork. It was a focused product built for a niche but passionate community.",
     "بنيت وأطلقت <strong>thecoffeestores.com</strong> منصةً لاكتشاف المقاهي والبن المختص والمحامص في السعودية. كان الهدف بسيطًا: تسهيل وصول الناس إلى الأماكن والمنتجات والعلامات المناسبة دون تخمين. كان منتجًا مركّزًا لمجتمع متخصص لكنه شغوف."),
    ("This project taught me how to take an idea from zero to a live product on my own from building the site to thinking through how users would actually discover and use it. It also reinforced something important: when you build for a real community with clear needs, even a simple product can create strong value.",
     "علّمني هذا المشروع كيف آخذ فكرة من الصفر إلى منتج حي بمفردي، من بناء الموقع إلى التفكير في كيف سيكتشفه المستخدمون ويستخدمونه فعلًا. وأكّد لي أمرًا مهمًا: عندما تبني لمجتمع حقيقي باحتياجات واضحة، يمكن حتى لمنتج بسيط أن يصنع قيمة كبيرة."),
    ("I launched this Arabic podcast around <strong>entrepreneurship and the difficult first step of building something</strong>. The name captured the core question I wanted to explore: how do people actually begin? Through the podcast, I spoke about early-stage ideas, founder journeys, and the uncertainty that comes with starting. It is currently paused, but the conversations were honest and meaningful.",
     "أطلقت هذا البودكاست العربي حول <strong>ريادة الأعمال والخطوة الأولى الصعبة في بناء أي شيء</strong>. عبّر الاسم عن السؤال الذي أردت استكشافه: كيف يبدأ الناس فعلًا؟ تحدثت فيه عن الأفكار في مراحلها الأولى، ورحلات المؤسسين، وعدم اليقين المصاحب للبدايات. البودكاست متوقف حاليًا، لكن الحوارات كانت صادقة وذات معنى."),
    ("Hosting a podcast taught me how to ask better questions, listen more carefully, and turn complex personal journeys into clear, relatable conversations. It also reminded me that starting is rarely neat or linear and that there is real value in documenting the messy part of growth.",
     "علّمني تقديم البودكاست كيف أطرح أسئلة أفضل، وأستمع بانتباه أكبر، وأحوّل الرحلات الشخصية المعقدة إلى حوارات واضحة وقريبة من الناس. وذكّرني بأن البدايات نادرًا ما تكون مرتبة أو مستقيمة، وأن لتوثيق الجانب الفوضوي من النمو قيمة حقيقية."),
    ('class="project-link">Listen on Spotify</a>', 'class="project-link">استمع على Spotify</a>'),
    ("I built this as my graduation project at King Saud University to improve the experience of <strong>searching for properties in Saudi Arabia</strong>. At the time, the user journey was full of friction limited information, poor listing quality, and weak browsing and filtering options. The app aimed to bring those pieces together into a cleaner, more practical mobile experience.",
     "بنيت هذا التطبيق مشروعَ تخرج في جامعة الملك سعود لتحسين تجربة <strong>البحث عن العقارات في السعودية</strong>. في ذلك الوقت كانت رحلة المستخدم مليئة بالعقبات: معلومات محدودة، وجودة إعلانات ضعيفة، وخيارات تصفح وتصفية محدودة. هدف التطبيق إلى جمع هذه الأجزاء في تجربة جوال أوضح وأكثر عملية."),
    ("This was my first real product journey from concept to working app. It taught me the full development cycle, the difference between what looks good in theory and what users actually need, and how to build collaboratively under deadlines. It also planted the seed for how I think about products today not just as software, but as experiences designed around real problems.",
     "كانت هذه أول رحلة منتج حقيقية لي من الفكرة إلى تطبيق يعمل. تعلمت منها دورة التطوير كاملة، والفرق بين ما يبدو جيدًا نظريًا وما يحتاجه المستخدمون فعلًا، وكيف نبني بشكل جماعي تحت ضغط المواعيد. وزرعت البذرة لطريقة تفكيري في المنتجات اليوم: ليست مجرد برمجيات، بل تجارب مصممة حول مشكلات حقيقية."),
    ("btn.textContent = 'Read more';", "btn.textContent = 'اقرأ المزيد';"),
    ("btn.textContent = open ? 'Show less' : 'Read more';", "btn.textContent = open ? 'عرض أقل' : 'اقرأ المزيد';"),
]

# ---------------------------------------------------------------- experience
# Job titles (class="pos") intentionally stay in English, matching LinkedIn and the CV.
EXPERIENCE = [
    ("<title>Experience | Omar Alfawzan, Cloud Technical Lead</title>",
     "<title>الخبرات | عمر الفوزان، Cloud Technical Lead</title>"),
    ('content="Experience | Omar Alfawzan, Cloud Technical Lead"',
     'content="الخبرات | عمر الفوزان، Cloud Technical Lead"'),
    ('content="Omar Alfawzan’s cloud experience across SITE, Mobily, solutions by stc and IBM, spanning pre-sales, architecture, migration delivery and cloud products."',
     'content="خبرات عمر الفوزان السحابية في SITE وموبايلي وsolutions by stc وIBM، في ما قبل البيع وتصميم الحلول وتنفيذ عمليات الترحيل والمنتجات السحابية."'),
    ('content="Omar Alfawzan, Cloud Technical Lead"', 'content="عمر الفوزان، Cloud Technical Lead"'),
    ('"name": "Omar Alfawzan Experience"', '"name": "خبرات عمر الفوزان"'),
    ('"url": "https://oalfawzan.sa/experience/"', '"url": "https://oalfawzan.sa/ar/experience/"'),
    ('"@id": "https://oalfawzan.sa/experience/#webpage"', '"@id": "https://oalfawzan.sa/ar/experience/#webpage"'),
    ('<h1>Work <span class="accent">Experience</span></h1>', '<h1>الخبرات <span class="accent">المهنية</span></h1>'),
    ("<p>Roles, results, and the skills behind them.</p>", "<p>الأدوار والنتائج والمهارات التي تقف خلفها.</p>"),
    ('id="connect">Connect</h2>', 'id="connect">تواصل</h2>'),
    ("</span> LinkedIn Profile", "</span> حسابي على LinkedIn"),
    ('<h2 class="section-title">Experience</h2>', '<h2 class="section-title">الخبرات</h2>'),
    ("Sep 2024 - Present", "سبتمبر 2024 - الآن"),
    ('<span class="company">Mobily</span>', '<span class="company">موبايلي</span>'),
    ('<span class="company">Al Tayyar Travel Group</span>', '<span class="company">مجموعة الطيار للسفر</span>'),
    ("<li><strong>Led the migration of 15,000 email users and 400+ virtual machines</strong> from on-premises to the cloud, including system re-architecture and the application of security and governance standards throughout.</li>",
     "<li><strong>قدت ترحيل 15,000 مستخدم للبريد الإلكتروني وأكثر من 400 خادم افتراضي</strong> من البيئة المحلية إلى السحابة، بما في ذلك إعادة تصميم الأنظمة وتطبيق معايير الأمن والحوكمة طوال المشروع.</li>"),
    ("<li>Designed and delivered a secure cloud file-sharing platform built to serve 15,000 users reliably.</li>",
     "<li>صممت ونفّذت منصة سحابية آمنة لمشاركة الملفات تخدم 15,000 مستخدم بموثوقية.</li>"),
    ("<li>Owned cloud delivery end to end, from infrastructure setup to customer handover, covering migrations, professional services, and managed services.</li>",
     "<li>توليت التنفيذ السحابي من البداية إلى النهاية، من تجهيز البنية التحتية حتى التسليم للعميل، شاملًا عمليات الترحيل والخدمات المهنية والخدمات المُدارة.</li>"),
    ("<li>Owned RFP responses, writing tailored proposals, defining project scope, and creating detailed Bills of Quantities (BoQs) for cloud, professional services, and managed services.</li>",
     "<li>توليت الرد على طلبات العروض (RFP)، بكتابة عروض مخصصة وتحديد نطاق المشاريع وإعداد جداول كميات (BoQ) مفصّلة للسحابة والخدمات المهنية والخدمات المُدارة.</li>"),
    ("<li>Led customer discovery meetings, solution design, and technical workshops to align needs with the right cloud solutions.</li>",
     "<li>قدت اجتماعات استكشاف احتياجات العملاء وتصميم الحلول وورش العمل التقنية لمواءمة الاحتياجات مع الحلول السحابية المناسبة.</li>"),
    ("<li>Assessed customer AI use cases and their feasibility on cloud platforms to support AI pre-sales.</li>",
     "<li>قيّمت حالات استخدام الذكاء الاصطناعي لدى العملاء وجدواها على المنصات السحابية لدعم ما قبل البيع في مجال الذكاء الاصطناعي.</li>"),
    ("<li>Managed Mobily's cloud product portfolio (Public Cloud, DRaaS, Co-location, and custom solutions), keeping offerings competitive and well-positioned in the market.</li>",
     "<li>أدرت محفظة منتجات موبايلي السحابية (السحابة العامة وDRaaS والاستضافة المشتركة والحلول المخصصة)، مع الحفاظ على تنافسيتها وتموضعها الجيد في السوق.</li>"),
    ("<li>Established a Cloud Partnership Program and redefined the Cloud Life Cycle Process, making partner onboarding and service delivery smoother and more consistent.</li>",
     "<li>أسست برنامج الشراكات السحابية وأعدت تعريف عملية دورة حياة الخدمات السحابية، ما جعل إلحاق الشركاء وتقديم الخدمات أكثر سلاسة واتساقًا.</li>"),
    ("<li>Enabled the sales team to position cloud products effectively and win more deals.</li>",
     "<li>مكّنت فريق المبيعات من تقديم المنتجات السحابية بفعالية والفوز بمزيد من الصفقات.</li>"),
    ("<li>Built and launched a Disaster Recovery as a Service (DRaaS) product on the stc cloud platform, taking it from initial concept all the way to market launch.</li>",
     "<li>بنيت وأطلقت منتج التعافي من الكوارث كخدمة (DRaaS) على منصة stc السحابية، من الفكرة الأولى حتى الإطلاق في السوق.</li>"),
    ("<li>Managed a portfolio of cloud products (Virtual Data Center, Co-Location, and FWaaS), covering vendor management, customer billing, revenue tracking, business case development, and customer satisfaction.</li>",
     "<li>أدرت محفظة منتجات سحابية (مركز البيانات الافتراضي والاستضافة المشتركة وFWaaS)، شاملةً إدارة الموردين وفوترة العملاء ومتابعة الإيرادات وإعداد دراسات الجدوى ورضا العملاء.</li>"),
    ("<li>Equipped the sales team with technical knowledge and insights, and improved products based on customer feedback and market trends.</li>",
     "<li>زوّدت فريق المبيعات بالمعرفة التقنية والرؤى، وحسّنت المنتجات بناءً على ملاحظات العملاء واتجاهات السوق.</li>"),
    ("<li>Analyzed competitors and market trends to position cloud and IoT products more effectively.</li>",
     "<li>حلّلت المنافسين واتجاهات السوق لتحسين تموضع منتجات السحابة وإنترنت الأشياء.</li>"),
    ("<li>Tracked product performance and proposed improvements to support adoption and service quality.</li>",
     "<li>تابعت أداء المنتجات واقترحت تحسينات لدعم التبنّي وجودة الخدمة.</li>"),
    ("<li>Built forecasts, pipeline reports, and data analysis to support business decisions.</li>",
     "<li>أعددت التوقعات وتقارير الفرص البيعية وتحليلات البيانات لدعم قرارات الأعمال.</li>"),
    ("<li>Managed cloud service partners within the stc marketplace to grow the partner ecosystem.</li>",
     "<li>أدرت شركاء الخدمات السحابية في متجر stc لتنمية منظومة الشركاء.</li>"),
    ("<li>Organized 35+ meetups and webinars for the Cloud and IoT portfolio, building community and raising product awareness.</li>",
     "<li>نظّمت أكثر من 35 لقاءً وندوة إلكترونية لمحفظة السحابة وإنترنت الأشياء، لبناء المجتمع ورفع الوعي بالمنتجات.</li>"),
    ("<li>Hosted 15+ workshops and mentored developers across 35+ workshops for community developers and enterprise customers on IBM Cloud, microservices, Kubernetes, Docker, Cloud Foundry, and Watson Assistant.</li>",
     "<li>قدّمت أكثر من 15 ورشة عمل وأرشدت المطورين في أكثر من 35 ورشة لمطوري المجتمع وعملاء المؤسسات حول IBM Cloud والخدمات المصغّرة وKubernetes وDocker وCloud Foundry وWatson Assistant.</li>"),
    ("<li>Installed IBM Private Cloud for a Saudi banking customer using RHEL 7, Docker, and Kubernetes, including deployment of IBM and third-party applications.</li>",
     "<li>ثبّتُّ IBM Private Cloud لعميل مصرفي سعودي باستخدام RHEL 7 وDocker وKubernetes، بما في ذلك نشر تطبيقات IBM وتطبيقات أطراف أخرى.</li>"),
    ("<li>Built a customer chatbot using Watson Assistant, Node.js, and Telegram.</li>",
     "<li>بنيت روبوت محادثة لخدمة العملاء باستخدام Watson Assistant وNode.js وTelegram.</li>"),
    ("<li>Practical training in storage systems (VMAX, Unity, VNX) and cloud infrastructure.</li>",
     "<li>تدريب عملي على أنظمة التخزين (VMAX وUnity وVNX) والبنية التحتية السحابية.</li>"),
    ("<li>Configured switches and routers; secured networks via VLANs and firewalls.</li>",
     "<li>أعددت المحولات والموجّهات، وأمّنت الشبكات عبر الشبكات الافتراضية (VLANs) والجدران النارية.</li>"),
    ('<h2 class="section-title">Skills & Expertise</h2>', '<h2 class="section-title">المهارات والخبرات</h2>'),
    (">Cloud Architecture & Delivery</p>", ">معمارية السحابة والتنفيذ</p>"),
    (">Pre-Sales & Solutions</p>", ">ما قبل البيع والحلول</p>"),
    (">Product & Strategy</p>", ">المنتجات والاستراتيجية</p>"),
    (">Service Delivery & Governance</p>", ">تقديم الخدمات والحوكمة</p>"),
    (">AI (Supporting)</p>", ">الذكاء الاصطناعي (مهارات مساندة)</p>"),
    ('<div class="pill">Solution Architecture</div>', '<div class="pill">معمارية الحلول</div>'),
    ('<div class="pill">Cloud Migration</div>', '<div class="pill">الترحيل السحابي</div>'),
    ('<div class="pill">System Re-architecture</div>', '<div class="pill">إعادة تصميم الأنظمة</div>'),
    ('<div class="pill">Private Cloud</div>', '<div class="pill">السحابة الخاصة</div>'),
    ('<div class="pill">DR & Backup</div>', '<div class="pill">التعافي من الكوارث والنسخ الاحتياطي</div>'),
    ('<div class="pill">Technical Pre-Sales</div>', '<div class="pill">ما قبل البيع التقني</div>'),
    ('<div class="pill">RFP Responses</div>', '<div class="pill">الرد على طلبات العروض</div>'),
    ('<div class="pill">Proposals & BoQs</div>', '<div class="pill">العروض وجداول الكميات</div>'),
    ('<div class="pill">Customer Discovery & Workshops</div>', '<div class="pill">استكشاف احتياجات العملاء وورش العمل</div>'),
    ('<div class="pill">Solution Design</div>', '<div class="pill">تصميم الحلول</div>'),
    ('<div class="pill">Client Onboarding</div>', '<div class="pill">إلحاق العملاء</div>'),
    ('<div class="pill">Product Management</div>', '<div class="pill">إدارة المنتجات</div>'),
    ('<div class="pill">Portfolio Management</div>', '<div class="pill">إدارة المحافظ</div>'),
    ('<div class="pill">Product Life Cycle</div>', '<div class="pill">دورة حياة المنتج</div>'),
    ('<div class="pill">Business Case Development</div>', '<div class="pill">إعداد دراسات الجدوى</div>'),
    ('<div class="pill">Partner Ecosystem</div>', '<div class="pill">منظومة الشركاء</div>'),
    ('<div class="pill">Digital Transformation</div>', '<div class="pill">التحول الرقمي</div>'),
    ('<div class="pill">Service Delivery</div>', '<div class="pill">تقديم الخدمات</div>'),
    ('<div class="pill">Managed Services</div>', '<div class="pill">الخدمات المُدارة</div>'),
    ('<div class="pill">Cloud Life Cycle</div>', '<div class="pill">دورة حياة السحابة</div>'),
    ('<div class="pill">Security & Governance Standards</div>', '<div class="pill">معايير الأمن والحوكمة</div>'),
    ('<div class="pill">Vendor Management</div>', '<div class="pill">إدارة الموردين</div>'),
    ('<div class="pill">GenAI</div>', '<div class="pill">الذكاء الاصطناعي التوليدي</div>'),
    ('<div class="pill">LLMs</div>', '<div class="pill">النماذج اللغوية الكبيرة</div>'),
    ('<div class="pill">Agentic AI</div>', '<div class="pill">الذكاء الاصطناعي الوكيلي</div>'),
    ('<div class="pill">AI Solution Assessment</div>', '<div class="pill">تقييم حلول الذكاء الاصطناعي</div>'),
    ('<h2 class="section-title">Certifications</h2>', '<h2 class="section-title">الشهادات</h2>'),
    ('<h2 class="section-title">Education</h2>', '<h2 class="section-title">التعليم</h2>'),
    ('<span class="company">King Saud University</span>', '<span class="company">جامعة الملك سعود</span>'),
    ("<span class=\"pos\">Bachelor's degree, Computer Information Systems</span>", '<span class="pos">بكالوريوس نظم المعلومات الحاسوبية</span>'),
    (">Grade: 4.59/5</p>", ">المعدل: 4.59 من 5</p>"),
    ('<h2 class="section-title">Languages</h2>', '<h2 class="section-title">اللغات</h2>'),
    ('<span class="company">Arabic</span><span class="period">Native</span>', '<span class="company">العربية</span><span class="period">اللغة الأم</span>'),
    ('<span class="company">English</span><span class="period">Professional Working Proficiency</span>', '<span class="company">الإنجليزية</span><span class="period">إجادة مهنية</span>'),
]

# ---------------------------------------------------------------- blog
READ_LI = 'Read on LinkedIn ↗<span class="sr-only"> (opens in a new tab)</span>'
BLOG = [
    ("<title>Cloud & AI Articles | Omar Alfawzan Blog</title>", "<title>مقالات في السحابة والذكاء الاصطناعي | مدونة عمر الفوزان</title>"),
    ('content="Cloud & AI Articles | Omar Alfawzan Blog"', 'content="مقالات في السحابة والذكاء الاصطناعي | مدونة عمر الفوزان"'),
    ('content="Articles by Omar Alfawzan on cloud computing, AI, LLMs, product management, and containers. Written in Arabic and English."',
     'content="مقالات عمر الفوزان عن الحوسبة السحابية والذكاء الاصطناعي والنماذج اللغوية الكبيرة وإدارة المنتجات والحاويات، بالعربية والإنجليزية."'),
    ('"name": "Omar Alfawzan Blog"', '"name": "مدونة عمر الفوزان"'),
    ('"url": "https://oalfawzan.sa/blog/"', '"url": "https://oalfawzan.sa/ar/blog/"'),
    ('"@id": "https://oalfawzan.sa/blog/#webpage"', '"@id": "https://oalfawzan.sa/ar/blog/#webpage"'),
    ('<h1>Blog & <span class="accent">Articles</span></h1>', '<h1>المدونة <span class="accent">والمقالات</span></h1>'),
    ('<p>Thoughts on Cloud, AI & Product · <span class="accent">10 articles</span>, 9 of them on LinkedIn</p>',
     '<p>أفكار في السحابة والذكاء الاصطناعي والمنتجات · <span class="accent">10 مقالات</span>، 9 منها على LinkedIn</p>'),
    ('<h2 class="section-title">Browse Articles</h2>', '<h2 class="section-title">تصفح المقالات</h2>'),
    ("onclick=\"filter('all',this)\">All</button>", "onclick=\"filter('all',this)\">الكل</button>"),
    ("onclick=\"filter('ai',this)\">AI & LLMs</button>", "onclick=\"filter('ai',this)\">الذكاء الاصطناعي</button>"),
    ("onclick=\"filter('cloud',this)\">Cloud</button>", "onclick=\"filter('cloud',this)\">السحابة</button>"),
    ("onclick=\"filter('product',this)\">Product</button>", "onclick=\"filter('product',this)\">المنتجات</button>"),
    ("onclick=\"filter('containers',this)\">Containers</button>", "onclick=\"filter('containers',this)\">الحاويات</button>"),
    ('aria-live="polite">Showing all articles.</p>', 'aria-live="polite">عرض جميع المقالات.</p>'),
    ("`Showing ${visibleCount} ${visibleCount === 1 ? 'article' : 'articles'}.`", "`عدد المقالات المعروضة: ${visibleCount}`"),
    ('<span class="blog-tag">AI &amp; Web Development</span>', '<span class="blog-tag">الذكاء الاصطناعي وتطوير الويب</span>'),
    ('<span class="blog-tag">AI & LLMs</span>', '<span class="blog-tag">الذكاء الاصطناعي</span>'),
    ('<span class="blog-tag">Cloud</span>', '<span class="blog-tag">السحابة</span>'),
    ('<span class="blog-tag">Product & Cloud</span>', '<span class="blog-tag">المنتجات والسحابة</span>'),
    ('<span class="blog-tag">Product</span>', '<span class="blog-tag">المنتجات</span>'),
    ('<span class="blog-tag">Containers</span>', '<span class="blog-tag">الحاويات</span>'),
    ('<span class="blog-badge">AR</span>', '<span class="blog-badge">عربي</span>'),
    ('<span class="blog-badge">EN</span>', '<span class="blog-badge">إنجليزي</span>'),
    ('<span class="blog-badge local">On this site</span>', '<span class="blog-badge local">على هذا الموقع</span>'),
    ("<span>9 Oct 2026</span>", "<span>9 أكتوبر 2026</span>"),
    ('<span class="blog-read">Read article →</span>', '<span class="blog-read">اقرأ المقال ←</span>'),
    (READ_LI, 'اقرأ على LinkedIn ↗<span class="sr-only"> (يفتح في علامة تبويب جديدة)</span>'),
    ("<span>2 min read</span>", "<span>دقيقتان للقراءة</span>"),
    ("<span>3 min read</span>", "<span>3 دقائق للقراءة</span>"),
    ("<span>4 min read</span>", "<span>4 دقائق للقراءة</span>"),
    ("<span>6 min read</span>", "<span>6 دقائق للقراءة</span>"),
    ("My experience building practical AI applications in sovereign cloud: the journey from LLMs to RAG pipelines to agentic workflows.",
     "تجربتي في بناء تطبيقات ذكاء اصطناعي عملية في السحابة السيادية: الرحلة من النماذج اللغوية الكبيرة إلى خطوط RAG وصولًا إلى سير العمل الوكيلي."),
    ("As digital transformation accelerates, digital sovereignty has become a top strategic priority for nations. This is the side of public cloud we rarely discuss.",
     "مع تسارع التحول الرقمي أصبحت السيادة الرقمية أولوية استراتيجية للدول. هذا هو الجانب من السحابة العامة الذي نادرًا ما نتحدث عنه."),
    ("The real challenge isn't building the product. It's tying it to customer requirements. How my path moved from product management into cloud engineering.",
     "التحدي الحقيقي ليس في بناء المنتج، بل في ربطه بمتطلبات العملاء. كيف انتقل مساري من إدارة المنتجات إلى الهندسة السحابية."),
    ("With strong government support pushing every sector toward cloud, here are the real challenges as seen through the lens of a product manager.",
     "مع الدعم الحكومي القوي الذي يدفع كل القطاعات نحو السحابة، هذه هي التحديات الحقيقية من منظور مدير منتج."),
    ("The role of Product Manager means different things across different companies. A breakdown of the top challenges PMs face in today's job market.",
     "يختلف دور مدير المنتج من شركة إلى أخرى. استعراض لأبرز التحديات التي يواجهها مديرو المنتجات في سوق العمل اليوم."),
    ("After moving to the cloud computing product management division, I share my early experience and what I learned starting out as a PM.",
     "بعد انتقالي إلى قسم إدارة منتجات الحوسبة السحابية، أشارك تجربتي الأولى وما تعلّمته في بداياتي مديرًا للمنتج."),
    ("Following Container 101, going deeper into container orchestration, Kubernetes architecture, and running containers at scale in production.",
     "استكمالًا لمقال Container 101، أتعمق في تنسيق الحاويات ومعمارية Kubernetes وتشغيل الحاويات على نطاق واسع في بيئات الإنتاج."),
    ("A recap of the Dec 2018 meetup on Hybrid Cloud Integration, and a practical guide to getting started with a multi-cloud strategy.",
     "ملخص لقاء ديسمبر 2018 حول تكامل السحابة الهجينة، ودليل عملي للبدء باستراتيجية السحابة المتعددة."),
    ("Container Technology is a standard way to package applications and their dependencies so they can be reliably moved and deployed across environments.",
     "تقنية الحاويات طريقة موحّدة لتغليف التطبيقات واعتمادياتها بحيث يمكن نقلها ونشرها بموثوقية عبر البيئات المختلفة."),
]

# ---------------------------------------------------------------- social
SOCIAL = [
    ("<title>Photography by Omar Alfawzan | Landscapes, Street &amp; Travel</title>", "<title>التصوير | عمر الفوزان، مناظر طبيعية وشوارع وسفر</title>"),
    ('content="Photography by Omar Alfawzan. Landscapes, street, and travel, shot on iPhone and Fujifilm X100F."',
     'content="صور بعدسة عمر الفوزان: مناظر طبيعية وشوارع وسفر، بكاميرا iPhone وFujifilm X100F."'),
    ('content="Omar Alfawzan | Photography"', 'content="عمر الفوزان | التصوير"'),
    ('content="Landscapes, street, and travel photography by Omar Alfawzan."', 'content="صور مناظر طبيعية وشوارع وسفر بعدسة عمر الفوزان."'),
    ('content="Omar Alfawzan, Cloud Technical Lead"', 'content="عمر الفوزان، Cloud Technical Lead"'),
    ('"name": "Omar Alfawzan Photography"', '"name": "تصوير عمر الفوزان"'),
    ('"url": "https://oalfawzan.sa/social/"', '"url": "https://oalfawzan.sa/ar/social/"'),
    ('"inLanguage": "en"', '"inLanguage": "ar"'),
    ('"@id": "https://oalfawzan.sa/social/#gallery"', '"@id": "https://oalfawzan.sa/ar/social/#gallery"'),
    ('"caption": "Photography by Omar Alfawzan, photo 1"', '"caption": "صورة بعدسة عمر الفوزان، رقم 1"'),
    ('<p class="hero-eyebrow">Beyond the Cloud</p>', '<p class="hero-eyebrow">ما وراء السحابة</p>'),
    ("<h1>Seeing the world<br><em>one frame at a time.</em></h1>", "<h1>أرى العالم<br><em>لقطةً تلو الأخرى.</em></h1>"),
    ('<p class="hero-sub">A personal collection of landscapes, streets, details and moments, kept in their original image quality.</p>',
     '<p class="hero-sub">مجموعة شخصية من المناظر الطبيعية والشوارع والتفاصيل واللحظات، محفوظة بجودتها الأصلية.</p>'),
    ('aria-label="Photography details"', 'aria-label="تفاصيل الصور"'),
    ('<span class="meta-pill">193 photographs</span>', '<span class="meta-pill">193 صورة</span>'),
    ('aria-label="Social profiles"', 'aria-label="حساباتي على الشبكات الاجتماعية"'),
    ('<p class="gallery-kicker">Photography</p>', '<p class="gallery-kicker">التصوير</p>'),
    ('id="galleryTitle">Selected frames</h2>', 'id="galleryTitle">لقطات مختارة</h2>'),
    ('<p class="gallery-copy">Natural aspect ratios. Tap any frame for the full original.</p>',
     '<p class="gallery-copy">بأبعادها الطبيعية. اضغط على أي صورة لعرضها بجودتها الأصلية.</p>'),
    ('aria-label="Photography gallery"', 'aria-label="معرض الصور"'),
    ('aria-label="Open photo 1 of 193"', 'aria-label="فتح الصورة 1 من 193"'),
    ('src="thumbs/photo_001.webp" alt="Photography by Omar Alfawzan, photo 1"', 'src="/social/thumbs/photo_001.webp" alt="صورة بعدسة عمر الفوزان، رقم 1"'),
    ('type="button">Load more</button>', 'type="button">عرض المزيد</button>'),
    ('type="button">New mix</button>', 'type="button">ترتيب جديد</button>'),
    ('aria-label="Close photo"', 'aria-label="إغلاق الصورة"'),
    ('aria-label="Previous photo"', 'aria-label="الصورة السابقة"'),
    ('aria-label="Next photo"', 'aria-label="الصورة التالية"'),
    ('<span id="lightboxCount">Photo 1 of 193</span><span>Original quality</span>', '<span id="lightboxCount">الصورة 1 من 193</span><span>الجودة الأصلية</span>'),
    ("src: `photos/${filename}.jpg`", "src: `/social/photos/${filename}.jpg`"),
    ("thumb: `thumbs/${filename}.webp`", "thumb: `/social/thumbs/${filename}.webp`"),
    ("`Open photo ${index + 1} of ${PHOTO_COUNT}`", "`فتح الصورة ${index + 1} من ${PHOTO_COUNT}`"),
    ("`Photography by Omar Alfawzan, photo ${index + 1}`", "`صورة بعدسة عمر الفوزان، رقم ${index + 1}`"),
    ("`Photography by Omar Alfawzan, photo ${lightboxIndex + 1} of ${photos.length}`", "`صورة بعدسة عمر الفوزان، رقم ${lightboxIndex + 1} من ${photos.length}`"),
    ("`Photo ${lightboxIndex + 1} of ${photos.length}`", "`الصورة ${lightboxIndex + 1} من ${photos.length}`"),
]

PAGES = [
    ("index.html", "", HOME),
    ("experience/index.html", "experience/", EXPERIENCE),
    ("blog/index.html", "blog/", BLOG),
    ("social/index.html", "social/", SOCIAL),
]


def replace_all(text: str, pairs: list[tuple[str, str]], source: str, problems: list[str]) -> str:
    for en, ar in pairs:
        if en not in text:
            problems.append(f"{source}: English text not found: {en[:90]}")
            continue
        text = text.replace(en, ar)
    return text


def build_page(source: str, path: str, pairs: list[tuple[str, str]], problems: list[str]) -> str:
    html = (ROOT / source).read_text(encoding="utf-8")

    html = html.replace('<html lang="en">', '<html lang="ar" dir="rtl">', 1)
    canonical_en = f'<link rel="canonical" href="https://oalfawzan.sa/{path}">'
    if canonical_en not in html:
        problems.append(f"{source}: canonical not found")
    html = html.replace(canonical_en, f'<link rel="canonical" href="https://oalfawzan.sa/ar/{path}">', 1)
    html = html.replace(f'<meta property="og:url" content="https://oalfawzan.sa/{path}">',
                        f'<meta property="og:url" content="https://oalfawzan.sa/ar/{path}">', 1)

    html = replace_all(html, COMMON + pairs, source, problems)
    for en, ar in NAV:
        html = html.replace(en, ar)
    leftover = NAV_LEFTOVER.search(html)
    if leftover:
        problems.append(f"{source}: untranslated menu label: {leftover.group(1)}")

    # Month names in date ranges (Experience periods).
    def arabic_months(match: re.Match) -> str:
        return re.sub(r"\b(" + "|".join(MONTHS) + r")\b", lambda m: MONTHS[m.group(1)], match.group(0))
    html = re.sub(r'<span class="period">[^<]*</span>', arabic_months, html)

    # Internal page links point at the Arabic pages (the article and privacy stay shared).
    html = re.sub(r'href="/((?:experience|social|blog)/(?:#[^"]*)?|)"', lambda m: f'href="/ar/{m.group(1)}"', html)

    html = html.replace("<!DOCTYPE html>", "<!DOCTYPE html>\n<!-- Generated by scripts/build_arabic.py from the English page. Edit the English page or the script, then rebuild. -->", 1)
    return html


def main() -> int:
    problems: list[str] = []
    outputs: dict[Path, str] = {}
    for source, path, pairs in PAGES:
        outputs[ROOT / "ar" / path / "index.html"] = build_page(source, path, pairs, problems)
    if problems:
        print("Arabic build failed:")
        for problem in problems:
            print(f"- {problem}")
        return 1
    for target, html in outputs.items():
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(html, encoding="utf-8", newline="")
        print(f"wrote {target.relative_to(ROOT).as_posix()}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
