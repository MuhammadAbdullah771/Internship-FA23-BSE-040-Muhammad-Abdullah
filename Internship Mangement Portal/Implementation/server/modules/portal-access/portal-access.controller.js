import * as portalAccessService from './portal-access.service.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const getMine = asyncHandler(async (req, res) => {
  const application = await portalAccessService.getMyPortalAccess(req.user._id);
  res.json({ success: true, data: { application } });
});

export const submit = asyncHandler(async (req, res) => {
  const application = await portalAccessService.submitPortalAccess(req.user._id, req.body);
  res.status(201).json({ success: true, data: { application } });
});

export const listPending = asyncHandler(async (req, res) => {
  const applications = await portalAccessService.listPendingApplications();
  res.json({ success: true, data: { applications } });
});

export const review = asyncHandler(async (req, res) => {
  const application = await portalAccessService.reviewPortalAccess(
    req.user._id,
    req.params.studentId,
    req.body,
  );
  res.json({ success: true, data: { application } });
});

export const listActiveEnrollments = asyncHandler(async (req, res) => {
  const applications = await portalAccessService.listActiveEnrollments();
  res.json({ success: true, data: { applications } });
});

export const completeEnrollment = asyncHandler(async (req, res) => {
  const application = await portalAccessService.completeEnrollment(
    req.user._id,
    req.params.studentId,
  );
  res.json({ success: true, data: { application } });
});
