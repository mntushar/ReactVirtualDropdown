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
      const data = await requestHandler.getList(
        request.startIndex,
        request.limit,
        'name',
        null,
        request.searchKey
      );
      const itemData = data.map(({ id, name }: SelectItem) => ({ id, name }))
      const count = await requestHandler.getCount(request.searchKey);
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
