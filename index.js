const express = require("express");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");

const app = express();

const urls = [
    { url: "/", changefreq: "daily", priority: 1.0 },
    { url: "/about", changefreq: "monthly", priority: 0.8 },
    { url: "/contact", changefreq: "monthly", priority: 0.8 },
    { url: "/services", changefreq: "weekly", priority: 0.9 },
    { url: "/blog", changefreq: "weekly", priority: 0.7 },
];

app.get("/sitemap", async (req, res) => {
    res.header("Content-Type", "application/xml");
    res.header("Content-Encoding", "gzip");

    try {
        const smStream = new SitemapStream({ hostname: "https://example.com" });
        const pipeline = smStream.pipe(createGzip());

        urls.forEach((link) => smStream.write(link));
        smStream.end();

        const sitemap = await streamToPromise(pipeline);
        
        res.send({
            sitemap: sitemap.toString(),
            total_urls: urls.length,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error generating sitemap");
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
