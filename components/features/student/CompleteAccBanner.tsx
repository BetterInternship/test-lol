import { useProfile } from "@/lib/api/student.api";
import { getMissingProfileFields } from "@/lib/utils/user-utils";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CompleteAccBanner() {
  const profile = useProfile();
  const router = useRouter();
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);

  useEffect(() => {
    if (profile.data) {
      const { missing } = getMissingProfileFields(profile.data);
      setShowCompleteProfile(missing.length > 0);
    }
  }, [profile.data]);

  if (!showCompleteProfile) return null;

  return (
    <div
      className="w-full bg-blue-50 border border-blue-200 py-3 flex justify-center items-center"
      role="alert"
    >
      <button
        className="text-base text-blue-700 font-medium hover:underline focus:outline-none"
        onClick={() => router.push("/profile?edit=1")}
      >
        Finish your profile to unlock awesome opportunities!
      </button>
    </div>
  );
}