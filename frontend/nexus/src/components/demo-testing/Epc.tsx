import { useState } from "react";

import MainLayout from "@/templates/MainLayout";
import "./Epc.css"


function Epc() {

  const [rowData1] = useState([
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxster", price: 72000 }
  ]);

  const [columnDefs1] = useState([
    { field: 'make' },
    { field: 'model' },
    { field: 'price' }
  ]);


  return (
    <MainLayout>
    </MainLayout>
  )
}

export default Epc 