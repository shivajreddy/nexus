import { ReactNode } from "react";
import "@assets/templates/mainlayoutbody.css"

interface IProps {
  children: ReactNode;
}

function MainLayoutBody({ ...props }: IProps) {

  return (
    <div className="main-layout-body">
      {props.children}
    </div>
  )
}

export default MainLayoutBody