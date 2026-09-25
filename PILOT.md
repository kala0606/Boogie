# Boogie — welcome note for the class

*Paste this into the class group. The link is https://kala0606.github.io/Boogie/*

---

**Boogie — our studio's app 🟥🟨🟦**

One place for everything about the studio: announcements, questions, show &
tell, and a direct line to me. Named after *Broadway Boogie Woogie* — watch
the logo.

**Set it up — on your phone**
1. Open **https://kala0606.github.io/Boogie/** in your phone's browser (iPhone: use **Safari**).
2. Tap **Get the app** — it walks you through putting Boogie on your home
   screen so it behaves like a real app:
   - **iPhone (Safari):** Share → **Add to Home Screen**
   - **Android (Chrome):** the install prompt appears; confirm
3. Open it and sign in:
   - Your **@learner.manipal.edu** email
   - Password: your **first name, lowercase** (e.g. `oorja`)
   - First time only, the class password: **MONDRIAN**
   - That's it — your name is already on the class list.
- *(If it ever looks oddly plain or stale, close it and open it again.)*

**What's inside**
- **Announcements** — from me to everyone. Read-only, so nothing gets buried.
  Check it before class.
- **Studio** — stuck? ask here. Someone else has the same question.
- **Show & Tell** — paste a link to your sketch (p5 editor share link, GitHub,
  anything that runs) and say a line about it.
- **Class** — everyone in the studio. Tap **Message** to DM anyone, me included.
- **Me** — your own Mondrian. Everyone gets a family (Tableau, Composition,
  Boogie, Trafalgar) for life; the composition is fresh every day. Tap it to
  shift it.

---

## For faculty

- Anyone with an `@learner.manipal.edu` address **and the class password**
  can sign up as a student; any `@manipal.edu` address with the password signs
  up as faculty and can post Announcements. No approval step — share the link
  (Me → *Copy invite message*, which includes the password). The password is
  enforced server-side; to change it, update the SHA-256 in `firestore.rules`
  and `index.html` and redeploy the rules.
- The **Class** tab shows who hasn't joined yet.
- Reset a password / remove someone: Firebase console (Authentication + Firestore).
