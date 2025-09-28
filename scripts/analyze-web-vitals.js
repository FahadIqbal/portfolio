/**
 * Core Web Vitals Analysis Script
 * 
 * This script helps analyze Core Web Vitals metrics for the portfolio website.
 * It provides recommendations for improving performance based on Lighthouse metrics.
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = process.env.SITE_URL || 'http://localhost:5173'; // Default to local dev server
const REPORT_PATH = path.join(__dirname, '../lighthouse-report.json');

// Run Lighthouse audit
const runLighthouse = () => {
  return new Promise((resolve, reject) => {
    console.log(`Running Lighthouse audit for ${SITE_URL}...`);
    
    // Check if lighthouse is installed
    exec('npx lighthouse --version', (error) => {
      if (error) {
        console.log('Lighthouse not found. Installing...');
        exec('npm install -g lighthouse', (installError) => {
          if (installError) {
            reject(new Error('Failed to install Lighthouse. Please install it manually.'));
            return;
          }
          runLighthouseCommand(resolve, reject);
        });
      } else {
        runLighthouseCommand(resolve, reject);
      }
    });
  });
};

// Execute Lighthouse command
const runLighthouseCommand = (resolve, reject) => {
  const command = `npx lighthouse ${SITE_URL} --output=json --output-path=${REPORT_PATH} --only-categories=performance,accessibility,best-practices,seo`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Lighthouse execution error: ${error}`);
      reject(error);
      return;
    }
    
    if (stderr) {
      console.warn(`Lighthouse stderr: ${stderr}`);
    }
    
    console.log('Lighthouse audit completed successfully.');
    resolve();
  });
};

// Analyze the report and provide recommendations
const analyzeReport = () => {
  try {
    const reportData = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
    const { categories, audits } = reportData;
    
    console.log('\n===== CORE WEB VITALS ANALYSIS =====');
    
    // Overall scores
    console.log('\nOverall Scores:');
    Object.entries(categories).forEach(([key, category]) => {
      console.log(`${category.title}: ${Math.round(category.score * 100)}/100`);
    });
    
    // Core Web Vitals specific metrics
    console.log('\nCore Web Vitals Metrics:');
    const webVitalsMetrics = [
      'first-contentful-paint',
      'largest-contentful-paint',
      'cumulative-layout-shift',
      'total-blocking-time',
      'speed-index',
      'interactive'
    ];
    
    webVitalsMetrics.forEach(metric => {
      if (audits[metric]) {
        const { title, displayValue, score, description } = audits[metric];
        const scoreValue = score * 100;
        const status = scoreValue >= 90 ? '✅ GOOD' : scoreValue >= 50 ? '⚠️ NEEDS IMPROVEMENT' : '❌ POOR';
        
        console.log(`${title}: ${displayValue} (${status})`);
      }
    });
    
    // Top recommendations for improvement
    console.log('\nTop Recommendations for Improvement:');
    const opportunities = Object.values(audits)
      .filter(audit => audit.details && audit.details.type === 'opportunity' && audit.score < 1)
      .sort((a, b) => (a.score || 0) - (b.score || 0))
      .slice(0, 5);
    
    if (opportunities.length === 0) {
      console.log('No significant opportunities for improvement found!');
    } else {
      opportunities.forEach((opportunity, index) => {
        console.log(`${index + 1}. ${opportunity.title}`);
        console.log(`   - ${opportunity.description}`);
      });
    }
    
    console.log('\nFull report saved to:', REPORT_PATH);
    console.log('\nFor more details, you can import this JSON file into the Lighthouse Viewer:');
    console.log('https://googlechrome.github.io/lighthouse/viewer/');
    
  } catch (error) {
    console.error('Error analyzing report:', error);
  }
};

// Main execution
const main = async () => {
  try {
    await runLighthouse();
    analyzeReport();
  } catch (error) {
    console.error('Analysis failed:', error);
  }
};

main();