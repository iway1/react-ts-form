import React, { useEffect, useState } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import { AiFillStar } from "react-icons/ai";
import "../css/custom.css";
import { useColorMode } from "@docusaurus/theme-common";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const [githubStars, setGithubStars] = useState(0);

  const { isDarkTheme } = useColorMode();
  const background = isDarkTheme ? "" : "bg-white";

  useEffect(() => {
    // fetch github stars from api
    fetch("https://api.github.com/repos/iway1/react-ts-form")
      .then((res) => res.json())
      .then((data) => setGithubStars(data.stargazers_count));
  }, []);

  return (
    <header className="dark:text-white w-full py-6 px-4">
      <section
        className={`flex flex-col w-full items-center space-y-4 md:space-y-8 p-4 rounded-sm ${background}`}
      >
        <h1 className="text-4xl text-center md:text-6xl mb-0">
          {siteConfig.title}
        </h1>
        <p className="text-xl text-center md:text-2xl">{siteConfig.tagline}</p>
        <div className="flex space-x-2 items-center">
          <Link
            className={`rounded-sm px-5 py-3 font-bold hover:text-white hover:no-underline hover:bg-opacity-90 w-32 md:w-36 text-center ${
              isDarkTheme
                ? "bg-white text-black hover:text-black"
                : "bg-background text-white hover:text-white"
            }`}
            to="https://github.com/iway1/react-ts-form"
            target="_blank"
          >
            <div className="grid grid-cols-3 items-center w-full">
              <AiFillStar className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-xs whitespace-nowrap md:text-sm">Star</span>

              <span className="text-xs whitespace-nowrap md:text-sm w-full">
                {githubStars > 0 && githubStars}
              </span>
            </div>
          </Link>

          <Link
            className={`rounded-sm px-3 py-3 font-bold hover:text-white hover:no-underline hover:bg-opacity-90 w-32 md:w-36 text-center ${
              isDarkTheme
                ? "bg-white text-black hover:text-black"
                : "bg-background text-white hover:text-white"
            }`}
            to="/docs/docs/usage/quick-start"
            target="_blank"
          >
            <div className="grid grid-cols-1 whitespace-nowrap items-center w-full text-xs md:text-sm">
              <span className={isDarkTheme ? `text-black` : `text-white`}>
                Get Started →
              </span>
            </div>
          </Link>
        </div>
        <div
          style={{
            borderColor: "#444444",
            borderWidth: 1,
          }}
          className="rounded-md border-[1px] border-solid  overflow-hidden"
        >
          <img
            src="https://user-images.githubusercontent.com/12774588/210157220-e287cfdf-c26f-4169-a944-ac147cb4b058.gif"
            alt="demo"
          />
        </div>
      </section>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="react-ts-form documentation site, build maintainable forms faster!"
    >
      <HomepageHeader />
      <main className="p-4">
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
