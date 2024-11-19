import UserNotifications from "@/features/notifications/UserNotifications";
import {FaCircleUser} from "react-icons/fa6"
import {NavLink, useNavigate} from "react-router-dom";
import {ReactElement} from "react";
import {
    FaAtlas,
    FaCannabis, FaCog,
    FaDatabase,
    FaDotCircle,
    FaDrawPolygon, FaDungeon, FaExpand, FaFaucet, FaHouseDamage, FaHouseUser, FaLaptopHouse, FaRegBuilding,
    FaRegCircle,
    FaSith,
    FaSteamSquare, FaWallet
} from "react-icons/fa";

import {BsCollection, BsHouses} from "react-icons/bs";
import {PiGraphBold} from "react-icons/pi";
// import {RiHome2Line} from "react-icons/ri";


function Navbar() {
    const navigate = useNavigate();

    interface INavBarItem {
        name: string,
        link: string,
        icon: ReactElement,
        isBeta: boolean
    }

    // + Fetch the items based on user roles
    const HardCodedNavBarItems: INavBarItem[] = [
        {
            name: "Projects",
            link: "/projects",
            icon: <BsHouses size="1.5em"/>,
            isBeta: true,
        },
        {
            name: "PipeLine",
            link: "/pipeline",
            icon: <PiGraphBold size="1.5em"/>,
            isBeta: true,
        },
        {
            name: "EPC",
            link: "/epc",
            icon: <FaRegCircle size={"1.5em"}/>,
            isBeta: true,
        },
        {
            name: "FOSC",
            link: "/fosc",
            icon: <FaExpand size={"1.5em"}/>,
            isBeta: true,
        },
        {
            name: "CORD",
            link: "/core-dashboard",
            icon: <BsCollection size={"1.5em"}/>,
            isBeta: true,
        },
    ]

    const LinkWithToolTip = ({...props}: INavBarItem) => {
        return (
            <div className="px-4">
                <NavLink to={props.link}
                         key={props.name}>

                    <div className="group relative w-max">
                        <p className="px-6">{props.icon}</p>
                        <span
                            className="bg-default-bg1 rounded-md shadow-sm px-2 p-1 pointer-events-none absolute -bottom-9 left-2 w-max opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            {props.name}
                        </span>
                    </div>

                </NavLink>

            </div>
        )
    }

    return (
        <header
            className="sticky top-0 z-50 w-full
            border-b shadow-sm
            bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg
            supports-[backdrop-filter]:bg-background/60"
        >
            <nav className="flex items-center p-2">

                {/* :: Left Area* :: */}
                <div className="flex-none px-6 pr-24">
                    <button className="" onClick={() => navigate('/')}>
                        <p className="font-bold text-2xl m-0 p-0">NEXUS</p>
                    </button>
                </div>

                {/* :: Center Area * :: */}
                <div className="flex-auto nav-menu flex justify-center">

                    {
                        HardCodedNavBarItems.map((item) => (
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

                {/* :: Right Area * :: */}
                <div className="flex-none px-6 flex user-controls">
                    <div className="user-notificationm px-12">
                        <UserNotifications/>
                    </div>
                    <NavLink to="/user" className="user-avatar mr-8">
                        <FaCircleUser size={"1.5em"}/>
                    </NavLink>
                </div>

            </nav>
        </header>
    )
}

export default Navbar