import {
  CREATE,
  UPDATE,
  DELETE,
  FETCH,
  FETCH_ALL,
} from "../../constants/actionTypes";

import axios from "axios";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const API = axios.create({ baseURL: `${apiUrl}` });


export const updateSalesOrder =
  (id, formData, successCB, failedCB) => async (dispatch) => {
    API.put(`/api/salesorder/${id}`, formData)
      .then((response) => {
        const res = response.data;
        dispatch({ type: UPDATE, payload: res });
        return successCB && successCB(res);
      })
      .catch((err) => {
        return failedCB && failedCB(err);
      });
  };

export const createSalesOrder =
  (formData, successCB, failedCB) => async (dispatch) => {
    API.post("/api/salesorder", formData)
      .then((response) => {
        const res = response.data;
        dispatch({ type: CREATE, payload: res });
        return successCB && successCB(res);
      })
      .catch((err) => {
        return failedCB && failedCB(err);
      });
  };

export const delSalesOrder =
  (id, successCB, failedCB) => async (dispatch) => {
    API.delete(`/api/salesorder/${id}`)
      .then((response) => {
        const res = response.data;
        dispatch({ type: DELETE, payload: res });
        return successCB && successCB(res);
      })
      .catch((err) => {
        return failedCB && failedCB(err);
      });
  };

export const getSalesOrder = (id, successCB, failedCB) => async (dispatch) => {
  API.get(`/api/salesorder/${id}`)
    .then((response) => {
      const data = response.data;
      dispatch({
        type: FETCH,
        payload: data.data,
      });

      // Manipulate items array and save to localStorage
      const items = data.data.items || [];
      const modifiedItems = items.map(item => ({
        Item_Name: item.item_Name,
        Qty: item.qty,
        Price: item.price,
        total: item.total
      }));
      localStorage.setItem("salesOrderItems", JSON.stringify(modifiedItems));

      return successCB && successCB(response);
    })
    .catch((err) => {
      return failedCB && failedCB(err);
    });
};


export const getSalesOrders = (page, limit, successCB, failedCB) => async (dispatch) => {
  API.get(`/api/salesorder?page=${page}&limit=${limit}`)
    .then((response) => {
      const data = response.data;
      dispatch({
        type: FETCH_ALL,
        payload: data.data,
      });
      return successCB && successCB(response);
    })
    .catch((err) => {
      return failedCB && failedCB(err);
    });
};

export const getSalesOrdersSearch = (searchParams, successCB, failedCB) => async (dispatch) => {
  const { keywords, date, page, limit } = searchParams;
  API.get(`api/salesorder/search?keywords=${keywords}&date=${date}&page=${page}&limit=${limit}`)
    .then((response) => {
      const data = response.data;
      dispatch({
        type: FETCH_ALL,
        payload: data.data,
      });
      return successCB && successCB(response);
    })
    .catch((err) => {
      return failedCB && failedCB(err);
    });
};