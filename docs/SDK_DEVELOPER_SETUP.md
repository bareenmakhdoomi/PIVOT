# PIVOT SDK developer setup

This guide covers a first local build and development-instance deployment. Allow about 30–60 minutes if you already have repository and instance access.

## Requirements and access

- Windows, Git, VS Code, and Node.js 20 or later (LTS recommended). npm is included with Node.js.
- Access to the PIVOT repository: <https://github.com/bareenmakhdoomi/PIVOT>
- A PIVOT developer/admin account on the development instance: <https://enablenowincdemo1.service-now.com>
- Use the application scope `x_enno_pivot`. **Do not create or build PIVOT records in Global.**
- Choose the authentication method permitted for your account and instance:
  - **Basic with MFA:** use your ServiceNow username and password. When prompted, enter a fresh six-digit code from your authenticator app. Each code can only be used once.
  - **OAuth:** choose this if your organization has configured OAuth access for the instance. Complete the browser-based OAuth sign-in when prompted.

Ask the PIVOT administrator for repository/instance access or the approved OAuth setup if you do not have it. Never put passwords, MFA codes, or OAuth secrets in the repository or command history.

## Clone and install

Open PowerShell (or the VS Code terminal) and run:

```powershell
git clone https://github.com/bareenmakhdoomi/PIVOT.git
Set-Location PIVOT
npm install
```

In VS Code, open the cloned `PIVOT` folder. Confirm the application scope in `now.config.json` is `x_enno_pivot`; do not change it to Global.

## Add SDK authentication

Add credentials interactively for the development instance. Select the auth type your administrator approved:

```powershell
npx now-sdk auth --add https://enablenowincdemo1.service-now.com --type basic
```

Or, for an OAuth-configured account:

```powershell
npx now-sdk auth --add https://enablenowincdemo1.service-now.com --type oauth
```

Follow the prompts to set an alias and authenticate. With Basic authentication, provide the MFA code when challenged. Make the new alias the default for this project:

```powershell
npx now-sdk auth --use <alias>
```

Replace `<alias>` with the alias you chose. Check saved aliases with:

```powershell
npx now-sdk auth --list
```

The credentials are stored locally by the SDK, not in the project source. Do not copy credential files into Git or share them.

## Build and first deployment

Run these commands from the repository root, in order:

```powershell
npm run build
npm run deploy
```

The build must complete successfully before deploying; fix any build errors first. `npm run deploy` installs the built app to the authenticated development instance. Accept any instance/app confirmation prompts only after verifying they refer to the PIVOT development app and instance.

After deployment, sign in to the development instance and open the PIVOT application in the `x_enno_pivot` scope. Confirm the PIVOT workspace loads and that the records or feature changed by your work behave as expected. Do not use production for this first-deploy check.

## Rules for instance changes

- Records owned by the SDK project are maintained in this repository and **must never be edited in Studio**. Make changes in the project source and deploy them with the SDK.
- If an authorized change is made to an SDK-owned record on the instance, pull it back into the project with `npm run transform` (`now-sdk transform`) **before the next deploy**. Review the resulting source changes and run `npm run build` before deploying, so the instance change is not overwritten by an older local definition.
- Keep all PIVOT work in the `x_enno_pivot` scope. Nothing for this project is built in Global.

## If setup or deployment fails

- For a network/connection timeout, verify VPN/network access and that the development instance opens in a browser, then retry.
- For an MFA failure, wait for a new six-digit code and enter it once; do not reuse a code from an earlier command.
- For an authentication/permission error, confirm the selected auth method, account access, and development-instance permissions with the PIVOT administrator.
- For build errors, resolve them before running `npm run deploy`; do not deploy stale build output.
