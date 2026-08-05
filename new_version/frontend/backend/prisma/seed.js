const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Roles
  const roles = [
    { name: 'Faculty Mentor', level: 1 },
    { name: 'President', level: 2 },
    { name: 'Vice President', level: 2 },
    { name: 'Research Advisor', level: 2 },
    { name: 'Lead Developer', level: 2 },
    { name: 'Domain Head', level: 3 },
    { name: 'Technical Member', level: 4 },
  ];

  for (const roleData of roles) {
    await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: roleData,
    });
  }
  console.log('Roles seeded.');

  // 2. Domains
  const domains = [
    { 
        name: 'AI/ML/DS', 
        tagline: '“Driving innovation through intelligent systems and data-driven insights. From predictive models to autonomous agents, we build the future.”',
        description: 'We believe AI is more than just code; it\'s about building systems that can reason and adapt.',
        logoUrl: 'logoai.png'
    },
    { 
        name: 'Web Development', 
        tagline: '“Building the digital frontier with responsive design, powerful backend systems, and seamless user experiences. We are the architects of the web.”',
        description: 'Using modern frameworks and libraries, we build responsive and interactive web applications.',
        logoUrl: 'logofull.png'
    },
    { 
        name: 'Cybersecurity', 
        tagline: 'We teach how to defend systems, detect vulnerabilities, and practice ethical hacking to build a safer digital world.',
        description: 'Focusing on Ethical Hacking, Digital Forensics, Threat Intelligence, and Secure Development.',
        logoUrl: 'logocyber.png'
    },
    { 
        name: 'IoT & Robotics', 
        tagline: '“We are the architects of the automated future. The IoT & Robotics domain is where we bring code to life, building intelligent machines and interconnected systems that interact with the physical world.”',
        description: 'Utilizing ESP32 and Arduino for powerful connected devices.',
        logoUrl: 'logoiot.png'
    },
    { 
        name: 'Tech Ops / DevOps', 
        tagline: '"Bridging the gap between development and operations to build resilient, scalable systems."',
        description: 'Focusing on CI/CD, Infrastructure as Code, and Automation.',
        logoUrl: 'logod.png'
    },
    { 
        name: 'Research & Innovation', 
        tagline: '"Empowering curiosity and creativity to spark breakthrough technologies and interdisciplinary solutions."',
        description: 'Focusing on Computational Research, Hardware Innovation, and Environmental Tech.',
        logoUrl: 'logor.png'
    }
  ];

  for (const domainData of domains) {
    await prisma.domain.upsert({
      where: { name: domainData.name },
      update: {},
      create: domainData,
    });
  }
  console.log('Domains seeded.');

  // Fetch Roles & Domains for Members
  const presRole = await prisma.role.findUnique({ where: { name: 'President' } });
  const facRole = await prisma.role.findUnique({ where: { name: 'Faculty Mentor' } });
  const vprRole = await prisma.role.findUnique({ where: { name: 'Vice President' } });
  const devRole = await prisma.role.findUnique({ where: { name: 'Lead Developer' } });

  const aiDomain = await prisma.domain.findUnique({ where: { name: 'AI/ML/DS' } });
  const webDomain = await prisma.domain.findUnique({ where: { name: 'Web Development' } });

  // 3. Members
  const members = [
    {
      firstName: 'Namash',
      lastName: 'Kate',
      personalEmail: 'namash@astrademo.com', // Dummy email
      roleId: presRole.id,
      primaryDomainId: aiDomain.id,
      linkedinUrl: '#',
      githubUrl: '#',
      profileImageUrl: 'namash.jpg',
      status: 'active'
    },
    {
      firstName: 'Prof. Yogita',
      lastName: 'Patil',
      personalEmail: 'yogitapatil@astrademo.com',
      roleId: facRole.id,
      linkedinUrl: '#',
      githubUrl: '#',
      profileImageUrl: 'yogita.jpg',
      status: 'active'
    },
    {
      firstName: 'Shravani',
      lastName: 'Patki',
      personalEmail: 'shravani@astrademo.com',
      roleId: vprRole.id,
      linkedinUrl: '#',
      githubUrl: '#',
      profileImageUrl: 'Shravani.jpg',
      status: 'active'
    },
    {
      firstName: 'Yash',
      lastName: 'Lund',
      personalEmail: 'yash@astrademo.com',
      roleId: devRole.id,
      primaryDomainId: webDomain.id,
      linkedinUrl: '#',
      githubUrl: '#',
      profileImageUrl: 'yash.jpg',
      status: 'active'
    }
  ];

  for (const memberData of members) {
    await prisma.member.upsert({
      where: { personalEmail: memberData.personalEmail },
      update: {},
      create: memberData,
    });
  }
  console.log('Members seeded.');

  // Fetch Members for Events & Blogs
  const namash = await prisma.member.findUnique({ where: { personalEmail: 'namash@astrademo.com' } });

  // 4. Events
  const events = [
    {
      id: 'evt_intro',
      title: 'Club Introduction',
      description: 'The beginning of innovation. Watch out for what we do.',
      eventDate: new Date('2024-11-20T10:00:00Z'),
      venue: 'Seminar Hall 1',
      coverImageUrl: 'about.jpg',
      status: 'completed'
    },
    {
      id: 'evt_inaug',
      title: 'A.S.T.R.A Inaugration!',
      description: 'The official launch of the AI-driven Systems for Technological Research and Advancement club.',
      eventDate: new Date('2024-12-05T14:30:00Z'),
      venue: 'Main Auditorium',
      coverImageUrl: 'inaugration.jpg',
      status: 'completed'
    },
    {
        id: 'evt_bootcamp',
        title: 'Web-Development Bootcamp',
        description: 'Learn the essentials of modern frontend and backend development.',
        eventDate: new Date('2025-04-15T09:00:00Z'), // Future date
        venue: 'CCF-1 (Lab)',
        coverImageUrl: 'web.webp',
        status: 'upcoming'
    }
  ];

  for (const eventData of events) {
    // using findFirst since we added ID to the array manually for easier logic,
    // though in reality we'd probably use a unique constraint on title+date for upsert
    const existing = await prisma.event.findFirst({ where: { title: eventData.title } });
    if (!existing) {
        await prisma.event.create({ data: eventData });
    }
  }
  console.log('Events seeded.');

  // 5. Blogs
  const blogs = [
    {
        title: 'A.S.T.R.A Induction 2025 – The Highlights',
        content: '<p>Day 5 of A.S.T.R.A’s induction week was all about action...</p>',
        authorId: namash.id,
        coverImageUrl: 'A2.png',
        publishedDate: new Date('2025-01-20T10:00:00Z'),
        status: 'published'
    }
  ];

  for (const blogData of blogs) {
      const existing = await prisma.blog.findFirst({ where: { title: blogData.title } });
      if(!existing) {
          await prisma.blog.create({ data: blogData });
      }
  }
  console.log('Blogs seeded.');
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
