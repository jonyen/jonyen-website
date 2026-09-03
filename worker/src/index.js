/**
 * resume-links — serves the full resume (the variant that includes a phone
 * number) behind expiring, signed links.
 *
 * The PDFs are rendered during deploy and bundled into this Worker by
 * resume/bundle-worker.mjs, so they never enter the git repository. Links are
 * minted offline with `npm run resume:link`.
 */
import pdfs from './pdfs.generated.js';
import { createHandler } from './handler.js';

export default createHandler({ getPdf: (variant) => pdfs[variant] ?? null });
