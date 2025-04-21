import { http, HttpResponse } from "msw";

import articleContent from "./articleContent.json";
import features from "./api/features.json";
export const handlers = [
  http.get(new RegExp(`${process.env.NEXT_PUBLIC_API_URL}markers/get/es/.*`), () => {
    const mockData = features;

    return HttpResponse.json(mockData);
  }),
  http.get(`${process.env.NEXT_PUBLIC_API_URL}check-auth`, () => {
    const mockData = {
      success: true,
      data: {
        SUCCESS: true,
        id: 21,
        email: "martinbailetti@gmail.com",
        name: "MARTIN",
        created_at: "2023-12-29T22:35:31.000000Z",
        geolocation: null,
      },
      message: "LOGIN",
    };

    return HttpResponse.json(mockData);
  }),
  http.get(`${process.env.NEXT_PUBLIC_API_URL}markers/articles/get/.*`, () => {
    const mockData = {
      success: true,
      data: {
        html: "<p>Article content</p>",
      },
    };

    return HttpResponse.json(mockData);
  }),
  http.get(new RegExp(`${process.env.NEXT_PUBLIC_API_URL}markers/articles-content/get/.*`), () => {
    const mockData = articleContent;

    return HttpResponse.json(mockData);
  }),
];
