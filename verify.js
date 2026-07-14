import fs from 'fs';
import path from 'path';
import process from 'process';

// Get the absolute path to your component
const targetPath = path.join(process.cwd(), 'src', 'components', 'SpinScreen.jsx');

if (fs.existsSync(targetPath)) {
  console.log("✅ File FOUND at:", targetPath);
  const content = fs.readFileSync(targetPath, 'utf8');
  console.log("-----------------------------------------");
  console.log("Check 1: Does it contain 'v7-FIXED-LAYOUT'?", content.includes('v7-FIXED-LAYOUT'));
  console.log("Check 2: Does it contain 'mt-12'?", content.includes('mt-12'));
  console.log("-----------------------------------------");
} else {
  console.error("❌ File NOT FOUND at:", targetPath);
  console.log("Looking for:", targetPath);
}