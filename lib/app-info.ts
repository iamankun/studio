// Thông tin app lấy từ file .version, package.json, logo, tên công ty
import fs from 'fs'
import path from 'path'

// Đọc version từ file .version
export const appVersion = fs.existsSync(path.resolve(process.cwd(), '.version'))
    ? fs.readFileSync(path.resolve(process.cwd(), '.version'), 'utf-8').replace(/"/g, '').trim()
    : 'unknown';

// Đọc thông tin từ package.json
let appName = 'An Kun Studio';
let companyName = 'An Kun Studio Digital Music';
let appLogo = '/logo.svg';
try {
    const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf-8'));
    appName = pkg.name || appName;
    if (pkg.company) companyName = pkg.company;
    if (pkg.logo) appLogo = pkg.logo;
} catch { }

export const APP_INFO = {
    version: appVersion,
    name: appName,
    company: companyName,
    logo: appLogo,
};

export default APP_INFO;
