import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

const photos = defineCollection({
  loader: file("src/content/photos/photos.yaml"),
  schema: ({ image }) =>
    z.object({
      image: image(),
      alt: z.string().min(1),
      caption: z.string().optional(),
      date: z.coerce.date(),
    }),
});

export const collections = { photos };
