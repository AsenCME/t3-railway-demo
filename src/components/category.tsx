import { Category } from "@prisma/client";
import Link from "next/link";

import { formatDate } from "../utils/dates";

export default function CategoryComponent(props: Category) {
  return (
    <Link href={props.id}>
      <div className="transition p-2 rounded hover:bg-gray-100 cursor-pointer">
        <div className="flex gap-4">
          <div className="text-lg font-bold flex-1">{props.name}</div>
          <div className="text-sm text-gray-400 font-bold tracking-widest">
            {formatDate(props.created_at)}
          </div>
        </div>

        <div className="text-gray-600">{props.desc}</div>
      </div>
    </Link>
  );
}
