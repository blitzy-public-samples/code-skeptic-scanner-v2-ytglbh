import { NlpProcessor } from '../../../src/services/sentimentAnalysis/nlpProcessor';
import { DoubtRatingAssigner } from '../../../src/services/sentimentAnalysis/doubtRatingAssigner';
import { AiToolMentionDetector } from '../../../src/services/sentimentAnalysis/aiToolMentionDetector';
import { mockTweet } from '../../mocks/tweetMock';
import { mockAiTools } from '../../mocks/aiToolsMock';

// Test suite for NlpProcessor
describe('NlpProcessor', () => {
  // Test NlpProcessor initialization
  test('should initialize NlpProcessor correctly', () => {
    const nlpProcessor = new NlpProcessor();
    expect(nlpProcessor).toBeDefined();
    expect(nlpProcessor.sentimentAnalyzer).toBeDefined();
    expect(nlpProcessor.tokenizer).toBeDefined();
  });

  // Test analyzeSentiment method
  test('should analyze sentiment correctly', () => {
    const nlpProcessor = new NlpProcessor();
    const positiveText = "I love this product! It's amazing!";
    const negativeText = "This is terrible. I hate it.";
    const neutralText = "The sky is blue.";

    const positiveSentiment = nlpProcessor.analyzeSentiment(positiveText);
    const negativeSentiment = nlpProcessor.analyzeSentiment(negativeText);
    const neutralSentiment = nlpProcessor.analyzeSentiment(neutralText);

    expect(positiveSentiment).toBeGreaterThan(0.5);
    expect(negativeSentiment).toBeLessThan(0.5);
    expect(neutralSentiment).toBeCloseTo(0.5, 1);
    expect(positiveSentiment).toBeGreaterThan(negativeSentiment);
  });

  // Test extractKeywords method
  test('should extract keywords correctly', () => {
    const nlpProcessor = new NlpProcessor();
    const text = "Artificial intelligence and machine learning are transforming the tech industry.";
    const keywords = nlpProcessor.extractKeywords(text);

    expect(keywords).toContain("artificial");
    expect(keywords).toContain("intelligence");
    expect(keywords).toContain("machine");
    expect(keywords).toContain("learning");
    expect(keywords).not.toContain("the");
    expect(keywords).not.toContain("and");
  });

  // Test detectLanguage method
  test('should detect language correctly', () => {
    const nlpProcessor = new NlpProcessor();
    const englishText = "Hello, how are you?";
    const spanishText = "Hola, ¿cómo estás?";
    const frenchText = "Bonjour, comment allez-vous?";

    expect(nlpProcessor.detectLanguage(englishText)).toBe("en");
    expect(nlpProcessor.detectLanguage(spanishText)).toBe("es");
    expect(nlpProcessor.detectLanguage(frenchText)).toBe("fr");
  });
});

// Test suite for DoubtRatingAssigner
describe('DoubtRatingAssigner', () => {
  // Test DoubtRatingAssigner initialization
  test('should initialize DoubtRatingAssigner with correct parameters', () => {
    const mockNlpProcessor = new NlpProcessor();
    const doubtRatingAssigner = new DoubtRatingAssigner(mockNlpProcessor);

    expect(doubtRatingAssigner).toBeDefined();
    expect(doubtRatingAssigner.doubtKeywords).toEqual(expect.arrayContaining(["doubt", "skeptical", "unsure"]));
    expect(doubtRatingAssigner.sentimentThreshold).toBeCloseTo(0.3, 2);
  });

  // Test assignDoubtRating method
  test('should assign doubt rating correctly', () => {
    const mockNlpProcessor = new NlpProcessor();
    const doubtRatingAssigner = new DoubtRatingAssigner(mockNlpProcessor);

    const highDoubtTweet = mockTweet("I'm very skeptical about the claims of this AI tool.");
    const lowDoubtTweet = mockTweet("This AI tool seems pretty good.");
    const neutralTweet = mockTweet("I'm using an AI tool for my work.");

    const highDoubtRating = doubtRatingAssigner.assignDoubtRating(highDoubtTweet);
    const lowDoubtRating = doubtRatingAssigner.assignDoubtRating(lowDoubtTweet);
    const neutralDoubtRating = doubtRatingAssigner.assignDoubtRating(neutralTweet);

    expect(highDoubtRating).toBeGreaterThan(lowDoubtRating);
    expect(highDoubtRating).toBeGreaterThan(neutralDoubtRating);
    expect(highDoubtRating).toBeGreaterThanOrEqual(0);
    expect(highDoubtRating).toBeLessThanOrEqual(10);
  });

  // Test updateDoubtKeywords method
  test('should update doubt keywords correctly', () => {
    const mockNlpProcessor = new NlpProcessor();
    const doubtRatingAssigner = new DoubtRatingAssigner(mockNlpProcessor);
    const newKeywords = ["uncertain", "questionable", "dubious"];

    doubtRatingAssigner.updateDoubtKeywords(newKeywords);

    expect(doubtRatingAssigner.doubtKeywords).toEqual(expect.arrayContaining(newKeywords));

    const tweet = mockTweet("This AI tool seems questionable and dubious.");
    const doubtRating = doubtRatingAssigner.assignDoubtRating(tweet);
    expect(doubtRating).toBeGreaterThan(5);
  });

  // Test updateSentimentThreshold method
  test('should update sentiment threshold correctly', () => {
    const mockNlpProcessor = new NlpProcessor();
    const doubtRatingAssigner = new DoubtRatingAssigner(mockNlpProcessor);
    const newThreshold = 0.5;

    doubtRatingAssigner.updateSentimentThreshold(newThreshold);

    expect(doubtRatingAssigner.sentimentThreshold).toBe(newThreshold);

    const tweet1 = mockTweet("I'm slightly unsure about this AI tool.");
    const tweet2 = mockTweet("I'm very skeptical about this AI tool.");

    const rating1 = doubtRatingAssigner.assignDoubtRating(tweet1);
    const rating2 = doubtRatingAssigner.assignDoubtRating(tweet2);

    expect(rating2).toBeGreaterThan(rating1);
  });
});

// Test suite for AiToolMentionDetector
describe('AiToolMentionDetector', () => {
  // Test AiToolMentionDetector initialization
  test('should initialize AiToolMentionDetector with correct AI tools', () => {
    const mockNlpProcessor = new NlpProcessor();
    const aiToolMentionDetector = new AiToolMentionDetector(mockNlpProcessor, mockAiTools);

    expect(aiToolMentionDetector).toBeDefined();
    expect(aiToolMentionDetector.aiTools).toEqual(mockAiTools);
  });

  // Test detectMentions method
  test('should detect AI tool mentions correctly', () => {
    const mockNlpProcessor = new NlpProcessor();
    const aiToolMentionDetector = new AiToolMentionDetector(mockNlpProcessor, mockAiTools);

    const tweet1 = mockTweet("I'm using ChatGPT for my work.");
    const tweet2 = mockTweet("DALL-E and Midjourney are great for creating images.");
    const tweet3 = mockTweet("This tweet doesn't mention any AI tools.");

    const mentions1 = aiToolMentionDetector.detectMentions(tweet1);
    const mentions2 = aiToolMentionDetector.detectMentions(tweet2);
    const mentions3 = aiToolMentionDetector.detectMentions(tweet3);

    expect(mentions1).toContain("ChatGPT");
    expect(mentions2).toContain("DALL-E");
    expect(mentions2).toContain("Midjourney");
    expect(mentions3).toHaveLength(0);
  });

  // Test updateAiTools method
  test('should update AI tools correctly', () => {
    const mockNlpProcessor = new NlpProcessor();
    const aiToolMentionDetector = new AiToolMentionDetector(mockNlpProcessor, mockAiTools);
    const newAiTools = ["GPT-4", "Stable Diffusion", "LaMDA"];

    aiToolMentionDetector.updateAiTools(newAiTools);

    expect(aiToolMentionDetector.aiTools).toEqual(expect.arrayContaining(newAiTools));

    const tweet = mockTweet("I'm excited about the capabilities of GPT-4 and Stable Diffusion.");
    const mentions = aiToolMentionDetector.detectMentions(tweet);

    expect(mentions).toContain("GPT-4");
    expect(mentions).toContain("Stable Diffusion");
  });
});

// Human tasks:
// - Review and update test cases as new features are added to the sentiment analysis services
// - Implement integration tests to ensure proper interaction between NlpProcessor, DoubtRatingAssigner, and AiToolMentionDetector
// - Add more edge case scenarios to test robustness of the sentiment analysis and mention detection logic
// - Implement performance tests to ensure efficient processing of large volumes of tweets
// - Add tests for error handling and recovery scenarios in all services
// - Develop tests for multilingual support in sentiment analysis
// - Ensure test coverage is maintained above 90% for all sentiment analysis services