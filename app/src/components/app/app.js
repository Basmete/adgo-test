import React, { Component } from "react";
import "./app.scss";
import Table from "../table";
import FiltersField from "../filters-field";
import Pagination from "../pagination";
import withAPIService from "../hoc/with-APIService";
import { string } from "prop-types";

class App extends Component {
  state = {
    groupBy: "Day",
    groups: [],
    operatingSystems: [],
    browsers: [],
    platforms: [],

    selectedDateFrom: null,
    selectedDateTo: new Date(),

    offset: 0,
    totalItems: 0,

    currentFilter: null,
  };

  onSelectHandler = e => {
    if (!e) return null
    const arrayOfLabels = e.map((item) => {
      return item.label
    })
    this.setState({
      currentFilter: arrayOfLabels
    })
    if (!e.length) {
      this.setState({
        currentFilter: null
      })
    }
  };

  componentDidMount() {
    this.updateItem();
  }

  setDataFromServer = (getter, value) => {
    getter().then(item => {
      this.setState({
        [value]: item
      })
    })
  }

  updateItem() {
    const {
      getGroups,
      getOperatingSystems,
      getBrowsers,
      getPlatforms
    } = this.props; 
    this.setDataFromServer(getGroups, "groups")
    this.setDataFromServer(getBrowsers, "browsers")
    this.setDataFromServer(getOperatingSystems, "operatingSystems")
    this.setDataFromServer(getPlatforms, "platforms")
  }

  onGroupBySelector = e => {
    const value = e.target.value;
    this.setState({
      groupBy: value
    });
  };

  updateState = (stateKey, stateValue) => {
    this.setState({
      [stateKey]: stateValue
    })
  }

  changeOffset = (operation, counter) => {
    if (operation === "+") {
      this.setState({
        offset:  (this.state.offset < counter - 1) ? this.state.offset + 1 : this.state.offset,
      })
    } else if (operation === "-") {
      this.setState({
        offset: (this.state.offset >= 1) ? this.state.offset - 1 : this.state.offset,
      })
    } else if (typeof operation !== string) {
      this.setState({
        offset: operation
      })
    } 
  }

  render() {
    const {
      platforms,
      browsers,
      operatingSystems,
      groups,
      selectedDateFrom,
      selectedDateTo,
      groupBy,
      offset,
      totalItems,
      currentFilter
    } = this.state;
    return (
      <>
        <div className="container">
          <FiltersField
            onSelectHandler={this.onSelectHandler}
            onGroupBy={this.onGroupBySelector}
            platforms={platforms}
            browsers={browsers}
            operatingSystems={operatingSystems}
            groups={groups}
            changeDateFrom={this.updateState}
            changeDateTo={this.updateState}
            selectedDateFrom={selectedDateFrom}
            selectedDateTo={selectedDateTo}
            testFunc={this.testFunc}
            groupBy={groupBy}
          />
          <Table
            groupBy={groupBy}
            groups={groups}
            dateFrom={selectedDateFrom}
            dateTo={selectedDateTo}
            offset={offset}
            changeTotalItems={this.updateState}
            currentFilter={currentFilter}
          />
          <Pagination
            changeOffset={this.changeOffset}
            total={totalItems}
          />
        </div>
      </>
    );
  }
}

const mapMethodsToProps = ({
  getStatistics,
  getGroups,
  getOperatingSystems,
  getBrowsers,
  getPlatforms
}) => {
  return {
    getStatistics,
    getGroups,
    getOperatingSystems,
    getBrowsers,
    getPlatforms
  };
};

export default withAPIService(mapMethodsToProps)(App);
