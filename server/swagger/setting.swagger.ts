export const settingSwagger = {
  paths: {
    '/api/v1/settings': {
      get: {
        summary: 'Lấy tất cả các cấu hình cài đặt',
        tags: ['Cài đặt (Setting)'],
        responses: {
          200: { description: 'Lấy danh sách cài đặt thành công.' },
        },
      },
      post: {
        summary: 'Tạo hoặc cập nhật cài đặt (Yêu cầu Admin)',
        tags: ['Cài đặt (Setting)'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  key: { type: 'string', example: 'site_title' },
                  value: { type: 'string', example: 'AnSan Wine & Spirits' },
                },
                required: ['key', 'value'],
              },
            },
          },
        },
        responses: {
          200: { description: 'Cập nhật thành công.' },
        },
      },
    },
    '/api/v1/settings/{key}': {
      get: {
        summary: 'Lấy cấu hình cài đặt theo khóa (Key)',
        tags: ['Cài đặt (Setting)'],
        parameters: [{ name: 'key', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Lấy thông tin thành công.' },
          404: { description: 'Không tìm thấy cài đặt.' },
        },
      },
    },
  },
};
