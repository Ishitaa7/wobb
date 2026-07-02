import { memo } from "react";

interface ProfileAvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
}

const sizeClasses = {
  sm: "h-12 w-12 ring-2",
  md: "h-16 w-16 ring-[3px]",
  lg: "h-24 w-24 sm:h-28 sm:w-28 ring-4",
} as const;

export const ProfileAvatar = memo(function ProfileAvatar({
  src,
  alt,
  size = "sm",
  priority = false,
}: ProfileAvatarProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={`${sizeClasses[size]} shrink-0 rounded-full object-cover ring-white shadow-sm`}
    />
  );
});
