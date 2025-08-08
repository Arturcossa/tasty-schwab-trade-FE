import { LoaderIcon } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoaderIcon className="animate-spin w-10 h-10" />
    </div>
  );
}
