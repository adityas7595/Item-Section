import { Collapse } from "antd";
import { useEffect, useState } from "react";

import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

ModuleRegistry.registerModules([AllCommunityModule]);

const { Panel } = Collapse;

interface IRow {
  [key: string]: any;
}

interface ISection {
  key: string;
  label: string;
  items: IRow[];
}

const defaultColDef: ColDef = {
  flex: 1,
};

const ItemSection = () => {
  const [sections, setSections] = useState<ISection[]>([]);
  const [colDefs] = useState<ColDef<IRow>[]>([
    { field: "item_type_display_name", headerName: "Type" },
    { field: "subject", headerName: "Item Name" },
    { field: "quantity", headerName: "QTY" },
    {
      field: "unit_cost",
      headerName: "Unit Cost",
      valueFormatter: (params) =>
        params.value ? (params.value / 100).toFixed(2) : "",
    },
    {
      field: "item_total",
      headerName: "Total",
      valueFormatter: (params) =>
        params.value ? (params.value / 100).toFixed(2) : "",
    },
    {
      field: "assignee_name",
      headerName: "Assign To",
    },
    {
      field: "cost_code_name",
      headerName: "Cost Code",
      valueFormatter: (params) => (params.value ? params.value : ""),
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("app/data/item.json");
        const data = await response.json();
        console.log(data.data.sections);

        // Assuming data.data.sections is an array of section objects
        const formattedSections = data.data.sections.map(
          (section: any, index: number) => ({
            key: String(index + 1),
            label: `${section.section_name} - Total: $${
              section.section_total / 100
            }`,
            items: section.items,
          })
        );

        setSections(formattedSections);
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };

    fetchData();
  }, []);

  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  return (
    <div>
      <Collapse defaultActiveKey={["1"]} onChange={onChange}>
        {sections.map((section) => (
          <Panel header={section.label} key={section.key}>
            <div style={{ width: "100%", height: "300px" }}>
              <AgGridReact
                rowData={section.items}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
              />
            </div>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default ItemSection;
