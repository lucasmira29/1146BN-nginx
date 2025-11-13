import { parseDateTimeToDate } from '../utils/dateUtils.js';

export function parseDateTimeFields(fields) {
  return (req, res, next) => {
    fields.forEach(field => {
      if (req.body[field]) {
        req.body[field] = parseDateTimeToDate(req.body[field]);
      }
    });
    next();
  };
}
