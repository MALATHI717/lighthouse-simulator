const express = require("express");
const axios = require("axios");
const { parseStringPromise } = require("xml2js");
const fs = require('fs');
const lighthouse = require('lighthouse').default;
const chromeLauncher = require('chrome-launcher');
const cors = require("cors"); // Import CORS

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request body

app.post("/get-sitemap-urls", async (req, res) => {
    try {
        const { sitemapUrl } = req.body;

        if (!sitemapUrl) {
            return res.status(400).json({ error: "sitemapUrl is required" });
        }

        // Fetch the sitemap XML
        const response = await axios.get(sitemapUrl);
        const xmlData = response.data;

        // Parse XML to JSON
        const jsonData = await parseStringPromise(xmlData);
        const urls = jsonData.urlset.url.map((entry) => entry.loc[0]);

        // Return response
        res.json({
            total_urls: urls.length,
            urls: urls,
        });

    } catch (error) {
        console.error("Error fetching sitemap:", error);
        res.status(500).json({ error: "Failed to fetch or parse sitemap" });
    }
});

app.post ("/get-light-score",async (req,res)=> {
    const { url } = req.body;    
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = { logLevel: 'info', output: ['json', 'html'], port: chrome.port };
    const runnerResult = await lighthouse(url, options);
    // const htmlReport = runnerResult.report[1]; // Index 1 for HTML output
    // fs.writeFileSync('lighthouse-report.html', htmlReport);

    // Get JSON and HTML reports
    // const jsonReport = JSON.stringify(runnerResult.lhr, null, 2);
    await chrome.kill();
    // Return response
    res.status(200).json(runnerResult.lhr);

})

app.listen(3000, () => console.log("Server running on port 3000"));
