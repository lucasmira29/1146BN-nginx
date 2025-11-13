import { formatDateTime } from '../utils/dateUtils.js';

export function formatDateTimeFields(fields) {
  return (req, res, next) => {
    const originalJson = res.json;

    res.json = function (data) {
      const formatFields = obj => {
        fields.forEach(field => {
          if (obj[field] instanceof Date) {
            obj[field] = formatDateTime(obj[field]);
          }
        });
        return obj;
      };

      if (Array.isArray(data)) {
        data = data.map(item => formatFields(item));
      } else if (typeof data === 'object' && data !== null) {
        data = formatFields(data);
      }

      return originalJson.call(this, data);
    };

    next();
  };
}
