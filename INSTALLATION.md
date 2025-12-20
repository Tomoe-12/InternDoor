# 📚 Complete Installation Guide

## Prerequisites Check

Before you start, make sure you have:

- ✅ Windows 10 or Windows 11
- ✅ At least 2GB free disk space
- ✅ Administrator access (for XAMPP installation)
- ✅ Internet connection

## Step 1: Download and Install XAMPP

### Download XAMPP
1. Go to: https://www.apachefriends.org/
2. Download the **Windows** version
3. Click the **XAMPP version 8.2 or higher** (PHP 8.2+)

### Install XAMPP
1. Run the installer (e.g., `xampp-windows-x64-8.2.12-VS16-installer.exe`)
2. Click "Next" through the installation wizard
3. Install location: Keep default (`C:\xampp`)
4. Choose components:
   - ✅ Apache
   - ✅ MySQL (optional, we use SQLite)
   - ✅ PHP
   - ✅ phpMyAdmin (optional)
5. Click "Finish"

### Test XAMPP
1. Open XAMPP Control Panel
2. Click "Start" next to **Apache**
3. Open browser: http://localhost
4. You should see the XAMPP dashboard ✅

## Step 2: Download and Install Composer

### Download Composer
1. Go to: https://getcomposer.org/download/
2. Click **"Composer-Setup.exe"** (Windows Installer)

### Install Composer
1. Run the installer
2. Click "Next" through the wizard
3. When asked for PHP location, select:
   - `C:\xampp\php\php.exe`
4. Click "Install"

### Test Composer
1. Open Command Prompt (`cmd`)
2. Type: `composer --version`
3. You should see: `Composer version 2.x.x...` ✅

## Step 3: Install Laravel Backend

### Navigate to Backend Folder
1. Open Command Prompt or PowerShell
2. Type:
   ```bash
   cd C:\Project\spring-boot-nextjs-starter-kit\backend
   ```

### Run Setup Script
1. Type:
   ```bash
   setup.bat
   ```
2. The script will:
   - ✅ Install all PHP dependencies
   - ✅ Generate configuration files
   - ✅ Create SQLite database
   - ✅ Run migrations

3. If setup completes successfully, you'll see:
   ```
   ========================================
   Setup Complete!
   ========================================
   ```

### If setup.bat doesn't work manually:

```bash
# Install dependencies
composer install

# Copy environment file
copy .env.example .env

# Generate app key
php artisan key:generate

# Generate JWT secret
php artisan jwt:secret --force

# Create database and run migrations
php artisan migrate --force
```

## Step 4: Start the Development Server

### Option A: Built-in PHP Server (Recommended)
```bash
php artisan serve
```

Output should show:
```
Laravel development server started on: http://localhost:8000
```

Visit: **http://localhost:8000** ✅

### Option B: Using XAMPP Apache (Alternative)

If you prefer to use XAMPP's Apache server:

1. Copy the `backend` folder to `C:\xampp\htdocs\laravel-api`
2. Open XAMPP Control Panel
3. Click "Start" next to Apache
4. In Command Prompt, navigate to the folder:
   ```bash
   cd C:\xampp\htdocs\laravel-api
   ```
5. Run migrations:
   ```bash
   php artisan migrate --force
   ```
6. Access at: **http://localhost/laravel-api** ✅

## Step 5: Test the API

### Using Postman (Recommended)

1. Download Postman from: https://www.postman.com/downloads/
2. Install and open Postman

### Test 1: Register User
```
Method: POST
URL: http://localhost:8000/api/users
Body (JSON):
{
  "email": "test@example.com",
  "password": "Password123",
  "full_name": "Test User"
}
```
Expected Response: `201 Created` ✅

### Test 2: Login
```
Method: POST
URL: http://localhost:8000/api/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "Password123"
}
```
Expected Response: 
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```
✅ Copy this token

### Test 3: Get Current User (Protected Route)
```
Method: GET
URL: http://localhost:8000/api/auth/me
Headers:
  Authorization: Bearer <paste_token_here>
```
Expected Response: User data ✅

## Step 6: Browse the Database

### Using TablePlus (Recommended)

1. Download from: https://tableplus.com/
2. Install and open TablePlus
3. Click "+" to create new connection
4. Select **SQLite**
5. File path: `C:\Project\spring-boot-nextjs-starter-kit\backend\database\database.sqlite`
6. Click "Connect"
7. Browse tables:
   - `users` - Registered users
   - `verification_codes` - Email verification
   - `password_reset_tokens` - Password reset tokens
   - `notifications` - System notifications
   - etc.

## Troubleshooting

### Error: "php is not recognized"
**Solution:**
- XAMPP might not be in your PATH
- Use full path: `C:\xampp\php\php.exe artisan serve`
- Or add `C:\xampp\php` to Windows PATH

### Error: "composer is not recognized"
**Solution:**
- Composer installation failed
- Reinstall from https://getcomposer.org/download/
- Make sure to select correct PHP path during installation

### Error: "Port 8000 is already in use"
**Solution:**
```bash
php artisan serve --port=8001
```
Then access at: `http://localhost:8001`

### Error: "SQLSTATE[HY000]: General error: unable to open database file"
**Solution:**
1. Delete `database/database.sqlite`
2. Run migrations again:
   ```bash
   php artisan migrate --force
   ```

### Error: "JWT secret not set"
**Solution:**
```bash
php artisan jwt:secret --force
```

### Error: "Class not found" or "Autoload errors"
**Solution:**
```bash
composer dump-autoload
php artisan cache:clear
```

## Database Setup Details

### SQLite Database Location
```
C:\Project\spring-boot-nextjs-starter-kit\backend\database\database.sqlite
```

### Tables Created
1. **users** - User accounts
2. **verification_codes** - Email verification
3. **password_reset_tokens** - Password resets
4. **user_connected_accounts** - OAuth accounts
5. **uploaded_files** - File uploads
6. **push_notification_subscriptions** - Push subscriptions
7. **notifications** - System notifications
8. **jobs** - Queue jobs
9. **cache** - Cache table
10. **sessions** - Session storage

## Environment Configuration

### Key .env Variables

```env
# Server
APP_NAME=Laravel
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database (SQLite)
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# JWT Authentication
JWT_SECRET=<auto-generated>
JWT_ALGORITHM=HS256
JWT_TTL=60

# CORS (Allow frontend)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost

# Email (for development, logs emails)
MAIL_MAILER=log

# Optional: AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET=
```

## Connecting Frontend

### For Next.js Frontend

1. Update `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

2. Make API calls:
```javascript
const response = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { token } = await response.json();
localStorage.setItem('jwt_token', token);
```

3. Use token on protected routes:
```javascript
const response = await fetch('http://localhost:8000/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## Daily Development Workflow

### Each Day You Work:

```bash
# 1. Navigate to backend folder
cd C:\Project\spring-boot-nextjs-starter-kit\backend

# 2. Start Laravel server
php artisan serve

# 3. In another terminal, start Next.js frontend
cd C:\Project\spring-boot-nextjs-starter-kit\frontend
npm run dev

# 4. Open browser:
# - Backend API: http://localhost:8000
# - Frontend: http://localhost:3000
```

### Stop Server:
- Press `Ctrl + C` in the terminal

## Useful Commands

```bash
# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# View routes
php artisan route:list

# View logs
tail -f storage/logs/laravel.log

# Database commands
php artisan migrate          # Run migrations
php artisan migrate:reset    # Reset database
php artisan tinker           # Interactive shell

# Create new controller
php artisan make:controller YourControllerName

# Create new model
php artisan make:model YourModelName -m
```

## Next Steps

1. ✅ Backend is running at http://localhost:8000/api
2. ⏭️ Start your Next.js frontend
3. ⏭️ Connect frontend to backend API
4. ⏭️ Test JWT authentication flow
5. ⏭️ Implement remaining features

## Support Resources

- **Laravel Docs**: https://laravel.com/docs
- **JWT Documentation**: https://jwt-auth.readthedocs.io/
- **Postman Learning Center**: https://learning.postman.com/
- **SQLite Docs**: https://www.sqlite.org/docs.html

## Security Reminders

### For Development
✅ OK to use default secrets  
✅ SQLite is fine  
✅ Debug mode ON is OK  

### Before Production
❌ Never commit `.env` file  
❌ Never use default secrets  
❌ Set `APP_DEBUG=false`  
❌ Use secure database  
❌ Enable HTTPS  
❌ Restrict CORS origins  

---

**You're all set! Happy coding! 🚀**

For questions, refer to SETUP.md and README.md in the backend folder.
