

const ChildComp1 = ({state_piece}) => {

    function handleClick(){}

    return (
        <div>
            <button onClick={handleClick}>toggle state</button>
        </div>
    )
}



const StateTestForm = () => {

    const WholeState = {
        pp1 : false,
        pp2 : "",
        pp3 : 0
    }

    return (
        <div>
            <ChildComp1 state_piece={WholeState.pp1} />
            <ChildComp2 state_piece={WholeState.pp2} />
            <ChildComp3 state_piece={WholeState.pp3} />
        </div>
    );
};

export default StateTestForm;