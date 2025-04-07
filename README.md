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
