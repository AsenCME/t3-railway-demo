import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface Props {
  page: number;
  onPrev: () => void;
  onNext: () => void;
}
export default function PageControls(props: Props) {
  return (
    <div className="flex gap-2 mt-2">
      <div className="page-button cursor-pointer" onClick={props.onPrev}>
        <IoChevronBack />
      </div>
      <div className="page-button">{props.page}</div>
      <div className="page-button cursor-pointer" onClick={props.onNext}>
        <IoChevronForward />
      </div>
    </div>
  );
}
