import Link from "next/link";
import { IoChevronBack } from "react-icons/io5";

interface Props {
  name: string;
  to: string;
}
export default function BackButton(props: Props) {
  return (
    <div className="w-full flex justify-start mb-2">
      <Link href={props.to}>
        <div className="transition px-2 py-1 text-gray-600 font-bold text-sm rounded hover:bg-gray-100 flex items-center justify-center gap-2 cursor-pointer">
          <IoChevronBack />
          {props.name}
        </div>
      </Link>
    </div>
  );
}
