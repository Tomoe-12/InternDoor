/**
 * API Testing Script
 * Run with: npx tsx scripts/test-api.ts
 * 
 * This script tests all API endpoints to ensure they work correctly
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

interface TestResult {
  name: string;
  method: string;
  endpoint: string;
  status: number;
  success: boolean;
  error?: string;
}

const results: TestResult[] = [];

async function testEndpoint(
  name: string,
  method: string,
  endpoint: string,
  body?: any,
  headers?: Record<string, string>
): Promise<TestResult> {
  try {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    const result: TestResult = {
      name,
      method,
      endpoint,
      status: response.status,
      success: response.ok,
      error: response.ok ? undefined : data.error || "Unknown error",
    };

    console.log(`✓ ${name}: ${response.status} ${response.statusText}`);
    if (!response.ok) {
      console.log(`  Error: ${result.error}`);
    }

    return result;
  } catch (error) {
    const result: TestResult = {
      name,
      method,
      endpoint,
      status: 0,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    console.log(`✗ ${name}: FAILED`);
    console.log(`  Error: ${result.error}`);
    return result;
  }
}

async function runTests() {
  console.log("🧪 Testing API Endpoints...\n");
  console.log(`Base URL: ${BASE_URL}\n`);

  // Test: Create Student
  console.log("📝 Testing Student Endpoints");
  const createStudentResult = await testEndpoint(
    "Create Student",
    "POST",
    "/api/students",
    {
      email: `test-${Date.now()}@example.com`,
      password: "TestPassword123!",
      passwordConfirmation: "TestPassword123!",
      firstName: "Test",
      lastName: "User",
    }
  );
  results.push(createStudentResult);

  let studentId: number | null = null;
  if (createStudentResult.success) {
    // Get students
    const getStudentsResult = await testEndpoint("Get Students", "GET", "/api/students?page=1&size=10");
    results.push(getStudentsResult);
  }

  // Test: Create Company
  console.log("\n🏢 Testing Company Endpoints");
  const createCompanyResult = await testEndpoint(
    "Create Company",
    "POST",
    "/api/companies",
    {
      companyName: `Test Company ${Date.now()}`,
      companyEmail: `company-${Date.now()}@example.com`,
      password: "CompanyPassword123!",
    }
  );
  results.push(createCompanyResult);

  if (createCompanyResult.success) {
    const getCompaniesResult = await testEndpoint("Get Companies", "GET", "/api/companies?page=1&size=10");
    results.push(getCompaniesResult);
  }

  // Test: Login (if we have a user)
  console.log("\n🔐 Testing Auth Endpoints");
  const loginResult = await testEndpoint(
    "Login",
    "POST",
    "/api/auth/login",
    {
      email: "test@example.com", // Update with a real test user
      password: "TestPassword123!",
    }
  );
  results.push(loginResult);

  let authToken: string | null = null;
  if (loginResult.success) {
    const token = (await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        password: "TestPassword123!",
      }),
    }).then((r) => r.json())) as any;
    authToken = token?.token || null;

    if (authToken) {
      const meResult = await testEndpoint(
        "Get Current User",
        "GET",
        "/api/auth/me",
        undefined,
        { Authorization: `Bearer ${authToken}` }
      );
      results.push(meResult);
    }
  }

  // Test: Password Reset Request
  console.log("\n🔑 Testing Password Reset");
  const passwordResetResult = await testEndpoint(
    "Request Password Reset",
    "POST",
    "/api/password-reset",
    {
      email: "test@example.com",
    }
  );
  results.push(passwordResetResult);

  // Test: Verification Codes
  console.log("\n📧 Testing Verification");
  const verificationResult = await testEndpoint(
    "Request Verification Code",
    "POST",
    "/api/verification-codes",
    {
      email: "test@example.com",
      studentId: 1,
    }
  );
  results.push(verificationResult);

  // Print Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 Test Summary");
  console.log("=".repeat(50));

  const passed = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`Total Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log("\n❌ Failed Tests:");
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`  - ${r.name} (${r.method} ${r.endpoint}): ${r.error}`);
      });
  }

  console.log("\n✅ All tests completed!");
}

// Run tests
runTests().catch(console.error);
