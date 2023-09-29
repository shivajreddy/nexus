import {useAppDispatch, useAppSelector} from "@/redux/hooks"
import {toggleSidebar_action} from "@/features/sidebar/sidebarSlice";


const Demo2 = () => {
    const sidebarStatus = useAppSelector((state) => state.sidebarStatus.isOpen);

    const dispatch = useAppDispatch();

    return (
        <div>
            <p>Demo2</p>
            <p>Status:
                {sidebarStatus && "yes"}
                {!sidebarStatus && "no"}
            </p>

            <button onClick={() => dispatch(toggleSidebar_action())}> toggle</button>

        </div>
    )
}

export default Demo2