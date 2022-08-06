interface PriceProps {
  price?: number | null | undefined;
  discount_percent?: number | undefined | null;
}
export function Price(props: PriceProps) {
  if (!props.price) return null;
  return (
    <div className="text-2xl font-bold">
      {props.discount_percent ? (
        <span>
          <del>${props.price}</del>{" "}
          {(props.price * (100 - props.discount_percent)) / 100}
        </span>
      ) : (
        <span>${props.price}</span>
      )}
    </div>
  );
}
