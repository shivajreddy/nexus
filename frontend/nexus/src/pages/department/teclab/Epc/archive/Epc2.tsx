import {AgGridReact} from "ag-grid-react";

import {useEffect, useState} from "react";
import {ColDef, ColGroupDef} from "ag-grid-community";


// interface IRow {
//     community: string;
// }
interface IRow {
    mission: string;
    company: string;
    location: string;
    date: string;
    time: string;
    rocket: string;
    price: number;
    successful: boolean;
}


const Epc2 = () => {

    const [rowData, setRowData] = useState<IRow[]>([]);
    const [colDefs] = useState<ColGroupDef[]>([
        {
            headerName: 'Group A',
            children: [
                {
                    field: 'community',
                    headerName: 'Comm.',
                    width: 250,
                    checkboxSelection: true
                },
                {
                    field: 'company',
                    width: 130,
                },
            ]
        },
        {
            headerName: 'Group B',
            children: [
                {
                    field: 'location',
                    width: 225,
                },
                {
                    field: 'date',
                },
            ]
        },
        {
            headerName: 'Notes',
            children:[
                {
                    field: 'notes'
                }
            ]
        }
    ])

    // Fetch data & update rowData state
    useEffect(() => {
        const getData = async () => {
            const res = await fetch('https://www.ag-grid.com/example-assets/space-mission-data.json');
            const rowData = await res.json();
            console.log(res, rowData)
            /*
            { "mission": "CRS SpX-25",
                "company": "SpaceX",
                "location": "LC-39A, Kennedy Space Center, Florida, USA",
                "date": "2022-07-15",
                "time": "0:44:00",
                "rocket": "Falcon 9 Block 5",
                "price": 12480000,
                "successful": true }
             */
            setRowData(rowData)
        }
        getData();
    }, [])

    return (
        <div className="ag-theme-quartz-dark w-[100vw] h-[100vh]">
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
            />
        </div>
    );
};

export default Epc2;
