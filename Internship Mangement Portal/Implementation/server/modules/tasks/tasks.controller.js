import * as tasksService from './tasks.service.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const list = asyncHandler(async (req, res) => {
  const board = await tasksService.listTasks(req.user);
  res.json({ success: true, data: { board } });
});

export const getById = asyncHandler(async (req, res) => {
  const task = await tasksService.getTaskById(req.params.id, req.user);
  res.json({ success: true, data: { task } });
});

export const create = asyncHandler(async (req, res) => {
  const task = await tasksService.createTask(req.body, req.user);
  res.status(201).json({ success: true, data: { task } });
});

export const update = asyncHandler(async (req, res) => {
  const task = await tasksService.updateTask(req.params.id, req.body, req.user);
  res.json({ success: true, data: { task } });
});

export const remove = asyncHandler(async (req, res) => {
  const result = await tasksService.deleteTask(req.params.id);
  res.json({ success: true, data: result });
});
