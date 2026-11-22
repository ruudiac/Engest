export type NewsItem = {
  title: string;
  link: string;
  description: string;
  date: string;   // e.g. "22 Nov"
  image: string | null;
};

const FEED = 'https://news.err.ee/rss/news';

// Pulls the text out of one tag, e.g. <title><![CDATA[Hello]]></title> -> "Hello"
const pick = (block: string, tag: string) => {
  const m = block.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`));
  return m ? decode(m[1].trim()) : '';
};

// Turns &amp; &quot; etc. back into normal characters
const decode = (s: string) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

export async function getNews(limit = 5): Promise<NewsItem[]> {
  const res = await fetch(FEED);
  const xml = await res.text();

  // Every article is one <item> ... </item> block
  const items = xml.split('<item>').slice(1, limit + 1);

  return items.map((block) => {
    // "Sun, 22 Nov 2026 09:17:00 +0200" -> ["Sun,", "22", "Nov", ...] -> "22 Nov"
    const parts = pick(block, 'pubDate').split(' ');
    const image = block.match(/<media:thumbnail url='([^']+)'/);
    return {
      title: pick(block, 'title'),
      link: pick(block, 'link'),
      description: pick(block, 'description'),
      date: parts.length > 2 ? `${parts[1]} ${parts[2]}` : '',
      image: image ? image[1] : null,
    };
  });
}