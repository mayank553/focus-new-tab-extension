## **FocusTab — Product Requirements Document (PRD)** 

## **Project Overview** 

FocusTab is a Chrome extension that replaces the default browser new tab page with a personal productivity dashboard. 

The extension helps users: 

- Set a daily main focus 

- Manage lightweight tasks 

- Block distracting websites 

- Reflect on their daily progress 

- Maintain consistency with streak tracking 

The experience should be minimal, calming, and distraction-free. 

## **Product Vision** 

Turn every new tab into a productivity-first workspace that promotes focus, clarity, and discipline. 

## **Goals** 

## **Primary Goals** 

- Improve daily focus 

- Reduce distractions 

- Increase task completion 

- Build productivity habits 

## **Secondary Goals** 

- Personalize the workspace 

- Create emotional engagement through streaks 

- Keep the product lightweight and fast 

1 

## **Core Features** 

## **1. New Tab Dashboard** 

## **Description** 

Replace Chrome’s default new tab with a personal dashboard. 

## **Components** 

## **Fullscreen Wallpaper** 

- Show fullscreen wallpaper 

- User can upload custom image 

- Save uploaded image locally 

- Use default wallpaper if none exists 

## **Personalized Greeting** 

Display based on time: 

- Morning (5 AM – 12 PM) 

- Afternoon (12 PM – 5 PM) 

- Evening (5 PM – 10 PM) 

- Night (10 PM – 5 AM) 

Format: 

```
Good Morning, {name}
```

## **Live Clock** 

Display: 

- Hours • Minutes • Seconds • Current date 

Update every second. 

## **2. Daily Main Focus** 

## **Description** 

Ask user once every day: 

2 

```
What is your main focus today?
```

## **Requirements** 

- Ask only once per day 

- Save the response 

- Keep it visible throughout the day 

- Automatically reset the next day 

## **Data Structure** 

```
{
"focus":"Complete project proposal",
"date":"YYYY-MM-DD"
}
```

## **Acceptance Criteria** 

- Focus persists throughout the day 

- Resets automatically on date change 

## **3. Task List** 

## **Description** 

Simple task manager. 

## **Features** 

## **Add Task** 

- Input field 

- Add on Enter key 

- Prevent empty task 

## **Mark Complete** 

- Checkbox toggle • Apply strikethrough 

## **Delete Task** 

- Trash icon removes task 

## **Data Structure** 

```
{
"id":"uuid",
```

3 

```
"text":"Call client",
"completed":false
}
```

## **Acceptance Criteria** 

- Tasks persist in storage 

- UI updates instantly 

## **4. Focus Mode** 

## **Description** 

Blocks distracting websites. 

## **Toggle Behavior** 

## **ON** 

Block listed websites. 

## **OFF** 

Allow normal browsing. 

## **Default Block List** 

```
instagram.com
youtube.com
linkedin.com
twitter.com
reddit.com
```

## **Redirect Behavior** 

Instead of browser error: 

Show custom block page. 

Example: 

```
Stay Focused
```

4 

```
Your main focus today:
{daily_focus}
```

Buttons: 

- Go Back 

- Disable Focus Mode 

## **Technical Requirements** 

Use: 

```
chrome.declarativeNetRequest
```

Redirect blocked sites to: 

```
block.html
```

## **Acceptance Criteria** 

- Blocking works instantly • Turning off restores access 

## **5. Settings** 

## **Description** 

Manage personalization and behavior. 

## **Change Name** 

Input: 

- Name field 

- Save button 

Storage key: 

```
user_name
```

5 

## **Upload Wallpaper** 

Allow: 

- Upload image 

- Replace image 

Store as: 

- Base64 string 

## **Manage Block List** 

Allow: 

- Add domain 

- Remove domain 

- View domains 

Store as: 

```
["instagram.com","youtube.com"]
```

## **Acceptance Criteria** 

Changes reflect immediately. 

## **6. Daily Reflection Journal** 

## **Description** 

Prompt user at end of day. 

Question: 

```
What did you accomplish today?
```

## **Trigger Logic** 

Show after: 

- 8 PM OR 

- First new tab after 8 PM 

6 

Only once per day. 

## **Save Reflection** 

Data Structure: 

`{ "date": "YYYY-MM-DD", "win": "Finished important work" }` 

## **Streak Logic** 

A streak increases when: 

- Daily focus is set AND 

- Reflection is completed 

Miss one day: Reset streak. 

Display: 

`7 Day Streak` 

## **Acceptance Criteria** 

- Reflections saved 

- History visible 

- Streak updates correctly 

## **Technical Requirements** 

## **Tech Stack** 

- Manifest V3 

- HTML 

- CSS 

- JavaScript (Vanilla) 

- Chrome Storage API 

- Chrome Tabs API 

- Declarative Net Request API 

7 

## **Storage Architecture** 

Use: 

```
chrome.storage.local
```

Store: 

```
{
""
"user_name":,
""
"wallpaper":,
"focus":{},
"tasks":[],
"focus_mode":false,
"blocked_sites":[],
"journal_entries":[],
"streak":0
}
```

## **Project Structure** 

```
/focustab
│── manifest.json
│── newtab.html
│── styles.css
│── app.js
│── background.js
│── settings.html
│── settings.js
│── block.html
│── block.js
│── assets/
│── utils/
│   │── storage.js
│   │── date.js
│   │── streak.js
```

8 

## **Development Phases** 

## **Phase 1 — Dashboard** 

Build: 

- New tab override 

- Wallpaper 

- Greeting 

- Live clock 

- Daily focus 

Deliverable: Working dashboard UI. 

## **Phase 2 — Tasks** 

Build: 

- Add tasks 

- Complete tasks 

- Delete tasks 

- Persist tasks 

Deliverable: Functional task manager. 

## **Phase 3 — Focus Mode** 

Build: 

- Toggle switch 

- Blocking engine 

- Redirect page 

Deliverable: Website blocker system. 

## **Phase 4 — Settings** 

Build: 

- Name settings 

- Wallpaper upload 

- Block list management 

Deliverable: Fully functional settings page. 

9 

## **Phase 5 — Reflection + Streaks** 

Build: 

- Reflection modal 

- Save journal entries 

- Streak engine 

- History system 

Deliverable: Daily reflection system. 

## **UI/UX Requirements** 

## **Layout** 

Top: 

- Greeting 

Center: 

- Clock 

- Daily focus 

Bottom Left: 

- Tasks 

Bottom Right: 

- Focus toggle • Settings icon 

Top Right: 

Popup: 

- Reflection modal 

## **Design Style** 

Use: 

- Glassmorphism 

- Soft blur cards 

10 

- White text 

- Smooth transitions 

- Minimal icons 

- Fullscreen aesthetic 

## **Performance Requirements** 

- New tab loads under 500ms 

- No external APIs 

- Fully local storage 

- Smooth transitions 

- Minimal CPU usage 

## **Edge Cases** 

## **Date Changes** 

If date changes while browser open: Reset focus. 

## **Missing Wallpaper** 

Fallback to default image. 

## **Empty Reflection** 

Allow skip. 

## **Focus Mode Without Daily Focus** 

Show generic focus message. 

## **Future Enhancements** 

Not part of MVP: 

- Pomodoro timer 

- Ambient sounds 

- Calendar sync 

- Notes widget 

11 

- Focus analytics 

- Weekly reports 

- Quote of the day 

- Wallpaper rotation 

## **Success Metrics** 

Track: 

- Daily usage 

- Tasks completed 

- Focus streak length 

- Number of blocked attempts 

- Reflection consistency 

## **Final Deliverable** 

A production-ready Chrome extension with: 

- Custom new tab dashboard 

- Daily focus system 

- Task manager 

- Focus mode blocker 

- Settings management 

- Daily reflection journal 

- Streak tracking 

Priority: Clean architecture, modular code, and smooth UX. 

12 

