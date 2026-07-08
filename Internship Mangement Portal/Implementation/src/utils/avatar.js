export function getAvatarUrl(user, clerkImageUrl) {
  if (clerkImageUrl) return clerkImageUrl;
  if (user?.avatar) return user.avatar;
  const name = user?.name || user?.firstName || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=fff`;
}
