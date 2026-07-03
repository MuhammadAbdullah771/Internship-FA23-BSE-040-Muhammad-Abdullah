import * as internshipsService from './internships.service.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const list = asyncHandler(async (req, res) => {
  const postings = await internshipsService.listPostings(req.query);
  res.json({ success: true, data: { postings } });
});

export const getById = asyncHandler(async (req, res) => {
  const posting = await internshipsService.getPostingById(req.params.id);
  res.json({ success: true, data: { posting } });
});

export const apply = asyncHandler(async (req, res) => {
  const result = await internshipsService.applyToPosting(req.params.id, req.user._id);
  res.status(201).json({ success: true, data: result });
});

export const myApplications = asyncHandler(async (req, res) => {
  const applications = await internshipsService.getMyApplications(req.user._id);
  res.json({ success: true, data: { applications } });
});

export const create = asyncHandler(async (req, res) => {
  const posting = await internshipsService.createPosting(req.body);
  res.status(201).json({ success: true, data: { posting } });
});
