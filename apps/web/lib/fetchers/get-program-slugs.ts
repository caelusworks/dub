import { prisma } from "@/lib/prisma";
import { cache } from "react";

// called from generateStaticParams, which runs during `next build` — there is no
// database to reach then, so prerender nothing and let these pages render on demand
export const getProgramSlugs = cache(async () => {
  try {
    return await prisma.program.findMany({
      select: {
        slug: true,
      },
      orderBy: {
        applications: {
          _count: "desc",
        },
      },
      take: 250,
    });
  } catch (error) {
    console.warn("[getProgramSlugs] database unreachable, skipping prerender");
    return [];
  }
});
