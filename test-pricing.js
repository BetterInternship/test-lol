// Test script to verify our pricing normalization
import { mockApiService } from './lib/mock/api.js';

async function testPricing() {
  console.log('Testing pricing normalization...\n');
  
  const result = await mockApiService.getJobs({ limit: 10 });
  
  result.jobs.forEach((job, index) => {
    console.log(`Job ${index + 1}: ${job.title}`);
    console.log(`  Original location: "${job.location}"`);
    console.log(`  Processed salary: "${job.salary}"`);
    console.log(`  Work type: "${job.workType}"`);
    console.log(`  Allowance: "${job.allowance}"`);
    console.log(`  Project type: "${job.projectType}"`);
    console.log(`  Duration: "${job.duration}"`);
    console.log('');
  });
}

testPricing();
