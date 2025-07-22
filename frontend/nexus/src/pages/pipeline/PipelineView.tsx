import { useState } from "react";
import { Background, Controls, Position, ReactFlow, ConnectionLineType, NodeProps } from "reactflow";
import 'reactflow/dist/style.css'

const initialNodes = [
    {
        id: '1',
        position: { x: 0, y: 0 },
        data: { label: 'RB-5-33 \n Contract' },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        type: "input"
    },
    {
        id: '2',
        position: { x: 300, y: -75 },
        data: { label: 'Addendum 1' },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: {
            backgroundColor: 'lightGreen'
        },
        type: "output"
    },
    {
        id: '3',
        position: { x: 300, y: 0 },
        data: { label: 'Addendum 2' },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: {
            backgroundColor: 'lightGreen'
        }
    },
    {
        id: '4',
        position: { x: 300, y: 75 },
        data: { label: 'Addendum 3' },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: {
            backgroundColor: '#3b9bc4'
        }
    },
    {
        id: '5',
        position: { x: 300, y: 150 },
        data: { label: 'Addendum 4', count: 10 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: {
            backgroundColor: '#db4848'
        }
    }
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', type: ConnectionLineType.Step },
    { id: 'e1-3', source: '1', target: '3', type: ConnectionLineType.Step },
    { id: 'e1-4', source: '1', target: '4', type: ConnectionLineType.Step },
    { id: 'e1-5', source: '1', target: '5', type: ConnectionLineType.Step },
];

type CounterData = {
    initialCount?: number
}

function CounterNode(props: NodeProps<CounterData>) {
    const [count, setCount] = useState(props.data?.initialCount ?? 0);
    return (
        <>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>+</button>
        </>
    )
}

const nodeTypes = {
    counterNode: CounterNode,
}

const PipeLineView = () => {
    return (
        <div>
            <div className="w-100vw h-[calc(100vh-84px)] m-4 border rounded-md bg-default-bg2 shadow-sm p-4">
                <ReactFlow
                    nodeTypes={nodeTypes}
                    nodes={initialNodes} edges={initialEdges}
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    );
};

export default PipeLineView;
