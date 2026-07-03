import * as internsService from './interns.service.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const list = asyncHandler(async (req, res) => {
  const result = await internsService.listInterns(req.query);
  res.json({ success: true, data: result });
});

export const stats = asyncHandler(async (req, res) => {
  const result = await internsService.getInternStats();
  res.json({ success: true, data: result });
});

export const filters = asyncHandler(async (req, res) => {
  const result = await internsService.getFilterOptions();
  res.json({ success: true, data: result });
});

export const getById = asyncHandler(async (req, res) => {
  const intern = await internsService.getInternById(req.params.id);
  res.json({ success: true, data: { intern } });
});

export const create = asyncHandler(async (req, res) => {
  const intern = await internsService.createIntern(req.body);
  res.status(201).json({ success: true, data: { intern } });
});

export const update = asyncHandler(async (req, res) => {
  const intern = await internsService.updateIntern(req.params.id, req.body);
  res.json({ success: true, data: { intern } });
});

export const remove = asyncHandler(async (req, res) => {
  const result = await internsService.deleteIntern(req.params.id);
  res.json({ success: true, data: result });
});
