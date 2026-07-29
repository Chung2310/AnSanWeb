export const categorySwagger = {
  paths: {
    '/api/v1/categories': {
      get: {
        summary: 'Lấy danh sách danh mục',
        tags: ['Danh mục (Category)'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'parentId', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'inactive'] } },
        ],
        responses: {
          200: { description: 'Lấy danh sách thành công.' },
        },
      },
      post: {
        summary: 'Tạo danh mục mới (Yêu cầu Admin)',
        tags: ['Danh mục (Category)'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Rượu Vang Đỏ' },
                  slug: { type: 'string', example: 'ruou-vang-do' },
                  description: { type: 'string', example: 'Mô tả danh mục rượu vang đỏ' },
                  parentId: { type: 'string', example: 'null' },
                },
                required: ['name', 'slug'],
              },
            },
          },
        },
        responses: {
          201: { description: 'Tạo thành công.' },
          400: { description: 'Dữ liệu không hợp lệ.' },
          401: { description: 'Không có quyền.' },
        },
      },
    },
    '/api/v1/categories/{id}': {
      get: {
        summary: 'Lấy chi tiết danh mục theo ID',
        tags: ['Danh mục (Category)'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Lấy chi tiết thành công.' },
          404: { description: 'Không tìm thấy danh mục.' },
        },
      },
      put: {
        summary: 'Cập nhật danh mục theo ID (Yêu cầu Admin)',
        tags: ['Danh mục (Category)'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Rượu Vang Đỏ Cao Cấp' },
                  status: { type: 'string', enum: ['active', 'inactive'] },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Cập nhật thành công.' },
          404: { description: 'Không tìm thấy.' },
        },
      },
      delete: {
        summary: 'Xóa danh mục theo ID (Yêu cầu Admin)',
        tags: ['Danh mục (Category)'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Xóa thành công.' },
          404: { description: 'Không tìm thấy.' },
        },
      },
    },
    '/api/v1/categories/slug/{slug}': {
      get: {
        summary: 'Lấy chi tiết danh mục theo Slug',
        tags: ['Danh mục (Category)'],
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Lấy chi tiết thành công.' },
          404: { description: 'Không tìm thấy.' },
        },
      },
    },
  },
};
