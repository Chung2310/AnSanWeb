export const contactSwagger = {
  paths: {
    '/api/v1/contacts': {
      post: {
        summary: 'Gửi biểu mẫu liên hệ mới',
        tags: ['Liên hệ (Contact)'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Nguyễn Văn A' },
                  email: { type: 'string', example: 'vanya@gmail.com' },
                  phone: { type: 'string', example: '0901234567' },
                  message: { type: 'string', example: 'Tôi cần tư vấn mua rượu ngoại làm quà tặng.' },
                },
                required: ['name', 'email', 'message'],
              },
            },
          },
        },
        responses: {
          201: { description: 'Gửi thành công.' },
        },
      },
      get: {
        summary: 'Lấy danh sách các liên hệ (Yêu cầu Admin)',
        tags: ['Liên hệ (Contact)'],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'email', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Lấy thành công.' },
          401: { description: 'Chưa xác thực.' },
        },
      },
    },
  },
};
