# Chef's Menu Manager – Portfolio of Evidence (Part 3)

## Overview
A Mobile web application for managing a restaurant menu. Built with HTML, CSS and vanilla JavaScript. The Data is persisted in the browser using `localStorage`.

## Features Implemented

### 1. Manage Menu Items 
- **Add** applies new menu items (name, description, course, price)
- **Edit** modify existing menu items – form is pre-filled with current values
- **Update** changes are saved immediately and reflected across the app
- **Delete** confirmation screen option before permanent removal
- All changes update the UI and statistics instantly

### 2. Search and Filter Menu Items
- **Search** by entering in the dish name (live filtering as you type)
- **Filter** by course (Starter / Main Course / Dessert)
- **Clear** search and filter to show all items again
- Results update the displayed list appropriately

### 3. Display Menu Statistics
- Total number of menu items
- Average price of all menu items
- Count of items per course (Starters, Main Courses, Desserts)
- Statistics recalculate automatically after every add / edit / delete

### 4. Enhancements
- Cleaner, more consistent layout and visual hierarchy
- Reusable rendering functions (`createMenuItemCard`, `renderMenuList`)
- Centralised validation and error display
- Meaningful variable and function names
- Improved form validation with clear error messages
- Toast notifications for success and error feedback
- Organised code structure (storage, rendering, CRUD, events)

### 5. User Experience
- Clear navigation between dashboard and all features
- Meaningful success and error messages (toasts)
- Input validation with helpful error text
- Consistent look and feel across all screens
- Empty-state messages when no items match or exist
- Confirmation step before deleting an item

## How to Run
1. Open `App/App/index.html` in a modern web browser

## Default Sample Data
On the first load, the app seeds in three sample items:
- Grilled Chicken (Main Course) – R 120.00
- Caesar Salad (Starter) – R 75.00
- Chocolate Cake (Dessert) – R 65.00

## Change Log (since Part 2)
- Replaced static hard-coded menu items with dynamic JavaScript-driven list
- Added full CRUD (Create, Read, Update, Delete) with localStorage persistence
- Implemented live search by name and filter by course
- Added “Clear Search / Filter” control
- Added live Menu Statistics (total, average price, per-course counts)
- Added form validation with inline error messages
- Added toast notifications for user feedback
- Converted Edit/Delete from static links to functional buttons
- Improved accessibility (labels, aria-live for toasts)
- Refactored into reusable helper functions and a single `app.js` module
- Polished CSS for validation states, empty states, toasts and buttons

## References
- W3Schools. (n.d.). CSS Tutorial.
https://www.w3schools.com/css/ 
- W3Schools. (n.d.). JavaScript Tutorial.
https://www.w3schools.com/js/
- Mozilla Developer Network. (n.d.). JavaScript. MDN Web Docs.
https://developer.mozilla.org/en-US/docs/Web/JavaScript
- Mozilla Developer Network. (n.d.). Window: localStorage property. MDN Web Docs.
https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- W3Schools. (n.d.). Responsive Web Design – Media Queries.
https://www.w3schools.com/css/css_rwd_mediaqueries.asp
- W3Schools. (n.d.). CSS Flexbox.
https://www.w3schools.com/css/css3_flexbox.asp
- W3Schools. (n.d.). JavaScript Array Methods.
https://www.w3schools.com/js/js_array_methods.asp
- W3Schools. (n.d.). HTML Forms.
https://www.w3schools.com/html/html_forms.asp

## Video demonstration
- https://youtu.be/vyj2NiouH8U
