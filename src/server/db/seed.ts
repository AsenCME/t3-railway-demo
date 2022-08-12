import { faker } from "@faker-js/faker";
import { CATEGORY_TYPES } from "../../utils/constants";
import { prisma } from "./client";

export const seed = async () => {
  // create discounts
  const discountData = new Array(5).fill(null).map(() => ({
    name: faker.animal.lion(),
    desc: faker.company.bs(),
    discount_percent: faker.datatype.number({ min: 5, max: 100 }),
  }));
  const discounts = await prisma.$transaction(
    discountData.map((data) =>
      prisma.discount.create({ data, select: { id: true } })
    )
  );

  // create inventories
  const inventoriesData = new Array(25)
    .fill(null)
    .map(() => ({ qty: faker.datatype.number({ min: 10, max: 100 }) }));
  const inventories = await prisma.$transaction(
    inventoriesData.map((x) =>
      prisma.inventory.create({ data: x, select: { id: true } })
    )
  );

  // create products
  const productData = new Array(25).fill(null).map((_, i) => ({
    name: faker.commerce.productName(),
    desc: faker.commerce.productDescription(),
    price: faker.datatype.number({ min: 1, max: 1000 }),
    SKU: faker.random.alpha({ count: 10 }),
    inventory_id: inventories[i]!.id,
    discount_id:
      Math.random() > 0.25
        ? discounts[
            faker.datatype.number({ min: 0, max: discounts.length - 1 })
          ]?.id
        : undefined,
  }));
  const products = await prisma.$transaction(
    productData.map((data) =>
      prisma.product.create({ data, select: { id: true } })
    )
  );

  // create categories
  const categoryData = new Array(50).fill(null).map(() => ({
    name: faker.science.chemicalElement().name,
    desc: faker.company.bs(),
    type: CATEGORY_TYPES[
      faker.datatype.number({ min: 0, max: CATEGORY_TYPES.length - 1 })
    ] as any,
  }));
  const categories = await prisma.$transaction(
    categoryData.map((data) =>
      prisma.category.create({ data, select: { id: true } })
    )
  );

  // create product categories
  const productCategoryData = products.flatMap(({ id: product_id }) =>
    new Array(Math.round(Math.random() * 3 + 2)).fill(null).map(() => ({
      product_id,
      category_id:
        categories[
          faker.datatype.number({ min: 0, max: categories.length - 1 })
        ]!.id,
    }))
  );
  await prisma.productCategory.createMany({ data: productCategoryData });
};
