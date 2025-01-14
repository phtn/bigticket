import createMDX from "@next/mdx";
import "./src/env.js";

const config = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactStrictMode: true,
  experimental: {
    reactCompiler: true,
    mdxRs: true,
  },
};

const withMDX = createMDX({});

export default withMDX(config);
