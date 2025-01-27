import type { LinksFunction, MetaFunction } from "@remix-run/node";
import React, { useEffect } from "react";
import ItemSection from "../components/ItemSection";

// filepath: /f:/Remix/item/item-section/app/root.tsx

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const Index = () => {
  return (
    <div className="container">
      <h1>Welcome to Remix</h1>
      <ItemSection />
    </div>
  );
};

export default Index;
