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
  return [];
};

export const clearAllLogs_DO_NOT_USE_EXCEPT_SEEDING = () => {};
