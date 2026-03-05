# fh_tha
This repository contains ideas for automation and automation for booking a medical procedure

I automated login with valid and invalid credentials for the existing users cause it starts the flow of booking for them. 

Had issues with POManager working in POM model, so I re-wrote the tests in rougher mode to work (if one runs them from terminal)

For example:
npx playwright test /Users/<username>/fh_tha/tests/Login/ExistingUserLogin.spec.js --ui --project=chromium
