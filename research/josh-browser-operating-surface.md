# Josh's browser operating surface

September 2026. Fit assessment, not a security certification.

The twelve-browser catalog was useful. The first shortlist was not.

Wavebox, Opera One, and Vivaldi are all Chromium shells. Two of them also fail the actual test: they tidy tabs, they do not isolate sign-ins. For Josh that is the whole problem.

This note locks a mixed-engine top 3, then expands six ideas worth stealing.

The system can map the past, but it cannot carry it for you.
Scar is evidence.
Weight is consequence.
Memory changes the next pull.

Chrome profiles map history into another window. They do not change the next Gmail pull. If the next click can still open the wrong Google account, the memory was decoration.

---

## The problem, restated

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

That is not a tab-manager problem. It is an identity problem.

Two different primitives get sold as the same word:

| Primitive | What it actually does | Same-site two logins in one window? |
| --------- | --------------------- | ----------------------------------- |
| **Organization** (most "Workspaces") | Hides one pile of tabs so you can see another | No. Cookies are still shared. |
| **Isolation** (Wavebox Spaces, Firefox Containers) | Separate cookies / session / storage | Yes. |

Opera Workspaces and Vivaldi Workspaces are organization. Vivaldi staff have said cookie storage is per profile, per window, not per workspace. Switching workspace does not give you a second Gmail.

Wavebox Spaces and Firefox Containers are isolation. That is why they belong in the top 3 and Opera does not.

---

## Top 3 for Josh

Not Google Chrome. Not three Chromium clones. One Blink daily driver, two Gecko identity browsers.

| # | Browser | Engine | Isolation | Built-in apps | AI | Why it is here |
| - | ------- | ------ | --------- | ------------- | -- | -------------- |
| 1 | **Wavebox** | Chromium | **10** Spaces | **10** | 8 | Closest to browser-as-OS *and* it isolates cookies |
| 2 | **Firefox** | Gecko | **10** Containers | 7 | 8 | Best identity architecture that is not Chromium |
| 3 | **Floorp** | Gecko | **9** workspace + container | 8 | 5 | Firefox if the command bar can choose identity |

Opera One, Vivaldi, Edge, and Brave stay off this list on purpose. They are still worth studying. They are not the three to live in first.

### 1. Wavebox — the one that matches the life tree

Wavebox is container-first. A Space holds cookies. A Group holds the apps for a job. Several Spaces can be live in one window.

That maps directly:

```text
WAVEBOX
├─ SPACE JOSH
│  ├─ Group: Home
│  │  ├─ Proton
│  │  ├─ Banking
│  │  ├─ Personal Gmail
│  │  └─ ChatGPT
│  └─ Group: Calendar
├─ SPACE RESCOPE
│  ├─ Group: Comms
│  │  ├─ Gmail
│  │  ├─ Slack
│  │  └─ Gemini
│  └─ Group: Build
│     ├─ GitHub
│     ├─ Drive
│     └─ Claude
└─ SPACE FIXMYIPHONE
   └─ Group: Shop
      ├─ Gmail
      ├─ RepairOS
      ├─ Parts
      ├─ Facebook
      └─ Accounting
```

Critical:

```text
RESCOPE Gmail ≠ JOSH Gmail
```

without a second Chrome profile window.

Three layout modes, same structure underneath:

- **Spaces layout** — one company at a time. Circle icons. New tabs inherit that Space.
- **List layout** — every Group from every Space in one dock. Agency pattern. Use dividers named JOSH / RESCOPE / FMI.
- **Explorer layout** — same all-Spaces scope drawn as a tree. No tabstrip. Nested folders.

Hierarchy, permanent to temporary:

```text
Space > Group > App > Saved Items > Tab group > Pinned tab > Open tab
```

A Space is a decision you make once. An open tab is this afternoon. Saved Items are the Raindrop-killer inside a single client: reference URLs on an app, not loaded, one hover away.

Bookmarks are the exception. The bookmarks bar is global across Spaces. Client-specific links belong as Saved Items, not as bookmarks. If Raindrop remains, it is archive, not the daily filing surface.

**Windows: yes. Chrome extensions: yes. Proton Pass: keep as the credential root, not Wavebox's built-in vault.**

Practical constraint: Basic/free is 2 Spaces, 2 Groups, 2 apps each, 1 extension. Josh needs at least three Spaces (JOSH, RESCOPE, FIXMYIPHONE), probably a fourth (BUILD). The real test requires Pro.

[Wavebox](https://wavebox.io/) · [Spaces](https://hub.wavebox.io/spaces/) · [Hierarchy](https://hub.wavebox.io/the-wavebox-hierarchy-what-sits-inside-what/) · [Plans](https://hub.wavebox.io/wavebox-plans/)

**Josh fit: 10/10 for the multi-account job. Engine: Chromium, accepted because it is the only Chromium that is actually container-first.**

### 2. Firefox — the identity browser that is not Chrome

Firefox 153 (21 July 2026) shipped native Containers as a preview. Same window. Isolated cookies. Named, colored identities.

```text
SAME WINDOW

Google
├─ container JOSH
├─ container RESCOPE
└─ container FMI

GitHub
├─ container PERSONAL
└─ container RESCOPE
```

This is the strongest non-Chromium answer to "too many accounts."

It is not Wavebox. Firefox still thinks in tabs. Sidebar now holds vertical tabs, synced tabs, bookmarks, history, passwords, and optional chatbot access. Persistent SaaS apps are weaker than Wavebox Groups. Ferdium-style always-on Gmail/Slack is not native.

Keep the Multi-Account Containers add-on installed. Mozilla's own preview is missing site-to-container assignment. Power users are told to keep the extension until that lands. For Josh that assignment is the difference between "I remembered to open Gmail in RESCOPE" and "gmail.com always opens as RESCOPE."

Proton Pass stays the vault. Firefox passwords are a cache at most.

[Firefox](https://www.mozilla.org/firefox/) · [Containers preview](https://blog.mozilla.org/en/firefox/firefox-containers-preview/) · [153 notes](https://www.firefox.com/en-US/firefox/153.0/releasenotes/)

**Josh fit: 9/10 as architecture, 7.5/10 as the whole operating surface. Engine: Gecko. This is why the top 3 is not all Chromium.**

### 3. Floorp — Firefox if a power user kept adding the missing verbs

Floorp is the Gecko daily driver if stock Firefox feels like a container demo with extra chrome.

Current 12.17 line:

```text
Workspaces
Panel Sidebar
vertical / horizontal / multi-row tabs
Zen Mode
command palette
containers
Tab Stacks (opt-in)
mouse gestures
workspace icons
```

The important combination, from the August 2026 12.17 release:

```text
COMMAND PALETTE
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

Search-from-palette also uses the current workspace's default container. Workspaces can carry a default identity, which Opera/Vivaldi workspaces cannot.

Floorp is not Wavebox. Apps are still pages. Isolation is still Firefox containers. What you gain is: place and identity on the same command.

Do not run Firefox and Floorp as twin dailies. Floorp *is* the Firefox experiment with the extra verbs. Stock Firefox is the control: native Containers, Mozilla support, fewer moving parts.

[Floorp](https://floorp.app/) · [v12.17 notes](https://blog.floorp.app/en/release/12.17.0/)

**Josh fit: 8.5/10 as the Gecko daily. 9.5/10 as the Ǝ prototype.**

---

## How the three divide the work

```text
              PROTON PASS
            credential root
                  │
                  ▼
     ┌────────────┼──────────────┐
     │            │              │
 WAVEBOX      FIREFOX         FLOORP
 Chromium      Gecko           Gecko
     │            │              │
 Spaces       Containers     Workspace
 + Groups     + sidebar      + container
 + Apps                      + command
     │            │              │
 JOSH          JOSH            Ǝ
 RESCOPE       RESCOPE         PLACE
 FMI           FMI             IDENTITY
     │            │              │
  live in      prove the      if Firefox
  this if      identity       chrome is
  it works     model          too thin
```

If Wavebox handles the three companies cleanly, Ferdium becomes unnecessary. Raindrop becomes archive. Flow Launcher stays Windows-wide Ǝ; Floorp's palette is browser Ǝ.

If Wavebox feels like a paid SaaS dock, Firefox/Floorp is the path that does not drag Google's engine into the trunk.

---

## Six ideas to expand (not six more browsers to install)

These are the ideas. Browsers are only where the idea is currently visible.

### Idea 1 — Isolation is not organization

This is the idea the twelve-browser table blurred.

```text
WRONG
  Workspace named RESCOPE
  Workspace named JOSH
  both logged into whichever Google you signed in last

RIGHT
  Isolated cookie jar named RESCOPE
  Isolated cookie jar named JOSH
  Gmail.com in each jar is a different human
```

Test any browser with one question:

> Can I have two Gmails visible, both authenticated, in one window, without a second profile process?

| Browser | Answer |
| ------- | ------ |
| Wavebox Spaces | Yes |
| Firefox / Floorp Containers | Yes |
| Vivaldi Workspaces | No — same profile cookies |
| Opera Workspaces | No — same profile cookies |
| Edge Workspaces | No — project tabs, shared identity |
| Chrome Profiles | Yes, but each profile is another window / another brain |
| SigmaOS workspace profiles | Yes, but Mac |
| Arc Spaces + Profiles | Historically yes; product is frozen |

LITHOS translation: a branch can look like a place and still share a trunk. If identity lives in the trunk, the branch cannot hold a second person.

### Idea 2 — Company as Space, job as Group, app as resident

Wavebox's ladder is the closest existing model to Josh's life tree.

```text
PLACE     = Space     (JOSH / RESCOPE / FMI)
WORK      = Group     (Comms / Build / Shop)
RESIDENT  = App       (Gmail, Slack, RepairOS)
MEMORY    = Saved Item (the link you are afraid to close)
NOW       = Tab
```

Chrome's model is inverted:

```text
TAB
TAB
TAB
TAB
TAB
```

plus a profile you remember to switch.

The Wavebox model is:

```text
WORKSPACE
  GMAIL     (resident, badged, sleeping)
  SLACK
  GITHUB
  CLAUDE
  + temporary tabs
```

That is why Ferdium may collapse into the browser. Ferdium was the resident-app layer Chrome refused to be. Wavebox already is that layer, with isolation underneath.

Steal this even if Wavebox is not the forever home: **residents are not tabs.** Tabs are the temporary layer. Identity is not a tab either.

Caveat from Wavebox's own docs: a Group can hold apps from more than one Space. Most people should not. Mixing Spaces in one Group is how RESCOPE Slack sits next to JOSH Gmail and the scar comes back.

### Idea 3 — Identity as a first-class container, not a profile window

Firefox Containers (native in 153, complete with the add-on) treat identity as a color on the tab.

```text
PLACE is optional
IDENTITY is required
```

Chrome Profiles treat identity as a whole other browser:

```text
Window A  — Josh
Window B  — Rescope
taskbar soup
wrong window, right URL, wrong cookies
```

Containers keep one window and stamp the next pull:

```text
open mail.google.com
in RESCOPE
```

The scar of the wrong account stays visible as a color. Weight is not reset by "I think I'm in the work profile." Memory changes the next pull because the container *is* the pull.

What Firefox still lacks for Josh: residents. You can pin, you can sidebar, you can vertical-tab. You do not get Wavebox Apps with unread badges and sleep schedules per client.

What to steal for LITHOS: **identity is a property of the next action, not a property of the window.** Floorp's palette already does this. TALON / Ǝ should too.

```text
HUMAN
→ request

AGENT
→ must declare IDENTITY
→ then PLACE
→ then act

SCREEN
→ identity remains visible
→ interrupt still works
```

An agent that can click but cannot say which Gmail it is in is how weight gets reset by accident.

### Idea 4 — Command as Ǝ: intent, then place, then identity, then go

Floorp 12.17 is the prototype, not because Floorp is beautiful, but because the command is ordered correctly.

```text
TYPE   github.com
CHOOSE container RESCOPE
LAND   in workspace BUILD
```

versus Chrome:

```text
hope you are in the right profile
type github.com
get Josh's notifications in a Rescope hour
```

Floorp also lets a workspace own a default container, so search and new tabs inherit identity. That is PLACE carrying IDENTITY without making you re-select it every time — which is the good kind of memory. The workspace remembers. You can still override from the palette.

LITHOS / Flow / Ǝ should not copy Floorp's UI. It should copy the order:

```text
1. What   (URL, app, person, object)
2. Who    (JOSH / RESCOPE / FMI)
3. Where  (desk, workspace, device)
4. Go
```

Most launchers skip 2. That is why they keep reproducing Chrome's scar.

### Idea 5 — The desk that is not identity (Vivaldi)

Vivaldi is still the deepest native desk. It dropped out of the top 3 because its Workspaces do not isolate cookies. Study it anyway. Steal the desk. Do not live the identity model.

Native, first-party:

```text
Mail          (multi-account IMAP/POP, pin across workspaces as of 7.8)
Calendar      (CalDAV)
Feeds         (RSS)
Notes
Web Panels    (any site as a persistent sidebar)
Tab Stacks
Tab Tiling    (no two-pane cap; drag-and-drop; open link as tiled tab)
Workspaces    (organization only)
Quick Commands
Mouse gestures
Sessions
Sync
```

The tiling idea is the desk:

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

Two warnings:

1. Gmail in a Web Panel and Gmail in a tab share cookies. A panel is not a container.
2. Vivaldi Mail can combine accounts in one client. That is email-protocol multi-account, not Google-session multi-account. Useful for IMAP. Not a substitute for Spaces.

What to steal: unlimited tiling, web panels as residents-without-isolation, mail/calendar as first-party so the browser can be a desk without Outlook. Combine that *form* with Wavebox/Firefox *identity* and you have the LITHOS brief.

Vivaldi 7.8 also made a product statement: humans do not need an AI babysitter. For TALON that is a reminder. Visible execution is not the same as an assistant that navigates on your behalf without a declared identity.

[Vivaldi](https://vivaldi.com/) · [Workspaces](https://vivaldi.com/features/workspaces/) · [Tab tiling](https://help.vivaldi.com/desktop/tabs/tab-tiling/) · [7.8](https://vivaldi.com/blog/vivaldi-on-desktop-7-8/)

**Desk research: 10/10. Josh migration: 7/10, and only with Profiles for isolation, which puts you back in window-per-company.**

### Idea 6 — How little chrome can exist, and what a trail is

Two Gecko/indie experiments, neither is a Josh daily driver, both are LITHOS form research.

**Zen** asks: how little browser chrome can exist while projects remain understandable?

```text
Workspaces
Compact Mode
Glance
Split View
vertical navigation
```

The lesson is not "migrate Josh to Zen." The lesson is quiet entry. A desk that does not shout every identity, every tab, every panel at once. Compact Mode hides the tab bar until needed. That is relevant to app-within-app and to not turning Wavebox's dock into another noisy Ferdium.

[Zen](https://zen-browser.app/)

**Horse** throws away tabs, bookmarks, and history as separate objects. It uses Trails:

```text
SOURCE
├─ RESULT A
│  ├─ DOC
│  └─ GITHUB
└─ RESULT B
```

Clicking a link does not replace the page. It branches. The path stays visible. Horse describes this as tabs + bookmarks + history in one persistent tree.

That is TREE → STEM → BRANCH → OBJECT, drawn in a sidebar.

Horse will not solve credentials. It is the closest browser to how LITHOS wants *research* to look. Use it as a reading/research surface, or do not install it at all and still steal the rule:

```text
The path is the memory.
Closing a tab should not erase how you got there.
A trail that cannot change the next pull is just a history list.
```

[Horse Trails](https://browser.horse/manual/getting-started/how-to-use-horse-browsers-trails)

Zen + Horse together:

```text
ZEN     = how little chrome
HORSE   = how visible the path
WAVEBOX = how hard the identity boundary
```

LITHOS needs all three. No current browser is all three.

---

## What dropped out of the top 3, and why

| Browser | Engine | Kept as | Dropped because |
| ------- | ------ | ------- | ---------------- |
| **Opera One** | Chromium | Sidebar-apps reference | Workspaces do not isolate. Most "everything is already here." Still Chrome-family. |
| **Vivaldi** | Chromium | Idea 5 — the desk | Deepest native OS, wrong identity primitive. |
| **Edge** | Chromium | TALON / Copilot study only | Microsoft spine. Workspaces are projects. Copilot click-the-page is relevant to visible agents, not to Josh Gmail. |
| **Brave** | Chromium | Privacy / local Leo memory | Shields + split view + containers-ish, still a Chrome-shaped all-rounder. |
| **Arc** | Chromium | Archaeological UX | Chromium updates only. Company points new work at Dia. Research 10, migration 5. |
| **SigmaOS** | WebKit-adjacent / Mac | Mandatory concept study | Workspace = separate profile cookies. Purest "browser = OS" after Wavebox. Josh's main desktop is Windows. |
| **Sidekick** | Chromium | Wavebox cousin | App-centric. Compare, do not dual-install. |
| **Chrome** | Chromium | Control | The scar. Profiles as windows. Not in the study set as a destination. |

Opera still answers a different question: can one conventional browser contain Gmail, Calendar, Slack, Discord, Telegram, WhatsApp, ChatGPT, Gemini, music, VPN, split-to-four, so Ferdium and a pile of extensions die? Yes, possibly. It will not give you three Gmails. That is why it is not top 3 for *this* Josh.

---

## The experiment (install these, not twelve)

Proton Pass remains outside. Do not put vault secrets in browser sync.

```text
              PROTON PASS
                  │
                  ▼
         1. WAVEBOX   (Chromium daily)
         2. FIREFOX   (Gecko control)
         3. FLOORP    (only if Firefox is too thin)
```

**Wavebox setup**

1. Create Spaces: `JOSH`, `RESCOPE`, `FIXMYIPHONE`. Optional: `BUILD`.
2. One Group per job, not one Group per site.
3. Promote Gmail / Slack / GitHub / RepairOS to Apps. Do not leave them as tabs you are scared to close.
4. Client-specific links → Saved Items. Global links → bookmarks or Raindrop archive.
5. Start in Spaces layout. Switch to List + dividers only if you need all companies on screen at once.
6. Do not mix Spaces inside one Group.

**Firefox setup**

1. Create containers: `JOSH`, `RESCOPE`, `FMI`.
2. Keep Multi-Account Containers add-on. Assign `mail.google.com`, `github.com`, etc. per container where the native preview cannot.
3. Vertical tabs + sidebar. Do not expect Wavebox residents.
4. Same three Gmails as Wavebox. This is the A/B.

**Floorp setup** (only after Firefox feels incomplete)

1. Import the same containers.
2. Workspaces with default containers: BUILD → RESCOPE, HOME → JOSH, SHOP → FMI.
3. Bind the command palette. Practice: URL → container → go.
4. Tab Stacks are opt-in. Ignore until the identity loop is boring.

**Pass / fail**

A week is enough if the week includes real work, not a demo.

Pass Wavebox if:

```text
zero logout/login cycles
zero wrong Google account
zero "which GitHub is this"
Ferdium not opened
```

Pass Firefox/Floorp if the same three identities hold, even if Slack/Gmail feel less "installed."

Fail any browser whose Workspaces still share cookies. That is organization wearing an isolation costume.

---

## LITHOS takeaway

Intelligence should move through relationships without acquiring sovereignty over them.

A browser that owns every identity in one cookie jar has acquired sovereignty it should not have. A browser that isolates JOSH from RESCOPE is letting intelligence (you, later an agent) move through the relationship without collapsing the people into one session.

```text
TRUNK   = identity boundary   (Space / Container / Proton Pass)
BRANCH  = place of work       (Group / Workspace / Desk)
THING   = the page, the app, the trail
```

Wavebox currently has the best trunk-plus-branch for Josh's Windows life.
Firefox currently has the cleanest trunk that is not Chromium.
Floorp currently has the best verb for declaring trunk before the thing opens.
Vivaldi currently has the best branch-as-desk, with a shared trunk.
Zen currently has the least chrome.
Horse currently has the most honest path.

None of them is LITHOS. The next pull should remember which person is pulling.
