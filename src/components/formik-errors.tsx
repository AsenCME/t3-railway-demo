import { useFormikContext } from "formik";

export default function FormikErrors() {
  const { errors, touched } = useFormikContext();
  if (
    !Object.keys(errors).length ||
    Object.values(touched).filter((x) => !!x).length === 0
  )
    return null;
  return (
    <div className="p-2 mb-4 rounded bg-red-700 text-white flex flex-col gap-2">
      {Object.entries(errors).map(([k, v]) => (
        <div key={k} className="hover:text-gray-300 flex gap-1">
          <b>{k}:</b>
          <div>{String(v)}</div>
        </div>
      ))}
    </div>
  );
}
