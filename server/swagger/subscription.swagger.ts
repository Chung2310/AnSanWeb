export const subscriptionSwagger = {
  paths: {
    '/api/v1/subscriptions': {
      post: {
        summary: 'Đăng ký email nhận bản tin khuyến mãi',
        tags: ['Đăng ký nhận tin (Subscription)'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'news@ansan.com' },
                },
                required: ['email'],
              },
            },
          },
        },
        responses: {
          201: { description: 'Đăng ký thành công.' },
          400: { description: 'Email đã tồn tại.' },
        },
      },
      get: {
        summary: 'Lấy danh sách email nhận tin (Yêu cầu Admin)',
        tags: ['Đăng ký nhận tin (Subscription)'],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'email', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Lấy danh sách thành công.' },
        },
      },
    },
  },
};
