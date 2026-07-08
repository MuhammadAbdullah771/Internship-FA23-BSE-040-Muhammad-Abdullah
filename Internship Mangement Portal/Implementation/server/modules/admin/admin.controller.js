import { asyncHandler } from '../../middleware/asyncHandler.js';
import * as adminService from './admin.service.js';

export const dashboard = asyncHandler(async (_req, res) => {
  const data = await adminService.getDashboardStats();
  return res.status(200).json({ success: true, data });
});

export const students = asyncHandler(async (req, res) => {
  const data = await adminService.listClerkStudents({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: req.query.search,
    portalStatus: req.query.portalStatus,
    enrollmentStatus: req.query.enrollmentStatus,
  });
  return res.status(200).json({ success: true, data });
});

export const reports = asyncHandler(async (_req, res) => {
  const data = await adminService.getAdminReports();
  return res.status(200).json({ success: true, data });
});
