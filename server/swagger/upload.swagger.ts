export const uploadSwagger = {
  paths: {
    '/api/v1/upload': {
      post: {
        summary: 'Tải ảnh lên Cloudinary (Yêu cầu Admin)',
        tags: ['Tải ảnh (Upload)'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: { type: 'string', format: 'binary' },
                  folder: { type: 'string', example: 'products' },
                },
                required: ['image'],
              },
            },
          },
        },
        responses: {
          200: { description: 'Tải lên thành công, trả về link Cloudinary.' },
        },
      },
    },
  },
};
