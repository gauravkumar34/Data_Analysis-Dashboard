import React, { useState } from "react";
import * as XLSX from "xlsx";
import DataTable from "react-data-table-component";
import { OffCanvas, OffCanvasMenu } from "react-offcanvas";
// import ReactFileReader from "react-file-reader";
import "./App.css";
function App() {
  const [columns, setColumns] = useState([]);
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [clickFile, setClickFile] = useState(null);
  const [uploadFileName, setUploadFileName] = useState([]);
  const [data, setData] = useState([]);
  const [checked, setChecked] = useState(false);
  const [checked1, setChecked1] = useState(false);
  const [file, setFile] = useState("");
  // process CSV data
  const processData = (dataString) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );

    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
      );
      if (headers && row.length === headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] === '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj);
        }
      }
    }

    // prepare columns list from headers
    const columns = headers.map((c) => ({
      name: c,
      selector: c,
    }));
    // setData(list);
    // setColumns(columns);
    setData((data) => [...data, list]);
    setColumns((column) => [...column, columns]);
  };

  // handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    // setUploadFileName(...uploadFileName, file.name);
    {
      /* <p onClick={showSideBar}>{uploadFileName}</p> */
    }
    setUploadFileName((searches) => [...searches, file.name]);

    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  };

  // file render in slides
  const renderUploadedFile = () => {
    return (
      <ul>
        {uploadFileName.map((file, index) => {
          return <li onClick={() => showSideBar(index)}>{file}</li>;
        })}
      </ul>
    );
  };

  const showSideBar = (index) => {
    setClickFile(index);
    setIsMenuOpened(!isMenuOpened);
  };

  return (
    <div className="App">
      <div>
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
          <a className="navbar-brand" href="#">
            Data Analysis
          </a>
        </nav>
      </div>
      <div>
        <div className="row">
          <div className="column left">
            <div>
              <h4>1. Select Format</h4>
              <div className="">
                <br />
                <label>
                  <input
                    type="checkbox"
                    onChange={() => setChecked1(!checked1)}
                    checked={checked1}
                  />

                  <strong>MySQL</strong>
                  <br />
                  {checked1 ? (
                    <div>
                      <form>
                        <input type="text" placeholder="username" /> <br />
                        <input type="password" placeholder="password" />
                        <br />
                        <input type="text" placeholder="server" />
                        <br />
                        <button type="submit">submit</button>
                      </form>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <br />
                </label>
              </div>
              <hr></hr>
              <div>
                <form>
                  <label>
                    <input
                      type="checkbox"
                      onChange={() => setChecked(!checked)}
                      checked={checked}
                    />
                    <strong>CSV</strong>
                    {checked ? (
                      <div>
                        <input
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          onChange={handleFileUpload}
                        />
                      </div>
                    ) : (
                      <div></div>
                    )}

                    <br />
                  </label>
                  <br />
                </form>
              </div>
            </div>
          </div>
          <div className="column middle">
            <div>
              <h4>2. Select Source</h4>
              <div className="column text">
                <a>
                  <strong>MySQL</strong>
                </a>
              </div>
              <div className="column text">
                <a>
                  <strong>CSV</strong>
                </a>
                <a>{file.name}</a>
                {renderUploadedFile()}
              </div>
            </div>
          </div>
          <div className="column right">
            <div>
              <h4> Visualizer</h4>
            </div>
          </div>
        </div>
        <OffCanvas
          width={1000}
          transitionDuration={300}
          effect={"parallax"}
          isMenuOpened={isMenuOpened}
          position={"right"}
        >
          <OffCanvasMenu>
            <a href="#" className="closeSideBar" onClick={showSideBar}>
              Close
            </a>
            <DataTable
              pagination
              highlightOnHover
              id="btnLeft"
              columns={columns[clickFile]}
              data={data[clickFile]}
            />
          </OffCanvasMenu>
        </OffCanvas>
      </div>
    </div>
  );
}

export default App;
