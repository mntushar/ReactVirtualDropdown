'use client'

// import { SelectItem, SelectorRequest, VirtualSelector } from "react-virtual-dropdown";
import { SelectItem, SelectorRequest, VirtualSelector } from "../../../src/virtual_selector";
import styles from "./page.module.css";
import { useCallback, useEffect, useState } from "react";

import '../../../src/virtual_selector.css'

export default function Home() {
  const [selectedData, setSelectedData] = useState<string>('');
  const fetchData = useCallback(async (request: SelectorRequest) => {
    try {
      // const params = new URLSearchParams({
      //       skip: request.startIndex.toString(),
      //       limit: request.limit.toString(),
      //       sortColumn: 'name',
      //       sortOrder: '',
      //       searchKey: request.searchKey ?? '',
      //   });
      // const url = `https://your_url/comments?${params}`;
      const url = `https://jsonplaceholder.typicode.com/comments`;
      const response = await fetch(url);
      if (!response.ok) throw new Error();
      const data = await response.json();
      const itemData = data.map(({ id, body }: { id: number, body: string }) => ({
        id: id.toString(),
        name: body.toString()
      }));

      // const countUrl = `http://your_url/count?searchKey=${request.searchKey}`;
      // const countResponse = await fetch(countUrl);
      // if(!countResponse.ok) throw new Error();
      // const count = await countResponse.json();
      return {
        items: itemData,
        totalCount: 500,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return {
        items: [],
        totalCount: 0,
      };
    }
  }, []);

  const fetchData2 = useCallback(async (request: SelectorRequest) => {
    try {
      // const params = new URLSearchParams({
      //       skip: request.startIndex.toString(),
      //       limit: request.limit.toString(),
      //       sortColumn: 'name',
      //       sortOrder: '',
      //       searchKey: request.searchKey ?? '',
      //   });
      // const url = `https://your_url/comments?${params}`;
      const url = `https://jsonplaceholder.typicode.com/users`;
      const response = await fetch(url);
      if (!response.ok) throw new Error();
      const data = await response.json();
      const itemData = data.map(({ id, name }: { id: number, name: string }) => ({
        id: id.toString(),
        name: name.toString()
      }));

      // const countUrl = `http://your_url/count?searchKey=${request.searchKey}`;
      // const countResponse = await fetch(countUrl);
      // if(!countResponse.ok) throw new Error();
      // const count = await countResponse.json();
      return {
        items: itemData,
        totalCount: 3,
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
    // getSetData()
  }, [])

  return (
    <div className={styles.page}>
      <h1>Alhadmulilah</h1>
      <div style={{ width: "500px" }}>
        <VirtualSelector
          fetchData={fetchData}
          height={200}
          rowHeight={35}
          placeholder="Select Dropdown"
          selectedData={selectedData}
          callBack={getValue} />
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <VirtualSelector
          fetchData={fetchData2}
          height={200}
          rowHeight={35}
          placeholder="Select Dropdown"
          selectedData={selectedData}
          callBack={getValue} />
      </div>
    </div>
  );
}
