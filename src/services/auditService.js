export const logEvent = async (userId, role, actionType, targetEntity, resultStatus, additionalData = {}) => {
  try {
    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userId || 'anonymous',
        role: role || 'guest',
        actionType,
        targetEntity,
        resultStatus,
        additionalData
      })
    });
  } catch (error) {
    console.error('Failed to log event', error);
  }
};

export const getLogs = async () => {
  const token = localStorage.getItem('healthai_token'); // Can't easily import getToken here without circular deps sometimes, or just import it
  const response = await fetch('/api/logs', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch logs');
  return await response.json();
};

export const clearAllLogs_DO_NOT_USE_EXCEPT_SEEDING = () => {};
