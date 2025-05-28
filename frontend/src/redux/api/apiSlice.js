import { fetchBaseQuery,createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL,credential:"include" });
export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Orders", "User", "Category"],
  endpoints: () => ({}),
});
