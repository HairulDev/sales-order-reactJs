import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import convertToRupiah from "../utils/formatCurrency";
import {
  createSalesOrder,
  getSalesOrder,
  updateSalesOrder,
} from "../store/actions/salesOrder";
import Button from "../components/atoms/Button";
import Pagination from "../components/atoms/Pagination";
import Modal from "../components/atoms/Modal";
import Icon from "../components/atoms/Icon";

const CreateSalesOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const initialsSalesOrder = {
    Number_Order: "",
    Date: "",
    Customer: "",
    Address: "",
    Items: [],
  };
  const [salesOrder, setSalesOrder] = useState(initialsSalesOrder);
  const [newItem, setNewItem] = useState(null);
  const [isExpandInput, setIsExpandInput] = useState(true);
  const [isExpandDetails, setIsExpandDetails] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgModal, setImgModal] = useState(false);
  const [textModal, setTextModal] = useState("");
  const [isButton, setIsButton] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = Number(import.meta.env.VITE_APP_LIMIT);

  const totalPage = Math.ceil(salesOrder?.Items?.length / limit);

  // Pagination handlers
  const handlePageChange = (page) => setCurrentPage(page);
  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPage);
  const handleNextPage = () => {
    if (currentPage < totalPage) setCurrentPage(currentPage + 1);
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Data for the current page
  const startIndex = (currentPage - 1) * limit;
  const currentData = salesOrder?.Items.slice(startIndex, startIndex + limit);

  const closeModal = () => {
    setIsModalOpen(false);
    setDeleteIndex(null);
    setIsButton(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteIndex !== null) {
      deleteItem(deleteIndex);
      setDeleteIndex(null);
      closeModal();
    }
  };

  const handleDeleteClick = (index) => {
    setIsButton(true);
    setTextModal("Do you want to Delete ?");
    setImgModal("/images/icons/question-mark.png");
    setIsModalOpen(true);
    setDeleteIndex(index);
  };

  useEffect(() => {
    if (id) {
      dispatch(
        getSalesOrder(id, (response) => {
          const { number_Order, date, customer, address } = response.data.data;
          setSalesOrder({
            Number_Order: number_Order,
            Date: date,
            Customer: customer,
            Address: address,
            Items: JSON.parse(localStorage.getItem("salesOrderItems")),
          });
        })
      );
    }
  }, [id, dispatch]);

  useEffect(() => {
    const savedItems =
      JSON.parse(localStorage.getItem("salesOrderItems")) || [];
    setSalesOrder((prev) => ({ ...prev, Items: savedItems }));
  }, []);

  const toggleExpand = () => {
    setIsExpandInput(!isExpandInput);
  };

  const toggleExpandDetails = () => {
    setIsExpandDetails(!isExpandDetails);
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    if ((name === "Qty" && value < 0) || (name === "Price" && value < 0)) {
      setNewItem((prevItem) => ({
        ...prevItem,
        [name]: 0,
      }));
    } else {
      setNewItem((prevItem) => ({
        ...prevItem,
        [name]: value,
      }));
    }
  };

  const addItemRow = () => {
    setNewItem({ Item_Name: "", Qty: "", Price: "" });
  };

  const saveNewItem = () => {
    if (newItem && newItem.Item_Name && newItem.Qty && newItem.Price) {
      const newItemData = {
        ...newItem,
        Qty: Number(newItem.Qty),
        Price: Number(newItem.Price),
        total: Number(newItem.Qty) * Number(newItem.Price),
      };

      const updatedItems = [...salesOrder.Items, newItemData];
      setSalesOrder((prev) => ({
        ...prev,
        Items: updatedItems,
      }));

      localStorage.setItem("salesOrderItems", JSON.stringify(updatedItems));
      setNewItem(null);
    } else {
      alert("Please fill in all fields before saving.");
    }
  };

  const deleteItem = (index) => {
    const updatedItems = salesOrder.Items.filter((_, i) => i !== index);
    setSalesOrder((prev) => ({
      ...prev,
      Items: updatedItems,
    }));
    localStorage.setItem("salesOrderItems", JSON.stringify(updatedItems));
  };

  const submitCreate = () => {
    if (id) {
      dispatch(
        updateSalesOrder(
          id,
          salesOrder,
          (res) => {
            setSalesOrder(initialsSalesOrder);
            localStorage.removeItem("salesOrderItems");
            setIsModalOpen(true);
            setImgModal("/images/icons/success.png");
            setTextModal("Process Successfully");
          },
          (error) => {
            setIsModalOpen(true);
            setTextModal("Process Failed");
            setImgModal("/images/icons/error.png");
          }
        )
      );
    } else {
      dispatch(
        createSalesOrder(
          salesOrder,
          (res) => {
            <Modal show={isModalOpen} onClose={closeModal} />;
            setSalesOrder(initialsSalesOrder);
            localStorage.removeItem("salesOrderItems");
            setIsModalOpen(true);
            setTextModal("Process Successfully");
            setImgModal("/images/icons/success.png");
          },
          (error) => {
            setIsModalOpen(true);
            setTextModal("Process Failed");
            setImgModal("/images/icons/error.png");
          }
        )
      );
    }
  };

  return (
    <div className="bg-[#79A5D2]">
      <h3 className="p-4 pl-10 text-xl font-bold bg-gradient-to-r from-[#126ABD] to-[#010F33] text-white">
        {id ? "EDIT" : "ADD NEW"} - SALES ORDER
      </h3>

      {/* Sales Order Information */}
      <div className=" text-black shadow-md  min-h-screen mt-2">
        <div
          onClick={toggleExpand}
          className="flex justify-center items-center bg-[#032A5C] text-lg font-semibold text-white px-3 py-1 cursor-pointer "
        >
          Sales Order Information
          {isExpandInput ? (
            <img
              src="/images/icons/arrow-down.png"
              alt="Expand Icon"
              className="w-6 h-6 ml-2"
            />
          ) : (
            <img
              src="/images/icons/arrow-up.png"
              alt="Collapse Icon"
              className="w-6 h-6 ml-2"
            />
          )}
        </div>

        {isExpandInput && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-4 mr-4 sm:ml-20 sm:mr-20 mt-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="text-sm w-full mb-1 sm:mb-0">
                Sales Order Number <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Input Here"
                className="w-full flex-grow p-2 mr-20 rounded-md border-2 border-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={salesOrder.Number_Order}
                onChange={(e) =>
                  setSalesOrder({ ...salesOrder, Number_Order: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="text-sm w-full mb-1 sm:mb-0">
                Customer <span style={{ color: "red" }}>*</span>
              </label>
              <select
                className="w-full flex-grow p-2 mr-20 rounded-md border-2 border-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={salesOrder.Customer}
                onChange={(e) =>
                  setSalesOrder({ ...salesOrder, Customer: e.target.value })
                }
                required
              >
                <option>Select One</option>
                <option value="PROFES">PROFES</option>
                <option value="TITAN">TITAN</option>
                <option value="DIPS">DIPS</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="text-sm w-full ">
                Order Date <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="date"
                className="w-full flex-grow p-2 mr-20 rounded-md border-2 border-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={salesOrder.Date.toString().split("T")[0]}
                onChange={(e) =>
                  setSalesOrder({ ...salesOrder, Date: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full text-sm ">Address</label>
              <textarea
                placeholder="Input Here"
                className="w-full flex-grow p-2 mr-20 rounded-md border-2 border-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={salesOrder.Address}
                onChange={(e) =>
                  setSalesOrder({ ...salesOrder, Address: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {/*  Detail Item Information*/}
        <div
          onClick={toggleExpandDetails}
          className="flex justify-center items-center bg-[#032A5C] text-lg font-semibold text-white px-3 py-1 cursor-pointer mt-8"
        >
          Detail Item Information
          {isExpandDetails ? (
            <img
              src="/images/icons/arrow-down.png"
              alt="Expand Icon"
              className="w-6 h-6 ml-2"
            />
          ) : (
            <img
              src="/images/icons/arrow-up.png"
              alt="Collapse Icon"
              className="w-6 h-6 ml-2"
            />
          )}
        </div>

        {isExpandDetails && (
          <div className="px-5">
            <Button
              onClick={addItemRow}
              className="bg-[#880743] text-white rounded-md my-3"
            >
              Add Item
            </Button>

            <table className="w-full bg-white text-black rounded-md shadow-md">
              <thead>
                <tr className="bg-[#032A5C] text-white text-center">
                  <td className="p-0 border-r border-[#969da5]">No</td>
                  <td className="p-0 border-r border-[#969da5]">Action</td>
                  <td className="p-2 border-r border-[#969da5]">Item Name</td>
                  <td className="p-2 border-r border-[#969da5]">Qty</td>
                  <td className="p-2 border-r border-[#969da5]">Price</td>
                  <td className="p-2 border-r border-[#969da5]">Total</td>
                </tr>
              </thead>
              <tbody>
                {currentData?.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                  >
                    <td className="p-0 text-center border-r border-b border-[#DEE9F4]">
                      {index + 1 + (currentPage - 1) * limit}
                    </td>
                    <td className="p-0 text-center border-r border-b border-[#DEE9F4]">
                      <Icon
                        onClick={() => handleDeleteClick(index)}
                        className=""
                      >
                        <img
                          src="/images/icons/trash.png"
                          alt="Delete Icon"
                          className="w-6 h-6"
                        />
                      </Icon>
                    </td>
                    <td className="p-2 text-center border-r border-b border-[#DEE9F4] ">
                      {item.Item_Name}
                    </td>
                    <td className="p-2 text-center border-r border-b border-[#DEE9F4] ">
                      {convertToRupiah(item.Qty)}
                    </td>
                    <td className="p-2 text-center border-r border-b border-[#DEE9F4] ">
                      {convertToRupiah(item.Price)}
                    </td>
                    <td className="p-2 text-center border-r border-b border-[#DEE9F4] ">
                      {convertToRupiah(item.total)}
                    </td>
                  </tr>
                ))}
                {newItem && (
                  <tr className="bg-gray-100">
                    <td className="p-0 text-center border-r border-b border-[#DEE9F4]"></td>
                    <td className="p-0 text-center border-r border-b border-[#DEE9F4]">
                      <Icon
                        onClick={saveNewItem}
                        className="text-green-600 hover:text-green-800"
                      >
                        <img
                          src="/images/icons/save.png"
                          alt="Save Icon"
                          className="w-6 h-6"
                        />
                      </Icon>
                    </td>
                    <td className="p-2 text-center border-r border-b border-[#DEE9F4]">
                      <input
                        type="text"
                        placeholder="Item Name"
                        className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newItem.Item_Name || ""}
                        onChange={handleNewItemChange}
                        name="Item_Name"
                      />
                    </td>
                    <td className="p-2 w-10 text-center border-r border-b border-[#DEE9F4]">
                      <input
                        type="number"
                        placeholder="Qty"
                        className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newItem.Qty || 0}
                        onChange={handleNewItemChange}
                        name="Qty"
                      />
                    </td>
                    <td className="p-2 text-center border-r border-b border-[#DEE9F4]">
                      <input
                        type="number"
                        placeholder="Price"
                        className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newItem.Price || 0}
                        onChange={handleNewItemChange}
                        name="Price"
                      />
                    </td>
                    <td className="p-2 text-center border-r border-b border-[#DEE9F4]">
                      {newItem.Qty && newItem.Price
                        ? convertToRupiah(newItem.Qty * newItem.Price)
                        : 0}
                    </td>
                  </tr>
                )}
                <tr>
                  <td
                    colSpan="6"
                    className="text-right font-semibold border-t border-b"
                  >
                    <span>Total Item &nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;</span>
                    <span className="pr-10">
                      {!localStorage.getItem("salesOrderItems")
                        ? 0
                        : JSON.parse(localStorage.getItem("salesOrderItems"))
                            .length}
                    </span>
                    <span>Total Amount &nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;</span>
                    <span className="pr-10">
                      {(() => {
                        const items =
                          JSON.parse(localStorage.getItem("salesOrderItems")) ||
                          [];
                        const totalAmount = items.reduce(
                          (acc, item) => acc + item.total,
                          0
                        );
                        return convertToRupiah(totalAmount);
                      })()}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td colSpan="6" className="p-4 text-center bg-[#F1F1F1]"></td>
                </tr>
                <tr>
                  <td colSpan={6}>
                    <Pagination
                      count={
                        JSON.parse(localStorage.getItem("salesOrderItems"))
                          ?.length
                      }
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
              </tbody>
            </table>

            <div className="flex justify-center mt-4">
              <Button
                onClick={submitCreate}
                className="bg-[#880743] text-white px-4 py-2 rounded-md my-4 mr-5"
              >
                Save
              </Button>
              <Button
                className="bg-[#032A5C] text-white px-4 py-2 rounded-md my-4"
                to="/"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
      <Modal
        show={isModalOpen}
        onClose={closeModal}
        text={textModal}
        img={imgModal}
        onConfirm={handleDeleteConfirm}
        isButton={isButton}
      ></Modal>
    </div>
  );
};

export default CreateSalesOrder;
