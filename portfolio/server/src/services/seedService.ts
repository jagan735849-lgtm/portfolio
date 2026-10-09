import mongoose from 'mongoose';
import { Admin } from '../models/Admin.js';
import { Profile } from '../models/Profile.js';
import { Project } from '../models/Project.js';
import { Skill } from '../models/Skill.js';
import { Experience } from '../models/Experience.js';
import { Education } from '../models/Education.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { logger } from '../utils/logger.js';
import { ENV } from '../config/env.js';

export const seedDatabase = async (standalone = true): Promise<void> => {
  try {
    if (standalone) {
      logger.info(`Attempting to connect to ${ENV.MONGODB_URI} for seed...`);
      try {
        await mongoose.connect(ENV.MONGODB_URI, { serverSelectionTimeoutMS: 2500 });
        logger.info('Connected to MongoDB for seeding.');
      } catch (err: any) {
        logger.warn(`Could not connect to external MongoDB (${err.message}). Using In-Memory MongoDB for standalone test seed...`);
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const memoryServer = await MongoMemoryServer.create();
        await mongoose.connect(memoryServer.getUri());
        logger.info('Connected to In-Memory MongoDB.');
      }
    }

    logger.info('Starting database seed process...');

    // 1. Seed Admin
    const existingAdmin = await Admin.findOne({ email: ENV.ADMIN_EMAIL.toLowerCase() });
    if (!existingAdmin) {
      await Admin.create({
        email: ENV.ADMIN_EMAIL.toLowerCase(),
        password: ENV.ADMIN_PASSWORD,
        name: 'Alex Mercer (Admin)',
        role: 'admin',
      });
      logger.info(`Admin user created: ${ENV.ADMIN_EMAIL}`);
    } else {
      logger.info('Admin user already exists, keeping current credentials.');
    }

    // 2. Seed Profile
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      await Profile.create({
        name: 'Alex Mercer',
        title: 'Senior Full-Stack Developer & Cloud Architect',
        tagline: 'Designing scalable architectures, robust distributed systems, and engaging web apps.',
        bio: 'I am a passionate senior full-stack developer with over 5 years of professional experience building web applications with React, TypeScript, Node.js, and cloud ecosystems. I specialize in designing scalable backend APIs, optimizing database pipelines, and crafting clean, accessible user interfaces.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        resumeUrl: '/uploads/Alex_Mercer_Resume.pdf',
        email: 'alex.mercer.dev@example.com',
        phone: '+1 (555) 349-8821',
        location: 'San Francisco, CA / Remote',
        availableForHire: true,
        yearsOfExperience: 5,
        socialLinks: {
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com',
          website: 'https://alexmercer.portfolio.dev',
        },
        strengths: [
          'Full-Stack Architecture & Microservices',
          'High Performance React, Next.js & TypeScript UIs',
          'Scalable REST & GraphQL Node.js APIs',
          'Docker, Kubernetes & AWS Cloud Deployments',
          'Database Design, Query Tuning & Redis Caching',
        ],
        stats: {
          projectsCompleted: 38,
          satisfiedClients: 24,
          yearsExperience: 5,
          codeCommits: 3120,
        },
      });
      logger.info('Profile created successfully.');
    }

    // 3. Seed Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      const skillsData = [
        // Frontend
        { name: 'React.js', category: 'frontend', proficiency: 95, level: 'Expert', icon: 'FaReact', order: 1 },
        { name: 'TypeScript', category: 'frontend', proficiency: 92, level: 'Expert', icon: 'SiTypescript', order: 2 },
        { name: 'Next.js', category: 'frontend', proficiency: 88, level: 'Advanced', icon: 'SiNextdotjs', order: 3 },
        { name: 'Bootstrap 5', category: 'frontend', proficiency: 90, level: 'Expert', icon: 'FaBootstrap', order: 4 },
        { name: 'Tailwind CSS', category: 'frontend', proficiency: 85, level: 'Advanced', icon: 'SiTailwindcss', order: 5 },
        { name: 'HTML5 & CSS3', category: 'frontend', proficiency: 96, level: 'Expert', icon: 'FaHtml5', order: 6 },
        { name: 'Redux / Zustand', category: 'frontend', proficiency: 87, level: 'Advanced', icon: 'SiRedux', order: 7 },

        // Backend
        { name: 'Node.js', category: 'backend', proficiency: 93, level: 'Expert', icon: 'FaNodeJs', order: 1 },
        { name: 'Express.js', category: 'backend', proficiency: 95, level: 'Expert', icon: 'SiExpress', order: 2 },
        { name: 'RESTful API Design', category: 'backend', proficiency: 96, level: 'Expert', icon: 'FaServer', order: 3 },
        { name: 'GraphQL', category: 'backend', proficiency: 82, level: 'Advanced', icon: 'SiGraphql', order: 4 },
        { name: 'NestJS', category: 'backend', proficiency: 80, level: 'Advanced', icon: 'SiNestjs', order: 5 },
        { name: 'Microservices', category: 'backend', proficiency: 85, level: 'Advanced', icon: 'FaCubes', order: 6 },

        // Databases
        { name: 'MongoDB & Mongoose', category: 'database', proficiency: 94, level: 'Expert', icon: 'SiMongodb', order: 1 },
        { name: 'PostgreSQL', category: 'database', proficiency: 88, level: 'Advanced', icon: 'SiPostgresql', order: 2 },
        { name: 'Redis Caching', category: 'database', proficiency: 86, level: 'Advanced', icon: 'SiRedis', order: 3 },
        { name: 'MySQL', category: 'database', proficiency: 84, level: 'Advanced', icon: 'SiMysql', order: 4 },

        // Programming
        { name: 'JavaScript (ES6+)', category: 'programming', proficiency: 96, level: 'Expert', icon: 'SiJavascript', order: 1 },
        { name: 'TypeScript', category: 'programming', proficiency: 94, level: 'Expert', icon: 'SiTypescript', order: 2 },
        { name: 'Python', category: 'programming', proficiency: 83, level: 'Advanced', icon: 'FaPython', order: 3 },
        { name: 'SQL', category: 'programming', proficiency: 88, level: 'Advanced', icon: 'FaDatabase', order: 4 },

        // Tools
        { name: 'Docker', category: 'tools', proficiency: 88, level: 'Advanced', icon: 'FaDocker', order: 1 },
        { name: 'Git & GitHub', category: 'tools', proficiency: 95, level: 'Expert', icon: 'FaGitAlt', order: 2 },
        { name: 'Swagger / OpenAPI', category: 'tools', proficiency: 90, level: 'Expert', icon: 'SiSwagger', order: 3 },
        { name: 'AWS (S3, EC2, Lambda)', category: 'tools', proficiency: 82, level: 'Advanced', icon: 'FaAws', order: 4 },
        { name: 'Vite & Webpack', category: 'tools', proficiency: 90, level: 'Expert', icon: 'SiVite', order: 5 },
        { name: 'Postman & Insomnia', category: 'tools', proficiency: 92, level: 'Expert', icon: 'SiPostman', order: 6 },
      ];

      await Skill.insertMany(skillsData);
      logger.info(`Inserted ${skillsData.length} skills.`);
    }

    // 4. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      const projectsData = [
        {
          title: 'CloudPulse - Distributed Metrics & APM Platform',
          description: 'A cloud infrastructure monitoring dashboard featuring real-time telemetry streaming, alerts, and container resource analytics.',
          longDescription: 'CloudPulse provides DevOps teams with single-pane-of-glass observability into distributed microservices. Built with React, TypeScript, Node.js, MongoDB, and Redis pub/sub for real-time WebSocket metric visualization.',
          thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Redis', 'Docker'],
          category: 'Full Stack',
          githubUrl: 'https://github.com/example/cloudpulse',
          liveDemoUrl: 'https://cloudpulse.demo.app',
          featured: true,
          order: 1,
        },
        {
          title: 'DevFlow - Collaborative Code Workspace & Kanban',
          description: 'An agile development workspace integrating issue management, interactive sprint boards, and GitHub pull request automation.',
          longDescription: 'DevFlow accelerates team delivery cycles with custom workflow pipelines, automated burndown charts, and role-based permissions.',
          thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=800&q=80',
          technologies: ['React', 'Bootstrap 5', 'TypeScript', 'Express', 'MongoDB', 'JWT'],
          category: 'Full Stack',
          githubUrl: 'https://github.com/example/devflow',
          liveDemoUrl: 'https://devflow.demo.app',
          featured: true,
          order: 2,
        },
        {
          title: 'OmniStore - Modern Headless E-Commerce Suite',
          description: 'High-conversion headless storefront with lightning-fast catalog search, dynamic cart state, and Stripe payment processing.',
          longDescription: 'Engineered for seamless omnichannel commerce. Includes full inventory synchronization, product rating engines, and discount voucher validation.',
          thumbnail: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=800&q=80',
          technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe API', 'Bootstrap'],
          category: 'Full Stack',
          githubUrl: 'https://github.com/example/omnistore',
          liveDemoUrl: 'https://omnistore.demo.app',
          featured: true,
          order: 3,
        },
        {
          title: 'NeuralQuery - AI Document Search & Semantic RAG',
          description: 'Vector-powered question answering engine that ingests technical PDFs and delivers contextual semantic answers with citation highlights.',
          longDescription: 'Combines modern vector embeddings with Node.js indexing pipelines and a responsive chat interface built in React.',
          thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
          technologies: ['Python', 'FastAPI', 'Node.js', 'React', 'TypeScript', 'MongoDB'],
          category: 'AI/ML',
          githubUrl: 'https://github.com/example/neuralquery',
          liveDemoUrl: 'https://neuralquery.demo.app',
          featured: true,
          order: 4,
        },
        {
          title: 'FastGateway - High Throughput Reverse Proxy & Rate Limiter',
          description: 'Lightweight API gateway middleware providing token bucket rate limiting, JWT validation, and circuit breakers.',
          longDescription: 'Protects backend microservices from denial-of-service spikes while providing unified CORS, request logging, and metrics aggregation.',
          thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
          technologies: ['Node.js', 'TypeScript', 'Express', 'Redis', 'Docker'],
          category: 'Backend',
          githubUrl: 'https://github.com/example/fastgateway',
          liveDemoUrl: '',
          featured: false,
          order: 5,
        },
        {
          title: 'TaskCraft - Clean Task & Project Organizer',
          description: 'Responsive productivity web application with drag-and-drop kanban boards, deadline reminders, and local caching.',
          longDescription: 'A clean, distraction-free productivity app designed with React Hook Form and Bootstrap 5.',
          thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
          technologies: ['React', 'TypeScript', 'Bootstrap 5', 'React Icons'],
          category: 'Frontend',
          githubUrl: 'https://github.com/example/taskcraft',
          liveDemoUrl: 'https://taskcraft.demo.app',
          featured: false,
          order: 6,
        },
      ];

      await Project.insertMany(projectsData);
      logger.info(`Inserted ${projectsData.length} projects.`);
    }

    // 5. Seed Experience
    const experienceCount = await Experience.countDocuments();
    if (experienceCount === 0) {
      const experienceData = [
        {
          company: 'AcroTech Solutions',
          role: 'Lead Full-Stack Engineer',
          location: 'San Francisco, CA (Hybrid)',
          employmentType: 'Full-time',
          startDate: '2023-01',
          endDate: 'Present',
          isCurrent: true,
          description: [
            'Architected and led the development of a cloud analytics platform serving 150,000+ monthly active users.',
            'Reduced API latency by 42% through query optimization, Redis caching, and MongoDB indexing strategies.',
            'Mentored junior and mid-level developers, spearheaded code review standards, and introduced automated CI/CD pipelines.',
          ],
          technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Docker', 'AWS'],
          order: 1,
        },
        {
          company: 'Vanguard Digital Lab',
          role: 'Full-Stack Developer',
          location: 'Austin, TX (Remote)',
          employmentType: 'Full-time',
          startDate: '2021-06',
          endDate: '2022-12',
          isCurrent: false,
          description: [
            'Built responsive web interfaces and microservices for an enterprise SaaS e-commerce suite.',
            'Implemented secure JWT-based authentication, RBAC authorization, and OpenAPI 3.0 documentation.',
            'Integrated Stripe payment processing and third-party logistics tracking webhooks with 99.98% reliability.',
          ],
          technologies: ['React', 'Redux', 'Node.js', 'Express', 'MongoDB', 'Bootstrap 5', 'Jest'],
          order: 2,
        },
        {
          company: 'NextGen Software Inc.',
          role: 'Junior Frontend Developer & Intern',
          location: 'San Jose, CA',
          employmentType: 'Full-time',
          startDate: '2020-07',
          endDate: '2021-05',
          isCurrent: false,
          description: [
            'Developed modular UI components using React, TypeScript, and modern CSS/Bootstrap.',
            'Collaborated with UX designers to transform Figma mockups into pixel-perfect responsive pages.',
            'Improved web performance Core Web Vitals scores by 25% across marketing and app views.',
          ],
          technologies: ['JavaScript', 'React', 'HTML5', 'CSS3', 'Git', 'Bootstrap'],
          order: 3,
        },
      ];

      await Experience.insertMany(experienceData);
      logger.info(`Inserted ${experienceData.length} experience records.`);
    }

    // 6. Seed Education
    const educationCount = await Education.countDocuments();
    if (educationCount === 0) {
      const educationData = [
        {
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science (B.S.)',
          fieldOfStudy: 'Computer Science',
          location: 'Berkeley, CA',
          startDate: '2016-08',
          endDate: '2020-05',
          isCurrent: false,
          grade: '3.85 GPA - Magna Cum Laude',
          description: 'Focus on Data Structures, Algorithms, Distributed Computing, Database Systems, and Human-Computer Interaction.',
          order: 1,
        },
        {
          institution: 'AWS Certified Solutions Architect',
          degree: 'Professional Certification',
          fieldOfStudy: 'Cloud Architecture & Distributed Systems',
          location: 'Online',
          startDate: '2022-04',
          endDate: '2025-04',
          isCurrent: false,
          grade: 'Scored 910/1000',
          description: 'Demonstrated expertise in architecting secure, robust, and cost-optimized cloud solutions on Amazon Web Services.',
          order: 2,
        },
      ];

      await Education.insertMany(educationData);
      logger.info(`Inserted ${educationData.length} education records.`);
    }

    // 7. Seed Sample Contact Messages
    const messageCount = await ContactMessage.countDocuments();
    if (messageCount === 0) {
      const messagesData = [
        {
          name: 'Sarah Connor',
          email: 'sarah.connor@skylineventures.com',
          subject: 'Senior Full-Stack Engineer Opportunity',
          message: 'Hi Alex, I was very impressed by your CloudPulse and DevFlow projects. We are currently looking for a Senior Full-Stack Engineer to lead our core products team. Would you be open to a quick introductory call this week?',
          isRead: false,
        },
        {
          name: 'David Miller',
          email: 'david@innovatestudio.io',
          subject: 'Consulting Inquiry for Web App Redesign',
          message: 'Hello Alex! We are looking for an experienced full-stack consultant to assist with our React and Node.js migration. Please let us know your current availability and consultation rates.',
          isRead: true,
        },
      ];

      await ContactMessage.insertMany(messagesData);
      logger.info(`Inserted ${messagesData.length} contact messages.`);
    }

    logger.info('Database seeding completed successfully.');
    if (standalone) {
      await mongoose.disconnect();
      process.exit(0);
    }
  } catch (error) {
    logger.error('Error during database seed:', error);
    if (standalone) {
      process.exit(1);
    }
    throw error;
  }
};

// If run directly via CLI
if (process.argv[1]?.includes('seedService')) {
  seedDatabase(true);
}
