/**
 * A.S.T.R.A Dynamic Content & Projects Navigation Hub
 * Manages domain cards showcase on projects.html (with redirects to projectdomain.html)
 * and dynamic project rendering on projectdomain.html without default images.
 */

// Helper check for Live Firebase Mode vs Local Fallback Mode
const isDemoModeActive = () => (typeof window.DEMO_MODE !== 'undefined' ? window.DEMO_MODE : false);


// Domain Metadata Dictionary
const DOMAINS_CONFIG = {
  all: { name: "All Technical Domains", icon: "🚀", short: "All", target: "projectdomain.html?domain=all", tag: "Explore complete innovation showcase across all A.S.T.R.A project tracks.", lead: "All Domain Teams & Core Leads" },
  web: { name: "Full Stack & Web Dev", icon: "🌐", short: "Web Dev", target: "projectdomain.html?domain=web", tag: "Web portals, cloud platforms, SIH EdTech apps, and modern UI/UX engineering.", lead: "Manjiri Kench (Lead Web Developer)" },
  aiml: { name: "AI, ML & Data Science", icon: "🤖", short: "AI / ML", target: "projectdomain.html?domain=aiml", tag: "Neural networks in C, computer vision, financial NLP, and deep learning diagnostics.", lead: "Anish Pathak, Om Dangi, Pravesh Jain" },
  cybersec: { name: "Cybersecurity & OSINT", icon: "🛡️", short: "CyberSec", target: "projectdomain.html?domain=cybersec", tag: "OSINT social media threat monitoring (IDEX ADITI 4.0 IAF) & real-time intrusion detection.", lead: "Namash Kate & Mayank Patil" },
  iot: { name: "Robotics & IoT Automation", icon: "⚡", short: "Robotics & IoT", target: "projectdomain.html?domain=iot", tag: "Hazardous gas sensing rovers, delivery robots & automated poultry climate systems.", lead: "Swayam Dhawade (Robotics & IoT Lead)" },
  research: { name: "RnD & Academic Research", icon: "🔬", short: "Research", target: "projectdomain.html?domain=research", tag: "IEEE paper publishing pipelines, academic thesis frameworks & automated LaTeX toolkits.", lead: "Karthik Kurup (RnD Lead)" },
  interdisc: { name: "Interdisciplinary & Collaborative Labs", icon: "🧩", short: "Inter-Domain", target: "projectdomain.html?domain=interdisc", tag: "Multi-domain hackathon systems (AgriSarathi, Krishi Mitra) & OS kernel development.", lead: "Core Engineering Team & Mentors" }
};

// Logbook Projects Dataset (31 Projects without default/placeholder images)
const INITIAL_PROJECTS_DATA = [
  {
    id: "proj-medha",
    title: "MEDHA — Autonomous Cyber Defense",
    description: "Intelligent autonomous cyber defense framework that detects, analyzes, explains, and responds to cyber threats in real time using Explainable Deep Learning, Context-Aware Risk Assessment, and Hybrid Reinforcement Learning.",
    domain: "cybersec",
    duration: "2025 – 2026",
    imageUrl: "secure.webp",
    githubUrl: "https://github.com/ASTRA-Club/medha-cyber-defense",
    demoUrl: "",
    authorName: "Namash Kate & Mayank Patil",
    createdAt: "2025-08-01T00:00:00.000Z"
  },
  {
    id: "proj-nids",
    title: "Cybernetics Defense (NIDS)",
    description: "Intelligent network monitoring system that detects malicious activities and unauthorized access in real time using ML/DL models to classify DoS, DDoS, brute-force, botnets, and port scanning.",
    domain: "cybersec",
    duration: "2025 – 2026",
    imageUrl: "logocyber.png",
    githubUrl: "https://github.com/ASTRA-Club/nids-cybersec",
    demoUrl: "",
    authorName: "Namash Kate & Cybersecurity Team",
    createdAt: "2025-08-15T00:00:00.000Z"
  },
  {
    id: "proj-resumeiq",
    title: "Resume-IQ — AI Resume Screener",
    description: "Intelligent resume analysis system evaluating and ranking resumes against job descriptions in real time using NLP, instant match scoring, ATS compatibility, and skill gap visual analytics.",
    domain: "aiml",
    duration: "2025 – 2026",
    imageUrl: "logoai.png",
    githubUrl: "https://github.com/ASTRA-Club/resume-iq",
    demoUrl: "",
    authorName: "Anish Pathak & Pravesh Jain",
    createdAt: "2025-09-01T00:00:00.000Z"
  },
  {
    id: "proj-braintumor",
    title: "Brain Tumor Detection System",
    description: "Deep Learning MRI scan classification system detecting glioma, meningioma, and pituitary tumors with high accuracy, leveraging Grad-CAM explainable AI for diagnostic transparency.",
    domain: "aiml",
    duration: "2025 – 2026",
    imageUrl: "deep.jpg",
    githubUrl: "https://github.com/ASTRA-Club/brain-tumor-dl",
    demoUrl: "",
    authorName: "Pravesh Jain & Om Dangi",
    createdAt: "2025-09-15T00:00:00.000Z"
  },
  {
    id: "proj-1",
    title: "Align with Yoga",
    description: "Interactive OpenCV yoga pose estimation and guidance tool demonstrating real-time computer vision for wellness.",
    domain: "aiml",
    duration: "2024 – 2025",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/align-with-yoga",
    demoUrl: "",
    authorName: "Om Dangi",
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "proj-2",
    title: "Gesture-Based Game Controller",
    description: "Human-computer interaction system controlling arcade and racing games using OpenCV hand gesture recognition.",
    domain: "aiml",
    duration: "2024 – 2025",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/gesture-controller",
    demoUrl: "",
    authorName: "Pravesh Jain",
    createdAt: "2024-01-15T00:00:00.000Z"
  },
  {
    id: "proj-3",
    title: "TypoClypse – Typing Speed Game",
    description: "Interactive web-based typing speed and accuracy game showcasing dynamic front-end & back-end mechanics.",
    domain: "web",
    duration: "2024 – 2025",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/typoclypse",
    demoUrl: "",
    authorName: "Mehwish Tabbasum & Team (Supervised by Manjiri Kench)",
    createdAt: "2024-02-01T00:00:00.000Z"
  },
  {
    id: "proj-4",
    title: "Delivery Robot Car",
    description: "Autonomous delivery robot vehicle demonstrating IoT sensor integration, motor control, and automation fundamentals.",
    domain: "iot",
    duration: "2024 – 2025",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/delivery-robot",
    demoUrl: "",
    authorName: "Swayam Dhawade & Palak Thakur",
    createdAt: "2024-02-10T00:00:00.000Z"
  },
  {
    id: "proj-5",
    title: "Automatic Poultry Farming System",
    description: "Automated poultry ecosystem maintenance using temperature, humidity, IR, and proximity sensors with automated climate management.",
    domain: "iot",
    duration: "2024 – 2025",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/poultry-automation",
    demoUrl: "",
    authorName: "Shreyas Pangare, Yash Bhilare & Pravesh Jain",
    createdAt: "2024-03-01T00:00:00.000Z"
  },
  {
    id: "proj-6",
    title: "Gas Sensing Rover for Hazardous Environments",
    description: "Hazardous environment inspection rover equipped with gas sensors for disaster-response preliminary assessment.",
    domain: "iot",
    duration: "2024 – 2025",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/gas-rover",
    demoUrl: "",
    authorName: "Swayam Dhawade & Palak Thakur",
    createdAt: "2024-03-15T00:00:00.000Z"
  },
  {
    id: "proj-7",
    title: "Smart Computing for Sustainable Development",
    description: "Mathematical modeling and data science computational approach to sustainable computing and green tech analytics.",
    domain: "aiml",
    duration: "2024 – 2025",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/sustainable-computing",
    demoUrl: "",
    authorName: "Pravesh Jain, Arushi Jain, Palak Thakur",
    createdAt: "2024-04-01T00:00:00.000Z"
  },
  {
    id: "proj-8",
    title: "IPO Risk & Readiness Analysis via DRHP NLP",
    description: "Financial NLP pipeline for structured analysis of Draft Red Herring Prospectuses to evaluate IPO risk factors and readiness metrics.",
    domain: "aiml",
    duration: "2024 – 2025",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/ipo-nlp-analysis",
    demoUrl: "",
    authorName: "Pravesh Jain, Vandith Shetty, Gagan Agrawal",
    createdAt: "2024-04-15T00:00:00.000Z"
  },
  {
    id: "proj-9",
    title: "Dynamic Pricing & Inventory Optimization (Hybrid ML)",
    description: "Machine learning inventory management and dynamic pricing model for perishable goods using hybrid Markov Decision Processes.",
    domain: "aiml",
    duration: "2024 – 2025",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/dynamic-pricing-ml",
    demoUrl: "",
    authorName: "Pravesh Jain & Team",
    createdAt: "2024-05-01T00:00:00.000Z"
  },
  {
    id: "proj-10",
    title: "Bitcoin Mempool Fee Optimizer (RAG + ML)",
    description: "Multi-feature blockchain transaction fee optimizer integrating Retrieval-Augmented Generation (RAG) and predictive analytics.",
    domain: "interdisc",
    duration: "2024 – 2025",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/bitcoin-mempool-rag",
    demoUrl: "",
    authorName: "Pravesh Jain & Team",
    createdAt: "2024-05-15T00:00:00.000Z"
  },
  {
    id: "proj-11",
    title: "National MSME Analytics Portal",
    description: "Geospatial analytics dashboard mapping MSME growth metrics, economic indicators, and regional policy analytics across India.",
    domain: "aiml",
    duration: "2024 – 2025",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/msme-analytics",
    demoUrl: "",
    authorName: "Pravesh Jain, Vandit Chhatri, Anil Agarwal",
    createdAt: "2024-06-01T00:00:00.000Z"
  },
  {
    id: "proj-12",
    title: "Brain Tumor Detection using Deep Learning",
    description: "Deep learning computer vision pipeline utilizing U-Net MRI segmentation to classify brain tumors for healthcare diagnostics.",
    domain: "aiml",
    duration: "Ongoing (2025)",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/brain-tumor-dl",
    demoUrl: "",
    authorName: "Pravesh Jain",
    createdAt: "2024-06-15T00:00:00.000Z"
  },
  {
    id: "proj-13",
    title: "Movie Recommendation System",
    description: "Collaborative filtering and content-based recommendation model introducing first-year engineering students to ML workflows.",
    domain: "aiml",
    duration: "2024 – 2025",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/movie-recommendation",
    demoUrl: "",
    authorName: "Pravesh Jain & FY Student Cohort",
    createdAt: "2024-07-01T00:00:00.000Z"
  },
  {
    id: "proj-14",
    title: "Gamified Digital Platform for Rural STEM Learning",
    description: "Interactive STEM educational web portal for rural students designed for Smart India Hackathon (SIH).",
    domain: "web",
    duration: "2024 – 2025",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/stem-rural-learning",
    demoUrl: "",
    authorName: "Pravesh Jain & Team",
    createdAt: "2024-08-01T00:00:00.000Z"
  },
  {
    id: "proj-15",
    title: "AI Institutional Communication Mediation System",
    description: "AI-driven NLP system automating institutional communication workflows, message routing, and query processing.",
    domain: "aiml",
    duration: "Ongoing (2025)",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/institutional-nlp",
    demoUrl: "",
    authorName: "Pravesh Jain & Vandith Shetty",
    createdAt: "2024-08-15T00:00:00.000Z"
  },
  {
    id: "proj-16",
    title: "OS Development from Scratch",
    description: "Custom operating system built from scratch featuring a functional terminal CLI, kernel modules, and memory management.",
    domain: "interdisc",
    duration: "Ongoing (2025)",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/os-from-scratch",
    demoUrl: "",
    authorName: "Mayank Patil",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: "proj-17",
    title: "AI Fake News Detector",
    description: "Natural Language Processing text classification tool evaluating web news articles for authenticity and misinformation.",
    domain: "aiml",
    duration: "2024 – 2025",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/fake-news-detector",
    demoUrl: "",
    authorName: "Mayank Patil & Rashmi Rahangdale",
    createdAt: "2024-09-15T00:00:00.000Z"
  },
  {
    id: "proj-18",
    title: "AI-Based Verification Portal",
    description: "Interactive web application utilizing ML text classification for real-time fake news verification.",
    domain: "web",
    duration: "2024 – 2025",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/verification-portal",
    demoUrl: "",
    authorName: "Saim Kotkar & Team (Supervised by Manjiri Kench)",
    createdAt: "2024-10-01T00:00:00.000Z"
  },
  {
    id: "proj-19",
    title: "AI Skill Swap Matcher",
    description: "Full-stack peer learning web portal connecting students for skill exchange using AI recommendation algorithms.",
    domain: "web",
    duration: "Ongoing",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/skill-swap-matcher",
    demoUrl: "",
    authorName: "Pushit Akkar & Team (Supervised by Manjiri Kench)",
    createdAt: "2024-10-15T00:00:00.000Z"
  },
  {
    id: "proj-20",
    title: "AI Bus Scheduling & Route Management",
    description: "Intelligent municipal transit scheduling platform featuring dynamic route optimization and bus arrival forecasts.",
    domain: "web",
    duration: "Phase 1 Completed",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/bus-scheduling-ai",
    demoUrl: "",
    authorName: "Janvi Thopte & Team (Supervised by Manjiri Kench)",
    createdAt: "2024-11-01T00:00:00.000Z"
  },
  {
    id: "proj-21",
    title: "AI Therapist Assistant",
    description: "Conversational AI assistant providing empathetic mental health support and mindfulness guidance.",
    domain: "aiml",
    duration: "Ongoing",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/ai-therapist",
    demoUrl: "",
    authorName: "Anish Pathak & Deep Khatke",
    createdAt: "2024-11-15T00:00:00.000Z"
  },
  {
    id: "proj-22",
    title: "Neighbor Connect Platform",
    description: "Community engagement web portal facilitating local neighborhood networking, event sharing, and resource pooling.",
    domain: "web",
    duration: "Ongoing",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/neighbor-connect",
    demoUrl: "",
    authorName: "Prakruti Pipaliya & Team (Supervised by Manjiri Kench)",
    createdAt: "2024-12-01T00:00:00.000Z"
  },
  {
    id: "proj-23",
    title: "Hostel Hub Management System",
    description: "Comprehensive student accommodation management portal streamlining room booking, maintenance, and logistics.",
    domain: "aiml",
    duration: "Ongoing",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/hostel-hub",
    demoUrl: "",
    authorName: "Priyanka Bankar, Anish Pathak, Manjiri Kench",
    createdAt: "2024-12-15T00:00:00.000Z"
  },
  {
    id: "proj-24",
    title: "AI-Based OSINT Social Media Monitoring",
    description: "Open-Source Intelligence (OSINT) gathering framework aligned with Indian Air Force IDEX ADITI 4.0 for threat monitoring.",
    domain: "cybersec",
    duration: "Prototype Stage",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/osint-threat-monitor",
    demoUrl: "",
    authorName: "Mayank Patil & Namash Kate",
    createdAt: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "proj-25",
    title: "AgriSarathi – Farmer Advisory System",
    description: "Multimodal agricultural advisory system with AI chatbot, GIS mapping, crop health engine, and market price forecasting demonstrated for IBM.",
    domain: "interdisc",
    duration: "Sep 2025 – Feb 2026",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/agrisarathi-ai",
    demoUrl: "",
    authorName: "Namash Kate & Mayank Patil",
    createdAt: "2025-01-15T00:00:00.000Z"
  },
  {
    id: "proj-26",
    title: "Neural Network in C from Scratch",
    description: "Low-level C programming implementation of neural network forward/backpropagation algorithms built without external libraries.",
    domain: "aiml",
    duration: "Jan 2026",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/nn-in-c",
    demoUrl: "",
    authorName: "Anish Pathak",
    createdAt: "2026-01-24T00:00:00.000Z"
  },
  {
    id: "proj-27",
    title: "Transformer Model in C from Scratch",
    description: "Low-level implementation of self-attention mechanisms and transformer neural architecture in pure C language.",
    domain: "aiml",
    duration: "Mar 2026 – May 2026",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/transformer-in-c",
    demoUrl: "",
    authorName: "Anish Pathak",
    createdAt: "2026-03-25T00:00:00.000Z"
  },
  {
    id: "proj-28",
    title: "Network Intrusion Detection System",
    description: "Real-time network traffic inspector analyzing protocol anomalies and TCP/IP attack signatures for threat prevention.",
    domain: "cybersec",
    duration: "Sep 2025 – Jan 2026",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/nids-cybersec",
    demoUrl: "",
    authorName: "Namash Kate & Mayank Patil",
    createdAt: "2025-09-12T00:00:00.000Z"
  },
  {
    id: "proj-29",
    title: "Quantized Neural Network in C from Scratch",
    description: "Integer-arithmetic quantized neural network built in C for high-efficiency edge computing AI models.",
    domain: "aiml",
    duration: "Jan 2026",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/quantized-nn-c",
    demoUrl: "",
    authorName: "Anish Pathak",
    createdAt: "2026-01-24T00:00:00.000Z"
  },
  {
    id: "proj-30",
    title: "Krishi Mitra – AI Agricultural Platform",
    description: "24-hour hackathon AI agricultural advisory platform built at Techathon 3.0 AISSMS, selected for patent filing.",
    domain: "interdisc",
    duration: "Feb 2026 (Techathon 3.0)",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/krishi-mitra-ai",
    demoUrl: "",
    authorName: "Namash Kate, Om Dangi, Priyanshu Sharma, Mayank Patel",
    createdAt: "2026-02-21T00:00:00.000Z"
  },
  {
    id: "proj-31",
    title: "IEEE Academic Paper Pipeline",
    description: "Research framework and automated LaTeX template generator for undergraduate thesis publishing and IEEE submission.",
    domain: "research",
    duration: "Oct 2024 – Dec 2024",
    imageUrl: "",
    githubUrl: "https://github.com/ASTRA-Club/research-pipeline",
    demoUrl: "",
    authorName: "Karthik Kurup & RnD Team",
    createdAt: "2024-10-01T00:00:00.000Z"
  }
];

// Initial Seed Members — 2025-26 PPT Roster + Technical Roster
const INITIAL_MEMBERS_DATA = [

  // ─── CATEGORY 1: MEET OUR TEAM (From Induction PPT) ─────────────────────
  {
    id: "mem-ppt-1",
    name: "Prof. Yogita Patil",
    role: "Faculty Mentor",
    category: "1",
    domain: "all",
    imageUrl: "yogita.jpg",
    linkedinUrl: "#",
    githubUrl: "#"
  },
  {
    id: "mem-ppt-2",
    name: "Namash Kate",
    role: "President",
    category: "1",
    domain: "cybersec",
    imageUrl: "namash.jpg",
    linkedinUrl: "https://www.linkedin.com/in/namash-kate",
    githubUrl: "https://github.com/namash-kate"
  },
  {
    id: "mem-ppt-3",
    name: "Yash Lund",
    role: "Vice-President",
    category: "1",
    domain: "all",
    imageUrl: "yash.jpg",
    linkedinUrl: "https://www.linkedin.com/in/yash-lund",
    githubUrl: "https://github.com/yash-lund"
  },
  {
    id: "mem-ppt-4",
    name: "Mayank Patil",
    role: "Lead Developer",
    category: "1",
    domain: "cybersec",
    imageUrl: "maya.jpg",
    linkedinUrl: "https://www.linkedin.com/in/mayank-patil",
    githubUrl: "https://github.com/mayank-patil"
  },
  {
    id: "mem-ppt-5",
    name: "Om Dangi",
    role: "ML Head",
    category: "1",
    domain: "aiml",
    imageUrl: "Om.jpg",
    linkedinUrl: "https://www.linkedin.com/in/om-dangi",
    githubUrl: "https://github.com/om-dangi"
  },
  {
    id: "mem-ppt-6",
    name: "Karthik Kurup",
    role: "R&D Head",
    category: "1",
    domain: "research",
    imageUrl: "karthik.jpg",
    linkedinUrl: "https://www.linkedin.com/in/karthik-kurup",
    githubUrl: "https://github.com/karthik-kurup"
  },
  {
    id: "mem-ppt-7",
    name: "Anish Pathak",
    role: "AI Head",
    category: "1",
    domain: "aiml",
    imageUrl: "Anish.jpg",
    linkedinUrl: "https://www.linkedin.com/in/anish-pathak",
    githubUrl: "https://github.com/anish-pathak"
  },
  {
    id: "mem-ppt-8",
    name: "Pravesh Jain",
    role: "DS Head",
    category: "1",
    domain: "aiml",
    imageUrl: "Pravesh.jpg",
    linkedinUrl: "https://www.linkedin.com/in/pravesh-jain",
    githubUrl: "https://github.com/pravesh-jain"
  },
  {
    id: "mem-ppt-9",
    name: "Om Nerkar",
    role: "IOT Head",
    category: "1",
    domain: "iot",
    imageUrl: "om nerkar.jpg",
    linkedinUrl: "https://www.linkedin.com/in/om-nerkar",
    githubUrl: "https://github.com/om-nerkar"
  },
  {
    id: "mem-ppt-10",
    name: "Manjiri Kench",
    role: "Fullstack Head",
    category: "1",
    domain: "web",
    imageUrl: "a.jpg",
    linkedinUrl: "https://www.linkedin.com/in/manjiri-kench",
    githubUrl: "https://github.com/manjiri-kench"
  },
  {
    id: "mem-ppt-11",
    name: "Khushi Thakkar",
    role: "UI/UX Head",
    category: "1",
    domain: "web",
    imageUrl: "khushi.jpg",
    linkedinUrl: "https://www.linkedin.com/in/khushi-thakkar",
    githubUrl: "https://github.com/khushi-thakkar"
  },
  {
    id: "mem-ppt-12",
    name: "Anay Khatpe",
    role: "Cybersecurity Head",
    category: "1",
    domain: "cybersec",
    imageUrl: "Anay.jpg",
    linkedinUrl: "https://www.linkedin.com/in/anay-khatpe",
    githubUrl: "https://github.com/anay-khatpe"
  },
  {
    id: "mem-ppt-13",
    name: "Mehwish Tabbassum",
    role: "Management Head",
    category: "1",
    domain: "all",
    imageUrl: "Mehwish.jpg",
    linkedinUrl: "https://www.linkedin.com/in/mehwish-tabbassum",
    githubUrl: "https://github.com/mehwish-tabbassum"
  },
  {
    id: "mem-ppt-14",
    name: "Arya Nagraj",
    role: "Tech. Operational Head",
    category: "1",
    domain: "all",
    imageUrl: "aarya.jpg",
    linkedinUrl: "https://www.linkedin.com/in/arya-nagraj",
    githubUrl: "https://github.com/arya-nagraj"
  },
  {
    id: "mem-ppt-15",
    name: "Khushi Nanekar",
    role: "Social Media Head",
    category: "1",
    domain: "all",
    imageUrl: "khushi.jpg",
    linkedinUrl: "https://www.linkedin.com/in/khushi-nanekar",
    githubUrl: "https://github.com/khushi-nanekar"
  },
  {
    id: "mem-ppt-16",
    name: "Prakruti Pipaliya",
    role: "Tech. Mgmt. Head",
    category: "1",
    domain: "web",
    imageUrl: "Prakruti.jpg",
    linkedinUrl: "https://www.linkedin.com/in/prakruti-pipaliya",
    githubUrl: "https://github.com/prakruti-pipaliya"
  },

  // ─── CATEGORY 2: TECHNICAL MEMBERS (Remaining Students) ────────────────
  {
    id: "mem-tech-1",
    name: "Harsh Jain",
    role: "Senior Technical Member",
    category: "2",
    domain: "all",
    imageUrl: "HarshJ.jpg",
    linkedinUrl: "https://www.linkedin.com/in/harsh-jain",
    githubUrl: "https://github.com/harsh-jain"
  },
  {
    id: "mem-tech-2",
    name: "Gaurav Kandalkar",
    role: "Senior Technical Member",
    category: "2",
    domain: "all",
    imageUrl: "Gaurav.jpg",
    linkedinUrl: "https://www.linkedin.com/in/gaurav-kandalkar",
    githubUrl: "https://github.com/gaurav-kandalkar"
  },
  {
    id: "mem-tech-3",
    name: "Sadiq Rangwala",
    role: "Technical Member",
    category: "2",
    domain: "all",
    imageUrl: "Sadiq.jpg",
    linkedinUrl: "https://www.linkedin.com/in/sadiq-rangwala",
    githubUrl: "https://github.com/sadiq-rangwala"
  },
  {
    id: "mem-tech-4",
    name: "Shravani Kasar",
    role: "Technical Member",
    category: "2",
    domain: "all",
    imageUrl: "Shravani.jpg",
    linkedinUrl: "https://www.linkedin.com/in/shravani-kasar",
    githubUrl: "https://github.com/shravani-kasar"
  },
  {
    id: "mem-tech-5",
    name: "Swayam Dhawade",
    role: "Robotics & IoT Member",
    category: "2",
    domain: "iot",
    imageUrl: "sawayam.jpg",
    linkedinUrl: "https://www.linkedin.com/in/swayam-dhawade",
    githubUrl: "https://github.com/swayam-dhawade"
  },
  {
    id: "mem-tech-6",
    name: "Palak Thakur",
    role: "Robotics & IoT Member",
    category: "2",
    domain: "iot",
    imageUrl: "Pakak.jpg",
    linkedinUrl: "https://www.linkedin.com/in/palak-thakur",
    githubUrl: "https://github.com/palak-thakur"
  },
  {
    id: "mem-tech-7",
    name: "Harsh Jaiswal",
    role: "Technical Member",
    category: "2",
    domain: "aiml",
    imageUrl: "harsh.jpg",
    linkedinUrl: "https://www.linkedin.com/in/harsh-jaiswal",
    githubUrl: "https://github.com/harsh-jaiswal"
  },
  {
    id: "mem-tech-8",
    name: "Aahana",
    role: "Technical Member",
    category: "2",
    domain: "web",
    imageUrl: "aahana.jpg",
    linkedinUrl: "#",
    githubUrl: "#"
  },
  {
    id: "mem-tech-9",
    name: "Esha",
    role: "Technical Member",
    category: "2",
    domain: "web",
    imageUrl: "esha.jpg",
    linkedinUrl: "#",
    githubUrl: "#"
  },
  {
    id: "mem-tech-10",
    name: "Fatema",
    role: "Technical Member",
    category: "2",
    domain: "aiml",
    imageUrl: "fatema.jpg",
    linkedinUrl: "#",
    githubUrl: "#"
  },
  {
    id: "mem-tech-11",
    name: "Suyash",
    role: "Technical Member",
    category: "2",
    domain: "iot",
    imageUrl: "suyash.jpg",
    linkedinUrl: "#",
    githubUrl: "#"
  },
  {
    id: "mem-tech-12",
    name: "Yash Bhilare",
    role: "Technical Member",
    category: "2",
    domain: "iot",
    imageUrl: "yash.jpg",
    linkedinUrl: "https://www.linkedin.com/in/yash-bhilare",
    githubUrl: "https://github.com/yash-bhilare"
  },
  {
    id: "mem-tech-13",
    name: "Vaishnavi",
    role: "Technical Member",
    category: "2",
    domain: "web",
    imageUrl: "vaishnavi.jpg",
    linkedinUrl: "#",
    githubUrl: "#"
  },
  {
    id: "mem-tech-14",
    name: "Dhanali",
    role: "Technical Member",
    category: "2",
    domain: "research",
    imageUrl: "dhanali.jpg",
    linkedinUrl: "#",
    githubUrl: "#"
  },
  {
    id: "mem-tech-15",
    name: "Nitiraj",
    role: "Technical Member",
    category: "2",
    domain: "aiml",
    imageUrl: "nitiraj.jpeg",
    linkedinUrl: "#",
    githubUrl: "#"
  },
  {
    id: "mem-tech-16",
    name: "Nishanth",
    role: "Technical Member",
    category: "2",
    domain: "iot",
    imageUrl: "nishanth.jpg",
    linkedinUrl: "#",
    githubUrl: "#"
  },
  {
    id: "mem-tech-17",
    name: "Shivansh",
    role: "Technical Member",
    category: "2",
    domain: "cybersec",
    imageUrl: "shivansh.jpg",
    linkedinUrl: "#",
    githubUrl: "#"
  }
];


// Fetch Projects from Firestore or LocalStorage fallback
async function getProjects(domainFilter = null) {
  let projects = [];
  if (typeof firebase !== 'undefined' && typeof db !== 'undefined' && db && !isDemoModeActive()) {
    try {
      let query = db.collection("projects");
      if (domainFilter && domainFilter !== "all") {
        query = query.where("domain", "==", domainFilter);
      }
      const snapshot = await query.get();
      snapshot.forEach(doc => {
        projects.push({ id: doc.id, ...doc.data() });
      });
      if (projects.length > 0) return projects;

      // If Firestore database collection is empty, auto-seed it with the initial 31 projects!
      console.log("🔥 Firestore `projects` collection is empty. Auto-seeding 31 projects into Firebase DB...");
      for (const p of INITIAL_PROJECTS_DATA) {
        db.collection("projects").doc(p.id).set(p, { merge: true }).catch(err => console.warn("Seed error:", err));
      }
      projects = [...INITIAL_PROJECTS_DATA];
      if (domainFilter && domainFilter !== "all") {
        projects = projects.filter(p => p.domain === domainFilter);
      }
      return projects;
    } catch(e) {
      console.warn("Firestore fetch error, falling back to LocalStorage:", e);
    }
  }

  const stored = localStorage.getItem("astra_projects");
  if (stored) {
    try { 
      projects = JSON.parse(stored);
      let needsReset = false;
      projects.forEach(p => {
        if (p.imageUrl && (p.imageUrl.includes('.jpg') || p.imageUrl.includes('.png') || p.imageUrl.includes('.webp'))) {
          p.imageUrl = "";
          needsReset = true;
        }
      });
      if (needsReset || projects.length < INITIAL_PROJECTS_DATA.length) {
        projects = [...INITIAL_PROJECTS_DATA];
        localStorage.setItem("astra_projects", JSON.stringify(projects));
      }
    } catch(e) {
      projects = [...INITIAL_PROJECTS_DATA];
    }
  } else {
    projects = [...INITIAL_PROJECTS_DATA];
    localStorage.setItem("astra_projects", JSON.stringify(projects));
  }

  if (domainFilter && domainFilter !== "all") {
    projects = projects.filter(p => p.domain === domainFilter);
  }
  return projects;
}

// Fetch Events
async function getEvents() {
  let events = [];
  const defaultEvents = [
    {
      id: "evt-1",
      title: "FY B.Tech Induction (2025-26)",
      date: "August 2025",
      venue: "VU Main Auditorium",
      imageUrl: "inaugration.jpg",
      registrationUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfHWbYhYEGoX3_8TJEBbY4nBEivX0HzMNaXenmSoNQR-xzKuw/viewform"
    },
    {
      id: "evt-2",
      title: "Cyber Awareness & Fun Activities",
      date: "August 2025",
      venue: "Engineering Seminar Hall",
      imageUrl: "cybersec1.png",
      registrationUrl: ""
    },
    {
      id: "evt-3",
      title: "ASTRA Ideathon 2025",
      date: "September 2025",
      venue: "VU Innovation Lab",
      imageUrl: "image1.jpg",
      registrationUrl: ""
    },
    {
      id: "evt-4",
      title: "ASEP Technical Workshop",
      date: "October 2025",
      venue: "Online & Hardware Lab",
      imageUrl: "image2.jpg",
      registrationUrl: ""
    },
    {
      id: "evt-5",
      title: "AI and Web Essentials Workshop",
      date: "April 2026",
      venue: "Dept. Computer Labs",
      imageUrl: "ai.webp",
      registrationUrl: ""
    },
    {
      id: "evt-6",
      title: "Research Paper Writing Workshop",
      date: "April 2026",
      venue: "Department Seminar Hall",
      imageUrl: "research.jpg",
      registrationUrl: ""
    }
  ];

  if (typeof firebase !== 'undefined' && typeof db !== 'undefined' && db && !isDemoModeActive()) {
    try {
      const snapshot = await db.collection("events").get();
      snapshot.forEach(doc => {
        events.push({ id: doc.id, ...doc.data() });
      });
      if (events.length > 0) return events;

      // Auto-seed events to Firestore if empty
      console.log("🔥 Firestore `events` collection is empty. Auto-seeding events into Firebase DB...");
      for (const e of defaultEvents) {
        db.collection("events").doc(e.id).set(e, { merge: true }).catch(err => console.warn("Event seed error:", err));
      }
      return defaultEvents;
    } catch(e) {
      console.warn("Firestore fetch error, falling back to LocalStorage:", e);
    }
  }

  const stored = localStorage.getItem("astra_events");
  if (stored) {
    try { events = JSON.parse(stored); } catch(e) {}
  } else {
    events = [...defaultEvents];
    localStorage.setItem("astra_events", JSON.stringify(events));
  }
  return events;
}

// Fetch Members
async function getMembers() {
  let members = [];
  if (typeof firebase !== 'undefined' && typeof db !== 'undefined' && db && !isDemoModeActive()) {
    try {
      const snapshot = await db.collection("members").get();
      snapshot.forEach(doc => {
        members.push({ id: doc.id, ...doc.data() });
      });
      if (members.length > 0) return members;

      // Auto-seed members to Firestore if empty
      console.log("🔥 Firestore `members` collection is empty. Auto-seeding 30 members into Firebase DB...");
      for (const m of INITIAL_MEMBERS_DATA) {
        db.collection("members").doc(m.id).set(m, { merge: true }).catch(err => console.warn("Member seed error:", err));
      }
      return [...INITIAL_MEMBERS_DATA];
    } catch(e) {
      console.warn("Firestore fetch error for members, falling back to LocalStorage:", e);
    }
  }

  const stored = localStorage.getItem("astra_members");
  if (stored) {
    try {
      members = JSON.parse(stored);
      if (members.length < INITIAL_MEMBERS_DATA.length || members.some(m => !m.imageUrl || m.imageUrl === "")) {
        members = [...INITIAL_MEMBERS_DATA];
        localStorage.setItem("astra_members", JSON.stringify(members));
      }
    } catch(e) {
      members = [...INITIAL_MEMBERS_DATA];
      localStorage.setItem("astra_members", JSON.stringify(members));
    }
  } else {
    members = [...INITIAL_MEMBERS_DATA];
    localStorage.setItem("astra_members", JSON.stringify(members));
  }
  return members;
}



// Initialize Dynamic Views on Page Load
document.addEventListener("DOMContentLoaded", () => {
  renderProjectsHubPage();
  renderProjectDomainPage();
  renderEventsOnHome();
  renderMembersPage();
});

// ----------------------------------------------------
// 1. PROJECTS HUB PAGE (projects.html)
// Renders pure Domain Showcase Cards that redirect to projectdomain.html?domain=...
// ----------------------------------------------------
async function renderProjectsHubPage() {
  const container = document.querySelector(".projects-pane");
  if (!container || !window.location.pathname.includes("projects.html")) return;

  const projects = await getProjects();

  // Count projects per domain
  const counts = { all: projects.length, web: 0, aiml: 0, cybersec: 0, iot: 0, research: 0, interdisc: 0 };
  projects.forEach(p => {
    if (counts[p.domain] !== undefined) counts[p.domain]++;
  });

  let html = `
    <!-- Header Section -->
    <div style="text-align: center; margin-bottom: 3rem;">
      <h2 style="font-family: 'Orbitron', sans-serif; font-size: 2.3rem; font-weight: 700; color: #ffffff; text-shadow: 0 0 20px rgba(255, 69, 0, 0.5); margin-bottom: 0.8rem;">
        TECHNICAL DOMAIN LABS
      </h2>
      <p style="color: #cccccc; font-size: 1.1rem; max-width: 780px; margin: 0 auto; line-height: 1.6;">
        💡 <em>Select any technical domain card below to open its dedicated project showcase page.</em>
      </p>
    </div>

    <!-- Domain Showcase Cards Grid -->
    <div class="astra-domain-hub-grid">
      
      <!-- 1. All Projects Card -->
      <div class="domain-hub-card" onclick="window.location.href='projectdomain.html?domain=all'">
        <div class="domain-hub-icon">🚀</div>
        <h3 class="domain-hub-title">All Club Projects</h3>
        <p class="domain-hub-tag">Complete showcase across all A.S.T.R.A technical domains and research tracks.</p>
        <div class="domain-hub-meta">
          <span>Scope: <strong>Global Repository</strong></span>
          <span class="domain-count-badge">${counts.all} Projects</span>
        </div>
        <div class="domain-hub-btn">View All Club Projects →</div>
      </div>

      <!-- 2. Web Dev Card -->
      <div class="domain-hub-card" onclick="window.location.href='projectdomain.html?domain=web'">
        <div class="domain-hub-icon">🌐</div>
        <h3 class="domain-hub-title">Full Stack & Web Dev</h3>
        <p class="domain-hub-tag">Web portals, cloud platforms, SIH EdTech apps, and modern UI/UX engineering.</p>
        <div class="domain-hub-meta">
          <span>Lead: <strong>Manjiri Kench</strong></span>
          <span class="domain-count-badge">${counts.web} Projects</span>
        </div>
        <div class="domain-hub-btn">Explore Full Stack Page →</div>
      </div>

      <!-- 3. AI / ML Card -->
      <div class="domain-hub-card" onclick="window.location.href='projectdomain.html?domain=aiml'">
        <div class="domain-hub-icon">🤖</div>
        <h3 class="domain-hub-title">AI, ML & Data Science</h3>
        <p class="domain-hub-tag">Neural networks in C, computer vision, financial NLP, and deep learning diagnostics.</p>
        <div class="domain-hub-meta">
          <span>Leads: <strong>Anish, Om, Pravesh</strong></span>
          <span class="domain-count-badge">${counts.aiml} Projects</span>
        </div>
        <div class="domain-hub-btn">Explore AI & ML Page →</div>
      </div>

      <!-- 4. Cybersecurity Card -->
      <div class="domain-hub-card" onclick="window.location.href='projectdomain.html?domain=cybersec'">
        <div class="domain-hub-icon">🛡️</div>
        <h3 class="domain-hub-title">Cybersecurity & OSINT</h3>
        <p class="domain-hub-tag">OSINT social media threat monitoring (IDEX ADITI 4.0 IAF) & real-time intrusion detection.</p>
        <div class="domain-hub-meta">
          <span>Leads: <strong>Namash & Mayank</strong></span>
          <span class="domain-count-badge">${counts.cybersec} Projects</span>
        </div>
        <div class="domain-hub-btn">Explore Security Page →</div>
      </div>

      <!-- 5. Robotics & IoT Card -->
      <div class="domain-hub-card" onclick="window.location.href='projectdomain.html?domain=iot'">
        <div class="domain-hub-icon">⚡</div>
        <h3 class="domain-hub-title">Robotics & IoT Automation</h3>
        <p class="domain-hub-tag">Hazardous gas sensing rovers, delivery robots & automated poultry climate systems.</p>
        <div class="domain-hub-meta">
          <span>Lead: <strong>Swayam Dhawade</strong></span>
          <span class="domain-count-badge">${counts.iot} Projects</span>
        </div>
        <div class="domain-hub-btn">Explore Robotics Page →</div>
      </div>

      <!-- 6. RnD & Research Card -->
      <div class="domain-hub-card" onclick="window.location.href='projectdomain.html?domain=research'">
        <div class="domain-hub-icon">🔬</div>
        <h3 class="domain-hub-title">RnD & Academic Research</h3>
        <p class="domain-hub-tag">IEEE paper publishing pipelines, academic thesis frameworks & automated LaTeX toolkits.</p>
        <div class="domain-hub-meta">
          <span>Lead: <strong>Karthik Kurup</strong></span>
          <span class="domain-count-badge">${counts.research} Projects</span>
        </div>
        <div class="domain-hub-btn">Explore Research Page →</div>
      </div>

      <!-- 7. Interdisciplinary Labs Card -->
      <div class="domain-hub-card" onclick="window.location.href='projectdomain.html?domain=interdisc'">
        <div class="domain-hub-icon">🧩</div>
        <h3 class="domain-hub-title">Interdisciplinary Labs</h3>
        <p class="domain-hub-tag">Multi-domain hackathon systems (AgriSarathi, Krishi Mitra) & OS kernel development.</p>
        <div class="domain-hub-meta">
          <span>Leads: <strong>Core Engineering Team</strong></span>
          <span class="domain-count-badge">${counts.interdisc} Projects</span>
        </div>
        <div class="domain-hub-btn">Explore Interdisciplinary Page →</div>
      </div>

    </div>
  `;

  container.innerHTML = html;
  injectModernHubStyles();
}

// ----------------------------------------------------
// 2. DYNAMIC DOMAIN SHOWCASE PAGE (projectdomain.html)
// Renders projects under the specified domain (?domain=...)
// ----------------------------------------------------
async function renderProjectDomainPage() {
  const container = document.getElementById("projectdomain-main");
  if (!container || !window.location.pathname.includes("projectdomain.html")) return;

  // Read domain from URL query params
  const urlParams = new URLSearchParams(window.location.search);
  let domainKey = urlParams.get("domain") || "all";
  if (!DOMAINS_CONFIG[domainKey]) domainKey = "all";

  const currentConfig = DOMAINS_CONFIG[domainKey];
  const projects = await getProjects(domainKey);

  // Quick Domain Switcher Strip HTML
  let switcherHtml = `<div class="domain-switcher-strip">`;
  Object.keys(DOMAINS_CONFIG).forEach(key => {
    const cfg = DOMAINS_CONFIG[key];
    const isActive = key === domainKey ? 'active' : '';
    switcherHtml += `<a href="projectdomain.html?domain=${key}" class="domain-switch-btn ${isActive}">${cfg.icon} ${cfg.short}</a>`;
  });
  switcherHtml += `</div>`;

  // Domain Header HTML
  let headerHtml = `
    <div style="margin-bottom: 1.5rem;">
      <a href="projects.html" style="color: #ff7060; font-size: 0.9rem; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;">
        ← Back to Technical Domains Hub
      </a>
    </div>

    ${switcherHtml}

    <div class="domain-header-card">
      <div class="domain-header-icon">${currentConfig.icon}</div>
      <h1 class="domain-header-title">${currentConfig.name}</h1>
      <p class="domain-header-desc">${currentConfig.tag}</p>
      <div style="display: flex; gap: 1rem; justify-content: center; align-items: center; flex-wrap: wrap;">
        <span class="domain-header-badge">👤 Lead: ${currentConfig.lead || 'Core Member Leads'}</span>
        <span class="domain-header-badge" style="background: rgba(255, 69, 0, 0.25); border-color: #FF4500;">🚀 ${projects.length} Project${projects.length === 1 ? '' : 's'} Built</span>
      </div>
    </div>
  `;

  // Projects Cards Grid HTML
  let gridHtml = `<div class="cards" style="display: flex; flex-wrap: wrap; gap: 2rem; justify-content: center;">`;

  if (projects.length === 0) {
    gridHtml += `
      <div style="text-align:center; padding:4rem 2rem; color:#aaa; font-style:italic; background: rgba(17,17,17,0.6); border: 1px dashed rgba(139,0,0,0.4); border-radius: 14px; width: 100%; max-width: 600px;">
        <p style="font-size: 1.2rem; color: #ff7060;">No projects listed under this domain yet.</p>
        <p style="font-size: 0.95rem; margin-top: 0.5rem;">Core domain members can log in via RBAC dashboard to upload new projects.</p>
      </div>
    `;
  } else {
    projects.forEach((p, i) => {
      const config = DOMAINS_CONFIG[p.domain] || { name: p.domain, icon: "💻", short: p.domain };
      const githubBtn = p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" class="proj-action-btn github-btn">GitHub Repo 💻</a>` : '';
      const demoBtn = p.demoUrl ? `<a href="${p.demoUrl}" target="_blank" class="proj-action-btn demo-btn">Live Demo 🚀</a>` : '';

      // Image Block - Only render if imageUrl is explicitly provided and valid
      const imageBlock = (p.imageUrl && p.imageUrl.trim() !== "") 
        ? `<img src="${p.imageUrl}" alt="${p.title}" style="width:100%; height:180px; object-fit:cover; border-radius:8px; margin-bottom:1rem;" />`
        : `<div style="background: linear-gradient(135deg, rgba(35,8,8,0.85), rgba(15,5,5,0.95)); border: 1px solid rgba(139,0,0,0.4); border-radius: 10px; padding: 1.2rem; margin-bottom: 1.2rem; display: flex; align-items: center; justify-content: space-between;">
             <span style="font-size: 2.2rem;">${config.icon}</span>
             <span style="background: rgba(139,0,0,0.5); color: #ff7060; border: 1px solid rgba(255,69,0,0.3); font-size: 0.78rem; font-weight: 700; padding: 0.25rem 0.7rem; border-radius: 14px;">${config.short}</span>
           </div>`;

      gridHtml += `
        <div class="card popin" style="width: 360px; min-width: 300px; background: linear-gradient(135deg, rgba(18,18,18,0.9), rgba(8,8,8,0.95)); border: 1px solid rgba(139,0,0,0.4); border-radius: 16px; padding: 1.6rem; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.3s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
          <div>
            ${imageBlock}
            <h3 style="color:#ffffff; font-size:1.25rem; font-weight:700; margin-bottom:0.4rem; font-family: 'Poppins', sans-serif;">${p.title}</h3>
            ${p.duration ? `<p style="font-size:0.82rem; color:#ff7060; font-weight:600; margin-bottom:0.6rem;">⏱️ Timeline: <span style="color:#cccccc; font-weight:400;">${p.duration}</span></p>` : ''}
            <p style="font-size:0.92rem; color:#bbbbbb; line-height:1.55; margin-bottom:1.2rem;">${p.description}</p>
          </div>

          <div>
            ${p.authorName ? `<p style="font-size:0.82rem; color:#888888; font-weight:600; margin-bottom:1rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.6rem;">Lead / Developers: <span style="color:#ffffff;">${p.authorName}</span></p>` : ''}
            <div style="display:flex; gap:0.6rem; justify-content:flex-start; flex-wrap:wrap;">
              ${githubBtn}
              ${demoBtn}
            </div>
          </div>
        </div>
      `;
    });
  }

  gridHtml += `</div>`;

  container.innerHTML = headerHtml + gridHtml;
  injectModernHubStyles();
}

// Inject Styles for Projects Hub & Domain Showcase
function injectModernHubStyles() {
  if (document.getElementById("astra-modern-hub-css")) return;

  const css = `
    .astra-domain-hub-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
      max-width: 1240px;
      margin: 0 auto;
    }
    .domain-hub-card {
      background: linear-gradient(135deg, rgba(20, 5, 5, 0.85) 0%, rgba(10, 10, 10, 0.95) 100%);
      border: 1px solid rgba(139, 0, 0, 0.4);
      border-radius: 16px;
      padding: 2rem;
      cursor: pointer;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      position: relative;
      overflow: hidden;
    }
    .domain-hub-card:hover {
      border-color: #FF4500;
      transform: translateY(-6px) scale(1.02);
      box-shadow: 0 12px 30px rgba(255, 69, 0, 0.25);
    }
    .domain-hub-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    .domain-hub-title {
      font-family: 'Poppins', sans-serif;
      font-weight: 700;
      color: #ffffff;
      font-size: 1.3rem;
      margin-bottom: 0.6rem;
    }
    .domain-hub-tag {
      font-size: 0.9rem;
      color: #bbbbbb;
      line-height: 1.5;
      margin-bottom: 1.5rem;
      flex-grow: 1;
    }
    .domain-hub-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.82rem;
      color: #aaaaaa;
      border-top: 1px solid rgba(255,255,255,0.08);
      padding-top: 1rem;
      margin-bottom: 1rem;
    }
    .domain-count-badge {
      background: rgba(139, 0, 0, 0.5);
      color: #ff7060;
      border: 1px solid rgba(255, 69, 0, 0.3);
      font-weight: 700;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
    }
    .domain-hub-btn {
      background: rgba(139, 0, 0, 0.3);
      color: #ffffff;
      border: 1px solid rgba(255, 69, 0, 0.4);
      padding: 0.65rem 1.2rem;
      border-radius: 30px;
      font-size: 0.88rem;
      font-weight: 600;
      text-align: center;
      transition: all 0.25s ease;
    }
    .domain-hub-card:hover .domain-hub-btn {
      background: #FF4500;
      border-color: #FF4500;
      box-shadow: 0 0 15px rgba(255, 69, 0, 0.4);
    }
    .proj-action-btn {
      padding: 0.4rem 0.9rem;
      border-radius: 20px;
      text-decoration: none;
      font-size: 0.8rem;
      font-weight: 600;
      transition: all 0.25s ease;
      display: inline-flex;
      align-items: center;
    }
    .github-btn {
      background: rgba(30, 10, 10, 0.8);
      color: #cccccc;
      border: 1px solid rgba(139, 0, 0, 0.5);
    }
    .github-btn:hover {
      background: #8B0000;
      color: #ffffff;
      border-color: #FF4500;
    }
    .demo-btn {
      background: #8B0000;
      color: #ffffff;
      border: 1px solid #FF4500;
    }
    .demo-btn:hover {
      background: #FF4500;
      color: #ffffff;
      box-shadow: 0 0 12px rgba(255, 69, 0, 0.5);
    }
    /* Project cards on domain page */
    .card.popin {
      animation: popIn 0.4s ease both;
    }
    .card.popin:hover {
      border-color: #FF4500 !important;
      transform: translateY(-5px);
      box-shadow: 0 14px 32px rgba(255, 69, 0, 0.22) !important;
    }
    @keyframes popIn {
      from { opacity: 0; transform: translateY(18px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    /* Stagger animation delay for cards */
    .cards .card.popin:nth-child(1)  { animation-delay: 0.05s; }
    .cards .card.popin:nth-child(2)  { animation-delay: 0.10s; }
    .cards .card.popin:nth-child(3)  { animation-delay: 0.15s; }
    .cards .card.popin:nth-child(4)  { animation-delay: 0.20s; }
    .cards .card.popin:nth-child(5)  { animation-delay: 0.25s; }
    .cards .card.popin:nth-child(6)  { animation-delay: 0.30s; }
    .cards .card.popin:nth-child(7)  { animation-delay: 0.35s; }
    .cards .card.popin:nth-child(8)  { animation-delay: 0.40s; }
    .cards .card.popin:nth-child(9)  { animation-delay: 0.45s; }
    .cards .card.popin:nth-child(10) { animation-delay: 0.50s; }
    /* Switcher strip scrollable on mobile */
    @media (max-width: 768px) {
      .domain-switcher-strip {
        gap: 0.5rem;
        overflow-x: auto;
        flex-wrap: nowrap;
        justify-content: flex-start;
        padding-bottom: 0.5rem;
      }
      .domain-switch-btn { white-space: nowrap; }
      .astra-domain-hub-grid { grid-template-columns: 1fr; }
      .cards { flex-direction: column; align-items: center; }
      .card.popin { width: 100% !important; min-width: unset !important; }
    }
  `;

  const style = document.createElement("style");
  style.id = "astra-modern-hub-css";
  style.textContent = css;
  document.head.appendChild(style);
}

// Render Events on Homepage (No default images)
async function renderEventsOnHome() {
  const cardsContainer = document.getElementById('dynamic-events-cards');
  if (!cardsContainer) return;

  const events = await getEvents();
  if (events.length === 0) return;

  let html = "";
  events.forEach((evt, i) => {
    const imageBlock = (evt.imageUrl && evt.imageUrl.trim() !== "") 
      ? `<img src="${evt.imageUrl}" alt="${evt.title}" style="width:100%; height:180px; object-fit:cover; border-radius:8px; margin-bottom:1rem;"/>`
      : `<div style="width:100%; height:100px; background:linear-gradient(135deg, rgba(30,5,5,0.8), rgba(15,5,5,0.9)); border:1px solid rgba(139,0,0,0.4); border-radius:8px; margin-bottom:1rem; display:flex; align-items:center; justify-content:center; font-size:2rem;">📅</div>`;

    html += `
      <div class="card popin" style="min-width: 300px; background: rgba(17,17,17,0.85); border: 1px solid rgba(139,0,0,0.4); border-radius:12px; padding:1.5rem; text-align:center;">
        ${imageBlock}
        <div style="color:#ffffff; font-weight:700; font-size:1.15rem; margin-bottom:0.5rem;">${evt.title}</div>
        <p style="font-size:0.88rem; color:#ccc;"><strong>📅 Date:</strong> ${evt.date}</p>
        <p style="font-size:0.88rem; color:#ccc;"><strong>📍 Venue:</strong> ${evt.venue}</p>
        ${evt.registrationUrl ? `<button onclick="window.open('${evt.registrationUrl}', '_blank')" style="margin-top:1rem; background:#8B0000; color:white; border:1px solid #FF4500; padding:0.5rem 1.2rem; border-radius:30px; font-weight:600; cursor:pointer; font-size:0.88rem; transition:0.25s;" onmouseover="this.style.background='#FF4500'" onmouseout="this.style.background='#8B0000'">Register Now</button>` : ''}
      </div>
    `;
  });

  cardsContainer.innerHTML = html;
}

// Fetch Members
async function getMembers() {
  let members = [];
  if (typeof firebase !== 'undefined' && typeof db !== 'undefined' && db && !isDemoModeActive()) {
    try {
      const snapshot = await db.collection("members").get();
      snapshot.forEach(doc => {
        members.push({ id: doc.id, ...doc.data() });
      });
      if (members.length >= INITIAL_MEMBERS_DATA.length) return members;

      // Auto-seed members to Firestore if empty or outdated
      console.log("🔥 Auto-seeding updated PPT & Technical members into Firebase DB...");
      for (const m of INITIAL_MEMBERS_DATA) {
        db.collection("members").doc(m.id).set(m, { merge: true }).catch(err => console.warn("Member seed error:", err));
      }
      return [...INITIAL_MEMBERS_DATA];
    } catch(e) {
      console.warn("Firestore fetch error for members, falling back to LocalStorage:", e);
    }
  }

  const stored = localStorage.getItem("astra_members");
  if (stored) {
    try {
      members = JSON.parse(stored);
      // Auto-refresh cache if roster structure changed
      if (members.length < INITIAL_MEMBERS_DATA.length || !members.some(m => m.id && m.id.includes("mem-ppt-"))) {
        members = [...INITIAL_MEMBERS_DATA];
        localStorage.setItem("astra_members", JSON.stringify(members));
      }
    } catch(e) {
      members = [...INITIAL_MEMBERS_DATA];
      localStorage.setItem("astra_members", JSON.stringify(members));
    }
  } else {
    members = [...INITIAL_MEMBERS_DATA];
    localStorage.setItem("astra_members", JSON.stringify(members));
  }
  return members;
}

// Initialize Dynamic Views on Page Load
document.addEventListener("DOMContentLoaded", () => {
  renderProjectsHubPage();
  renderProjectDomainPage();
  renderEventsOnHome();
  renderMembersPage();
});

// Render Members Page Dynamically — Real roster with photos & SVG icons
async function renderMembersPage() {
  const container = document.getElementById("dynamic-members-main");
  if (!container || !window.location.pathname.includes("members.html")) return;

  const members = await getMembers();

  const LINKEDIN_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width:22px;height:22px;fill:currentColor;"><path d="M22.23 0H1.77C.79 0 0 .78 0 1.75v20.5C0 23.22.79 24 1.77 24h20.46c.98 0 1.77-.78 1.77-1.75V1.75c0-.97-.79-1.75-1.77-1.75zM7.05 20.47H3.59V9H7.05v11.47zM5.32 7.55c-1.12 0-2.03-.92-2.03-2.05s.91-2.05 2.03-2.05c1.13 0 2.04.92 2.04 2.05s-.91 2.05-2.04 2.05zm15.15 12.92h-3.51v-5.6c0-1.34-.02-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7H9.83V9h3.38v1.54h.05c.47-.9 1.63-1.86 3.32-1.86 3.56 0 4.22 2.34 4.22 5.38v6.31z"/></svg>`;
  const GITHUB_SVG   = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width:22px;height:22px;fill:currentColor;"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.332-1.756-1.332-1.756-1.09-.744.083-.73.083-.73 1.205.085 1.838 1.238 1.838 1.238 1.07 1.834 2.809 1.306 3.492.998.108-.775.418-1.305.762-1.605-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.52.125-3.174 0 0 1.005-.322 3.301 1.23.956-.266 1.96-.399 2.96-.399s1.004.133 2.96.399c2.296-1.552 3.3-1.23 3.3-1.23.665 1.654.26 2.871.125 3.174.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.625-5.474 5.923.43.37.81 1.096.81 2.213 0 1.604-.015 2.89-.015 3.284 0 .319.21.694.825.575C20.565 22.102 24 17.59 24 12.297c0-6.627-5.373-12-12-12z"/></svg>`;

  const categories = {
    "1": { title: "MEET OUR TEAM", items: [] },
    "2": { title: "TECHNICAL MEMBERS", items: [] }
  };

  members.forEach(m => {
    const cat = m.category || "2";
    if (categories[cat]) categories[cat].items.push(m);
    else categories["2"].items.push(m);
  });

  let html = `<style>
    .mem-section-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.85rem;
      font-weight: 700;
      color: #ffffff;
      text-align: center;
      margin-bottom: 0.6rem;
      text-shadow: 0 0 12px rgba(255, 69, 0, 0.4);
    }
    .mem-divider {
      width: 80px;
      height: 2px;
      background: linear-gradient(90deg, #8B0000, #FF4500);
      margin: 0 auto 2.5rem auto;
      border-radius: 2px;
      box-shadow: 0 0 8px rgba(255,69,0,0.5);
    }
    .mem-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 2rem;
    }
    .lead-card-dyn {
      background: #1a0303f5;
      border: 1px solid rgba(139,0,0,0.5);
      border-radius: 1.2rem;
      box-shadow: 0 0 16px rgba(196,0,0,0.35);
      padding: 1.6rem 1.4rem 1.4rem;
      width: 210px;
      min-width: 180px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .lead-card-dyn:hover {
      transform: translateY(-8px) scale(1.05);
      box-shadow: 0 10px 32px rgba(255,45,45,0.55);
    }
    .lead-card-dyn img {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 0.9rem;
      border: 2.5px solid #ff7a59;
      filter: drop-shadow(0 0 8px rgba(255,180,130,0.5));
      transition: filter 0.2s;
    }
    .lead-card-dyn img:hover { filter: drop-shadow(0 0 16px #ff4a4a); }
    .lead-card-dyn .mem-no-photo {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(40,5,5,0.9), rgba(15,5,5,0.9));
      border: 2.5px solid #ff7a59;
      margin-bottom: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.8rem;
      color: #ff7060;
    }
    .lead-card-dyn .mem-name { color: #fffde9; font-size: 1rem; font-weight: 700; margin-bottom: 0.3rem; }
    .lead-card-dyn .mem-role { color: #ff7060; font-size: 0.82rem; font-weight: 600; margin-bottom: 0.9rem; letter-spacing: 0.02em; }
    .lead-card-dyn .mem-socials { display: flex; gap: 1rem; justify-content: center; margin-top: auto; }
    .mem-social-icon { color: #ff7060; transition: color 0.2s, transform 0.2s; display: flex; }
    .mem-social-icon:hover { color: #ffb18e; transform: scale(1.25); }
  </style>`;

  Object.keys(categories).forEach(catId => {
    const group = categories[catId];
    if (group.items.length === 0) return;

    html += `
      <div style="margin-bottom: 4rem;">
        <h2 class="mem-section-title">${group.title}</h2>
        <div class="mem-divider"></div>
        <div class="mem-grid">
    `;

    group.items.forEach(m => {
      const linkedinUrl = (m.linkedinUrl && m.linkedinUrl.trim() !== "" && m.linkedinUrl !== "#") ? m.linkedinUrl : "#";
      const githubUrl = (m.githubUrl && m.githubUrl.trim() !== "" && m.githubUrl !== "#") ? m.githubUrl : "#";

      const linkedinLink = `<a href="${linkedinUrl}" target="_blank" class="mem-social-icon" aria-label="LinkedIn" title="LinkedIn Profile">${LINKEDIN_SVG}</a>`;
      const githubLink = `<a href="${githubUrl}" target="_blank" class="mem-social-icon" aria-label="GitHub" title="GitHub Profile">${GITHUB_SVG}</a>`;

      const photoBlock = (m.imageUrl && m.imageUrl.trim() !== "")
        ? `<img src="${m.imageUrl}" alt="${m.name}" onerror="this.onerror=null; this.src='a.jpg';" />`
        : `<div class="mem-no-photo">👤</div>`;

      html += `
        <div class="lead-card-dyn">
          ${photoBlock}
          <div class="mem-name">${m.name}</div>
          <div class="mem-role">${m.role}</div>
          <div class="mem-socials">
            ${linkedinLink}
            ${githubLink}
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
  });

  container.innerHTML = html;
}
