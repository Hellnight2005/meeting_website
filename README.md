This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# ✅ 6/4/25 Progress Summary – Time Picker Component (React + Tailwind CSS)

## 🛠 Features Implemented

- Developed a `TimePicker` component using React with Tailwind CSS.
- Allowed time slot generation from **9 AM to 9 PM**.
- Included toggle functionality between **30 minutes** and **1 hour** intervals.
- Used `toLocaleTimeString()` with `Asia/Kolkata` timezone for proper IST formatting.
- Highlighted the selected time with styling feedback.
- Displayed the selected time at the bottom.

## 📱 Responsive Design

- Made the component responsive using **Tailwind's grid system**:
  - Mobile: `grid-cols-2` (2 slots per row for better spacing)
  - Tablet: `sm:grid-cols-3`
  - Medium: `md:grid-cols-4`
  - Large: `lg:grid-cols-5`
  - Extra Large: `xl:grid-cols-6`
- Ensured **layout doesn't break** inside the component while expanding on mobile screens.
- Adjusted the layout without changing inner content appearance.

## 🎯 Outcome

- TimePicker is now fully responsive.
- Maintains clean layout on tablets/desktops.
- Expands efficiently on mobile to improve usability.

---

---

# ✅ 7/4/25 Progress Summary : Event Page

## Overview

We developed a dynamic and engaging Event Page for managing and viewing meetings. The page includes categorized meetings, interactive UI components, and personalization based on meeting context.

## Features Implemented

### 1. **Create Event Page**

- Built a responsive and animated Event Dashboard.
- Allows users to create new meetings with a step-by-step modal form.
- Added fields for name, business type, date, and time.
- UI inspired by modern design platforms (like streaming services).

### 2. **Meeting List**

- Displayed meetings in categories like _Upcoming_ and _Lineup_.
- Added **search bar** to quickly filter meetings by title or name.
- Added **sorting** functionality (by date, name, etc.).
- Optimized layout using responsive design principles.

### 3. **Meeting Card**

- Each meeting displayed as a styled card.
- Background color dynamically changes based on time (e.g., red for overdue, green for future).
- Included **tags** like _Today_, _Tomorrow_, _Upcoming_ for better identification.
- Integrated profile image logic:
  - If the meeting is with a **client**, show professional image.
  - If the meeting is with an **inmate**, use a separate graphic/icon.

## Visual Enhancements

- Subtle animations for page transitions using `GSAP`.
- Button styling for accessibility and clarity.
- Icon support for labels and tags for a polished UX.

## Next Suggestions

- Add real-time status updates.
- Include filters by tags.
- Hook up to a backend for persistence.

# 8/4/25

## 🗂️ Fake Appointments Data

### ✅ Tasks Completed:

- Created a dataset `fakeAppointments` with mock appointment objects.
- Each appointment contains:
  - `id`
  - `user_name`
  - `title`
  - `selectDay`
  - `selectTime` (e.g., 10:00 AM, 10:30 AM — no odd times like 04:15)
  - `slot` (duration in minutes)
  - `type` (converted all `"lineup"` entries to `"upcoming"`)
  - `user_role` (`"Admin"` or `"user"`)

### 🔁 Time Management

- Adjusted `selectTime` to ensure **no overlapping time slots**.
- Appointment times are clean, readable, and aligned with common intervals (like 10:00 AM, 10:30 AM, etc.).

---

## 🆕 Feature Added: Time Slot Blocking in Time Picker

### 🕒 Description:

- Implemented a feature to **block already booked time slots** in the time picker.
- The booked time slots are extracted from the `fakeAppointments` data.

### 💡 How it works:

- When a user selects a day, the app checks all existing appointments for that day.
- Time picker disables any time slots that are already booked or partially overlapping.
- Ensures **no double-booking** and improves user experience.

---

### ✅ Final Notes:

- Maintained realistic user names, titles, and roles.
- Data is now ready for frontend display and backend logic (e.g., validation, booking).
- Fully compatible with integration into scheduling or calendar components.
