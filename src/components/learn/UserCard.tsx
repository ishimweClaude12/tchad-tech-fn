import { useELearningUser } from "src/hooks/useApi";

const UserCard = ({ userId }: { userId: string }) => {
  const { data: user, isLoading, error } = useELearningUser(userId);

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg overflow-hidden">
        <div className="flex items-center gap-4 p-4">
          {/* Avatar Skeleton */}
          <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse flex-0" />

          {/* Content Skeleton */}
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-2/5 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/5 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="w-full bg-white rounded-lg overflow-hidden border border-red-200">
        <div className="flex items-center gap-4 p-4">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center flex-0">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">
              Error Loading User
            </h3>
            <p className="text-xs text-gray-600">Unable to load user profile</p>
          </div>
        </div>
      </div>
    );
  }

  const { clerkProfile } = user;
  const fullName =
    `${clerkProfile.firstName} ${clerkProfile.lastName}`.trim() ||
    "Anonymous User";
  const email =
    clerkProfile.emailAddresses[0]?.emailAddress || "No email provided";

  return (
    <div className="w-full bg-white rounded-lg overflow-hidden transition-shadow duration-200">
      <div className="flex items-center gap-4 p-4">
        {/* Avatar */}
        <img
          src={
            clerkProfile.imageUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              fullName
            )}&size=64&background=random`
          }
          alt={fullName}
          className="w-16 h-16 rounded-full object-cover flex-0 border-2 border-gray-200"
        />

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate flex items-center gap-1.5">
            {fullName}
            {clerkProfile.emailAddresses[0]?.verification?.status ===
              "verified" && (
              <svg
                className="w-4 h-4 text-blue-500 flex-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </h3>
          <p className="text-sm text-gray-600 truncate">{email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
