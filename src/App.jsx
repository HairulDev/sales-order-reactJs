import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/reducers";

import Home from "./pages/Home";
import CreateSalesOrder from "./pages/CreateSalesOrder";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateSalesOrder />} />
            <Route path="/create/:id" element={<CreateSalesOrder />} />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;
