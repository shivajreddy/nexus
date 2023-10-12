import "@assets/templates/sidebar.css"
import {TbStatusChange, TbBulb} from "react-icons/tb"
import {FaRegCircle} from "react-icons/fa"
import {RiTodoLine} from "react-icons/ri"
import {GoHome} from "react-icons/go"
import eagleLogoIcon from "@assets/images/Eagle Logo Only B&W.png"
import tecLogo from "@assets/images/TEC_Black_Logo.png"
import {NavLink} from "react-router-dom"
import {Badge} from "@/components/ui/badge"

import {useAppSelector} from "@/redux/hooks"
import {ReactElement, useState} from "react"

interface ISidebarItem {
    name: string,
    link: string,
    icon: ReactElement,
    isBeta: boolean
}

const SideBarItems: ISidebarItem[] = [
    {
        name: "Home",
        link: "/",
        icon: <GoHome size={"1.5em"}/>,
        isBeta: false,
    },
    {
        name: "EPC",
        link: "/epc",
        icon: <FaRegCircle size={"22px"}/>,
        isBeta: true,
    },
    {
        name: "PipeLine",
        link: "/pipeline",
        icon: <TbStatusChange size={"1.5em"}/>,
        isBeta: true,
    },
    {
        name: "Tasks",
        link: "/tasks",
        icon: <RiTodoLine size={"1.5em"}/>,
        isBeta: true,
    },
    {
        name: "Updates",
        link: "/updates",
        icon: <TbBulb size={"1.6em"}/>,
        isBeta: false,
    },
]


const LinkWithToolTip = ({...item}: ISidebarItem) => {
    return (
        <div className="sidebar-content-item">
            <div className="sidebar-content-item-container ">
                <NavLink to={item.link}
                         key={item.name}>
                    <p className="tooltip">{item.name}</p>
                    <div className="item-icon">{item.icon}</div>
                    <div className="item-name">
                        {item.name}
                        {item.isBeta &&
                          <Badge className="badge" variant="secondaryInverted">Beta</Badge>
                        }
                    </div>
                </NavLink>
            </div>
        </div>
    )
}


function SideBar() {

    const sidebarStatusState = useAppSelector((state) => state.sidebarStatus.isOpen)
    const sidebarStatus = sidebarStatusState ? "open" : "closed"

    const [sidebarVisible, setSidebarVisible] = useState(true);

    function hideSidebar() {
        console.log("hi");
        document.querySelector('.sidebar')
        document.querySelector('.sidebar').style.transform =
            document.querySelector('.sidebar').style.transform === 'translateX(0)' ? 'translateX(-100%)' : 'translateX(0)';
    }

    const sidebarClass = `sidebar-${sidebarVisible ? 'open' : 'close'}`


    return (
        <aside className={`sidebar ${sidebarStatus} bg-card`}>

            <div className="sidebar-header"></div>
            <div className="sidebar-content">
                {
                    SideBarItems.map((item) => (
                        <LinkWithToolTip
                            key={item.name}
                            name={item.name}
                            link={item.link}
                            icon={item.icon}
                            isBeta={item.isBeta}
                            // sidebarIsOpen={sidebarStatusState}
                        />
                    ))
                }
            </div>
            <div className="sidebar-footer">
                <div id="sidebar-footer-tec-logo" className="">
                    <img src={tecLogo} alt=''/>
                </div>
                <div id="sidebar-footer-eagle-logo" className="">
                    <img src={eagleLogoIcon} alt=''/>
                </div>
            </div>

        </aside>
    )
}

export default SideBar