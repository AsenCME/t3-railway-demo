import { trpc } from "../utils/trpc";

function Price({
  price,
  discount_percent,
}: {
  price: number | null;
  discount_percent: number | undefined | null;
}) {
  if (!price) return null;
  return (
    <div className="text-4xl font-bold">
      {discount_percent ? (
        <>
          <del>${price}</del> {(price * (100 - discount_percent)) / 100}
        </>
      ) : (
        "$" + price
      )}
    </div>
  );
}

export default function Product({
  product,
  onClick,
}: {
  product: ProductFull;
  onClick: () => void;
}) {
  return (
    <div
      className="transition cursor-pointer rounded p-4 bg-gray-100 hover:bg-gray-300"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="tracking-widest text-gray-500 font-medium">
            {product.category?.name}
          </div>
          <div className="text-xl font-bold">{product.name}</div>
          <div className="text-gray-600">{product.desc}</div>
          <Price
            price={product.price}
            discount_percent={product.discount?.discount_percent}
          />
          {product.discount && (
            <div className="mt-4">
              <div>&quot;{product.discount.name}&quot; Discount</div>
              <div>{product.discount.desc}</div>
              <div>{product.discount.discount_percent}%</div>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="text-4xl font-bold text-gray-600">
            {product.inventory?.qty || 0}
          </div>
          <div className="text-gray-400">Items left</div>
        </div>
      </div>
    </div>
  );
}
