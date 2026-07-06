import * as studentsService from './students.service.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const dashboard = asyncHandler(async (req, res) => {
  const data = await studentsService.getStudentDashboard(req.user._id);
  res.json({ success: true, data });
});
