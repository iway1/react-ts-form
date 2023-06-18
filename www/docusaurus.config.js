// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "react-ts-form",
  tagline: "Build maintainable, typesafe forms faster 🏃💨",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://react-ts-form.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "iway1", // Usually your GitHub org/user name.
  projectName: "react-ts-form", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  plugins: ["docusaurus-tailwindcss"],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/iway1/react-ts-form/tree/main/www/",
        },

        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: "dark",
      },
      metadata: [
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:site",
          content: "@isaac_ts_way",
        },
        {
          name: "twitter:creator",
          content: "@isaac_ts_way",
        },
        {
          name: "twitter:title",
          content: "react-ts-form",
        },
        {
          name: "twitter:description",
          content: "Build maintainable, typesafe forms faster 🏃💨",
        },
        {
          name: "twitter:image",
          content: "https://react-ts-form.vercel.app/img/social-card.png",
        },
        {
          name: "og:title",
          content: "react-ts-form",
        },
        {
          name: "og:description",
          content: "Build maintainable, typesafe forms faster 🏃💨",
        },
        {
          name: "og:image",
          content: "https://react-ts-form.vercel.app/img/social-card.png",
        },
        {
          name: "og:url",
          content: "https://react-ts-form.vercel.app",
        },
        {
          name: "og:site_name",
          content: "react-ts-form",
        },
        {
          name: "og:type",
          content: "website",
        },
      ],
      // Replace with your project's social card
      image: "img/logo.png",
      navbar: {
        title: "react-ts-form",
        logo: {
          alt: "react-ts-form Logo",
          src: "img/logo.png",
        },
        items: [
          {
            type: "doc",
            docId: "docs/usage/quick-start",
            position: "left",
            label: "Docs",
          },
          {
            type: "doc",
            docId: "api/api-docs/createtsform",
            position: "left",
            label: "API",
          },
          {
            href: "https://github.com/iway1/react-ts-form",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "light",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Installation",
                to: "docs/docs/installation",
              },
              {
                label: "Usage",
                to: "docs/docs/usage/quick-start",
              },
              {
                label: "API",
                to: "docs/api/api-docs/createtsform",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Twitter",
                href: "https://twitter.com/isaac_ts_way",
              },
            ],
          },
        ],
        copyright: `Built with ❤️ - react-ts-form ${new Date().getFullYear()}`,
      },

      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
