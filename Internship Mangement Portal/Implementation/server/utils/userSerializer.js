function mapPostingSnapshot(posting) {
  if (!posting || typeof posting !== 'object' || !posting.title) return null;

  return {
    id: posting._id?.toString() || null,
    title: posting.title,
    company: posting.company || '',
    duration: posting.duration || '',
    level: posting.level || '',
    spots: posting.spots ?? null,
    type: posting.type || '',
    image: posting.image || '',
    tags: posting.tags || [],
    trending: Boolean(posting.trending),
  };
}

export function toUserDTO(user) {
  const posting = user.portalAccess?.postingId;

  return {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    name: user.fullName,
    role: user.role,
    avatar: user.avatar,
    portalAccessStatus: user.portalAccess?.status || 'unsubmitted',
    portalAccess: user.portalAccess
      ? {
          status: user.portalAccess.status || 'unsubmitted',
          internshipTitle: user.portalAccess.internshipTitle || '',
          postingId: posting?._id?.toString?.() || user.portalAccess.postingId?.toString?.() || null,
          internship: mapPostingSnapshot(posting),
          fullName: user.portalAccess.fullName || '',
          fatherName: user.portalAccess.fatherName || '',
          institute: user.portalAccess.institute || '',
          cnic: user.portalAccess.cnic || '',
          contactNumber: user.portalAccess.contactNumber || '',
          cvPdf: user.portalAccess.cvPdf || '',
          paymentScreenshot: user.portalAccess.paymentScreenshot || '',
          notes: user.portalAccess.notes || '',
          submittedAt: user.portalAccess.submittedAt || null,
          reviewedAt: user.portalAccess.reviewedAt || null,
          rejectionReason: user.portalAccess.rejectionReason || '',
          enrollmentStatus: user.portalAccess.enrollmentStatus || 'none',
          enrollmentCompletedAt: user.portalAccess.enrollmentCompletedAt || null,
        }
      : { status: 'unsubmitted' },
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
