export const productSwagger = {
  paths: {
    '/api/v1/products': {
      get: {
        summary: 'Lấy danh sách sản phẩm',
        tags: ['Sản phẩm (Product)'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'categoryIds', in: 'query', schema: { type: 'string' } },
          { name: 'tags', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['published', 'draft'] } },
          { name: 'isFeatured', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } },
        ],
        responses: {
          200: { description: 'Lấy danh sách thành công.' },
        },
      },
      post: {
        summary: 'Tạo sản phẩm mới (Yêu cầu Admin)',
        tags: ['Sản phẩm (Product)'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nameVN: { type: 'string', example: 'Rượu Macallan 12 Năm' },
                  slug: { type: 'string', example: 'macallan-12-nam' },
                  price: { type: 'number', example: 1850000 },
                  description: { type: 'string', example: 'Mô tả rượu Macallan 12 Năm Sherry Oak' },
                  categoryIds: { type: 'array', items: { type: 'string' } },
                },
                required: ['nameVN', 'slug', 'price', 'description'],
              },
            },
          },
        },
        responses: {
          201: { description: 'Tạo thành công.' },
          400: { description: 'Lỗi dữ liệu đầu vào.' },
        },
      },
    },
    '/api/v1/products/{id}': {
      get: {
        summary: 'Lấy chi tiết sản phẩm theo ID',
        tags: ['Sản phẩm (Product)'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Lấy chi tiết thành công.' },
          404: { description: 'Không tìm thấy sản phẩm.' },
        },
      },
      put: {
        summary: 'Cập nhật sản phẩm theo ID (Yêu cầu Admin)',
        tags: ['Sản phẩm (Product)'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nameVN: { type: 'string' },
                  price: { type: 'number' },
                  status: { type: 'string', enum: ['published', 'draft'] },
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
        summary: 'Xóa sản phẩm theo ID (Yêu cầu Admin)',
        tags: ['Sản phẩm (Product)'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Xóa thành công.' },
          404: { description: 'Không tìm thấy.' },
        },
      },
    },
    '/api/v1/products/slug/{slug}': {
      get: {
        summary: 'Lấy chi tiết sản phẩm theo Slug',
        tags: ['Sản phẩm (Product)'],
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Lấy chi tiết thành công.' },
          404: { description: 'Không tìm thấy.' },
        },
      },
    },
  },
};
