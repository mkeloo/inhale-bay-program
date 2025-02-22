import React from "react";
import { Redirect } from "expo-router";

export default function Home() {
  return <Redirect href={"/(root)/(client)/(main)/(signup)/clientPhone"} />;
}