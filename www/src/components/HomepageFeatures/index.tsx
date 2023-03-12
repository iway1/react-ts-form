import React from "react";
import { useColorMode } from "@docusaurus/theme-common";

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Typesafety First 👷‍♂️",
    description: (
      <>
        Automatically generate typesafe forms with <code>zod</code> schemas.
      </>
    ),
  },
  {
    title: "No more boilerplate 🧰",
    description: (
      <>
        Eliminate repetitive JSX & <code>zod</code> /{" "}
        <code>react-hook-form</code> boilerplate
      </>
    ),
  },
  {
    title: "Headless puts you in control 🤯",
    description: (
      <>
        Headless implementation with full control of components via typesafe
        props
      </>
    ),
  },
];

function Feature({ title, description }: FeatureItem) {
  const { isDarkTheme } = useColorMode();
  const text = isDarkTheme ? "[&>code]:text-white" : "text-black";

  return (
    <div
      className={`flex flex-col items-center justify-center max-w-sm text-center [&>code]:text-white ${text}`}
    >
      <h3 className="text-2xl md:text-4xl">{title}</h3>
      <p className="text-lg">{description}</p>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  const { isDarkTheme } = useColorMode();
  const background = isDarkTheme ? "" : "bg-white";
  const text = isDarkTheme ? "text-white" : "text-black";
  return (
    <section
      className={`flex flex-col md:flex-row w-full items-start justify-evenly py-4 space-y-8 md:space-y-0 md:py-20 rounded-sm ${background}`}
    >
      {FeatureList.map((props, idx) => (
        <Feature key={idx} {...props} />
      ))}
    </section>
  );
}
