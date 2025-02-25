'use client'

import { ToastHandler } from "@/app/_shared/component/toast";
import { SelectItem, SelectorRequest, VirtualSelector } from "@/app/_shared/component/virtual_selector";
import Category from "@/request_handlers/category";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useMemo } from "react";

export default function Dashboard() {
  const route = useRouter();
  const selectedData = '';
  const requestHandler = useMemo(() => new Category(route), [route]);

  const fetchData = useCallback(async (request: SelectorRequest) => {
    try {
      const params = new URLSearchParams({
            skip: request.startIndex.toString(),
            limit: request.limit.toString(),
            sortColumn: 'name,
            sortOrder: '',
            searchKey: searchKey,
        });
      const url = `${http://localhost:3000}/list?${params}`;
      const response = await fetch(url);
      if(!response.ok) throw new Error();
      const data = await response.json();
      const itemData = data.map(({ id, name }: SelectItem) => ({ id, name }))
  
      const url = `${http://localhost:3000}/count?${searchKey}`;
      const response = await fetch(url);
      if(!response.ok) throw new Error();
      const count = await response.json();
      return {
        items: itemData,
        totalCount: count,
      };
    } catch (error) {
      ToastHandler.Error((error as Error).message);
      console.error("Error fetching data:", error);
      return {
        items: [],
        totalCount: 0,
      };
    }
  }, [requestHandler]);

  const getValue = (data: SelectItem) => {
    console.log(data.id, data.name);
  };

  return (
    <Fragment>
      <div className="m-3">
        <h1>Dashboard</h1>

        <VirtualSelector
          fetchData={fetchData}
          height={200}
          rowHeight={35}
          placeholder="Select Category"
          selectedData={selectedData}
          callBack={getValue} />
      </div>
    </Fragment>
  );
}
