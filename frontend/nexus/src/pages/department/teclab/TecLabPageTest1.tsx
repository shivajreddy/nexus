import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import {BASE_URL, EAGLE_DATA_ENDPOINT} from "@/services/api";


function TecLabPageTest1() {

    const axiosPrivate = useAxiosPrivate();

    async function getData() {
        // const response = await axios.get(BASE_URL + EAGLE_DATA_ENDPOINT + "/users");
        const response = await axiosPrivate.get(BASE_URL + EAGLE_DATA_ENDPOINT + "/users");
        console.log("response @/users=", response)
    }


    return (
        <div>
            <p>TecLabPageTest1</p>
            <br/>
            <button onClick={getData}>getData</button>
        </div>
    )
}


export default TecLabPageTest1