import dotenv from 'dotenv';
import { createClerkClient } from '@clerk/backend';

dotenv.config();

async function testClerk() {
  const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;

  console.log('Testing Clerk with:');
  console.log('Publishable Key:', publishableKey?.substring(0, 10) + '...');
  console.log('Secret Key:', secretKey?.substring(0, 10) + '...');

  if (!publishableKey || !secretKey) {
    console.error('❌ Missing keys!');
    return;
  }

  try {
    const clerk = createClerkClient({ secretKey, publishableKey });
    const userList = await clerk.users.getUserList();
    console.log('✅ Successfully connected to Clerk! Found', userList.data.length, 'users.');
  } catch (err: any) {
    console.error('❌ Failed to connect to Clerk:', err.message);
  }
}

testClerk();
