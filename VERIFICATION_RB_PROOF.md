# RB Proof & Submission — Verification

## Shipped logic

**Status shows "Shipped" only when all of:**

1. **All 8 steps completed** — Each step has an artifact (e.g. "It Worked" / "Error" / "Screenshot" in Build panel). Stored in `rb_step_1_artifact` … `rb_step_8_artifact`.
2. **All 10 checklist items checked** — On `/rb/proof`, the "Verification checklist" section: every item must be checked. Stored in `rb_checklist` (array of 10 booleans).
3. **All 3 proof links provided and valid** — Lovable Project Link, GitHub Repository Link, Deployed URL must be non-empty and valid `http`/`https` URLs. Stored in `rb_final_submission`.

If any of the above is missing, status remains **"In Progress"** (on step pages) or **"Proof"** (on proof page). No bypass: the checklist lock is enforced.

---

## Proof validation

- **URL validation:** Inputs use `type="url"` and a runtime check `isValidUrl()` (protocol http/https, valid URL). Invalid URLs show an inline error and do not count toward "all 3 links provided."
- **Storage:** Submissions are stored under `rb_final_submission` (JSON: `{ lovable, github, deploy }`). Reading falls back to `rb_proof_links` for backward compatibility.

---

## Verification steps

1. **Step completion**
   - Go to `/rb/01-problem` … `/rb/08-ship`. For each step, use the Build panel to mark a result (It Worked / Error / Add Screenshot). Ensure "Proof" becomes available from step 8 only when step 8 has an artifact.
   - Open `/rb/proof`. Section "Step Completion Overview" should show all 8 steps with ✅ when artifacts exist; ○ otherwise.

2. **Artifact collection**
   - Enter a non-URL (e.g. `abc`) in Lovable Project Link. Blur or submit: error message "Please enter a valid URL (http or https)."
   - Enter `https://example.com` in all three fields. Errors clear. Check `localStorage` for key `rb_final_submission`; value should be JSON with the three URLs.

3. **Checklist lock**
   - With 8 steps done and 3 valid links but only 9/10 checklist items checked: status on proof page should still be "Proof", not "Shipped."
   - Check the 10th item: status should change to "Shipped" and the message "Project 3 Shipped Successfully." should appear. Badge in top bar should show "Shipped" (green).

4. **Copy Final Submission**
   - Click "Copy Final Submission". Paste into a text editor. Expected format:
     - Header/footer with dashes.
     - "AI Resume Builder — Final Submission"
     - Lovable Project / GitHub Repository / Live Deployment lines.
     - "Core Capabilities:" and the five bullet points (Structured resume builder, Deterministic ATS scoring, Template switching, PDF export, Persistence + validation checklist).

5. **No bypass**
   - With one step missing artifact, or one checklist item unchecked, or one link missing/invalid: badge must not show "Shipped." Manually editing `localStorage` to set `rb_checklist` to all true while leaving a link invalid should still keep status as Proof (getIsShipped checks URLs with `isValidUrl()`).

---

## Confirmation summary

- **Shipped logic:** Implemented in `getIsShipped()` in `src/lib/rbStorage.js`. Used by `PremiumLayout` (badge) and `RBProofPage` (message).
- **Proof validation:** URL validation via `isValidUrl()`; inline errors on inputs; data stored in `rb_final_submission`.
- **Checklist:** 10 items on proof page; stored in `rb_checklist`; all must be true for Shipped.
- **Copy format:** Matches the required text block (Lovable, GitHub, Live Deployment + Core Capabilities).
- **Calm completion:** "Project 3 Shipped Successfully." only when shipped; no confetti or flashy animations.
