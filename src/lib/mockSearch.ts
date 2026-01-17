import type { SearchResult } from '@/types/mountx';

const mockResults: Record<string, SearchResult[]> = {
  default: [
    {
      title: 'Wikipedia - The Free Encyclopedia',
      url: 'https://en.wikipedia.org',
      snippet: 'Wikipedia is a free online encyclopedia, created and edited by volunteers around the world and hosted by the Wikimedia Foundation.',
    },
    {
      title: 'GitHub: Let\'s build from here',
      url: 'https://github.com',
      snippet: 'GitHub is where over 100 million developers shape the future of software, together. Contribute to the open source community.',
    },
    {
      title: 'Stack Overflow - Where Developers Learn & Share',
      url: 'https://stackoverflow.com',
      snippet: 'Stack Overflow is the largest, most trusted online community for developers to learn, share their knowledge.',
    },
    {
      title: 'MDN Web Docs',
      url: 'https://developer.mozilla.org',
      snippet: 'Resources for developers, by developers. Documentation for Web technologies including HTML, CSS, JavaScript, and APIs.',
    },
    {
      title: 'Reddit - Pair with a community',
      url: 'https://reddit.com',
      snippet: 'Reddit is a network of communities where people can dive into their interests, hobbies and passions.',
    },
  ],
  react: [
    {
      title: 'React – A JavaScript library for building user interfaces',
      url: 'https://react.dev',
      snippet: 'React lets you build user interfaces out of individual pieces called components. Create your own React components like Thumbnail, LikeButton, and Video.',
    },
    {
      title: 'Getting Started – React',
      url: 'https://react.dev/learn',
      snippet: 'Welcome to the React documentation! This page will give you an introduction to the 80% of React concepts that you will use on a daily basis.',
    },
    {
      title: 'React Tutorial - W3Schools',
      url: 'https://www.w3schools.com/react',
      snippet: 'React is a JavaScript library for building user interfaces. React is used to build single-page applications.',
    },
    {
      title: 'React on GitHub',
      url: 'https://github.com/facebook/react',
      snippet: 'The library for web and native user interfaces. React 18.2.0 with concurrent features and improved performance.',
    },
  ],
  javascript: [
    {
      title: 'JavaScript | MDN',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      snippet: 'JavaScript (JS) is a lightweight interpreted programming language with first-class functions.',
    },
    {
      title: 'JavaScript.com',
      url: 'https://www.javascript.com',
      snippet: 'Learn JavaScript online in an interactive environment. Tutorials and courses from beginner to advanced.',
    },
    {
      title: 'The Modern JavaScript Tutorial',
      url: 'https://javascript.info',
      snippet: 'Modern JavaScript Tutorial: simple, but detailed explanations with examples and tasks.',
    },
  ],
  weather: [
    {
      title: 'Weather.com - Local Weather Forecast',
      url: 'https://weather.com',
      snippet: 'Check your local weather forecast, current conditions, and get regional weather updates.',
    },
    {
      title: 'AccuWeather - Weather Forecasts',
      url: 'https://accuweather.com',
      snippet: 'Get accurate weather forecasts for any city. Hourly and daily forecasts with precipitation chance.',
    },
  ],
  news: [
    {
      title: 'BBC News - World News',
      url: 'https://bbc.com/news',
      snippet: 'Breaking news, features and analysis from around the world. The BBC is an internationally trusted news source.',
    },
    {
      title: 'Reuters | Breaking International News',
      url: 'https://reuters.com',
      snippet: 'Find latest news from every corner of the globe. Reuters, the news and media division of Thomson Reuters.',
    },
    {
      title: 'The New York Times',
      url: 'https://nytimes.com',
      snippet: 'Live news, investigations, opinion, photos and video by the journalists of The New York Times from more than 150 countries.',
    },
  ],
};

export async function searchMock(query: string): Promise<SearchResult[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));

  const lowerQuery = query.toLowerCase();
  
  // Check for keyword matches
  for (const key of Object.keys(mockResults)) {
    if (key !== 'default' && lowerQuery.includes(key)) {
      return mockResults[key];
    }
  }

  // Return default results with modified snippets to include query
  return mockResults.default.map(result => ({
    ...result,
    snippet: `${result.snippet} Related to your search for "${query}".`,
  }));
}

export function isUrl(input: string): boolean {
  // Check if input looks like a URL
  if (input.startsWith('http://') || input.startsWith('https://')) {
    return true;
  }
  // Check for domain-like patterns
  const domainPattern = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+/;
  return domainPattern.test(input);
}

export function normalizeUrl(input: string): string {
  if (input.startsWith('http://') || input.startsWith('https://')) {
    return input;
  }
  return `https://${input}`;
}
