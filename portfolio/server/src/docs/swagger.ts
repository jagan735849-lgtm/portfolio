import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

export const openApiSpec: any = {
  openapi: '3.0.3',
  info: {
    title: 'Full-Stack Developer Portfolio REST API',
    version: '1.0.0',
    description: `Complete REST API for personal developer portfolio website.
Includes public endpoints for portfolio content presentation and secure JWT-authenticated endpoints for administrator content management.`,
    contact: {
      name: 'Developer Portfolio Admin',
      email: 'admin@portfolio.local',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token obtained from /api/auth/login',
      },
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'token',
        description: 'HTTP-only authentication cookie set automatically upon login',
      },
    },
    schemas: {
      StandardResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation completed successfully' },
          data: { type: 'object' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed or resource not found' },
          errors: { type: 'object' },
        },
      },
      Profile: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '6614a9c8e268a72c499e1234' },
          name: { type: 'string', example: 'Alex Mercer' },
          title: { type: 'string', example: 'Senior Full-Stack Developer' },
          tagline: { type: 'string', example: 'Building scalable modern web apps.' },
          bio: { type: 'string', example: '5+ years experience in Node, React, and Cloud.' },
          avatarUrl: { type: 'string', example: '/uploads/avatar.png' },
          resumeUrl: { type: 'string', example: '/uploads/resume.pdf' },
          email: { type: 'string', example: 'alex.mercer.dev@example.com' },
          location: { type: 'string', example: 'San Francisco, CA / Remote' },
          availableForHire: { type: 'boolean', example: true },
          yearsOfExperience: { type: 'number', example: 5 },
          socialLinks: {
            type: 'object',
            properties: {
              github: { type: 'string', example: 'https://github.com' },
              linkedin: { type: 'string', example: 'https://linkedin.com' },
              twitter: { type: 'string', example: 'https://twitter.com' },
              website: { type: 'string', example: 'https://portfolio.dev' },
            },
          },
        },
      },
      Project: {
        type: 'object',
        required: ['title', 'description', 'thumbnail', 'technologies', 'category'],
        properties: {
          _id: { type: 'string', example: '6614a9c8e268a72c499e5678' },
          title: { type: 'string', example: 'Enterprise Cloud Dashboard' },
          description: { type: 'string', example: 'Microservices analytics monitoring platform' },
          longDescription: { type: 'string', example: 'A comprehensive monitoring dashboard with real-time streaming.' },
          thumbnail: { type: 'string', example: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80' },
          technologies: {
            type: 'array',
            items: { type: 'string' },
            example: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Docker'],
          },
          category: {
            type: 'string',
            enum: ['Full Stack', 'Frontend', 'Backend', 'Mobile', 'Cloud/DevOps', 'AI/ML', 'Other'],
            example: 'Full Stack',
          },
          githubUrl: { type: 'string', example: 'https://github.com/developer/project' },
          liveDemoUrl: { type: 'string', example: 'https://project-demo.com' },
          featured: { type: 'boolean', example: true },
          order: { type: 'number', example: 1 },
        },
      },
      Skill: {
        type: 'object',
        required: ['name', 'category', 'proficiency'],
        properties: {
          _id: { type: 'string', example: '6614a9c8e268a72c499e9012' },
          name: { type: 'string', example: 'TypeScript' },
          category: {
            type: 'string',
            enum: ['frontend', 'backend', 'database', 'programming', 'tools', 'other'],
            example: 'programming',
          },
          proficiency: { type: 'number', minimum: 0, maximum: 100, example: 92 },
          level: {
            type: 'string',
            enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
            example: 'Expert',
          },
          icon: { type: 'string', example: 'SiTypescript' },
          order: { type: 'number', example: 1 },
        },
      },
      Experience: {
        type: 'object',
        required: ['company', 'role', 'startDate', 'description'],
        properties: {
          _id: { type: 'string', example: '6614a9c8e268a72c499e3456' },
          company: { type: 'string', example: 'Tech Innovations Inc.' },
          role: { type: 'string', example: 'Senior Full-Stack Engineer' },
          location: { type: 'string', example: 'San Francisco, CA' },
          employmentType: {
            type: 'string',
            enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
            example: 'Full-time',
          },
          startDate: { type: 'string', example: '2022-03' },
          endDate: { type: 'string', example: 'Present' },
          isCurrent: { type: 'boolean', example: true },
          description: {
            type: 'array',
            items: { type: 'string' },
            example: [
              'Architected high-throughput REST APIs handling 50k req/min.',
              'Spearheaded migration to React 18 and TypeScript.',
            ],
          },
          technologies: {
            type: 'array',
            items: { type: 'string' },
            example: ['React', 'Node.js', 'Express', 'MongoDB', 'AWS'],
          },
        },
      },
      Education: {
        type: 'object',
        required: ['institution', 'degree', 'fieldOfStudy', 'startDate'],
        properties: {
          _id: { type: 'string', example: '6614a9c8e268a72c499e7890' },
          institution: { type: 'string', example: 'University of California, Berkeley' },
          degree: { type: 'string', example: 'Bachelor of Science' },
          fieldOfStudy: { type: 'string', example: 'Computer Science' },
          location: { type: 'string', example: 'Berkeley, CA' },
          startDate: { type: 'string', example: '2016-08' },
          endDate: { type: 'string', example: '2020-05' },
          isCurrent: { type: 'boolean', example: false },
          grade: { type: 'string', example: '3.8 GPA' },
        },
      },
      ContactMessage: {
        type: 'object',
        required: ['name', 'email', 'subject', 'message'],
        properties: {
          _id: { type: 'string', example: '6614a9c8e268a72c499e1122' },
          name: { type: 'string', example: 'Sarah Connor' },
          email: { type: 'string', example: 'sarah@example.com' },
          subject: { type: 'string', example: 'Inquiry regarding new project' },
          message: { type: 'string', example: 'Hi Alex, I love your portfolio and would like to discuss an opportunity.' },
          isRead: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@portfolio.local' },
          password: { type: 'string', format: 'password', example: 'AdminPassword123!' },
        },
      },
    },
  },
  paths: {
    '/api/health': {
      get: {
        summary: 'Check API and Database Health',
        tags: ['Health'],
        responses: {
          200: {
            description: 'Server and database are healthy',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/StandardResponse' } } },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Admin Login',
        description: 'Authenticates administrator credentials and returns JWT token and sets HTTP-only cookie.',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
        },
        responses: {
          200: {
            description: 'Authentication successful',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/StandardResponse' } } },
          },
          401: {
            description: 'Invalid email or password',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        summary: 'Admin Logout',
        description: 'Clears HTTP-only session cookie.',
        tags: ['Authentication'],
        responses: {
          200: { description: 'Logged out successfully' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        summary: 'Get Current Authenticated Admin Session',
        tags: ['Authentication'],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: {
          200: { description: 'Authenticated administrator details' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/profile': {
      get: {
        summary: 'Get Portfolio Profile',
        tags: ['Profile'],
        responses: {
          200: {
            description: 'Portfolio profile data',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Profile' } } },
          },
        },
      },
      put: {
        summary: 'Update Portfolio Profile',
        tags: ['Profile', 'Admin'],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Profile' } } },
        },
        responses: {
          200: { description: 'Profile updated successfully' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/projects': {
      get: {
        summary: 'Get Projects with Search, Category Filter, and Pagination',
        tags: ['Projects'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'featured', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: {
          200: { description: 'Paginated project records' },
        },
      },
      post: {
        summary: 'Create New Project',
        tags: ['Projects', 'Admin'],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } },
        },
        responses: {
          201: { description: 'Project created' },
          400: { description: 'Validation error' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/projects/{id}': {
      get: {
        summary: 'Get Project Details by ID',
        tags: ['Projects'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Project details' },
          404: { description: 'Project not found' },
        },
      },
      put: {
        summary: 'Update Project',
        tags: ['Projects', 'Admin'],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } },
        },
        responses: {
          200: { description: 'Project updated' },
          401: { description: 'Unauthorized' },
        },
      },
      delete: {
        summary: 'Delete Project',
        tags: ['Projects', 'Admin'],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Project deleted' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/skills': {
      get: {
        summary: 'Get All Skills',
        tags: ['Skills'],
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'grouped', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: {
          200: { description: 'List of skills' },
        },
      },
      post: {
        summary: 'Create New Skill',
        tags: ['Skills', 'Admin'],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Skill' } } },
        },
        responses: {
          201: { description: 'Skill created' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/skills/{id}': {
      put: {
        summary: 'Update Skill',
        tags: ['Skills', 'Admin'],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Skill' } } },
        },
        responses: {
          200: { description: 'Skill updated' },
        },
      },
      delete: {
        summary: 'Delete Skill',
        tags: ['Skills', 'Admin'],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Skill deleted' },
        },
      },
    },
    '/api/experience': {
      get: {
        summary: 'Get Work Experience Timeline',
        tags: ['Experience'],
        responses: {
          200: { description: 'List of experience entries' },
        },
      },
      post: {
        summary: 'Create Experience Record',
        tags: ['Experience', 'Admin'],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Experience' } } },
        },
        responses: {
          201: { description: 'Experience created' },
        },
      },
    },
    '/api/experience/{id}': {
      put: {
        summary: 'Update Experience',
        tags: ['Experience', 'Admin'],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Experience' } } },
        },
        responses: {
          200: { description: 'Experience updated' },
        },
      },
      delete: {
        summary: 'Delete Experience',
        tags: ['Experience', 'Admin'],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Experience deleted' },
        },
      },
    },
    '/api/education': {
      get: {
        summary: 'Get Education Records',
        tags: ['Education'],
        responses: {
          200: { description: 'List of education history' },
        },
      },
      post: {
        summary: 'Create Education Record',
        tags: ['Education', 'Admin'],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Education' } } },
        },
        responses: {
          201: { description: 'Education created' },
        },
      },
    },
    '/api/education/{id}': {
      put: {
        summary: 'Update Education Record',
        tags: ['Education', 'Admin'],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Education' } } },
        },
        responses: {
          200: { description: 'Education updated' },
        },
      },
      delete: {
        summary: 'Delete Education Record',
        tags: ['Education', 'Admin'],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Education deleted' },
        },
      },
    },
    '/api/contact': {
      post: {
        summary: 'Submit Contact Message',
        description: 'Rate-limited public endpoint with spam prevention.',
        tags: ['Contact'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'subject', 'message'],
                properties: {
                  name: { type: 'string', example: 'Sarah Connor' },
                  email: { type: 'string', format: 'email', example: 'sarah@example.com' },
                  subject: { type: 'string', example: 'Collaboration Inquiry' },
                  message: { type: 'string', example: 'Hi! Let us connect for an exciting software role.' },
                  honeypot: { type: 'string', example: '' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Message sent successfully' },
          400: { description: 'Validation failed' },
          429: { description: 'Rate limit exceeded' },
        },
      },
    },
    '/api/admin/stats': {
      get: {
        summary: 'Get Dashboard Statistics',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: {
          200: { description: 'Aggregate statistics for admin dashboard' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/admin/messages': {
      get: {
        summary: 'List Contact Messages',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'isRead', in: 'query', schema: { type: 'boolean' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Paginated list of contact messages' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/admin/messages/{id}': {
      patch: {
        summary: 'Update Message Read Status',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { isRead: { type: 'boolean', example: true } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Message status updated' },
        },
      },
      delete: {
        summary: 'Delete Contact Message',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Message deleted' },
        },
      },
    },
    '/api/admin/upload': {
      post: {
        summary: 'Upload Image or Resume Document',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'File uploaded, returns static URL' },
          400: { description: 'Invalid file' },
          401: { description: 'Unauthorized' },
        },
      },
    },
  },
};

export const setupSwagger = (app: Express): void => {
  const swaggerCustomCss = `
    .swagger-ui .topbar { background-color: #0f172a; border-bottom: 2px solid #3b82f6; }
    .swagger-ui .info { margin: 25px 0; }
    .swagger-ui .info .title { color: #1e293b; font-weight: 700; }
    .swagger-ui .btn.authorize { background-color: #3b82f6; border-color: #3b82f6; color: #fff; }
  `;

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
      customCss: swaggerCustomCss,
      customSiteTitle: 'Developer Portfolio REST API Docs',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'list',
        filter: true,
      },
    })
  );
};
