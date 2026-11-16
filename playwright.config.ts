import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'tests',workers:1,use:{baseURL:'http://127.0.0.1:4173',browserName:'chromium',channel:'chrome',viewport:{width:360,height:780}},webServer:{command:'npx vite preview --host 127.0.0.1 --port 4173',port:4173,reuseExistingServer:!process.env.CI,timeout:30000}});
