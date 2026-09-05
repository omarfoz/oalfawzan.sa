import { createRequire } from 'node:module';
import path from 'node:path';

// Install optional browser-test dependencies outside the static site if desired.
const require = createRequire(path.resolve(process.env.AUDIT_DEPS || '.', 'package.json'));
export const { chromium } = require('playwright');
export const axePath = require.resolve('axe-core/axe.min.js');
export const launchOptions = {
  headless: true,
  ...(process.env.AUDIT_BROWSER ? { executablePath: process.env.AUDIT_BROWSER } : {}),
};
