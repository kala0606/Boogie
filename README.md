# Katte

**The studio's katte** — the class app for *Creative Coding & Generative Art*
(SMI26) at Srishti Manipal Institute. Announcements, studio chat, show & tell,
and direct messages between students and faculty.

> *katte* (n., Kannada) — the raised platform under a tree where a
> neighbourhood gathers.

A single self-contained `index.html` (vanilla JS, no build step) on Firebase
(Auth + Firestore). Installable PWA. Everyone in the class gets a generative
kolam mark, minted daily from their identity.

## Who can sign in — and who is who

Roles come from the **email domain**, enforced both in the app and in
`firestore.rules`:

| address | role |
|---|---|
| `…@learner.manipal.edu` | **student** |
| `…@manipal.edu` (no `learner.`) | **faculty** — can post Announcements |
| `ujjwal.agarwal@manipal.edu` | faculty + **admin** |

There is no invite list. Sign-in is email + password, where the password is
your **first name, lowercase** (padded client-side to satisfy Firebase's
6-character minimum). First sign-in creates the account.

The class roster lives in `index.html` (`ROSTER`). It only **pre-fills names**
and shows on the Class tab who hasn't joined yet — it is *not* a gate, so a
typo in the roster can never lock a student out. Edit it when the class list
changes.

## Channels

- **Announcements** — faculty post, everyone reads (rule-enforced).
- **Studio** — open class discussion.
- **Show & Tell** — drop links to sketches (p5 editor, GitHub…). Links are clickable.
- **Direct messages** — private between any two people in the class.

## Firestore

- `profiles/{uid}` — `email, name, role, isAdmin, joinedAt`
- `messages/{id}` — the three channels: `channelId, authorId, authorName, body, createdAt`
- `dms/{id}` — `participants:[a,b]` + the same message fields

Security rules are in `firestore.rules`. Deploy them with:

```sh
firebase deploy --only firestore:rules
```

## Run locally

```sh
python3 -m http.server 4173
```

`sw.js` is cache-first for the app shell — **bump `CACHE` whenever
`index.html` changes**, or installed apps keep serving the old version.

## Housekeeping

- Reset a password / remove someone: Firebase console (Authentication + Firestore).
- Client-side profile deletes are blocked by the rules; use the CLI:
  `firebase firestore:delete "profiles/<uid>" --force`
- `bot/` is the retired *Gubbi* admin-circulars bot from the earlier faculty
  pilot — not wired into the app any more.
