export const dynamic = "force-static";

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Ivren changelog</title>
    <link>https://ivren.io/changelog</link>
    <description>Ivren release notes, newest first.</description>
    <language>en-us</language>
  </channel>
</rss>`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
