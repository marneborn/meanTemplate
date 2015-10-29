
==== Handling provider signup ====
When signinup through a provider, there are several cases that need to be handled.
Get the email and a unique lookup from the provider.
Use both to see if the user already exists.
And then take the appropriate action described by this table
hasprovider   = There is an entry in the providers list where source=$provider
matchprovider = There is an entry in the providers list where source=$provider&&lookup!=$id
hasemail      = There is an email in the returned user
matchemail    = The email in the returned user matches the email from the provider.

// FIXME - For now, only do the simple part of the corner cases.
//         Later need to add views for the special case handling
1. !hasprovider !matchprovider !hasemail !matchemail - create new user
2. !hasprovider !matchprovider  hasemail  matchemail - add provider
3.  hasprovider !matchprovider  hasemail  matchemail - fail/throw error - FIXME - maybe later add provider again, allowing multiple accounts from one provider link to one user
4.  hasprovider  matchprovider  hasemail !matchemail - return user (no save) (handle email diff or assume it's intentional?)
5.  hasprovider  matchprovider  hasemail  matchemail - return user (no save)

These cases are impossible (or should be...)
If there is no provider, it can't match
 !hasprovider  matchprovider !hasemail !matchemail - impossible
 !hasprovider  matchprovider !hasemail  matchemail - impossible
 !hasprovider  matchprovider  hasemail !matchemail - impossible
 !hasprovider  matchprovider  hasemail  matchemail - impossible
If there is no email, it can't match
  hasprovider !matchprovider !hasemail  matchemail - impossible
  hasprovider  matchprovider !hasemail  matchemail - impossible
 !hasprovider !matchprovider !hasemail  matchemail - impossible
If there is an existing provider, there must be an email (emails are required).
  hasprovider  matchprovider !hasemail !matchemail - impossible
  hasprovider !matchprovider !hasemail !matchemail - impossible
If there is no matched provider and no matched email, no user could have been found
 !hasprovider !matchprovider  hasemail !matchemail - impossible
  hasprovider !matchprovider  hasemail !matchemail - impossible

