import React, { lazy } from "react";

const HomePage = lazy(() => import("./containers/HomePage"));
const PlaylistPage = lazy(() => import("./containers/PlaylistPage"));
const NotFoundPage = lazy(() => import("./containers/NotFoundPage"));

export const routes = [
  { path: "/", exact: true, name: "HomePage", component: HomePage },
  {
    path: "/playlist/:id",
    exact: true,
    name: "PlaylistPage",
    component: PlaylistPage
  },
  {
    path: "",
    exact: true,
    name: "NotFoundPage",
    component: NotFoundPage
  }
];
