function buildInitials(firstName, lastName) {
  const first = firstName?.[0] ?? '';
  const last = lastName?.[0] ?? '';
  return `${first}${last}`.toUpperCase();
}

export function toInternDTO(intern) {
  return {
    id: intern._id.toString(),
    name: intern.fullName,
    firstName: intern.firstName,
    lastName: intern.lastName,
    email: intern.email,
    role: intern.track,
    track: intern.track,
    status: intern.status,
    department: intern.department,
    intake: intern.intake,
    avatar: intern.avatar || null,
    initials: intern.avatar ? undefined : buildInitials(intern.firstName, intern.lastName),
    userId: intern.userId?.toString() ?? null,
    createdAt: intern.createdAt,
    updatedAt: intern.updatedAt,
  };
}
