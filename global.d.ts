interface ProductFull {
  id: string;
  name: string | null;
  desc: string | null;
  price: number | null;
  inventory_id: string | null;
  discount_id: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  deleted_at: Date | null;
  inventory: { qty: number } | null;
  categories: { category: { id: string; name: string; desc: string } | null }[];
  discount: {
    id: string;
    name: string;
    desc: string;
    discount_percent: number | null;
  } | null;
}
