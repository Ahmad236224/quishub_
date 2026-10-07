# Google Calendar OAuth Setup Guide

## Quick Fix for "Token has been expired or revoked" Error

When you see the error **"Token has been expired or revoked"**, the `GOOGLE_REFRESH_TOKEN` in your `.env.local` file is no longer valid and must be regenerated.

---

## Prerequisites

Ensure these environment variables are configured in `.env.local`:

```env
# Google OAuth Credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret

# This needs to be regenerated when revoked
GOOGLE_REFRESH_TOKEN=your_refresh_token

# Calendar ID (use "primary" for your main calendar)
GOOGLE_CALENDAR_ID=primary
```

---

## Step-by-Step Re-Authentication Process

### Step 1: Verify Google Cloud Console Setup

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services > Credentials**
4. Ensure your OAuth 2.0 Client ID exists and is not deleted
5. Note down the **Client ID** and **Client Secret**

### Step 2: Enable Required APIs

1. Go to **APIs & Services > Enabled APIs & Services**
2. Ensure these APIs are enabled:
   - **Google Calendar API**
   - **Google Meet API** (if using Meet links)
3. If not enabled, click **+ Enable APIs and Services** and search for them

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services > OAuth consent screen**
2. If using a Google Workspace: Select **Internal**
3. If using a personal account: Select **External**
4. Fill in required fields:
   - App name: `Quishub`
   - User support email: your email
   - Developer contact email: your email
5. Click **Save and Continue**

### Step 4: Generate New Refresh Token

#### Option A: Using OAuth2 Playground (Recommended)

1. Visit [Google OAuth2 Playground](https://developers.google.com/oauthplayground)
2. Click the **Settings** gear icon (top right)
3. Check **"Use your own OAuth credentials"**
4. Enter your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
5. Click **Close**
6. In the left sidebar, find and select these scopes:
   - `https://www.googleapis.com/auth/calendar` (Calendar API)
   - `https://www.googleapis.com/auth/calendar.events` (Calendar Events)
7. Click **Authorize APIs**
8. Sign in with the Google account that owns the calendar
9. Click **Allow** on the consent screen
10. Click **Exchange authorization code for tokens**
11. Copy the **Refresh token** value

#### Option B: Manual OAuth Flow (Advanced)

If OAuth2 Playground doesn't work, you can generate tokens manually:

1. Construct the authorization URL:
   ```
   https://accounts.google.com/o/oauth2/v2/auth?
     client_id=YOUR_CLIENT_ID&
     redirect_uri=http://localhost&
     scope=https://www.googleapis.com/auth/calendar&
     access_type=offline&
     response_type=code&
     prompt=consent
   ```

2. Open in browser, authorize, and copy the `code` from the redirect URL

3. Exchange code for tokens:
   ```bash
   curl -X POST https://oauth2.googleapis.com/token \
     -d "client_id=YOUR_CLIENT_ID" \
     -d "client_secret=YOUR_CLIENT_SECRET" \
     -d "code=YOUR_CODE" \
     -d "grant_type=authorization_code" \
     -d "redirect_uri=http://localhost"
   ```

4. Extract `refresh_token` from the JSON response

### Step 5: Update Environment Variables

1. Open `.env.local` in your project root
2. Update the `GOOGLE_REFRESH_TOKEN` value:
   ```env
   GOOGLE_REFRESH_TOKEN=your_new_refresh_token_here
   ```
3. Save the file

### Step 6: Restart Next.js

1. Stop the running dev server (Ctrl+C)
2. Restart:
   ```bash
   npm run dev
   ```
3. The new token will be loaded automatically

---

## Troubleshooting

### Error: "invalid_grant"
- The refresh token has been revoked
- User may have revoked access at [Google Account Permissions](https://myaccount.google.com/permissions)
- Generate a new token using the steps above

### Error: "unauthorized_client"
- Client ID or Client Secret is incorrect
- Verify credentials in Google Cloud Console match `.env.local`

### Error: "Calendar API not enabled"
- Go to Google Cloud Console > APIs & Services > Enabled APIs
- Ensure "Google Calendar API" is in the list
- If not, click "Enable APIs and Services" and search for it

### Error: "Token has been expired or revoked" keeps appearing
- Tokens can be revoked if:
  - User changed password
  - User manually revoked access
  - Google detected suspicious activity
  - The OAuth consent screen was reset
- Solution: Complete full re-authentication steps above

---

## Security Best Practices

1. **Never commit tokens to Git**
   - `.env.local` is already in `.gitignore`
   - Always keep tokens out of version control

2. **Rotate tokens periodically**
   - Consider regenerating refresh tokens every 6-12 months

3. **Use restricted scopes**
   - Only request the minimum required permissions
   - Current scope: `https://www.googleapis.com/auth/calendar` (full calendar access)

4. **Monitor API usage**
   - Check Google Cloud Console > APIs & Services > Dashboard for usage metrics

---

## Quick Checklist

- [ ] GOOGLE_CLIENT_ID set in Google Cloud Console
- [ ] GOOGLE_CLIENT_SECRET generated and saved
- [ ] Google Calendar API enabled
- [ ] OAuth consent screen configured
- [ ] New refresh token generated via OAuth2 Playground
- [ ] .env.local updated with new GOOGLE_REFRESH_TOKEN
- [ ] Next.js dev server restarted
- [ ] Test booking on Contact page

---

## Need Help?

If issues persist:
1. Check server console logs for detailed error messages
2. Verify all 4 environment variables are loaded: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID`
3. Ensure the calendar owner email matches the account used for OAuth
