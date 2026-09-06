# JOSH // BROWSER GARAGE

September 2026. Fit assessment, not a security certification.

The clothes can look like an operating system, an AI co-pilot, or a trail map. The machinery underneath is still one of three engine families.

```text
CHROMIUM / BLINK
├─ Comet
├─ Wavebox
├─ Vivaldi
├─ Brave
├─ Horse          (Chromium under a custom shell)
└─ formerly Sidekick

FIREFOX / GECKO
├─ Firefox
├─ Floorp
└─ LibreWolf

WEBKIT
├─ Safari
└─ SigmaOS
```

That is why a browser can feel completely different from Chrome while still sharing most of Chrome's web machinery — and why a Firefox fork can look like Vivaldi without becoming Chromium.

The system can map the past, but it cannot carry it for you.
Scar is evidence.
Weight is consequence.
Memory changes the next pull.

Chrome profiles map history into another window. They do not change the next Gmail pull. If the next click can still open the wrong Google account, the memory was decoration.

---

## Chromium is not Chrome

Easy to misunderstand. Chromium is the large open-source browser project that provides much of the machinery Chrome uses. Chrome is Google's product on top of that project.

```text
                CHROMIUM
                   │
         ┌─────────┼──────────┐
         │         │          │
       Chrome    Comet     Wavebox
         │         │          │
       Brave     (AI)      Vivaldi
```

Each company takes the underlying project and adds its own interface, sync, AI, privacy policy, account system, blockers, workspaces, sidebars, agents, telemetry.

Chromium's security architecture includes sandboxing and Site Isolation: sites can run in separate processes so a hole in one origin does less damage. ([Chromium core principles](https://www.chromium.org/Home/chromium-security/core-principles/))

Using Wavebox does not mean:

> I am secretly just using Google Chrome.

It means:

> Wavebox uses much of the same open-source web machinery.

That is a substantial difference. It is also not engine diversity. A Chromium-specific rendering bug, extension break, or policy change can still hit Wavebox, Comet, and Vivaldi together. That is why Gecko stays in the garage.

Firefox is not Chromium-based. Gecko handles rendering, networking, and internals. SpiderMonkey executes JavaScript. ([Gecko](https://firefox-source-docs.mozilla.org/overview/gecko.html) · [Firefox FAQ](https://www.mozilla.org/en-US/firefox/faq/))

```text
                THE WEB

       ┌──────────┼───────────┐
       │          │           │
     BLINK       GECKO      WEBKIT
       │          │           │
   Chromium     Firefox      Safari
       │          │           │
   Wavebox      Floorp      SigmaOS
   Comet        LibreWolf
   Vivaldi
   Brave
   Horse
```

---

## The problem the garage has to solve

```text
RESCOPE Gmail  ≠  JOSH Gmail  ≠  FIXMYIPHONE Gmail
RESCOPE GitHub ≠  JOSH GitHub
```

without:

```text
logout
login
wrong Google account
switch Chrome profile
wrong GitHub
find old tab
```

That is an identity problem, not a tab-manager problem.

Two primitives get sold as the same word:

| Primitive | What it actually does | Two Gmails, both logged in, one window? |
| --------- | --------------------- | --------------------------------------- |
| **Organization** (most "Workspaces") | Hides one pile of tabs so you can see another | No. Cookies still shared. |
| **Isolation** (Wavebox Spaces, Firefox/Floorp Containers) | Separate cookies / session / storage | Yes. |

Vivaldi Workspaces are organization. Cookie storage is per profile, per window, not per workspace. Opera Workspaces are the same class. Wavebox Spaces and Firefox Containers are isolation.

---

## The six, plus Vivaldi

| Browser | Engine | Personality | Best at | Josh fit |
| ------- | ------ | ----------- | ------- | -------: |
| **Comet** | Chromium | AI co-pilot | Research + browser actions | 9/10 as agent lane, not vault |
| **SigmaOS** | WebKit | Mac workspace OS | Project workspaces | 8/10 concept, 6/10 on this desk |
| **Wavebox** | Chromium | Mission control | Multiple accounts / apps | **10/10** |
| **Sidekick** | Chromium | Former work-OS | Historical reference | 5/10 now, do not install |
| **Horse** | Chromium under custom clothes | Trail / map browser | Remembering how you got somewhere | 9/10 concept |
| **Floorp** | Firefox / Gecko | Firefox after three espressos | Containers + panels + workspaces | **9.5/10** |
| **Vivaldi** | Chromium | Power-user cockpit | Maximum native control | **9.5/10** as builder reference |

The two to install first on the Windows PC: **Wavebox + Floorp**. One tests "everything already connected." The other is a real Gecko escape hatch, not another Blink logo.

---

## 01. COMET

### `THE BROWSER WITH A WORKER SITTING BESIDE YOU`

Comet is Perplexity's AI browser. Underneath it is Chromium: sites behave as they do in Chrome, and most Chrome Web Store extensions work. Windows, Mac, iOS, Android. ([Comet](https://www.perplexity.ai/comet))

The clothes are the agent layer.

```text
NORMAL BROWSER

YOU
 ↓
PAGE
 ↓
READ IT
 ↓
DO SOMETHING


COMET

YOU
 ↓
INTENT
 ↓
COMET ASSISTANT
 ├─ READ PAGE
 ├─ SEARCH
 ├─ SUMMARISE
 ├─ CLICK
 ├─ TYPE
 └─ NAVIGATE
```

Current surface: page-aware Assistant, Perplexity search, Gmail / Calendar connectors, summaries, voice, supervised browser actions. When connectors are on, it can draft and send mail, not just summarise a page.

### Why it is relevant to LITHOS / TALON

```text
HUMAN
→ INTENT
→ AGENT
→ VISIBLE ACTION
→ RESULT
```

That is the TALON loop, already shipping in a Chromium shell.

### The caution

An AI browser receives much richer context than a normal browser. Prompt injection is a structural risk: a page can try to instruct the agent while the agent can see authenticated sessions.

Do not throw every bank account, Proton session, business admin portal, or private inbox into Comet and tell the agent to freely act.

Use it first as:

```text
RESEARCH
AI
DOCUMENTATION
SEARCH
PUBLIC WORKFLOWS
```

Then expand deliberately. Proton Pass stays the credential root. Comet does not become the vault.

Sidekick's team joined Perplexity; Sidekick itself shut down in August 2025 and `meetsidekick.com` now points at Comet. Philosophical lineage:

```text
SIDEKICK  (work OS)
   │
   │ team acquisition
   ▼
COMET     (AI work environment)
```

Not the same product renamed. The work-OS idea moved into an agent browser.

**Josh score: 9/10 as the agent / research lane. 3/10 as the place identities live.**

---

## 02. SIGMAOS

### `THE BROWSER THAT THINKS IT IS macOS FOR THE WEB`

SigmaOS is not Chromium. It uses **WebKit**, the same engine family as Safari. The interface is native SwiftUI on macOS. ([SigmaOS](https://sigmaos.com/))

```text
CHROME-LIKE WORLD
Chromium
 ↓
Browser UI

SIGMA
WebKit
+
SwiftUI
 ↓
Mac-native workspace environment
```

The unit is a workspace, not a giant tab strip.

```text
◆ LITHOS
   Claude
   GitHub
   Figma
   Docs

◉ FIXMYIPHONE
   RepairOS
   Gmail
   Parts
   Facebook

⌂ JOSH
   Proton
   Personal
   Research
```

A workspace can use a separate profile with independent cookies, so two workspaces can stay signed into different versions of the same service.

The wild technical trick: SigmaOS supports many Chromium extensions even though the engine is WebKit. They implemented compatibility with Chromium's extension APIs themselves. Extensions can be scoped per workspace or globally. ([Extensions](https://docs.sigmaos.com/tutorial/extensions))

That proves:

> You do not have to adopt Chromium's entire worldview just to touch its ecosystem.

That is LITHOS-shell research. A future desk could be WebKit (or Gecko) underneath and still run Proton Pass as a Chrome-shaped extension.

### Problem for this desk

SigmaOS is macOS-only. Windows is "coming soon" in their own copy, not here.

**Concept: 10/10. Current Josh hardware: 6/10. Primary browser: no.**

---

## 03. WAVEBOX

### `THE EVERYTHING-IS-ALREADY-LOGGED-IN BROWSER`

Closest match to the original problem. Chromium underneath, reorganized around apps, identities, and Spaces rather than tabs.

Killer feature: cookie isolation. A Space holds cookies. Several Spaces can be live in one window.

```text
WAVEBOX

SPACE // JOSH
├─ Gmail Josh
├─ ChatGPT Josh
└─ Proton

SPACE // RESCOPE
├─ Gmail RESCOPE
├─ Slack RESCOPE
├─ GitHub RESCOPE
├─ Gemini
└─ Claude

SPACE // FMI
├─ Gmail FMI
├─ Meta
├─ RepairOS
└─ Parts
```

So `gmail.com` can be several completely different people at once. ([Spaces](https://hub.wavebox.io/spaces/))

Also: persistent web apps, notification badges, Groups, split screen, unified search, Chrome extensions, built-in password manager (ignore it — Proton Pass is the vault), sync, app locking. Windows / Mac / Linux.

Mental model:

```text
SPACE     → IDENTITY
GROUP     → JOB
APP       → TOOL  (resident, not a tab)
TAB       → TEMPORARY PAGE
```

Hierarchy, permanent to temporary:

```text
Space > Group > App > Saved Items > Tab group > Pinned tab > Open tab
```

Saved Items are the Raindrop-killer inside one client: the URL you are afraid to close, parked on the app, not loaded. Bookmarks are global across Spaces — so client-specific links do not belong on the bookmarks bar.

Three layouts, same structure: Spaces (one company at a time), List (every Group, agency-style, use dividers), Explorer (tree, no tabstrip).

Do not mix Spaces inside one Group. That is how RESCOPE Slack sits next to JOSH Gmail and the scar returns.

Practical: Basic/free is 2 Spaces, 2 Groups, 2 apps each, 1 extension. Josh needs at least JOSH / RESCOPE / FIXMYIPHONE, probably BUILD. The real test is Pro. ([Plans](https://hub.wavebox.io/wavebox-plans/))

If this works, Ferdium becomes unnecessary. Raindrop becomes archive. Flow Launcher stays Windows-wide Ǝ; Wavebox search is browser Ǝ.

[Wavebox](https://wavebox.io/) · [Hierarchy](https://hub.wavebox.io/the-wavebox-hierarchy-what-sits-inside-what/)

**Josh score: 10/10 for the multi-account job.**

---

## 04. SIDEKICK

### `THE GHOST OF A REALLY GOOD IDEA`

Do not migrate into Sidekick. It is not a product anymore.

It launched as a Chromium "work OS": Slack, WhatsApp, Gmail as persistent applications instead of anonymous tabs. ([TechCrunch, 2021](https://techcrunch.com/2021/03/19/sidekick-browser-wants-to-be-a-productivity-honed-work-os-on-chromium/))

```text
SIDEKICK
├─ APPS
├─ WORKSPACES
├─ MULTIPLE ACCOUNTS
├─ SEARCH
├─ SESSIONS
├─ DISTRACTION CONTROL
└─ CHROMIUM EXTENSIONS
```

Perplexity acquired the team in 2025. Sidekick shut down 3 August 2025. The old site now sends people to Comet.

```text
WEB APP ≠ RANDOM TAB
WEB APP = PERMANENT CAPABILITY
```

That idea survived. It now lives in Wavebox (isolation + residents) and, more loosely, in Comet (agent + work environment). Wavebox is the living Sidekick. Comet is the mutated heir.

**Historical inspiration: 9/10. Install today: 2/10.**

---

## 05. HORSE

### `THE BROWSER THAT REMEMBERS WHY THE TAB EXISTS`

Horse is different clothes on conventional web machinery (Chromium / Electron under the hood, Chrome-like DevTools, almost no Chrome Web Store). The thing they protected was Trails, not another Chrome clone. Founders: Pascal Pixel and Eleanor McKeown. Windows / Mac / Linux.

Normal browsers remember:

```text
PAGE A
PAGE B
PAGE C
PAGE D
```

Horse remembers:

```text
QUESTION
│
├─ GOOGLE RESULT
│  ├─ DOCUMENTATION
│  │  └─ GITHUB
│  └─ REDDIT THREAD
│
└─ DIFFERENT IDEA
   └─ ARTICLE
```

Click a link and it branches underneath the page that led to it. Sub-Trails go down. Side-Trails go sideways. Tabs, bookmarks, and history collapse into one persistent tree. Close the browser; the trail is still there. Drag a trail into notes and the whole family tree lands as Markdown. ([Trails](https://browser.horse/manual/getting-started/how-to-use-horse-browsers-trails))

Josh translation:

```text
TREE → BRANCH → OBJECT → THREAD

LITHOS LOGIN
│
├─ AUTH RESEARCH
│  ├─ FIREBASE
│  └─ SUPABASE
│
├─ UI REFERENCE
│  ├─ MOBBIN
│  └─ FIGMA
│
└─ CODE
   └─ GITHUB
```

Normal history loses the causal structure. Horse keeps it. That is why it scores so high as LITHOS research and so low as an account dock.

Do not expect Wavebox behaviour. Horse is not "keep 17 Gmails permanently docked." It is "preserve the shape of thought."

Proton Pass / Chrome extensions: weak here. Use Horse as a thinking lab, not as the password surface.

**Daily account-management: 6/10. LITHOS conceptual fit: 10/10.**

[Horse](https://browser.horse/)

---

## 06. FLOORP

### `FIREFOX AFTER THREE ESPRESSOS`

This is why the experiment is not Chromium-only.

Floorp is open source, built on Firefox. v12.17.2 (3 September 2026) rides Firefox 155. Windows / Mac / Linux. No account required.

```text
FLOORP
   ↓
FIREFOX
   ↓
GECKO
   ↓
SPIDERMONKEY
```

rather than:

```text
COMET / WAVEBOX / VIVALDI
   ↓
CHROMIUM
   ↓
BLINK
   ↓
V8
```

Floorp adds the features that make Vivaldi / Wavebox attractive, on Gecko:

```text
Workspaces
Firefox Containers
split view (up to four pages)
web panels
sidebar
command palette
Tab Stacks (opt-in)
mouse gestures
UI customization
web apps in their own windows
```

([Floorp](https://floorp.app/) · [v12.17](https://blog.floorp.app/en/release/12.17.0/) · [v12.17.2](https://blog.floorp.app/en/release/12.17.2/))

```text
FLOORP

RESCOPE WORKSPACE
├─ default container: RESCOPE
├─ GitHub
└─ Docs

PERSONAL WORKSPACE
├─ default container: JOSH
└─ Gmail

SAFE WORKSPACE
└─ isolated browsing
```

Containers keep cookies apart. Workspaces can carry a default container, so new tabs and palette search inherit identity. The 12.17 command palette can also choose a container when opening a URL:

```text
COMMAND
→ Open URL
→ choose container
   ├─ this workspace's default
   ├─ no container
   └─ any named container
→ go
```

That is close to:

```text
Ǝ
→ INTENT
→ PLACE     (workspace)
→ IDENTITY  (container)
→ GO
```

Keep the Multi-Account Containers add-on until native Firefox Containers grow site-assignment. Floorp sits on that same Gecko identity model.

Engine redundancy is the point. If Chromium has a Blink-specific bug, an extension mess, a rendering regression, or a Google-ecosystem policy change, the garage still has a usable Gecko environment.

Do not run stock Firefox and Floorp as twin dailies. Floorp *is* the Firefox experiment with the extra verbs. Stock Firefox remains the control: native Containers, Mozilla support, fewer moving parts — keep it installed, do not live in both.

**Josh score: 9.5/10 as Gecko daily and fallback.**

---

## 07. VIVALDI

### `THE LEGO TECHNIC BROWSER`

Extra comparison. Chromium underneath, deliberately not Chrome's UI.

```text
GOOGLE CHROME

CHROMIUM
+
GOOGLE UI / SERVICES


VIVALDI

CHROMIUM
+
VIVALDI BACKEND
+
VIVALDI CUSTOM UI
```

Vivaldi: about 92% open-source Chromium, ~3% their published C++ backend, ~5% proprietary desktop UI (HTML/CSS/JS). They do not use Google sync. ([Different from Chrome](https://vivaldi.com/blog/vivaldi-different-from-chrome/) · [Open source split](https://vivaldi.com/blog/vivaldi-browser-open-source/))

```text
WORKSPACES
TAB STACKS
TAB TILING          (no two-pane cap; drag-and-drop; open link as tiled tab)
MAIL                (multi-account IMAP/POP; pin across workspaces as of 7.8)
CALENDAR
RSS
NOTES
COMMAND PALETTE
WEB PANELS
SESSIONS
PROFILES
MOUSE GESTURES
KEYBOARD WORKFLOWS
```

Less "we designed your workflow" and more "here are 400 pieces; build the cockpit." That is why it suits Josh. The downside is the same sentence: you can spend six hours building the cockpit.

Workspaces here are rooms, not cookie jars. Gmail in a Web Panel and Gmail in a tab share cookies. Vivaldi Mail can combine IMAP accounts; that is protocol multi-account, not Google-session isolation. For RESCOPE Gmail ≠ JOSH Gmail you still need Profiles, which puts you back in window-per-company.

Steal the desk. Do not live the identity model.

```text
┌ RESCOPE WORKSPACE ──────────────────────┐
│ GitHub              Claude              │
│ ┌────────────┐     ┌────────────────┐   │
│ │            │     │                │   │
│ └────────────┘     └────────────────┘   │
├────── PANEL ────────────────────────────┤
│ Slack / Gmail / Calendar                │
└─────────────────────────────────────────┘
```

Vivaldi 7.8 also said humans do not need an AI babysitter. Useful contrast with Comet: visible execution is not the same as an assistant that navigates without a declared identity.

**Builder / power-user reference: 9.5/10. Josh migration with shared-cookie workspaces: 7/10.**

[Vivaldi](https://vivaldi.com/) · [Tiling](https://help.vivaldi.com/desktop/tabs/tab-tiling/)

---

## JOSH // BROWSER GARAGE

Not:

```text
CHROME
CHROME WITH DIFFERENT LOGO
CHROME WITH DIFFERENT LOGO
CHROME WITH DIFFERENT LOGO
```

This:

```text
┌────────────────────────────────────┐
│  WAVEBOX                           │
│  OPERATIONS                        │
│  Chromium                          │
│                                    │
│  Gmail / Slack / GitHub / AI       │
│  Multiple identities               │
└────────────────────────────────────┘

                 +

┌────────────────────────────────────┐
│  FLOORP / FIREFOX                  │
│  BACKUP + IDENTITY LAB             │
│  Gecko                             │
│                                    │
│  Containers                        │
│  Safe fallback                     │
└────────────────────────────────────┘

                 +

┌────────────────────────────────────┐
│  COMET                             │
│  AGENT / RESEARCH                  │
│  Chromium                          │
│                                    │
│  Search                            │
│  summarise                         │
│  browse                            │
│  supervised actions                │
└────────────────────────────────────┘

                 +

┌────────────────────────────────────┐
│  HORSE                             │
│  RESEARCH / THINKING LAB           │
│  Trails                            │
│                                    │
│  branches                          │
│  provenance of thought             │
└────────────────────────────────────┘
```

Keep off the daily taskbar:

```text
VIVALDI   = builder / power-user reference
SIGMAOS   = macOS / LITHOS UX reference (WebKit)
SIDEKICK  = historical research, not an install
```

Roles:

```text
OPERATE     → WAVEBOX   / CHROMIUM
AGENT       → COMET     / CHROMIUM
POWER       → VIVALDI   / CHROMIUM
FALLBACK    → FLOORP    / GECKO
BASELINE    → FIREFOX   / GECKO
MAC STUDY   → SIGMAOS   / WEBKIT
THINK       → HORSE     / TRAILS
```

```text
              PROTON PASS
            credential root
                  │
      ┌───────────┼───────────┐
      │           │           │
  WAVEBOX      FLOORP      COMET
  identities   Gecko lab   agent
  + residents  containers  public work
      │           │           │
      └───────────┼───────────┘
                  │
                HORSE
            when the path
            must stay visible
```

---

## Install first (Windows)

**Wavebox + Floorp.** Proton Pass remains outside. Do not put vault secrets in browser sync.

### Wavebox

1. Spaces: `JOSH`, `RESCOPE`, `FIXMYIPHONE`. Optional: `BUILD`.
2. One Group per job, not per site.
3. Promote Gmail / Slack / GitHub / RepairOS to Apps.
4. Client links → Saved Items. Global links → bookmarks or Raindrop archive.
5. Start in Spaces layout. List + dividers only if every company must be on screen.
6. Do not mix Spaces in one Group.

Pass if: zero logout/login cycles, zero wrong Google, zero "which GitHub," Ferdium not opened.

### Floorp

1. Containers: `JOSH`, `RESCOPE`, `FMI`. Keep Multi-Account Containers add-on for site assignment.
2. Workspaces with default containers: BUILD → RESCOPE, HOME → JOSH, SHOP → FMI.
3. Bind the command palette. Practice: URL → container → go.
4. Tab Stacks are opt-in. Ignore until identity is boring.

Pass if the same three identities hold, even if Slack/Gmail feel less "installed" than in Wavebox.

### Then, if the first two are boring

- **Comet** for supervised research / TALON study. No Proton, no banks, no admin portals until the agent lane is trusted.
- **Horse** when a LITHOS investigation needs a visible trail.
- **Vivaldi** only as a cockpit you are willing to build, not as the identity solution.
- **SigmaOS** when you are on a Mac and want WebKit clothes.

Fail any browser whose Workspaces still share cookies. That is organization wearing an isolation costume.

---

## LITHOS takeaway

Intelligence should move through relationships without acquiring sovereignty over them.

A browser that owns every identity in one cookie jar has acquired sovereignty it should not have. A browser that isolates JOSH from RESCOPE lets you — later an agent — move through the relationship without collapsing the people into one session.

```text
TRUNK   = identity boundary   (Space / Container / Proton Pass)
BRANCH  = place of work       (Group / Workspace / Desk)
THING   = the page, the app, the trail
AGENT   = declared identity before action  (Comet, later TALON)
PATH    = why the thing exists             (Horse)
```

Wavebox currently has the best trunk-plus-branch for this Windows life.
Floorp currently has the best Gecko trunk that can also be a daily.
Comet currently has the best agent sitting beside the page — and the most dangerous view into sessions.
Horse currently has the most honest path.
Vivaldi currently has the best branch-as-desk, with a shared trunk.
SigmaOS currently has the purest non-Chromium workspace OS, on the wrong OS for the main desk.

None of them is LITHOS. The next pull should remember which person is pulling.
