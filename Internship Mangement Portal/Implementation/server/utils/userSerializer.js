export function toUserDTO(user) {
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
          postingId: user.portalAccess.postingId?.toString() || null,
          paymentScreenshot: user.portalAccess.paymentScreenshot || '',
          notes: user.portalAccess.notes || '',
          submittedAt: user.portalAccess.submittedAt || null,
          reviewedAt: user.portalAccess.reviewedAt || null,
          rejectionReason: user.portalAccess.rejectionReason || '',
        }
      : { status: 'unsubmitted' },
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
