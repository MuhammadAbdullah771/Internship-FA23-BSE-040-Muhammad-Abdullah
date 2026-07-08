const subscribers = new Set();

export function addSubscriber(res, meta) {
  const entry = { res, ...meta };
  subscribers.add(entry);
  res.on('close', () => subscribers.delete(entry));
  return entry;
}

export function broadcast(event, data, filter) {
  const payload = `event: ${event}\ndata: ${JSON.stringify({ ...data, at: Date.now() })}\n\n`;
  for (const sub of subscribers) {
    if (filter && !filter(sub)) continue;
    try {
      sub.res.write(payload);
    } catch {
      subscribers.delete(sub);
    }
  }
}

export function broadcastToRole(role, event, data) {
  broadcast(event, data, (sub) => sub.role === role);
}

export function broadcastToUser(userId, event, data) {
  broadcast(event, data, (sub) => sub.userId === userId);
}
