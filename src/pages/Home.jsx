import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  getSalesOrders,
  getSalesOrdersSearch,
  delSalesOrder, // Import delSalesOrder action
} from "../store/actions/salesOrder";
import { useDispatch } from "react-redux";
import Pagination from "../components/atoms/Pagination";
import Button from "../components/atoms/Button";
import Icon from "../components/atoms/Icon";
import Modal from "../components/atoms/Modal";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [stateDataSalesOrder, setStateDataSalesOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [countData, setCountData] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [keywords, setKeywords] = useState(null);
  const [date, setDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [imgModal, setImgModal] = useState(false);
  const [textModal, setTextModal] = useState("");
  const [isButton, setIsButton] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const limit = Number(import.meta.env.VITE_APP_LIMIT);

  const handleEdit = (id) => {
    navigate(`/create/${id}`);
  };

  useEffect(() => {
    if (isSearchActive) {
      dispatch(
        getSalesOrdersSearch(
          { keywords, date, page: currentPage, limit },
          (res) => {
            setStateDataSalesOrder(res?.data.data);
            setTotalPage(res?.data.totalPage);
            setCountData(res?.data.count);
          },
          (error) => {
            console.log(error);
          }
        )
      );
    } else {
      dispatch(
        getSalesOrders(
          currentPage,
          limit,
          (res) => {
            setStateDataSalesOrder(res?.data.data);
            setTotalPage(res?.data.totalPage);
            setCountData(res?.data.count);
          },
          (error) => {
            console.log(error);
          }
        )
      );
    }
    localStorage.removeItem("salesOrderItems");
  }, [dispatch, currentPage, isSearchActive]);

  const handleSearch = () => {
    if (!keywords || date === null) {
      setTextModal("Please fill in all fields");
      setImgModal("/images/icons/error.png");
      setIsModalOpen(true);
    } else {
      setIsSearchActive(true);
      setCurrentPage(1);
      dispatch(
        getSalesOrdersSearch(
          { keywords, date, page: 1 || currentPage, limit },
          (res) => {
            setStateDataSalesOrder(res?.data.data);
            setTotalPage(res?.data.totalPage);
          },
          (error) => {
            console.log(error);
          }
        )
      );
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsButton(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedOrderId !== null) {
      handleDelete(selectedOrderId);
      setSelectedOrderId(null);
      closeModal();
    }
  };

  const confirmDelete = (id) => {
    setSelectedOrderId(id);
    setIsButton(true);
    setTextModal("Do you want to Delete ?");
    setImgModal("/images/icons/question-mark.png");
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    dispatch(
      delSalesOrder(
        id,
        () => {
          setStateDataSalesOrder((prevOrders) =>
            prevOrders.filter((order) => order.id_Order !== id)
          );
          setIsModalOpen(true);
          setImgModal("/images/icons/success.png");
          setTextModal("Process Successfully");
        },
        (error) => {
          setIsModalOpen(true);
          setIsButton(false);
          setTextModal("Process Failed");
          setImgModal("/images/icons/error.png");
        }
      )
    );
  };

  // Pagination Handlers
  const handlePageChange = (page) => setCurrentPage(page);
  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPage);
  const handleNextPage = () =>
    currentPage < totalPage && setCurrentPage((prev) => prev + 1);
  const handlePreviousPage = () =>
    currentPage > 1 && setCurrentPage((prev) => prev - 1);

  const exportToExcel = () => {
    // Define the data to export based on the current state
    const worksheetData = stateDataSalesOrder.map((order, index) => ({
      No: index + 1 + (currentPage - 1) * limit,
      "Sales Order": order.number_Order,
      "Order Date": new Date(order.date).toLocaleDateString(),
      Customer: order.customer,
    }));

    // Create a worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Orders");

    // Write the Excel file and download it
    XLSX.writeFile(workbook, "SalesOrders.xlsx");
  };

  return (
    <>
      <h3 className="p-4 pl-10 text-xl font-bold bg-gradient-to-r from-[#126ABD] to-[#010F33] text-white">
        SALES ORDER
      </h3>
      <div className="p-6 bg-[#79A5D2] min-h-screen text-black">
        {/* Search Filters */}
        <div className="min-h-[200px] h-auto bg-transparent border-2 border-black p-10 rounded-md">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-sm font-semibold w-full md:w-auto mr-20 ">
                Keywords
              </label>
              <input
                type="text"
                placeholder="Input Here"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="flex-1 p-2 rounded-md border-2 mr-20 border-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              <label className="text-sm font-semibold w-full md:w-auto mr-20">
                Order Date
              </label>
              <input
                placeholder="Pick Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 p-2 mr-20 rounded-md border-2 border-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
          </div>

          <div className="flex justify-end mr-20 mt-4">
            <Button onClick={handleSearch} className="bg-[#032A5C] text-white">
              Search
            </Button>
          </div>
        </div>

        <div className="flex mt-4">
          <Button className="bg-[#880743] mr-4 text-white" to="/create">
            Add New Data
          </Button>
          <Button
            className="bg-[#084165] text-white flex items-center gap-2"
            onClick={exportToExcel}
          >
            <img
              src="/images/icons/excel.png"
              alt="Export"
              className="w-5 h-5"
            />
            Export To Excel
          </Button>
        </div>

        <div className="mt-6">
          <table className="w-full bg-white border border-gray-900 text-black rounded-md shadow-md">
            <thead>
              <tr className="bg-[#032A5C] text-white text-center">
                <td className="p-0 border-r border-[#969da5]">No</td>
                <td className="p-0 border-r border-[#969da5]">Action</td>
                <td className="p-2">Sales Order</td>
                <td className="p-2">Order Date</td>
                <td className="p-2">Customer</td>
              </tr>
            </thead>
            <tbody>
              {stateDataSalesOrder && stateDataSalesOrder.length > 0 ? (
                stateDataSalesOrder.map((order, index) => (
                  <tr
                    key={order.id_Order}
                    className={index % 2 === 0 ? "bg-white" : "bg-[#F1F1F1]"}
                  >
                    <td className="p-0 text-center border-r border-[#DEE9F4]">
                      {index + 1 + (currentPage - 1) * limit}
                    </td>
                    <td className="p-0 text-center border-r border-[#DEE9F4]">
                      <Icon
                        onClick={() => handleEdit(order.id_Order)}
                        className="mr-3"
                      >
                        <img
                          src="/images/icons/pencil.png"
                          alt="Edit Order"
                          className="w-5 h-5"
                        />
                      </Icon>
                      <Icon onClick={() => confirmDelete(order.id_Order)}>
                        <img
                          src="/images/icons/trash.png"
                          alt="Delete Order"
                          className="w-6 h-6"
                        />
                      </Icon>
                    </td>
                    <td className="p-2 text-center">{order.number_Order}</td>
                    <td className="p-2 text-center">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="p-2 text-center">{order.customer}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No sales orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <table className="w-full">
            <tr>
              <td
                colSpan="5"
                className=" border-l border-r border-gray-900 p-4 text-center bg-[#F1F1F1]"
              ></td>
            </tr>
            <tr>
              <td
                colSpan="5"
                className="border-b border-l border-r border-gray-900 text-center bg-[#F1F1F1]"
              >
                <Pagination
                  count={countData}
                  limit={limit}
                  currentPage={currentPage}
                  totalPage={totalPage}
                  onPageChange={handlePageChange}
                  onFirstPage={handleFirstPage}
                  onLastPage={handleLastPage}
                  onNextPage={handleNextPage}
                  onPreviousPage={handlePreviousPage}
                />
              </td>
            </tr>
          </table>
        </div>
      </div>
      <Modal
        show={isModalOpen}
        onClose={closeModal}
        text={textModal}
        img={imgModal}
        onConfirm={handleDeleteConfirm}
        isButton={isButton}
      />
    </>
  );
};

export default Home;
