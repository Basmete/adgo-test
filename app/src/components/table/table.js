import React, { useEffect, useReducer } from "react";
import TableRow from "../table-row";
import withAPIService from "../hoc/with-APIService";
import generateKey from "../../utils/key-generator";
import formatDate from "../../utils/format-date-function";
import TableHeader from "../table-header";
import Spinner from "../spinner";

const Table = ({
  getStatistics,
  groupBy = "Day",
  getGroups,
  dateFrom,
  dateTo,
  offset,
  changeTotalItems,
  currentFilter
}) => {

  const initialState = {
    total: 1,
    data: [],
    from: dateFrom,
    to: dateTo,
    loading: false
  };
  
  const [state, dispatch] = useReducer(tableReducer, initialState);

  function tableReducer(state, action) {
    switch (action.type) {
      case "total": 
        return {
          ...state,
          total: action.payload
        };
      case "data":
        return {
          ...state,
          data: action.payload
        };
      case "from":
        return {
          ...state,
          from: action.payload
        };
      case "to":
        return {
          ...state,
          to: action.payload
        };
      case "loading":
        return {
          ...state,
          loading: action.payload
        };
      default:
        return state;
    }
  }

  
  const { from, to, total, data, loading } = state;
  

  useEffect(() => {
    dispatch({ type: "from", payload: dateFrom });
    dispatch({ type: "to", payload: dateTo });
    const fetchData = async () => {
      dispatch({ type: "loading", payload: true });
      const params = await getGroups();
      const param = params.find(item => item.label === groupBy);
      const result = await getStatistics(
        `${param.value || "platform"}`,
        `${formatDate(from)}`,
        `${formatDate(to)}`,
        25,
        offset
      );
      dispatch({ type: "data", payload: result.rows });
      dispatch({ type: "total", payload: result.count });
      changeTotalItems(total);
      dispatch({ type: "loading", payload: false });
    };

    fetchData();
  }, [
    getStatistics,
    groupBy,
    dateFrom,
    dateTo,
    from,
    to,
    offset,
    total,
    changeTotalItems,
    currentFilter,
    getGroups
  ]);

  const rows = data.map((item, index) => {
    const key = generateKey(index);
    if (currentFilter === "..." || !currentFilter) {
      return <TableRow key={key} {...item} />;
    }

    if (currentFilter.indexOf(item.platform) !== -1 || !currentFilter) {
      return <TableRow key={key} {...item} />;
    } else if (
      currentFilter.indexOf(item.operatingSystem) !== -1 ||
      !currentFilter
    ) {
      return <TableRow key={key} {...item} />;
    } else if (currentFilter.indexOf(item.browser) !== -1 || !currentFilter) {
      return <TableRow key={key} {...item} />;
    }
  });

  if (loading) {
    return <Spinner />;
  }

  return <TableHeader groupBy={groupBy} rows={rows} />;
};

const mapMethodsToProps = ({ getStatistics, getGroups }) => {
  return {
    getStatistics,
    getGroups
  };
};

export default withAPIService(mapMethodsToProps)(Table);
