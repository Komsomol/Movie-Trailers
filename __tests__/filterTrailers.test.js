const getTrailersOnly = require('../filterTrailers.improved');
const { sub } = require('date-fns');

describe('filterTrailers', () => {
  describe('getTrailersOnly', () => {
    const mockChannelName = 'Test Studio';

    const createMockVideo = (title, daysAgo = 5) => {
      const publishedAt = sub(new Date(), { days: daysAgo }).toISOString();
      return {
        snippet: {
          title,
          publishedAt,
          resourceId: {
            videoId: 'test123'
          },
          thumbnails: {
            high: {
              url: 'https://example.com/thumb.jpg'
            }
          }
        }
      };
    };

    test('should filter videos with "official trailer" in title', () => {
      const mockData = {
        items: [
          createMockVideo('Movie Title - Official Trailer'),
          createMockVideo('Movie Title - Behind The Scenes')
        ]
      };

      const result = getTrailersOnly(mockData, mockChannelName);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Movie Title - Official Trailer');
    });

    test('should exclude videos with excluded keywords', () => {
      const mockData = {
        items: [
          createMockVideo('Movie Title - Official Trailer'),
          createMockVideo('Movie Title - Official Trailer - Blu-ray'),
          createMockVideo('Series Name Season 1 - Official Trailer'),
          createMockVideo('Show Episode 5 - Official Trailer')
        ]
      };

      const result = getTrailersOnly(mockData, mockChannelName);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Movie Title - Official Trailer');
    });

    test('should filter by date range (default 10 days)', () => {
      const mockData = {
        items: [
          createMockVideo('Recent Movie - Official Trailer', 5),
          createMockVideo('Old Movie - Official Trailer', 15)
        ]
      };

      const result = getTrailersOnly(mockData, mockChannelName);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Recent Movie - Official Trailer');
    });

    test('should respect custom date range', () => {
      const mockData = {
        items: [
          createMockVideo('Movie 1 - Official Trailer', 3),
          createMockVideo('Movie 2 - Official Trailer', 25)
        ]
      };

      const result = getTrailersOnly(mockData, mockChannelName, 30);

      expect(result).toHaveLength(2);
    });

    test('should handle empty items array', () => {
      const mockData = { items: [] };
      const result = getTrailersOnly(mockData, mockChannelName);

      expect(result).toEqual([]);
    });

    test('should handle null/undefined input gracefully', () => {
      expect(getTrailersOnly(null, mockChannelName)).toEqual([]);
      expect(getTrailersOnly(undefined, mockChannelName)).toEqual([]);
      expect(getTrailersOnly({}, mockChannelName)).toEqual([]);
    });

    test('should handle missing channel name', () => {
      const mockData = {
        items: [createMockVideo('Test - Official Trailer')]
      };

      const result = getTrailersOnly(mockData, '');
      expect(result).toEqual([]);
    });

    test('should include required fields in output', () => {
      const mockData = {
        items: [createMockVideo('Test Movie - Official Trailer')]
      };

      const result = getTrailersOnly(mockData, mockChannelName);

      expect(result[0]).toHaveProperty('channel');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('dateString');
      expect(result[0]).toHaveProperty('link');
      expect(result[0]).toHaveProperty('thumbnail');
    });

    test('should handle missing thumbnail gracefully', () => {
      const mockData = {
        items: [{
          snippet: {
            title: 'Test - Official Trailer',
            publishedAt: new Date().toISOString(),
            resourceId: { videoId: 'test123' },
            thumbnails: {}
          }
        }]
      };

      const result = getTrailersOnly(mockData, mockChannelName);
      expect(result[0].thumbnail).toBe('');
    });

    test('should be case insensitive for keyword matching', () => {
      const mockData = {
        items: [
          createMockVideo('MOVIE TITLE - OFFICIAL TRAILER'),
          createMockVideo('Movie Title - Official Trailer'),
          createMockVideo('movie title - official trailer')
        ]
      };

      const result = getTrailersOnly(mockData, mockChannelName);
      expect(result).toHaveLength(3);
    });
  });

  describe('checkDateRange', () => {
    const { checkDateRange } = require('../filterTrailers.improved');

    test('should return true for date within range', () => {
      const fiveDaysAgo = sub(new Date(), { days: 5 }).toISOString();
      expect(checkDateRange(fiveDaysAgo, 10)).toBe(true);
    });

    test('should return false for date outside range', () => {
      const fifteenDaysAgo = sub(new Date(), { days: 15 }).toISOString();
      expect(checkDateRange(fifteenDaysAgo, 10)).toBe(false);
    });

    test('should handle invalid date gracefully', () => {
      expect(checkDateRange('invalid-date', 10)).toBe(false);
    });

    test('should work with custom day ranges', () => {
      const twentyDaysAgo = sub(new Date(), { days: 20 }).toISOString();
      expect(checkDateRange(twentyDaysAgo, 30)).toBe(true);
      expect(checkDateRange(twentyDaysAgo, 15)).toBe(false);
    });
  });
});
