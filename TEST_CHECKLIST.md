# ATS Resume Builder – Test Checklist

Use this list to verify all features after adding ATS Resume Scoring.

## 1. All form sections save to localStorage
- [ ] Open `/builder`, fill Personal (name, email, phone), Summary, Education, Experience, Projects, Skills, Links.
- [ ] Refresh the page. All entered data should still be present (key: `resumeBuilderData`).

## 2. Live preview updates in real-time
- [ ] On `/builder`, type in any section (e.g. name or summary). The preview panel on the right should update immediately as you type.

## 3. Template switching preserves data
- [ ] On `/builder` or `/preview`, switch between Classic, Modern, and Minimal. Resume content should remain unchanged; only layout/fonts change.

## 4. Color theme persists after refresh
- [ ] On `/preview`, pick a non-default color (e.g. blue or green). Refresh the page. The selected theme should still be applied (key: `resumeBuilderTheme`).

## 5. ATS score calculates correctly
- [ ] Empty resume → score 0.
- [ ] Add name (+10), email (+10), phone (+5), summary >50 chars (+10), 1 experience with bullets (+15), 1 education (+10), 5+ skills (+10), 1 project (+10), LinkedIn (+5), GitHub (+5), action verb in summary (+10) → score 100.
- [ ] Verify intermediate scores by adding items one by one and checking the displayed score.

## 6. Score updates live on edit
- [ ] On `/builder` or `/preview`, add or remove name, summary, experience, etc. ATS score (bar on builder, circle on preview) and suggestions list should update without refresh.

## 7. Export buttons work (copy/download)
- [ ] **Copy Resume as Text**: On `/preview`, click "Copy Resume as Text". Paste elsewhere; plain-text resume content should appear.
- [ ] **Print / Save as PDF**: Click "Print / Save as PDF". Print dialog opens; "Save as PDF" or printing produces a clean resume layout (tabs and ATS block hidden in print).

## 8. Empty states handled gracefully
- [ ] With no data, preview shows placeholders (e.g. "Your name") and empty-state message where appropriate. No crashes or blank screens.
- [ ] ATS score shows 0 and lists improvement suggestions (e.g. "Add your name (+10 points)").

## 9. Mobile responsive layout works
- [ ] Resize to mobile width (e.g. 375px). Builder and Preview layouts should reflow; buttons and forms remain usable; no horizontal scroll on main content.

## 10. No console errors on any page
- [ ] Open DevTools → Console. Visit `/`, `/builder`, `/preview`, `/proof` and interact (navigate, edit, switch template/theme, export). No red errors should appear.

---

**ATS Score Rules (reference)**  
+10 name, +10 email, +5 phone, +10 summary >50 chars, +15 1 experience w/ bullets, +10 1 education, +10 ≥5 skills, +10 ≥1 project, +5 LinkedIn, +5 GitHub, +10 summary has action verbs. Max 100.

**Score bands on /preview**  
0–40: Red "Needs Work" | 41–70: Amber "Getting There" | 71–100: Green "Strong Resume"
