import { CategoryType, Product } from "@prisma/client";

export type ProductFull =
  | (Partial<Product> & {
      categories?:
        | {
            category: {
              id: string | undefined;
              name: string | undefined;
              type: CategoryType | undefined;
            } | null;
          }[]
        | undefined
        | null;
      inventory?: { qty: number } | null | undefined;
      discount?:
        | {
            id: string | undefined;
            name: string | undefined;
            desc: string | undefined;
            discount_percent: number | undefined;
          }
        | null
        | undefined;
    })
  | null;
