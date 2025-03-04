'use client'

// import { SelectItem, SelectorRequest, VirtualSelector } from "react-virtual-dropdown";
import { SelectItem, SelectorRequest, VirtualSelector } from "../../../src/virtual_selector";
import styles from "./page.module.css";
import { useCallback } from "react";

// import 'react-virtual-dropdown/dist/index.css';
import '../../../src/virtual_selector.css';

export default function Home() {
  const selectedData = '';
  const fetchData = useCallback(async (request: SelectorRequest) => {
    try {
      // const params = new URLSearchParams({
      //       skip: request.startIndex.toString(),
      //       limit: request.limit.toString(),
      //       sortColumn: 'name,
      //       sortOrder: '',
      //       searchKey: searchKey,
      //   });
      const url = `https://jsonplaceholder.typicode.com/comments`;
      const response = await fetch(url);
      if(!response.ok) throw new Error();
      const data = await response.json();
      const itemData = data.map(({ id, email }: { id: number, email: number }) => ({
        id: id.toString(), 
        name: email.toString() 
      }));
  
      // const url = `http://localhost:3000}/count?${searchKey}`;
      // const response = await fetch(url);
      // if(!response.ok) throw new Error();
      // const count = await response.json();
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

  const getValue = (data: SelectItem) => {
    console.log(data.id, data.name);
  };

  return (
    <div className={styles.page}>
      <h1>Alhadmulilah</h1>
      <div style={{width: "200"}}>
      <VirtualSelector
          fetchData={fetchData}
          height={200}
          rowHeight={35}
          placeholder="Select Category"
          selectedData={selectedData}
          callBack={getValue} />
      </div>
    </div>
  );
}
