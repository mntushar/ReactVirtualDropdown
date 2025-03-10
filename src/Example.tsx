'use client'

import React from "react";
import { useCallback, useEffect, useState } from "react";
import { SelectItem, SelectorRequest, VirtualSelector } from "react-virtual-dropdown";

export default function Dashboard() {
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
      if (!response.ok) throw new Error();
      const data = await response.json();
      const itemData = data.map(({ id, email }: { id: number, email: number }) => ({
        id: id.toString(),
        name: email.toString()
      }));

      const countUrl = `http://your_url/count?searchKey=${request.searchKey}`;
      const countResponse = await fetch(countUrl);
      if (!countResponse.ok) throw new Error();
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
    if (!countResponse.ok) throw new Error();
    const data = await countResponse.json();
    setSelectedData(data);
  };

  useEffect(() => {
    getSetData()
  }, [])

  return (
    <div>
      <h1>Alhadmulilah</h1>
      <div style={{ width: "500px" }}>
        <VirtualSelector
          fetchData={fetchData}
          height={200}
          rowHeight={35}
          placeholder="Select Dropdown"
          selectedData={selectedData}
          callBack={getValue} />
      </div>
    </div>
  );
}
