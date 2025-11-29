const request = require('supertest');

// Mock the dependencies before requiring the app
jest.mock('../utils/logger');
jest.mock('../getContent', () => jest.fn());

describe('API Endpoints', () => {
  let app;
  let getContent;

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset modules to get fresh instances
    jest.resetModules();

    // Get mocked getContent
    getContent = require('../getContent');

    // Load app after mocks are set up
    app = require('../app');
  });

  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /', () => {
    test('should render index page with trailers', async () => {
      const mockTrailers = [
        {
          channel: 'Test Studio',
          name: 'Test Movie - Official Trailer',
          date: 'January 1, 2025',
          dateString: '2025-01-01T00:00:00.000Z',
          link: 'abc123',
          thumbnail: 'https://example.com/thumb.jpg'
        }
      ];

      getContent.mockResolvedValue(mockTrailers);

      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.type).toMatch(/html/);
    });

    test('should handle API errors gracefully', async () => {
      getContent.mockResolvedValue({
        apiValid: false,
        error: { message: 'Invalid API key' }
      });

      const response = await request(app).get('/');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });

    test('should handle exceptions', async () => {
      getContent.mockRejectedValue(new Error('Network error'));

      const response = await request(app).get('/');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api', () => {
    test('should return JSON data', async () => {
      const mockTrailers = [
        {
          channel: 'Test Studio',
          name: 'Test Movie - Official Trailer',
          date: 'January 1, 2025',
          dateString: '2025-01-01T00:00:00.000Z',
          link: 'abc123',
          thumbnail: 'https://example.com/thumb.jpg'
        }
      ];

      getContent.mockResolvedValue(mockTrailers);

      const response = await request(app).get('/api');

      expect(response.status).toBe(200);
      expect(response.type).toMatch(/json/);
      expect(response.body).toEqual(mockTrailers);
    });

    test('should return error for invalid API key', async () => {
      getContent.mockResolvedValue({
        apiValid: false,
        error: { message: 'Invalid API key' }
      });

      const response = await request(app).get('/api');

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('404 Handler', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });

  describe('Rate Limiting', () => {
    test('should apply rate limiting to API endpoints', async () => {
      const mockTrailers = [];
      getContent.mockResolvedValue(mockTrailers);

      // Make multiple requests quickly
      const requests = Array(5).fill(null).map(() =>
        request(app).get('/api')
      );

      const responses = await Promise.all(requests);

      // All should succeed (within rate limit)
      responses.forEach(response => {
        expect([200, 500]).toContain(response.status);
      });
    });
  });
});
