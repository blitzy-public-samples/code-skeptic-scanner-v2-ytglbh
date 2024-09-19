import puppeteer from 'puppeteer';
import { config } from '../../src/config/apiConfig';
import { mockTweets } from '../mocks/tweetMock';
import { mockResponses } from '../mocks/responseMock';
import { mockAnalytics } from '../mocks/analyticsMock';

let browser: puppeteer.Browser;
let page: puppeteer.Page;

describe('Dashboard E2E Tests', () => {
  // Set up browser and page before all tests
  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(config.dashboardUrl);
  });

  // Close browser after all tests
  afterAll(async () => {
    await browser.close();
  });

  // Test dashboard loading
  test('should load dashboard successfully', async () => {
    await page.waitForSelector('#dashboard-container');
    const title = await page.$eval('h1', (el) => el.textContent);
    expect(title).toBe('Code Skeptic Scanner Dashboard');

    const tweetStream = await page.$('#tweet-stream');
    const metrics = await page.$('#key-metrics');
    expect(tweetStream).toBeTruthy();
    expect(metrics).toBeTruthy();
  });

  // Test real-time tweet stream
  test('should display incoming tweets in real-time', async () => {
    // Mock WebSocket connection for real-time updates
    await page.evaluate(() => {
      (window as any).mockWebSocket = {
        send: (data: string) => {
          const event = new MessageEvent('message', { data });
          (window as any).dispatchEvent(event);
        },
      };
    });

    // Send mock tweet data through WebSocket
    const mockTweet = mockTweets[0];
    await page.evaluate((tweet) => {
      (window as any).mockWebSocket.send(JSON.stringify(tweet));
    }, mockTweet);

    // Wait for new tweet to appear in the stream
    await page.waitForSelector(`[data-tweet-id="${mockTweet.id}"]`);

    // Assert new tweet content is displayed correctly
    const tweetContent = await page.$eval(`[data-tweet-id="${mockTweet.id}"]`, (el) => el.textContent);
    expect(tweetContent).toContain(mockTweet.text);
  });

  // Test key metrics display
  test('should display accurate key metrics', async () => {
    // Mock API call for fetching analytics data
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (request.url().includes('/api/analytics')) {
        request.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockAnalytics),
        });
      } else {
        request.continue();
      }
    });

    // Wait for metrics to load
    await page.waitForSelector('#sentiment-trend-chart');

    // Assert sentiment trend chart is visible
    const sentimentChart = await page.$('#sentiment-trend-chart');
    expect(sentimentChart).toBeTruthy();

    // Assert engagement metrics are displayed correctly
    const engagementMetrics = await page.$eval('#engagement-metrics', (el) => el.textContent);
    expect(engagementMetrics).toContain(mockAnalytics.totalEngagement.toString());

    // Assert AI tool mention statistics are accurate
    const aiToolMentions = await page.$eval('#ai-tool-mentions', (el) => el.textContent);
    expect(aiToolMentions).toContain(mockAnalytics.aiToolMentions[0].tool);
    expect(aiToolMentions).toContain(mockAnalytics.aiToolMentions[0].count.toString());
  });

  // Test tweet analysis interaction
  test('should open tweet analysis view on tweet click', async () => {
    // Find and click on a tweet in the stream
    await page.click('[data-tweet-id]');

    // Wait for tweet analysis view to open
    await page.waitForSelector('#tweet-analysis-view');

    // Assert tweet content is displayed in the analysis view
    const analysisContent = await page.$eval('#tweet-analysis-view', (el) => el.textContent);
    expect(analysisContent).toContain(mockTweets[0].text);

    // Assert sentiment analysis is shown
    const sentimentAnalysis = await page.$('#sentiment-analysis');
    expect(sentimentAnalysis).toBeTruthy();

    // Assert AI tool mentions are highlighted
    const aiToolHighlights = await page.$$('.ai-tool-highlight');
    expect(aiToolHighlights.length).toBeGreaterThan(0);
  });

  // Test response generation and approval workflow
  test('should generate and approve a response to a tweet', async () => {
    // Open tweet analysis view
    await page.click('[data-tweet-id]');
    await page.waitForSelector('#tweet-analysis-view');

    // Click generate response button
    await page.click('#generate-response-btn');

    // Wait for response to be generated
    await page.waitForSelector('#generated-response');

    // Assert response content is displayed
    const responseContent = await page.$eval('#generated-response', (el) => el.textContent);
    expect(responseContent).toContain(mockResponses[0].text);

    // Click approve response button
    await page.click('#approve-response-btn');

    // Assert response status changes to approved
    const responseStatus = await page.$eval('#response-status', (el) => el.textContent);
    expect(responseStatus).toContain('Approved');

    // Assert response appears in the tweet stream
    await page.waitForSelector(`[data-response-id="${mockResponses[0].id}"]`);
    const streamResponse = await page.$eval(`[data-response-id="${mockResponses[0].id}"]`, (el) => el.textContent);
    expect(streamResponse).toContain(mockResponses[0].text);
  });
});

// Human tasks:
// - Implement tests for different user roles and permissions
// - Add tests for error scenarios (e.g., network errors, API failures)
// - Implement tests for responsive design across different screen sizes
// - Add tests for accessibility compliance
// - Implement tests for performance metrics (e.g., load time, responsiveness)
// - Add tests for data persistence across page reloads
// - Implement tests for all interactive elements in the dashboard