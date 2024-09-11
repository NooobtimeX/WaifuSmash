/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://www.waifusmash.com/",
  generateRobotsTxt: true, // (optional) to generate robots.txt file
  // ...other options
};
