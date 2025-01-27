import { Collapse } from "antd";
import { useCallback, useEffect, useState } from "react";

import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

ModuleRegistry.registerModules([AllCommunityModule]);

const { Panel } = Collapse;

interface IRow {
  [key: string]: any;
}

interface ISection {
  section_id: string;
  section_name: string;
  items: IRow[];
  section_total: number;
  label: string;
}

const defaultColDef: ColDef = {
  flex: 1,
};

const ItemSection = () => {
  const [sections, setSections] = useState<ISection[]>([]);
  const [colDefs] = useState<ColDef<IRow>[]>([
    { field: "item_type_display_name", headerName: "Type" },
    { field: "subject", headerName: "Item Name" },
    { 
      field: "quantity", 
      headerName: "QTY",
      editable: () => true,
      valueGetter: (params) => {
        const { data } = params;
        return data ? data.quantity: 0;
      },
      valueSetter: (params) => {
        if (params && params.node) {
          const quantity = params.newValue;
          const updatedData = { ...params.data, quantity: quantity };
          params.node.setData(updatedData);
          updateSectionTotal(params.node.data ? params.node.data.section_id : "", updatedData.quantity);
          return true;
        }
        return true;
      }
    },
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

  const updateSectionTotal = (sectionId: string, quantity: number) => {
    setSections((prevSections) => {      
      return prevSections.map((section) => {
        if (section.section_id === sectionId) {
          const newTotal = section.items.reduce((total, item) => {
            return (quantity * item.unit_cost);
          }, 0);
          return {
            ...section,
            section_total: newTotal,
            label: `${section.section_name} - Total: $${(newTotal / 100).toFixed(2)}`,
          };
        }
        return section;
      });
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("app/data/item.json");
        const data = await response.json();
        console.log(data.data.sections);

        // Assuming data.data.sections is an array of section objects
        const formattedSections = data.data.sections.map(
          (section: any, index: number) => ({
            section_id: section.section_id,
            section_name: section.section_name,
            items: section.items,
            section_total: section.section_total,
            label: `${section.section_name} - Total: $${(section.section_total / 100).toFixed(2)}`,
          })
        );

        setSections(formattedSections);
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };

    fetchData();
  }, []);

  const onChange = ((key: string | string[]) => {
    console.log(key);
  });  

  return (
    <div>
      <Collapse defaultActiveKey={["1"]} onChange={onChange}>
        {sections.map((section) => (
          <Panel header={section.label} key={section.section_id}>
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