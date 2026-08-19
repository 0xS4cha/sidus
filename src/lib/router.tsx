import { createBrowserRouter } from "react-router-dom";
// import Layout from "@/components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    // element: <Layout />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: Component } = await import("@/pages/Home");
          return { Component };
        },
      },
      {
        path: "/track",
        lazy: async () => {
          const { default: Component } = await import("@/pages/Track");
          return { Component };
        },
      },
    //   {
    //     path: "*",
    //     lazy: async () => {
    //       const { default: Component } = await import("@/pages/NotFound");
    //       return { Component };
    //     },
    //   },
    ],
  },
]);