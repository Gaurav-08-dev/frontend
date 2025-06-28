// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";

import {
  type Column,
  usePagination,
  useSortBy,
  useTable,
  type TableOptions,
} from "react-table";

function TableHOC<T extends object>(
  columns: Column<T>[],
  data: T[],
  containerClassname: string,
  heading: string,
  showPagination: boolean = false
) {
  return function HOC() {
    const options: TableOptions<T> = {
      columns,
      data,
      initialState: {
        pageSize: 6,
      },
    };

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      prepareRow,
      nextPage,
      pageCount,
      state,
      previousPage,
      canNextPage,
      canPreviousPage,
    } = useTable<T>(options, useSortBy, usePagination);

    const { pageIndex } = state as typeof state & { pageIndex: number };

    return (
      <div className="bg-white p-8 overflow-auto w-full h-full max-h-[65vh]">
        <h2 className="my-4 text-center">{heading}</h2>

        <table className="border-collapse w-full" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr className="" {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    className="p-2 text-left align-middle text-[#0000009e] text-[1.1rem] font-normal py-8 px-4"
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render("Header")}
                    {column.isSorted && (
                      <span>
                        {" "}
                        {column.isSortedDesc ? (
                          <AiOutlineSortDescending />
                        ) : (
                          <AiOutlineSortAscending />
                        )}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);

              return (
                <tr className="shadow-sm" {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td className="p-4" {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        {showPagination && (
          <div className="flex flex-row justify-center items-center gap-4 p-8">
            <button
              type="button"
              title="Previous"
              disabled={!canPreviousPage}
              onClick={previousPage}
              className="px-4 py-2 rounded-[10px] bg-[rgba(0,115,255)] text-white cursor-pointer disabled:bg-[rgba(0,115,255,0.1)] disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span>{`${pageIndex + 1} of ${pageCount}`}</span>
            <button
              className="px-4 py-2 rounded-[10px] bg-[rgba(0,115,255)] text-white cursor-pointer disabled:bg-[rgba(0,115,255,0.1)] disabled:cursor-not-allowed"
              type="button"
              title="Next"
              disabled={!canNextPage}
              onClick={nextPage}
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };
}

export default TableHOC;
