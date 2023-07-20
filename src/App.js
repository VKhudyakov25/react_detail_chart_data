import "devextreme/dist/css/dx.dark.css";
import "./App.css";

import DataSource from "devextreme/data/data_source";
import ODataStore from "devextreme/data/odata/store";
import * as _ from "underscore";

import { Chart, DataGrid, Popup } from "devextreme-react";
import { Series, Tooltip } from "devextreme-react/chart";
import { useState, useMemo, useRef } from "react";
import { Column } from "devextreme-react/data-grid";

function App() {
  const [categoryList, setCategoryList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const popup = useRef(null);
  let dataSource = useMemo(() => {
    let data = new DataSource({
      store: new ODataStore({
        url: "https://services.odata.org/V3/Northwind/Northwind.svc/Products_by_Categories",
      }),
      paginate: false,
      postProcess: (results) => {
        let arr = [];
        let grp = _.groupBy(results, "CategoryName");
        for (let obj in grp) {
          arr.push({
            categoryName: obj,
            productList: grp[obj],
            value: grp[obj].length,
          });
        }
        setCategoryList(arr);
        return arr;
      },
    });
    return data;
  }, []);

  const eventHandler = (e) => {
    let argument = e.target.argument;
    let category = categoryList.filter(
      (item) => item.categoryName === argument
    );
    setProducts(category[0].productList);
    popup.current.instance.option("title", `Product List in ${argument}`);
    setVisible(!visible);
  };

  const renderTooltipContent = (tooltip) => {
    return tooltip.valueText;
  };

  const renderContent = () => {
    return (
      <div>
        <DataGrid dataSource={products} showBorders={true}>
          <Column dataField="ProductName" />
          <Column dataField="QuantityPerUnit" />
          <Column dataField="UnitsInStock" />
        </DataGrid>
      </div>
    );
  };

  const toggle = () => {
    setVisible(!visible);
  };

  return (
    <div className="App">
      <Chart
        dataSource={dataSource}
        title="Categories Chart"
        onPointClick={eventHandler}
      >
        <Series
          valueField="value"
          argumentField="categoryName"
          type="bar"
          name="Product Count"
        />
        <Tooltip enabled={true} contentRender={renderTooltipContent} />
      </Chart>
      <Popup
        hideOnOutsideClick={true}
        showTitle={true}
        visible={visible}
        contentRender={() => renderContent(toggle)}
        ref={popup}
        onHiding={toggle}
      />
    </div>
  );
}

export default App;
