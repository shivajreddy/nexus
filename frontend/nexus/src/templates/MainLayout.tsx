import Navbar from "@/templates/Navbar"
import SideBar from "@templates/SideBar"
import MainLayoutBody from "@templates/MainLayoutBody"
import { ReactNode, useEffect } from "react";
import "@assets/templates/mainlayout.css"
import { useDispatch, useSelector } from "react-redux";
import { selectTheme, updateTheme } from "@/features/themes/themeSlice";
import { IThemeOptions } from "@/types";
import { GetFromLS, SaveToLS } from "@/hooks";

interface IProps {
  children: ReactNode;
}

function MainLayout({ children }: IProps) {

  // * THEMING -------------------------------------------
  const theme = useSelector(selectTheme);
  const dispatch = useDispatch();

  // $ Update store with user-prefered theme, else set default theme in state & LS
  useEffect(() => {
    const defaultProjectTheme: IThemeOptions = { value: "nexus-theme-light" };
    const currentLocalThemeValue = GetFromLS("nexus-theme");

    //$  There is no theme-pref local storage
    if (currentLocalThemeValue === null || currentLocalThemeValue === undefined) {
      SaveToLS("nexus-theme", defaultProjectTheme.value)
    }
    else {
      dispatch(updateTheme(currentLocalThemeValue))
    }
  }, [theme])

  // $ Apply Theme to DOM
  useEffect(() => {
    document.body.classList.remove('nexus-theme-light', 'nexus-theme-dark', 'nexus-theme-warm');
    document.body.classList.add(`${theme.value}`);
  }, [theme])
  // * THEMING -------------------------------------------


  return (
    <div className="main-layout">

      <Navbar ></Navbar>

      <div className="main-layout-container">
        <SideBar />
        <MainLayoutBody >
          {children}
        </MainLayoutBody>
      </div>

    </div>
  )
}

export default MainLayout