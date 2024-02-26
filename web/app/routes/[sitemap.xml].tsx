export const loader = () => {
  const content = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset
          xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    <url>
      <loc>https://r2dliu.com/</loc>
      <lastmod>2023-04-19T02:37:42+00:00</lastmod>
      <priority>0.80</priority>
    </url>
    <url>
      <loc>https://r2dliu.com/experience</loc>
      <lastmod>2023-04-19T02:37:42+00:00</lastmod>
      <priority>0.80</priority>
    </url>
    <url>
      <loc>https://r2dliu.com/articles</loc>
      <lastmod>2023-04-19T02:37:42+00:00</lastmod>
      <priority>0.80</priority>
    </url>
    <url>
      <loc>https://r2dliu.com/melee</loc>
      <lastmod>2023-04-19T02:37:42+00:00</lastmod>
      <priority>0.80</priority>
    </url>
    <url>
      <loc>https://r2dliu.com/climbing</loc>
      <lastmod>2023-04-19T02:37:42+00:00</lastmod>
      <priority>0.80</priority>
    </url>
    <url>
      <loc>https://r2dliu.com/articles/pulley</loc>
      <lastmod>2023-04-19T02:37:42+00:00</lastmod>
      <priority>0.64</priority>
    </url>
    <url>
      <loc>https://r2dliu.com/articles/ledgedash</loc>
      <lastmod>2023-04-19T02:37:42+00:00</lastmod>
      <priority>0.64</priority>
    </url>
    <url>
      <loc>https://r2dliu.com/articles/autocancel</loc>
      <lastmod>2023-04-19T02:37:42+00:00</lastmod>
      <priority>0.64</priority>
    </url>
    </urlset>`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      encoding: "UTF-8",
    },
  });
};
