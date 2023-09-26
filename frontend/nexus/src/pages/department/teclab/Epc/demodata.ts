/* ! LIST OF THINGS TO IMPLEMENT
- color the groups
- Fixed(static) column widths, depending on data-type and name
- column lines  
- save options to LS, upon "save view" click
*/

const columnSettings = {
  sortable: true,
  filter: true,
  resizable: true
}


const columnDefinitions = [
  {
    headerName: 'group-1',
    children:
      [
        { headerName: "column-1", field: "column-1" },
        { headerName: "h-column-2", field: "column-2" },
        { headerName: "column-3", field: "column-3" }
      ]
  },
  {
    headerName: 'group-2',
    children:
      [
        { headerName: "h-column-4", field: "column-4" },
        { headerName: "column-5", field: "column-5" },
        { headerName: "column-6", field: "column-6" }
      ]
  },
]

const gridOptions = {
  columnDefs: columnDefinitions,
  defaultColDef: columnSettings
}


const rowData = [
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
  {
    "column-1": "c1-val",
    "column-2": "c2-val",
    "column-3": "c3-val",
    "column-4": "c4-val",
    "column-5": "c5-val",
    "column-6": "c6-val",
  },
]


export { columnDefinitions, rowData, gridOptions }
