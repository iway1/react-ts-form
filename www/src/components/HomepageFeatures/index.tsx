import React from "react";

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Typesafety First 👷‍♂️", // hardhat emoji is
    description: (
      <>
        Automatically generate typesafe forms with{" "}
        <code className="text-black dark:text-white">zod</code> schemas.
      </>
    ),
  },
  {
    title: "No more boilerplate 🧰",
    description: (
      <>
        Eliminate repetitive JSX &{" "}
        <code className="text-black dark:text-white">zod</code>/
        <code className="text-black dark:text-white whitespace-nowrap">
          react-hook-form
        </code>{" "}
        boilerplate
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
  return (
    <div className="flex flex-col items-center justify-center max-w-sm text-center [&>p]:text-blue-500 dark:text-white">
      <h3 className="text-2xl md:text-4xl">{title}</h3>
      <p className="text-lg">{description}</p>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className="flex flex-col md:flex-row w-full items-start justify-evenly py-4 space-y-8 md:space-y-0 md:py-20 rounded-sm bg-white dark:bg-background">
      {FeatureList.map((props, idx) => (
        <Feature key={idx} {...props} />
      ))}
    </section>
  );
}
