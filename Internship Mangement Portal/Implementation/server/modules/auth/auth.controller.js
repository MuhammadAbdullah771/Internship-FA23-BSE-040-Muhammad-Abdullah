import * as authService from './auth.service.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

function sendAuthResponse(res, payload, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data: {
      user: payload.user,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    },
  });
}

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerStudent(req.body);
  return sendAuthResponse(res, result, 201);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return sendAuthResponse(res, result);
});

export const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refreshSession(req.body.refreshToken);
  return sendAuthResponse(res, result);
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user._id);
  return res.status(200).json({ success: true, data: { user } });
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user._id, req.body);
  return res.status(200).json({ success: true, data: { user } });
});

export const syncClerkAvatar = asyncHandler(async (req, res) => {
  const user = await authService.syncClerkAvatarForUser(req.user._id);
  return res.status(200).json({ success: true, data: { user } });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.requestPasswordReset(req.body.email);
  return res.status(200).json({ success: true, data: result });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body);
  return res.status(200).json({ success: true, data: result });
});
