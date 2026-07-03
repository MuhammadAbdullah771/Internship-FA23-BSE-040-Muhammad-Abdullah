export function toUserDTO(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    name: user.fullName,
    role: user.role,
    avatar: user.avatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
