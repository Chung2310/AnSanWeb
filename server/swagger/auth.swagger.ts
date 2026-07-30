export const authSwagger = {
  paths: {
    '/api/v1/auth/register': {
      post: {
        summary: 'Đăng ký tài khoản mới',
        tags: ['Xác thực (Auth)'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'admin@ansan.com' },
                  password: { type: 'string', example: 'password123' },
                  name: { type: 'string', example: 'AnSan Admin' },
                },
                required: ['email', 'password', 'name'],
              },
            },
          },
        },
        responses: {
          201: { description: 'Đăng ký thành công.' },
          400: { description: 'Dữ liệu không hợp lệ hoặc email đã tồn tại.' },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        summary: 'Đăng nhập',
        tags: ['Xác thực (Auth)'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'admin@ansan.com' },
                  password: { type: 'string', example: 'password123' },
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          200: { description: 'Đăng nhập thành công, trả về Access Token và lưu Refresh Token Cookie.' },
          400: { description: 'Sai tài khoản hoặc mật khẩu.' },
        },
      },
    },
    '/api/v1/auth/logout': {
      post: {
        summary: 'Đăng xuất',
        tags: ['Xác thực (Auth)'],
        responses: {
          200: { description: 'Xóa Refresh Token Cookie thành công.' },
        },
      },
    },
    '/api/v1/auth/refresh': {
      post: {
        summary: 'Làm mới Access Token',
        tags: ['Xác thực (Auth)'],
        responses: {
          200: { description: 'Cấp mới Access Token thành công.' },
          401: { description: 'Refresh Token không hợp lệ hoặc hết hạn.' },
        },
      },
    },
    '/api/v1/auth/me': {
      get: {
        summary: 'Lấy thông tin tài khoản hiện tại',
        tags: ['Xác thực (Auth)'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Lấy thông tin thành công.' },
          401: { description: 'Chưa đăng nhập.' },
        },
      },
    },
  },
};
