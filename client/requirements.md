## Packages
date-fns | Date formatting and manipulation for deadlines and calendar
recharts | Beautiful charts for the progress and analytics dashboard
lucide-react | Academic and productivity icons
react-day-picker | Calendar component for deadline selection
clsx | Utility for constructing className strings
tailwind-merge | Utility for merging tailwind classes

## Notes
- Expects Replit Auth to be active. `useAuth` handles session state.
- Date fields from the API are ISO strings, ensuring they are cast to `Date` objects on the client.
- Using direct `recharts` components for data visualization on the Progress page.
