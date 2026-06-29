async function runTest() {
  console.log('--- Starting API E2E Verification Test ---');
  
  const baseUrl = 'http://localhost:5000/api';
  const email = `test_intern_${Date.now()}@ledgerflow.io`;
  const password = 'password123';
  
  let token = '';

  try {
    // 1. Test POST /api/auth/register
    console.log('1. Testing User Registration...');
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        firstName: 'Sarayu',
        lastName: 'Voona',
        companyName: 'Sarayu Labs'
      })
    });
    
    if (!regRes.ok) {
      throw new Error(`Registration failed: ${regRes.statusText} (${await regRes.text()})`);
    }
    console.log('✅ Registration Successful!');
    
    // 2. Test POST /api/auth/login
    console.log('2. Testing User Login...');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!loginRes.ok) {
      throw new Error(`Login failed: ${loginRes.statusText} (${await loginRes.text()})`);
    }
    
    const loginData = await loginRes.json();
    token = loginData.token;
    console.log('✅ Login Successful! Token acquired.');
    
    const headers = { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    };

    // 3. Test GET /api/subscriptions
    console.log('3. Fetching Subscriptions...');
    const subsRes = await fetch(`${baseUrl}/subscriptions`, { headers });
    if (!subsRes.ok) {
      throw new Error(`Fetching subscriptions failed: ${subsRes.statusText}`);
    }
    const subsData = await subsRes.json();
    console.log(`✅ Subscriptions fetched successfully! Count: ${subsData.length}`);
    
    // 4. Test POST /api/subscriptions/simulate-billing-cycle
    console.log('4. Simulating SaaS Billing Cycle...');
    const simRes = await fetch(`${baseUrl}/subscriptions/simulate-billing-cycle`, {
      method: 'POST',
      headers
    });
    if (!simRes.ok) {
      throw new Error(`Simulation failed: ${simRes.statusText} (${await simRes.text()})`);
    }
    const simData = await simRes.json();
    console.log('✅ Billing Cycle Simulated!');
    console.log(`   - Invoice generated: ${simData.invoice.invoiceNumber}`);
    console.log(`   - Invoice amount: $${simData.invoice.amount}`);
    console.log(`   - Payment status: ${simData.payment.status}`);
    
    // 5. Test GET /api/invoices/stats
    console.log('5. Fetching Dashboard Stats...');
    const statsRes = await fetch(`${baseUrl}/invoices/stats`, { headers });
    if (!statsRes.ok) {
      throw new Error(`Fetching stats failed: ${statsRes.statusText}`);
    }
    const statsData = await statsRes.json();
    console.log('✅ Dashboard stats fetched successfully!');
    console.log('   - Stats:', JSON.stringify(statsData, null, 2));

    console.log('\n🌟 ALL BACKEND API ENDPOINTS VERIFIED AND WORKING FLAWLESSLY! 🌟');
  } catch (error) {
    console.error('❌ Test Failed with Error:', error.message);
    process.exit(1);
  }
}

runTest();
