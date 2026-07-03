export function toPostingDTO(posting) {
  return {
    id: posting._id.toString(),
    title: posting.title,
    company: posting.company,
    duration: posting.duration,
    type: posting.type,
    spots: posting.spots,
    level: posting.level,
    image: posting.image,
    tags: posting.tags,
    trending: posting.trending,
    isActive: posting.isActive,
    createdAt: posting.createdAt,
  };
}

export function toApplicationDTO(application) {
  return {
    id: application._id.toString(),
    status: application.status,
    appliedAt: application.createdAt,
    posting: application.postingId ? toPostingDTO(application.postingId) : null,
  };
}
