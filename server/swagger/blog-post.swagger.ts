export const blogPostSwagger = {
  paths: {
    '/api/v1/blog-posts': {
      get: {
        summary: 'Lấy danh sách bài viết blog',
        tags: ['Bài viết (BlogPost)'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'categories', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Lấy danh sách thành công.' },
        },
      },
      post: {
        summary: 'Tạo bài viết mới (Yêu cầu Admin)',
        tags: ['Bài viết (BlogPost)'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  author: { type: 'string', example: 'AnSan Admin' },
                  title: { type: 'string', example: 'Bí mật đằng sau chai rượu Macallan' },
                  slug: { type: 'string', example: 'bi-mat-macallan' },
                  excerpt: { type: 'string', example: 'Khám phá thế giới của Macallan...' },
                  content: { type: 'string', example: '<p>Nội dung bài viết HTML...</p>' },
                },
                required: ['author', 'title', 'slug', 'excerpt'],
              },
            },
          },
        },
        responses: {
          201: { description: 'Tạo thành công.' },
        },
      },
    },
    '/api/v1/blog-posts/{id}': {
      get: {
        summary: 'Lấy bài viết theo ID',
        tags: ['Bài viết (BlogPost)'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Lấy thành công.' },
          404: { description: 'Không tìm thấy.' },
        },
      },
      put: {
        summary: 'Cập nhật bài viết (Yêu cầu Admin)',
        tags: ['Bài viết (BlogPost)'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  content: { type: 'string' },
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
        summary: 'Xóa bài viết (Yêu cầu Admin)',
        tags: ['Bài viết (BlogPost)'],
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Xóa thành công.' },
          404: { description: 'Không tìm thấy.' },
        },
      },
    },
    '/api/v1/blog-posts/slug/{slug}': {
      get: {
        summary: 'Lấy bài viết theo Slug',
        tags: ['Bài viết (BlogPost)'],
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Lấy thành công.' },
          404: { description: 'Không tìm thấy.' },
        },
      },
    },
  },
};
