# 📋 Ramaul Village Portal — Feature Documentation

A complete breakdown of every feature in the portal, organized by category.

---

## Table of Contents

- [🏠 Homepage](#-homepage)
- [📰 News](#-news)
- [📅 Events](#-events)
- [📢 Notices](#-notices)
- [📄 Documents](#-documents)
- [🖼️ Gallery](#-gallery)
- [💰 Budget Transparency](#-budget-transparency)
- [🎁 Donations](#-donations)
- [🏛️ Ward Representatives](#-ward-representatives)
- [🗳️ Elections 2082](#-elections-2082)
- [📊 Village Statistics](#-village-statistics)
- [💬 Community Discussions](#-community-discussions)
- [⚠️ Community Issues](#-community-issues)
- [📞 Contact & Inquiries](#-contact--inquiries)
- [🚨 Emergency Contacts](#-emergency-contacts)
- [❓ FAQ](#-faq)
- [ℹ️ About](#-about)
- [🔐 Authentication](#-authentication)
- [🛡️ Admin Dashboard](#-admin-dashboard)
- [🌍 Internationalization](#-internationalization)
- [🌗 Dark Mode](#-dark-mode)
- [🔍 SEO Optimization](#-seo-optimization)
- [♿ Accessibility & Performance](#-accessibility--performance)

---

## 🏠 Homepage

The landing page provides a comprehensive overview of village life and quick access to all services.

- **Hero Section** — Full-screen hero with admin-configurable background image and overlay text. Smooth fade-in animation prevents image flash during loading.
- **Announcement Banner** — Scrolling marquee displaying active announcements with priority-based styling (normal, high, urgent). Auto-hides expired announcements.
- **Statistics Section** — Animated counters showing key village metrics (population, households, area, wards) pulled from admin-configurable settings.
- **News & Events Preview** — Latest 3 news articles and upcoming events in a card grid with "View All" navigation.
- **Budget Overview** — Visual pie chart summarizing current fiscal year allocations with spending percentages.
- **Notices Preview** — Recent official notices with date badges and category tags.
- **Documents Preview** — Quick access to the latest public documents with download counts.
- **Ward Section** — Representative profiles with photos, positions, and contact details.
- **CTA Section** — Call-to-action encouraging community participation with links to key pages.

---

## 📰 News

A news feed showcasing village updates, announcements, and stories.

- **Article Listing** — Cards with featured images, titles, summaries, dates, and view counts.
- **Category Filtering** — Filter by category (general, development, culture, etc.).
- **Detail Modal** — Click any article to read the full content in an overlay dialog.
- **Bilingual Content** — Articles display in English or Nepali based on the active language.
- **Admin Publishing** — Only published articles (`is_published = true`) are visible to the public.
- **View Tracking** — Automatic view count increment on article open.

---

## 📅 Events

Upcoming and past village events with registration capability.

- **Event Cards** — Display event date, location, description, and attendee count.
- **Event Registration** — Public registration form (name, phone, tole/area) without requiring authentication.
- **Registration Counter** — Live count of registered attendees with optional max capacity.
- **Category Tags** — Events categorized (festival, meeting, sports, cultural, etc.).
- **Contact Person** — Displays the organizer's contact information.
- **Admin Management** — Create, edit, and deactivate events from the admin panel.

---

## 📢 Notices

Official notices and circulars from the village administration.

- **Notice Cards** — Title, published date, category badge, and content preview.
- **Image & File Attachments** — Notices can include images and downloadable PDF/document files.
- **Search & Filter** — Search by title and filter by category.
- **Detail View** — Full notice content in an expanded modal with image display.
- **Bilingual Support** — Nepali translations for titles and content.

---

## 📄 Documents

A digital repository for public village records and forms.

- **Document Library** — Browse documents with title, description, file type icons, and size.
- **Download Counter** — Tracks how many times each document has been downloaded.
- **Category Filtering** — Filter documents by type (report, form, minutes, plan, etc.).
- **Search** — Full-text search across document titles.
- **Direct Download** — One-click download links for all files.

---

## 🖼️ Gallery

A community photo gallery celebrating village life.

- **Photo Grid** — Responsive masonry-style grid with hover effects.
- **Category Tabs** — Filter photos by event, landscape, culture, development, etc.
- **Community Uploads** — Authenticated users can upload photos (pending admin approval).
- **Admin Approval** — Photos require admin approval before public display.
- **Featured Photos** — Admins can mark photos as featured for prominence.

---

## 💰 Budget Transparency

Full transparency into village financial planning and spending.

- **Pie Chart** — Visual breakdown of budget allocation across categories using Recharts.
- **Bar Chart** — Allocated vs. spent comparison per category.
- **Category Details** — Detailed table with category name, allocated amount, spent amount, and utilization percentage.
- **Financial Year Filter** — View budgets for different fiscal years.
- **Transaction History** — Individual transaction records with dates, amounts, and descriptions.
- **Bilingual Categories** — Budget category names in both English and Nepali.

---

## 🎁 Donations

Support village development through transparent donation campaigns.

- **Campaign Listings** — Active campaigns with goals, progress bars, and deadlines.
- **QR Code Payments** — Each campaign displays a QR code for direct bank transfers.
- **Donation Form** — Submit donation details (name, amount, purpose, payment reference).
- **Anonymous Donations** — Option to donate anonymously.
- **Progress Tracking** — Real-time collected vs. goal amount with percentage indicators.
- **Public Donor List** — Completed donations displayed (respecting anonymity preferences).
- **Admin Campaign Management** — Create/edit campaigns, upload QR images, set goals.

---

## 🏛️ Ward Representatives

Profiles of elected village leaders and officials.

- **Representative Cards** — Photo, name, position, ward number, and contact details.
- **Bio & Achievements** — Detailed biography and accomplishments for each representative.
- **Bilingual Profiles** — Names, positions, and bios in English and Nepali.
- **Active/Inactive Toggle** — Admin can mark representatives as active or inactive.
- **Admin CRUD** — Full create, read, update, delete management from the admin panel.

---

## 🗳️ Elections 2082

Comprehensive local election results dashboard.

- **Interactive Results** — Seat-by-seat results with candidate details and vote counts.
- **Vote Share Visualization** — Bar charts and percentage indicators for each candidate.
- **Position Filtering** — Filter results by position (Mayor, Deputy Mayor, Ward Chair, etc.).
- **Search Candidates** — Search across all candidates by name or party.
- **Data-Driven** — Results loaded from a JSON data file (`election2082.json`).
- **Bilingual Interface** — Full Nepali translation for all election terminology.

---

## 📊 Village Statistics

A comprehensive data dashboard with demographic and development indicators.

- **Population Data** — Total population, gender ratio, age distribution.
- **Household Stats** — Number of households, average family size.
- **Geography** — Area, wards, elevation, climate data.
- **Education** — Literacy rates, school enrollment, educational institutions.
- **Health** — Health facilities, immunization rates, vital statistics.
- **Infrastructure** — Roads, electricity access, water supply coverage.
- **Economy** — Occupation distribution, agricultural data, remittance statistics.
- **Export to PDF** — Download statistics as a formatted report.
- **Tabbed Navigation** — Organized into logical sections for easy browsing.

---

## 💬 Community Discussions

A forum-style platform for village residents to discuss local topics.

- **Discussion Threads** — Create threads with title, description, and category.
- **Nested Replies (Threading)** — Reply to any comment to create multi-level threads. Reply chains indent visually and can be expanded/collapsed.
- **Category Tabs** — Filter discussions by topic (general, development, culture, governance).
- **Real-time Updates** — Discussions and replies update in real-time via Supabase Realtime.
- **Author Avatars** — Color-coded avatar initials for each participant.
- **Reply Counts** — Display total reply count per discussion.
- **Status Management** — Admins can close discussions.

---

## ⚠️ Community Issues

A civic issue tracking system for reporting and resolving local problems.

- **Issue Reporting** — Authenticated users can report issues with title, description, category, priority, location, and photo evidence.
- **Priority Levels** — Low, medium, high, and urgent with color-coded badges.
- **Status Tracking** — Open → In Progress → Resolved → Closed workflow.
- **Like System** — Users can upvote issues to signal community priority.
- **Comments** — Threaded comments on each issue for community discussion.
- **Image Uploads** — Photo evidence uploaded to Supabase Storage.
- **Admin Assignment** — Admins can assign issues and update status.
  Note:-some features are pending,working on that.
---

## 📞 Contact & Inquiries

A dual-channel contact system for reaching village administration.

- **Contact Form** — Name, email, phone, subject, category, and message fields with validation.
- **Supabase Storage** — All submissions saved to the `support_requests` table for admin review.
- **Formspree Integration** — Optional email forwarding via Formspree. Form ID and enabled/disabled status are admin-configurable through Site Settings (no code changes needed).
- **Admin Inquiry Panel** — View all inquiries with full details, status tracking, and internal admin notes.
- **Contact Info** — Office address, phone, email, and working hours displayed alongside the form.

---

## 🚨 Emergency Contacts

Quick access to critical emergency services and numbers.

- **Categorized Contacts** — Police, fire, ambulance, hospital, disaster management, etc.
- **Click-to-Call** — Direct phone links for immediate calling on mobile.
- **Visual Cards** — Color-coded cards with icons for each emergency category.
- **Animated Entry** — Staggered fade-in animations using Framer Motion.
- **Always Accessible** — Linked from the footer for quick access from any page.

---

## ❓ FAQ

Frequently asked questions about portal services.

- **Accordion Interface** — Expandable Q&A sections using shadcn/ui Accordion.
- **Common Topics** — Covers issue reporting, donations, documents, events, and account management.
- **GSAP Animations** — Smooth entrance animations on page load.

---

## ℹ️ About

Information about Ramaul Village and the portal's purpose.

- **Village Overview** — History, geography, culture, and demographics.
- **Admin-Configurable** — About content editable from the admin Manage Content section.
- **Hero Banner** — Visual header with village imagery.
- **Quick Links** — Navigation cards to key sections of the portal.
- **Statistics Integration** — Key village stats embedded in the about page.

---

## 🔐 Authentication

Secure user authentication powered by Supabase Auth.

- **Email/Password Signup** — Standard registration with email verification.
- **Login/Logout** — Secure session management with persistent sessions.
- **Auto Profile Creation** — A profile and default 'user' role are automatically created on signup via a database trigger.
- **Role-Based Access** — Three roles: `admin`, `moderator`, `user`.
- **Protected Routes** — Admin dashboard accessible only to users with the `admin` role.
- **Session Persistence** — Sessions persist across page reloads via localStorage.

---

## 🛡️ Admin Dashboard

A comprehensive content management system for village administrators.

- **Collapsible Sidebar** — Navigation between admin sections with icons and labels.
- **News Management** — Create, edit, publish/unpublish, and delete news articles with image uploads.
- **Events Management** — Full CRUD for events with registration viewer.
- **Ward Representatives** — Manage representative profiles with photo uploads.
- **Inquiry Management** — View contact form submissions, add admin notes, track status.
- **Analytics Dashboard** — Visual charts showing content statistics via Recharts.
- **Manage Content** — Configure site-wide settings including:
  - Hero section (title, subtitle, background image)
  - About page content
  - Village statistics
  - Formspree integration (form ID, enable/disable)
- **Badge Notifications** — Real-time badge counts for pending items.

---

## 🌍 Internationalization

Full bilingual support for inclusive access.

- **Languages** — English (default) and Nepali (नेपाली).
- **Language Toggle** — Accessible from header and mobile menu.
- **Translation Files** — Comprehensive `en.json` and `ne.json` locale files.
- **Dynamic Content** — Database fields with `_ne` suffixes for Nepali content.
- **Auto-Detection** — `i18next-browser-languagedetector` for automatic language selection.

---

## 🌗 Dark Mode

System-aware theming with manual override.

- **Light/Dark Toggle** — Theme toggle in header and mobile menu.
- **System Preference** — Respects OS-level dark mode preference.
- **CSS Variables** — All colors defined as HSL tokens in `:root` and `.dark`.
- **Consistent Theming** — Every component uses semantic design tokens, never hardcoded colors.

---

## 🔍 SEO Optimization

Production-ready search engine optimization.

- **react-helmet-async** — Dynamic `<title>`, `<meta>`, and OG tags per page.
- **JSON-LD** — GovernmentOrganization structured data on the homepage.
- **Sitemap** — `public/sitemap.xml` with all 16 public pages, priorities, and frequencies.
- **Robots.txt** — Crawler directives with admin/auth exclusions and sitemap link.
- **Canonical URLs** — Prevents duplicate content issues.
- **Open Graph & Twitter Cards** — Rich social media previews for every page.
- **Semantic HTML** — Proper use of `<header>`, `<main>`, `<section>`, `<footer>`, and heading hierarchy.

---

## ♿ Accessibility & Performance

- **Responsive Design** — Mobile-first layouts that adapt from 320px to 1920px+.
- **Keyboard Navigation** — All interactive elements are keyboard-accessible.
- **ARIA Attributes** — Proper labeling for screen readers.
- **Lazy Loading** — Images load on demand for faster page loads.
- **Smooth Scrolling** — Lenis-powered buttery smooth scroll experience.
- **Animations** — Framer Motion and GSAP with reduced-motion media query support.
- **Code Splitting** — Vite handles automatic bundle optimization.
- **Image Optimization** — Assets served from Supabase CDN.

---

<p align="center">
  <sub>Last updated: February 2026</sub>
</p>
