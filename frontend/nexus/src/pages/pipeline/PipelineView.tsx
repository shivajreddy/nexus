import {Background, Controls, Position, ReactFlow, ConnectionLineType} from "reactflow";
import 'reactflow/dist/style.css'

const initialNodes = [
    {
        id: '1',
        position: {x: 0, y: 0},
        data: {label: 'RB-5-33 \n Contract'},
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        type: "input"
    },
    {
        id: '2',
        position: {x: 300, y: -150},
        data: {label: 'Addendum 1'},
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: {
            backgroundColor: 'orange'
        }
    },
    {
        id: '3',
        position: {x: 300, y: 0},
        data: {label: 'Addendum 2'},
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: {
            backgroundColor: 'lightGreen'
        }
    },
    {
        id: '4',
        position: {x: 300, y: 150},
        data: {label: 'Addendum 3'},
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: {
            backgroundColor: 'lightGreen'
        }
    },
];

const initialEdges = [
    {id: 'e1-2', source: '1', target: '2', type: ConnectionLineType.Step},
    {id: 'e1-3', source: '1', target: '3', type: ConnectionLineType.Step},
    {id: 'e1-4', source: '1', target: '4', type: ConnectionLineType.Step},
];

const PipeLineView = () => {
    return (
        <div>
            <div className="w-100vw h-[calc(100vh-84px)] m-4 border rounded-md bg-default-bg2 shadow-sm p-4">
                <ReactFlow nodes={initialNodes} edges={initialEdges}>
                    <Background/>
                    <Controls/>
                </ReactFlow>
            </div>

        </div>
    );
};

export default PipeLineView;
