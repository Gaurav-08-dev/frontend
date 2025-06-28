import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import TableHOC from "@/components/Table";
import type { Column } from "react-table";
import { useMyOrdersQuery } from "../redux/api/orderAPI";
import { type RootState } from "../redux/store";
import { type CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import ProductSkeleton from "@/components/skeletonLoader";

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
};

const column: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Status",
    accessor: "status",
  },

];
const Orders = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { isLoading, data, isError, error } = useMyOrdersQuery(String(user?._id));

  const [rows, setRows] = useState<DataType[]>([
    {
      _id: "1",
      amount: 4000,
      quantity: 1,
      discount: 300,
      status: <span className="text-red-500">Processing</span>,
    },
  ]);
  
  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (data)
      setRows(
        data.orders.map((i) => ({
          _id: i._id || "",
          amount: i.total || 0,
          discount: i.discount || 0,
          quantity: i.orderItems.length || 0,
          status: (
            <span
              className={
                i.status === "Processing"
                  ? "red"
                  : i.status === "Shipped"
                  ? "green"
                  : "purple"
              }
            >
              {i.status}
            </span>
          ),
        }))
      );
  }, [data]);

  const Table = TableHOC<DataType>(
    column,
    rows,
    "bg-white p-8 overflow-auto w-full h-full max-h-[65vh]",
    "Orders",
    rows.length > 6
  )();

  return (
    <div className="max-w-[1367px] w-full mx-auto overflow-auto px-4 relative h-[calc(100vh-6.5rem)]">
      <h1 className="text-2xl font-bold tracking-wide my-4 text-left">
        My Orders
      </h1>
      {isLoading ? <ProductSkeleton count={10} /> : (!data || data?.orders.length === 0)?<div className="absolute top-[40%] left-[50%] text-2xl text-red-500 font-bold">No orders</div> :Table}
    </div>
  );
};

export default Orders;
