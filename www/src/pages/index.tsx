import React, { useEffect, useState } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import { AiFillStar } from "react-icons/ai";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const [githubStars, setGithubStars] = useState(0);

  useEffect(() => {
    // fetch github stars from api
    fetch("https://api.github.com/repos/iway1/react-ts-form")
      .then((res) => res.json())
      .then((data) => setGithubStars(data.stargazers_count));
  }, []);

  return (
    <header className="bg-background text-white w-full py-16">
      <div className="flex flex-col w-full items-center space-y-4 px-4">
        <h1 className="text-4xl text-center md:text-6xl">{siteConfig.title}</h1>
        <p className="text-xl text-center md:text-2xl">{siteConfig.tagline}</p>
        <div className="flex space-x-2 items-center">
          <Link
            className="rounded-md px-5 py-3 bg-white text-black font-bold hover:no-underline hover:text-black hover:bg-opacity-90"
            to="https://github.com/iway1/react-ts-form"
            target="_blank"
          >
            <div className="flex items-center space-x-2">
              <AiFillStar className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-xs whitespace-nowrap md:text-lg">
                Star {githubStars}
              </span>
            </div>
          </Link>
          <Link
            className="rounded-md text-xs whitespace-nowrap md:text-lg px-5 py-3 bg-white text-black font-bold hover:no-underline hover:text-black hover:bg-opacity-90"
            to="/docs/docs/installation"
          >
            Get Started →
          </Link>
        </div>
        <img
          src="https://user-images.githubusercontent.com/12774588/210157220-e287cfdf-c26f-4169-a944-ac147cb4b058.gif"
          alt="demo"
        />
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
