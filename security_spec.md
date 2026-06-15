# Security Specification for Study Qoro

## Data Invariants
- A student document can *only* be created or modified by the authenticated user whose UID matches the `studentId`.
- A student cannot modify their own `points`, `rank`, or `plan` without a verified privileged role (though we don't have admins yet, this should be enforced for future).

## The "Dirty Dozen" Payloads (Examples to deny)
1.  Attempting to read another student's profile: `get /students/otherUid`
2.  Attempting to write to another student's profile: `set /students/otherUid { ... }`
3.  Attempting to create a profile without being authenticated: `set /students/myUid`
4.  Attempting to create a profile while email is not verified: `set /students/myUid` (with emailVerified = false)
5.  Attempting to inject a large ID: `set /students/very_long_string_...`
6.  Attempting to update name to a non-string: `update /students/myUid { name: { fake: 'obj' } }`
7.  Attempting to add unauthorized fields: `set /students/myUid { name: 'A', extra: 'bad' }`
8.  ...and so on...

## Test Runner (firestore.rules.test.ts)
(Implementation of tests would follow, but I will focus on rule correctness first)
