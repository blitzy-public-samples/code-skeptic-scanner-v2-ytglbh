import { TweetParser } from '../../../src/services/dataExtraction/tweetParser';
import { MediaDownloader } from '../../../src/services/dataExtraction/mediaDownloader';
import { NotionApiClient } from '../../../src/services/dataExtraction/notionApiClient';
import { mockTweet } from '../../mocks/tweetMock';
import { mockMediaUrls } from '../../mocks/mediaUrlsMock';
import { mockNotionData } from '../../mocks/notionDataMock';

// Test suite for TweetParser
describe('TweetParser', () => {
  let tweetParser: TweetParser;

  beforeEach(() => {
    tweetParser = new TweetParser();
  });

  test('should initialize TweetParser correctly', () => {
    expect(tweetParser).toBeDefined();
  });

  test('should parse tweet data correctly', () => {
    const parsedTweet = tweetParser.parseTweet(mockTweet);
    expect(parsedTweet).toHaveProperty('id');
    expect(parsedTweet).toHaveProperty('text');
    expect(parsedTweet).toHaveProperty('author');
    // Add more assertions for all required fields
  });

  test('should extract hashtags correctly from tweet text', () => {
    const tweetText = 'This is a #test tweet with #multiple hashtags';
    const hashtags = tweetParser.extractHashtags(tweetText);
    expect(hashtags).toContain('test');
    expect(hashtags).toContain('multiple');
    expect(hashtags).not.toContain('This');
  });

  test('should extract URLs correctly from tweet text', () => {
    const tweetText = 'Check out this link: https://example.com and this one: http://test.org';
    const urls = tweetParser.extractUrls(tweetText);
    expect(urls).toContain('https://example.com');
    expect(urls).toContain('http://test.org');
    expect(urls).not.toContain('Check');
  });
});

// Test suite for MediaDownloader
describe('MediaDownloader', () => {
  let mediaDownloader: MediaDownloader;
  const mockDownloadPath = '/mock/download/path';

  beforeEach(() => {
    mediaDownloader = new MediaDownloader(mockDownloadPath);
  });

  test('should initialize MediaDownloader with correct download path', () => {
    expect(mediaDownloader).toBeDefined();
    expect(mediaDownloader['downloadPath']).toBe(mockDownloadPath);
  });

  test('should download media files correctly', async () => {
    // Mock file system operations
    const mockFs = jest.mock('fs');
    mockFs.writeFileSync = jest.fn();

    await mediaDownloader.downloadMedia(mockMediaUrls);
    expect(mockFs.writeFileSync).toHaveBeenCalledTimes(mockMediaUrls.length);
    // Add more assertions for correct file names and locations
  });

  test('should generate unique filenames for media files', () => {
    const url = 'https://example.com/image.jpg';
    const filename1 = mediaDownloader.getUniqueFilename(url);
    const filename2 = mediaDownloader.getUniqueFilename(url);
    expect(filename1).not.toBe(filename2);
    expect(filename1).toMatch(/\.jpg$/);
    expect(filename2).toMatch(/\.jpg$/);
  });

  test('should remove old media files correctly', () => {
    // Mock file system operations
    const mockFs = jest.mock('fs');
    mockFs.readdirSync = jest.fn().mockReturnValue(['old.jpg', 'new.jpg']);
    mockFs.statSync = jest.fn().mockImplementation((file) => ({
      mtime: file === 'old.jpg' ? new Date(Date.now() - 86400000) : new Date(),
    }));
    mockFs.unlinkSync = jest.fn();

    mediaDownloader.cleanupOldMedia(24); // 24 hours threshold
    expect(mockFs.unlinkSync).toHaveBeenCalledWith(expect.stringContaining('old.jpg'));
    expect(mockFs.unlinkSync).not.toHaveBeenCalledWith(expect.stringContaining('new.jpg'));
  });
});

// Test suite for NotionApiClient
describe('NotionApiClient', () => {
  let notionApiClient: NotionApiClient;
  const mockCredentials = { apiKey: 'mock-api-key' };

  beforeEach(() => {
    notionApiClient = new NotionApiClient(mockCredentials);
  });

  test('should initialize NotionApiClient with correct credentials', () => {
    expect(notionApiClient).toBeDefined();
    expect(notionApiClient['credentials']).toBe(mockCredentials);
  });

  test('should store tweet data in Notion correctly', async () => {
    const mockNotionApi = jest.mock('@notionhq/client');
    mockNotionApi.pages.create = jest.fn();

    await notionApiClient.storeTweet(mockTweet);
    expect(mockNotionApi.pages.create).toHaveBeenCalledWith(expect.objectContaining({
      parent: expect.any(Object),
      properties: expect.objectContaining({
        id: expect.any(Object),
        text: expect.any(Object),
        author: expect.any(Object),
      }),
    }));
  });

  test('should store response data in Notion correctly', async () => {
    const mockNotionApi = jest.mock('@notionhq/client');
    mockNotionApi.pages.create = jest.fn();

    await notionApiClient.storeResponse(mockNotionData.response);
    expect(mockNotionApi.pages.create).toHaveBeenCalledWith(expect.objectContaining({
      parent: expect.any(Object),
      properties: expect.objectContaining({
        id: expect.any(Object),
        text: expect.any(Object),
        author: expect.any(Object),
      }),
    }));
  });

  test('should retrieve tweet data from Notion correctly', async () => {
    const mockNotionApi = jest.mock('@notionhq/client');
    mockNotionApi.pages.retrieve = jest.fn().mockResolvedValue(mockNotionData.tweet);

    const tweet = await notionApiClient.getTweet('mock-tweet-id');
    expect(mockNotionApi.pages.retrieve).toHaveBeenCalledWith({ page_id: 'mock-tweet-id' });
    expect(tweet).toHaveProperty('id');
    expect(tweet).toHaveProperty('text');
    expect(tweet).toHaveProperty('author');
  });

  test('should retrieve response data from Notion correctly', async () => {
    const mockNotionApi = jest.mock('@notionhq/client');
    mockNotionApi.pages.retrieve = jest.fn().mockResolvedValue(mockNotionData.response);

    const response = await notionApiClient.getResponse('mock-response-id');
    expect(mockNotionApi.pages.retrieve).toHaveBeenCalledWith({ page_id: 'mock-response-id' });
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('text');
    expect(response).toHaveProperty('author');
  });

  test('should update tweet data in Notion correctly', async () => {
    const mockNotionApi = jest.mock('@notionhq/client');
    mockNotionApi.pages.update = jest.fn();

    await notionApiClient.updateTweet('mock-tweet-id', { text: 'Updated tweet text' });
    expect(mockNotionApi.pages.update).toHaveBeenCalledWith(expect.objectContaining({
      page_id: 'mock-tweet-id',
      properties: expect.objectContaining({
        text: expect.any(Object),
      }),
    }));
  });
});

// Human tasks:
// - Review and update test cases as new features are added to the data extraction services
// - Implement integration tests to ensure proper interaction between TweetParser, MediaDownloader, and NotionApiClient
// - Add more edge case scenarios to test robustness of the parsing and downloading logic
// - Implement mock server for Notion API to simulate various response scenarios
// - Add tests for error handling and recovery scenarios in all services
// - Implement performance tests to ensure efficient handling of large datasets
// - Ensure test coverage is maintained above 90% for all data extraction services