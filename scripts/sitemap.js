// Import necessary modules
const path = require('path');
const fs = require('fs-extra');
const SitemapGenerator = require('sitemap-generator');

// Define the path where the sitemap file will be saved
const xmlFile = path.join(process.cwd(), '.deploy/sitemap.xml');

// Create a sitemap generator for your website
const generator = SitemapGenerator('https://prompt.garyhou2023.info', {
  maxDepth: 0,                // Maximum depth to crawl (0 means only the homepage)
  filepath: xmlFile,          // Filepath to save the sitemap
  maxEntriesPerFile: 50000,   // Maximum number of URLs per sitemap file
  stripQuerystring: true,     // Remove query strings from URLs
  decodeResponses: true,      // Decode responses to handle encoded URLs
});

// Register event listeners
generator.on('done', async () => {
  // Read the generated sitemap file
  const str = await fs.readFileSync(xmlFile);

  // Replace old domain with the same domain in the sitemap content
  const newStr = str.toString().replace(/https:\/\/prompt\.garyhou2023\.info/g, 'https://prompt.garyhou2023.info');

  // Save the modified sitemap content
  await fs.outputFile(xmlFile, newStr);
  
  // Output a message indicating that sitemaps are created
  console.log('Sitemaps created!');
});

// Start the sitemap generation process
generator.start();
