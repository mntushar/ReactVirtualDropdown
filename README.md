# React Virtual Dropdown Component
The VirtualSelector is a virtual scrolling-based selector component designed to optimize data loading and rendering. Instead of loading all data at once, it loads a specific number of items and fetches new data as the user scrolls.

#### Props
- **fetchData (function)** - An asynchronous function that fetches data based on startIndex and limit, returning items and totalCount.
- **height (number)** - The maximum height of the component (in pixels).
- **rowHeight (number)** - The height of each item, used for virtual scrolling calculations.
- **placeholder (string)** - Placeholder text displayed in the dropdown.
- **selectedData (string | object)** - Default value for the selected item.
- **callBack (function)** - A callback function triggered when a user selects an item, returning the selected item's data.

#### How It Works?
- **Data Fetching:** Fetches new data dynamically based on scrolling using the fetchData function.
- **Optimized Rendering:** Renders only visible items based on rowHeight to improve performance.
- **User Interaction:** Calls the callBack function when a user selects an item, returning the selected data.

#### Use Cases
- Dropdown lists with a large number of items.
- Optimized data loading to enhance user experience.
- Fetching paginated data from a server dynamically.

# Getting started
### Install `react-virtual-dropdown` using npm.

```npm i react-virtual-dropdown```

### Setup
```
'use client'

import { SelectItem, SelectorRequest, VirtualSelector } from "react-virtual-dropdown";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [selectedData, setSelectedData] = useState<string>('');
  const fetchData = useCallback(async (request: SelectorRequest) => {
    try {
      const params = new URLSearchParams({
            skip: request.startIndex.toString(),
            limit: request.limit.toString(),
            sortColumn: 'name',
            sortOrder: '',
            searchKey: request.searchKey ?? '',
        });
      const url = `https://your_url/comments?${params}`;
      const response = await fetch(url);
      if(!response.ok) throw new Error();
      const data = await response.json();
      const itemData = data.map(({ id, email }: { id: number, email: number }) => ({
        id: id.toString(), 
        name: email.toString() 
      }));
  
      const countUrl = `http://your_url/count?searchKey=${request.searchKey}`;
      const countResponse = await fetch(countUrl);
      if(!countResponse.ok) throw new Error();
      const count = await countResponse.json();
      return {
        items: itemData,
        totalCount: count,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return {
        items: [],
        totalCount: 0,
      };
    }
  }, []);

  const getValue = (data: SelectItem) => {
    console.log(data.id, data.name);
  };

  const getSetData = async () => {
    const countUrl = `http://your_url/your-data-id`;
      const countResponse = await fetch(countUrl);
      if(!countResponse.ok) throw new Error();
      const data = await countResponse.json();
      setSelectedData(data);
  };

  useEffect(() => {
      getSetData()
  }, [])

  return (
    <div className={styles.page}>
      <h1>Alhadmulilah</h1>
      <div style={{width: "500px"}}>
      <VirtualSelector
          fetchData={fetchData}
          height={400}
          rowHeight={35}
          placeholder="Select Dropdown"
          selectedData={selectedData}
          callBack={getValue} />
      </div>
    </div>
  );
}
```

### Output
<img src="https://github.com/mntushar/ReactVirtualDropdown/blob/main/OutputImages/Screenshot%202025-03-05%20170327.png" alt="output Image one" width="200"/>
