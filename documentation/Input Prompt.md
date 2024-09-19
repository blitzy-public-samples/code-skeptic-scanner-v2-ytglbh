We are building a cloud-based solution called "Code Skeptic Scanner" that monitors Twitter/X in real-time for skeptical or negative opinions about AI coding tools. The application will identify relevant tweets, analyze their content, and store the information in a Notion database. Additionally, it will generate responses to these tweets using LLM technology.
On identifying a relevant tweet, we need to do the following:
1. Continuously monitor Twitter's streaming API to identify tweets in real-time that meet our criteria of expressing skepticism or negative opinions about AI coding tools.
2. Check if the tweet meets the specified "popularity threshold" based on the number of likes and/or the account's follower count.
3. Extract and store the following information in a Notion database:
   * Account Handle (Text): Handle of the posting account
   * Followers (Number): Number of followers of the posting account
   * Likes (Number): Number of likes of the tweet
   * Date and Time (Date): Date and time of the tweet
   * Tweet (Text): Content of the tweet
   * Media (Files & media): Any photo or video content associated with the tweet
   * Quoted Tweet (Text): If the tweet quoted another tweet, store the text of the quoted tweet
   * Doubt Rating (Number): Assign a rating from 1-10 indicating the level of hostility/doubt towards AI coding tools
   * AI Tools Mentioned (Multi-Select): Identify and tag any specific AI tools mentioned (e.g., Devin, ChatGPT, GitHub Copilot)
   * Response (Text): Store the generated response from the @BlitzyAI account
4. Issue a Notion notification whenever a new tweet is added to the database, alerting relevant team members in real-time.
5. Implement a "responses" module that uses LLMs to generate appropriate responses to the identified tweets. This module should:
   * Accept custom prompts and additional context documents to guide response generation
   * Generate responses that address the specific concerns or skepticism expressed in the tweet
   * Ensure responses align with the tone and messaging of the @BlitzyAI account
6. Provide an API and UI interface that allows users to:
   * Adjust the "popularity threshold" parameters
   * Manually trigger response generation for specific tweets
   * Add, edit, or remove custom prompts and context documents for the response module
   * Embed the Notion database directly in the UI for easy access to all collected data
   * Provide direct links to the original tweets on Twitter/X, allowing users to quickly navigate to and respond to the tweets from within the application
7. Implement robust error handling and logging to manage rate limits, API failures, and other potential issues.
8. Ensure GDPR compliance and respect Twitter's terms of service regarding data collection and storage.
The solution needs to be scalable to handle a high volume of tweets, maintain high availability, and provide real-time updates to the Notion database. It should also include analytics features to track trends in AI coding tool skepticism over time.
The UI should prioritize user experience, making it intuitive for team members to:
* Monitor incoming tweets in real-time
* Review and analyze the collected data
* Quickly respond to tweets directly from the application
* Customize and fine-tune the tweet identification and response generation processes
This system will serve as a comprehensive tool for monitoring, analyzing, and engaging with skepticism about AI coding tools on Twitter, enabling our team to stay informed and responsive in real-time.