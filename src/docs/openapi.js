const spec = {
  openapi: '3.0.3',
  info: {
    title: 'Jobzy Marketplace API',
    version: '2.0.0',
    description: 'Client, worker, and admin APIs for service marketplace, worker compliance and billing.'
  },
  servers: [{ url: '/' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  },
  paths: {
    '/health': { get: { summary: 'Health check', responses: { 200: { description: 'OK' } } } },
    '/api/auth/register': { post: { summary: 'Register client/worker account', responses: { 201: { description: 'Created' } } } },
    '/api/auth/login': { post: { summary: 'Login', responses: { 200: { description: 'JWT tokens' }, 401: { description: 'Invalid credentials' } } } },
    '/api/client/workers/discover': { get: { summary: 'Discover approved nearby workers', responses: { 200: { description: 'Workers list' } } } },
    '/api/client/jobs': { post: { summary: 'Create job (client)', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Job created' } } } },
    '/api/worker/payments/subscribe': { post: { summary: 'Create worker subscription payment intent', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Subscription and transaction pending' }, 402: { description: 'Payment needed' } } } },
    '/api/admin/workers/pending': { get: { summary: 'List pending worker applications', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Pending workers' } } } },
    '/api/admin/workers/{workerId}/review': { patch: { summary: 'Approve/reject worker verification and background check', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Reviewed' } } } },
    '/api/admin/subscriptions/transactions/confirm': { post: { summary: 'Confirm payment callback/admin reconciliation', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Updated transaction' } } } }
  }
};

module.exports = spec;
