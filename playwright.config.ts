import {defineConfig} from '@playwright/test';

const origin='http://127.0.0.1:4173';
export default defineConfig({
  testDir:'./e2e',
  timeout:30_000,
  expect:{timeout:8_000},
  fullyParallel:true,
  forbidOnly:!!process.env.CI,
  retries:process.env.CI?1:0,
  workers:process.env.CI?2:undefined,
  reporter:process.env.CI?'list':'line',
  use:{
    baseURL:origin,
    browserName:'chromium',
    headless:true,
    trace:'retain-on-failure'
  },
  webServer:{
    command:'python3 -m http.server 4173 --bind 127.0.0.1 --directory .site',
    url:origin+'/reasoning-arcade/fr/',
    reuseExistingServer:!process.env.CI,
    timeout:30_000
  }
});
