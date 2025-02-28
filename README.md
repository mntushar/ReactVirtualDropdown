# React Virtual Dropdown Component
The VirtualSelector is a virtual scrolling-based selector component designed to optimize data loading and rendering. Instead of loading all data at once, it loads a specific number of items and fetches new data as the user scrolls.

# Props
fetchData (function) - An asynchronous function that fetches data based on startIndex and limit, returning items and totalCount.
height (number) - The maximum height of the component (in pixels).
rowHeight (number) - The height of each item, used for virtual scrolling calculations.
placeholder (string) - Placeholder text displayed in the dropdown.
selectedData (string | object) - Default value for the selected item.
callBack (function) - A callback function triggered when a user selects an item, returning the selected item's data.

# How It Works?
Data Fetching: Fetches new data dynamically based on scrolling using the fetchData function.
Optimized Rendering: Renders only visible items based on rowHeight to improve performance.
User Interaction: Calls the callBack function when a user selects an item, returning the selected data.

# Use Cases
Dropdown lists with a large number of items.
Optimized data loading to enhance user experience.
Fetching paginated data from a server dynamically.
