/**
 * schedule-availability — serves jonyen.com/schedule/busy.json, the merged
 * busy times behind the availability grid on /schedule.
 */
import { createHandler } from './handler.js';

export default createHandler({ cache: caches.default });
