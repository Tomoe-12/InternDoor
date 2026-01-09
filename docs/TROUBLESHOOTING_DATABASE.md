# Database Connection Troubleshooting

## Error: `ENOTFOUND db.xxxxx.supabase.co`

This error means your system cannot resolve the Supabase database hostname. Here are the most common causes and solutions:

## 🔍 Quick Checks

### 1. Check if Supabase Project is Paused

**Free tier Supabase projects pause after 1 week of inactivity.**

**Solution:**
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Find your project
3. If it shows "Paused" or "Inactive", click "Restore" or "Resume"
4. Wait a few minutes for the database to come back online

### 2. Verify Database URL

Your `.env.local` should have the correct connection string.

**Get the correct connection string:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **Database**
4. Scroll to **Connection string**
5. Select **Connection pooling** mode (for better performance)
6. Copy the **URI** connection string

**Format should look like:**
```
postgresql://postgres.xxxxx:[PASSWORD]@aws-0-xx-xx-xx-xx.pooler.supabase.com:6543/postgres?pgbouncer=true
```

Or for direct connection:
```
postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

### 3. Check .env.local File

Make sure your `.env.local` has:

```env
SUPABASE_DB_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Important:**
- Replace `[YOUR-PASSWORD]` with your actual database password
- Replace `[PROJECT-REF]` with your project reference ID
- Use **Connection Pooler URL** for better performance (port 6543)
- Use **Direct Connection URL** if pooler doesn't work (port 5432)

### 4. Test Connection Manually

Test if you can resolve the hostname:

```bash
# Windows PowerShell
nslookup db.osyxdgyhvqomwhuzzplj.supabase.co

# Should return IP addresses
```

If this fails, the project might be paused or deleted.

## 🛠️ Step-by-Step Fix

### Step 1: Verify Supabase Project Status

1. Login to [Supabase Dashboard](https://supabase.com/dashboard)
2. Check if your project is active (not paused)
3. If paused, click "Restore" or "Resume Project"

### Step 2: Get Fresh Connection String

1. In Supabase Dashboard → Your Project
2. Settings → Database
3. Connection string section
4. **Recommended:** Use **Connection pooling** (Session mode)
5. Copy the URI

**Example (Connection Pooler - Recommended):**
```
postgresql://postgres.xxxxx:[PASSWORD]@aws-0-xx-xx-xx-xx.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Step 3: Update .env.local

Update your `.env.local` file:

```env
# Use Connection Pooler (Recommended for production)
SUPABASE_DB_URL=postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-xx-xx-xx-xx.pooler.supabase.com:6543/postgres?pgbouncer=true

# OR Use Direct Connection (If pooler doesn't work)
# SUPABASE_DB_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

### Step 4: Test Connection

```bash
# Test with Drizzle Studio
npm run db:studio

# Or test with a simple connection script
node -e "const { Pool } = require('pg'); const pool = new Pool({ connectionString: process.env.SUPABASE_DB_URL }); pool.query('SELECT NOW()', (err, res) => { if (err) console.error(err); else console.log('Connected!', res.rows); pool.end(); });"
```

## 🔧 Alternative: Use Local Database for Development

If Supabase continues to have issues, you can use a local PostgreSQL database:

### Option 1: Docker PostgreSQL

```bash
# Run PostgreSQL in Docker
docker run --name postgres-dev -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=mydb -p 5432:5432 -d postgres:15

# Update .env.local
SUPABASE_DB_URL=postgresql://postgres:postgres@localhost:5432/mydb
```

### Option 2: Local PostgreSQL Installation

1. Install PostgreSQL locally
2. Create a database
3. Update connection string to use `localhost`

## 📝 Common Issues

### Issue: "Project paused"

**Solution:** Resume the project in Supabase dashboard

### Issue: "Password incorrect"

**Solution:** 
1. Reset database password in Supabase Dashboard
2. Update `.env.local` with new password

### Issue: "SSL required"

**Solution:** Your `drizzle.config.ts` already handles SSL. Make sure you're using the correct connection string format.

### Issue: "Connection timeout"

**Solution:** 
1. Check if project is paused
2. Try using Connection Pooler URL (port 6543)
3. Check firewall settings
4. Verify network connectivity

## 🔐 Security Notes

- **Never commit** `.env.local` to git
- Use **Connection Pooler** in production (better performance)
- Use **Direct Connection** only if needed
- Rotate database passwords regularly

## 📚 Additional Resources

- [Supabase Connection Pooling Docs](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Drizzle Studio Documentation](https://local.drizzle.studio/)
- [Supabase Database Settings](https://supabase.com/dashboard/project/_/settings/database)
