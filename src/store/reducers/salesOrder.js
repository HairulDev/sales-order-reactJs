import {
  CREATE,
  FETCH,
  FETCH_ALL,
  UPDATE,
} from "../../constants/actionTypes";

const initialState = {
  fetchApi: true,
  dataSalesOrders: [],
  dataSalesOrder: {},
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE:
      return {
        ...state,
      };
    case FETCH:
      return {
        ...state,
        dataSalesOrder: action.payload,
      };
    case FETCH_ALL:
      return {
        ...state,
        dataSalesOrders: action.payload,
      };
    case UPDATE:
      return {
        ...state,
      };
    default:
      return state;
  }
};
export default userReducer;
