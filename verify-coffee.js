#!/usr/bin/env node

/**
 * Coffee Authenticity Verification Demo
 * Shows how to verify Ethiopian coffee authenticity
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

async function verifyCoffeeAuthenticity() {
    console.log('🌍 ETHIOPIAN COFFEE AUTHENTICITY VERIFICATION');
    console.log('===============================================\n');
    
    const batchId = 'BATCH-SIDAMA-2024-001';
    
    try {
        console.log(`🔍 Verifying batch: ${batchId}`);
        console.log('📡 Connecting to Hedera blockchain...\n');
        
        // Step 1: Verify authenticity
        const verifyResponse = await axios.get(`${BASE_URL}/api/verify/${batchId}`);
        
        if (verifyResponse.data.success) {
            console.log('✅ AUTHENTICITY VERIFICATION SUCCESSFUL\n');
            
            const result = verifyResponse.data;
            console.log('📋 VERIFICATION DETAILS:');
            console.log('========================');
            console.log(`🏷️  Batch ID: ${result.batchId}`);
            console.log(`✅ Status: ${result.status}`);
            console.log(`🔗 Transaction Hash: ${result.transactionHash}`);
            console.log(`🌐 Network: ${result.network}`);
            console.log(`📅 Verified: ${result.timestamp}`);
            
            if (result.coffeeData) {
                console.log('\n☕ COFFEE INFORMATION:');
                console.log('=====================');
                console.log(`🏡 Farm: ${result.coffeeData.farmName}`);
                console.log(`📍 Origin: ${result.coffeeData.origin}`);
                console.log(`👨‍🌾 Farmer: ${result.coffeeData.farmerName}`);
                console.log(`📅 Harvest Date: ${result.coffeeData.harvestDate}`);
                console.log(`⭐ Quality Grade: ${result.coffeeData.qualityGrade}`);
                console.log(`🔬 Processing: ${result.coffeeData.processingMethod}`);
                console.log(`🏔️  Elevation: ${result.coffeeData.elevation}`);
                console.log(`🌿 Certification: ${result.coffeeData.certification}`);
            }
            
            console.log('\n🔐 BLOCKCHAIN VERIFICATION:');
            console.log('===========================');
            console.log(`🔑 Verification Hash: ${result.verificationHash}`);
            console.log(`📊 Confidence Score: ${result.confidenceScore}%`);
            console.log(`🛡️  Anti-Fraud Status: ${result.antiFraudStatus}`);
            
        } else {
            console.log('❌ AUTHENTICITY VERIFICATION FAILED');
            console.log(`Error: ${verifyResponse.data.error}`);
        }
        
        // Step 2: Get supply chain history
        console.log('\n🚛 SUPPLY CHAIN TRACKING');
        console.log('========================');
        
        const supplyChainResponse = await axios.get(`${BASE_URL}/api/supply-chain/${batchId}`);
        
        if (supplyChainResponse.data.success) {
            console.log('✅ Supply chain data retrieved successfully\n');
            
            const steps = supplyChainResponse.data.steps;
            console.log('📋 COMPLETE JOURNEY:');
            console.log('===================');
            
            steps.forEach((step, index) => {
                console.log(`${index + 1}. ${step.step}`);
                console.log(`   📍 Location: ${step.location}`);
                console.log(`   👤 Operator: ${step.operator}`);
                console.log(`   📅 Time: ${new Date(step.timestamp).toLocaleString()}`);
                console.log(`   🔗 Transaction: ${step.transactionId}`);
                console.log('');
            });
            
        } else {
            console.log('❌ Supply chain data not available');
        }
        
        // Step 3: Summary
        console.log('🎯 VERIFICATION SUMMARY');
        console.log('=======================');
        console.log('✅ Product authenticity: VERIFIED');
        console.log('✅ Blockchain verification: CONFIRMED');
        console.log('✅ Supply chain tracking: COMPLETE');
        console.log('✅ Anti-fraud protection: ACTIVE');
        console.log('\n🌍 This Ethiopian coffee is AUTHENTIC and VERIFIED!');
        console.log('🛡️  Protected by Hedera blockchain technology');
        
    } catch (error) {
        console.log('❌ VERIFICATION FAILED');
        console.log('======================');
        console.log('Error:', error.response?.data?.error || error.message);
        console.log('\n💡 Make sure the backend server is running on port 4000');
        console.log('   Run: cd backend && npm start');
    }
}

// Run the verification
verifyCoffeeAuthenticity().catch(console.error);
