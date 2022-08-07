import { Price } from "./price";
import { AllProductsItemReturnType } from "../server/router/product";

interface Props {
  product: AllProductsItemReturnType;
  onClick: () => void;
}
export default function ProductComponent({ product, onClick }: Props) {
  if (!product) return null;
  return (
    <div
      className="transition rounded py-2 px-4 bg-gray-50 hover:ring-2 hover:ring-gray-400 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="tracking-widest text-gray-500 font-medium">
            {product.categories?.map((x) => x.category?.name).join(", ")}
          </div>
          <div className="text-lg font-bold">{product.name}</div>
          <div className="text-gray-600">{product.desc}</div>
          <Price
            price={product.price}
            discount_percent={product.discount?.discount_percent}
          />
          {product.discount && (
            <div className="mt-4 text-gray-500 text-sm">
              <div className="text-black font-bold">
                &quot;{product.discount.name}&quot; Discount
              </div>
              <b>{product.discount.discount_percent}%</b>
              <div>{product.discount.desc}</div>
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
