const spec = {
  openapi: '3.0.3',
  info: {
    title: 'Jobzy Marketplace API',
    version: '3.0.0',
    description: 'Two-sided service marketplace backend with client, worker, and admin APIs.'
  },
  servers: [{ url: '/' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    },
    schemas: {
      Error: {
        type: 'object',
        properties: { message: { type: 'string' } }
      },
      AuthTokens: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' }
        }
      },
      WorkerReviewRequest: {
        type: 'object',
        required: ['verificationStatus', 'backgroundCheckStatus'],
        properties: {
          verificationStatus: { type: 'string', enum: ['approved', 'rejected'] },
          backgroundCheckStatus: { type: 'string', enum: ['approved', 'rejected'] },
          rejectionReason: { type: 'string', nullable: true }
        }
      },
      SubscribeRequest: {
        type: 'object',
        required: ['planId'],
        properties: {
          planId: { type: 'string', format: 'uuid' },
          provider: { type: 'string', enum: ['paystack', 'peach', 'manual'] }
        }
      }
    }
  },
  paths: {
    '/health': { get: { summary: 'Health check', responses: { 200: { description: 'OK' } } } },

    '/api/auth/register': {
      post: {
        summary: 'Register client or worker account',
        description: 'Workers must provide South African ID number or passport number.',
        responses: { 201: { description: 'Created' }, 400: { description: 'Validation error' } }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Login and issue access/refresh tokens',
        responses: {
          200: { description: 'Login success', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthTokens' } } } },
          401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      }
    },
    '/api/auth/refresh': { post: { summary: 'Refresh access token', responses: { 200: { description: 'Token refreshed' } } } },
    '/api/auth/logout': { post: { summary: 'Revoke refresh token', responses: { 204: { description: 'Logged out' } } } },

    '/api/client/workers/discover': {
      get: {
        summary: 'Discover approved nearby workers',
        description: 'Returns only workers approved by admin checks.',
        responses: { 200: { description: 'Workers list' } }
      }
    },
    '/api/client/jobs': {
      post: {
        summary: 'Create job request',
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'Job created' }, 401: { description: 'Unauthorized' } }
      }
    },
    '/api/client/jobs/mine': { get: { summary: 'List client jobs', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Jobs list' } } } },
    '/api/client/reviews': { post: { summary: 'Create review', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Review created' } } } },

    '/api/worker/profile': {
      put: {
        summary: 'Upsert worker profile/application details',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Profile updated' }, 403: { description: 'Not a worker' } }
      }
    },
    '/api/worker/jobs/open': { get: { summary: 'List open client jobs (approved + subscribed workers only)', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Jobs list' }, 402: { description: 'Subscription required' }, 403: { description: 'Pending admin checks' } } } },
    '/api/worker/jobs/{id}/accept': { post: { summary: 'Accept open job', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Job accepted' } } } },
    '/api/worker/jobs/{id}/status': { patch: { summary: 'Update accepted job status', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Status updated' } } } },

    '/api/worker/payments/plans': { get: { summary: 'List active monthly plans', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Plans list' } } } },
    '/api/worker/payments/subscribe': {
      post: {
        summary: 'Create worker subscription and pending payment transaction',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/SubscribeRequest' } } }
        },
        responses: { 201: { description: 'Subscription intent created' }, 404: { description: 'Plan not found' } }
      }
    },
    '/api/worker/payments/transactions': { get: { summary: 'List worker transactions', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Transactions list' } } } },

    '/api/admin/workers/pending': { get: { summary: 'List pending worker applications', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Pending applications' } } } },
    '/api/admin/workers/{workerId}/review': {
      patch: {
        summary: 'Approve/reject worker verification & background check',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/WorkerReviewRequest' } } }
        },
        responses: { 200: { description: 'Application reviewed' }, 404: { description: 'Worker not found' } }
      }
    },

    '/api/admin/services': { get: { summary: 'List services (admin)', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Services list' } } }, post: { summary: 'Create service', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Service created' } } } },
    '/api/admin/subscriptions/plans': { get: { summary: 'List plans (admin)', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Plans list' } } }, post: { summary: 'Create subscription plan', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Plan created' } } } },
    '/api/admin/subscriptions/transactions/confirm': { post: { summary: 'Confirm provider payment and activate subscription', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Transaction updated' }, 404: { description: 'Transaction not found' } } } }
  }
};

module.exports = spec;
