import { useCallback, useEffect, useRef, useState } from "react";
import "./virtual_selector.css";

export interface SelectItem {
  id: string;
  name: string;
}

interface FetchDataResult {
  items: SelectItem[];
  totalCount: number;
}

type FetchDataFunction = (request: {
  startIndex: number;
  limit: number;
  searchKey: string | null;
}) => Promise<FetchDataResult>;

type CallBackFunction = (request: SelectItem) => void;

interface SelectorProps {
  fetchData: FetchDataFunction;
  height: number;
  rowHeight: number;
  placeholder?: string;
  selectedData?: string;
  callBack: CallBackFunction;
}

export interface SelectorRequest {
  startIndex: number;
  limit: number;
  searchKey: string | null;
}

const VirtualSelector = ({ fetchData, height, rowHeight, placeholder, selectedData, callBack }: SelectorProps) => {
  const buffer = 10;
  const [data, setData] = useState<Map<number, SelectItem>>(new Map());
  const [isLoding, setIsLoding] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState(0);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 30 });
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef({
    requestId: 0,
  });
  const scrollTimeoutRef = useRef<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null | undefined>(selectedData);
  const [searchKeyValue, setSearchKeyValue] = useState<string | null>(null);
  const [searchTimerId, setSearchTimerId] = useState<number>(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Update selectedOption when selectedData changes
  useEffect(() => {
    setSelectedOption(selectedData);
  }, [selectedData]);

  // Data fetching
  const fetchDataForRange = useCallback(async (start: number, end: number) => {
    const currentRequestId = Date.now();
    requestRef.current.requestId = currentRequestId;
    try {
      const count = end - start + 1;
      const result = await fetchData({
        startIndex: start,
        limit: count,
        searchKey: searchKeyValue,
      });

      if (requestRef.current.requestId !== currentRequestId) {
        return;
      }

      setData(prev => {
        const newMap = new Map(prev);
        result.items.forEach((item, index) => {
          newMap.set(start + index, item);
        });
        return newMap;
      });

      setTotalCount(prevTotalCount => {
        if (result.totalCount !== prevTotalCount) {
          return result.totalCount;
        }
        return prevTotalCount;
      });

      setIsLoding(false);

      setVisibleRange(prev => {
        const newEnd = Math.min(prev.end, result.totalCount - 1);
        if (newEnd !== prev.end) {
          return { ...prev, end: newEnd };
        }
        return prev;
      });
    } catch (error) {
      setIsLoding(false);
      console.error("Failed to fetch data:", error);
    }
  }, [fetchData, searchKeyValue]);

  // Scroll handler
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      const { scrollTop, clientHeight } = containerRef.current!;
      const start = Math.floor(scrollTop / rowHeight) - buffer;
      const end = Math.ceil((scrollTop + clientHeight) / rowHeight) + buffer;

      setVisibleRange({
        start: Math.max(0, start),
        end: Math.min(totalCount - 1, end),
      });
    }, 200);
  }, [rowHeight, buffer, totalCount]);

  // Fetch data when visible range changes
  useEffect(() => {
    if (!isOpen) return;
    const { start, end } = visibleRange;
    if (start >= 0 && end >= start) {
      fetchDataForRange(start, end);
    }
  }, [visibleRange, fetchDataForRange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const activeOption = async (isActive: boolean) => {
    setIsOpen(isActive);

    if (isActive) {
      setIsLoding(true);
      const start = 0;
      const end = Math.ceil(height / rowHeight) + buffer;

      setVisibleRange({ start, end });
    }
  }

  const handleOptionClick = (id: string, name: string) => {
    setSelectedOption(name);
    callBack({ id: id, name: name });
    setSearchKeyValue('');
    setIsOpen(false);
  };

  const searchOption = async (event: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(searchTimerId);

    const timeoutId = window.setTimeout(() => {
      setSearchKeyValue(event.target.value);
      const start = 0;
      const end = Math.ceil(height / rowHeight) + buffer;
      setData(new Map());
      setVisibleRange({ start, end });
    }, 300)
    setSearchTimerId(timeoutId);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const lodingRenderOption = () => {
    return (
      <li
        key={'lodingRenderOption'}
        className="option-li-loding spinner-container"
        style={{
          position: "absolute",
          top: 25,
          height: ((totalCount * rowHeight) - 50),
          width: "100%",
        }}
      >
        <div className="spinner"></div>
      </li>
    );
  };

  const renderOption = (index: number) => {
    const optionData = data.get(index);
    const { end } = visibleRange;
    if (searchKeyValue && !optionData && totalCount < end) {
      return null;
    }
    return (
      <li
        key={index}
        className="option-li"
        style={{
          position: "absolute",
          top: index * rowHeight,
          height: rowHeight,
          width: "100%",
          cursor: "pointer"
        }}
        onClick={() => handleOptionClick(optionData?.id || '', optionData?.name || '')}
      >
        {optionData ? optionData.name : '...'}
      </li>
    );
  };

  return (
    <div ref={wrapperRef} className="virtual-selector">
      <div className="selected-option">
        <div className="selected-value" onClick={() => activeOption(!isOpen)}>
          {selectedOption ? selectedOption : placeholder || 'Select an option'}
        </div>
        <div className="selected-icon" style={{ display: 'flex', alignItems: 'center' }}>
          {selectedOption ? (
            <span onClick={() => handleOptionClick('', '')} style={{ marginRight: '3px', marginLeft: '5px' }}>
              <div className="close-icon"></div>
            </span>
          ) : (
            <div style={{ marginRight: '3px', visibility: 'hidden' }}></div>
          )}
          <span onClick={() => activeOption(!isOpen)}>
            <div className="dropdown-icon"></div>
          </span>
        </div>
      </div>
      {isOpen && (
        <div ref={containerRef} className="select-list"
          style={{ width: "100%", overflowY: "auto", height: height }}
          onScroll={handleScroll}>
          <div className="search-input">
            <input className="virtual-selector-search" placeholder="Search..." onChange={((e) => searchOption(e))} />
          </div>
          <ul
            className="options-list"
            style={{ position: "relative", height: totalCount * rowHeight }}
          >
            {!isLoding ? (
              Array.from(
                { length: visibleRange.end - visibleRange.start + 1 },
                (_, i) => visibleRange.start + i
              ).map(renderOption)
            ) : (
              lodingRenderOption()
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

VirtualSelector.displayName = "VirtualSelector";

export { VirtualSelector };

