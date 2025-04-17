import React, { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react';

// Pre-defined color palette
const COLOR_PALETTE = [
    '#4299E1', // blue
    '#48BB78', // green
    '#F56565', // red
    '#ED8936', // orange
    '#9F7AEA', // purple
    '#38B2AC', // teal
    '#F6AD55', // light orange
    '#FC8181', // light red
    '#68D391', // light green
    '#63B3ED', // light blue
    '#D6BCFA', // light purple
    '#4FD1C5', // light teal
    '#2C5282', // dark blue
    '#276749', // dark green
    '#9B2C2C', // dark red
    '#9C4221', // dark orange
    '#553C9A', // dark purple
    '#285E61', // dark teal
];

type State = {
    colorAssignments: Record<string, string>;
    availableColors: string[];
};

type Action = {
    type: 'ASSIGN_COLORS';
    payload: string[];
};

const initialState: State = {
    colorAssignments: {},
    availableColors: [...COLOR_PALETTE],
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'ASSIGN_COLORS': {
            const names = action.payload;
            let colorAssignments = { ...state.colorAssignments };
            let availableColors = [...state.availableColors];

            for (const name of names) {
                if (colorAssignments[name]) continue;

                if (availableColors.length === 0) {
                    availableColors = [...COLOR_PALETTE];
                }

                const nextColor = availableColors.shift()!;
                colorAssignments = { ...colorAssignments, [name]: nextColor };
            }

            return { colorAssignments, availableColors };
        }
        default:
            return state;
    }
}

const ColorContext = createContext<{
    colorAssignments: Record<string, string>;
    ensureColors: (names: string[]) => void;
} | null>(null);

export function ColorProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const ensureColors = useCallback((names: string[]) => {
        dispatch({ type: 'ASSIGN_COLORS', payload: names });
    }, []);

    const value = useMemo(
        () => ({ colorAssignments: state.colorAssignments, ensureColors }),
        [state.colorAssignments, ensureColors]
    );

    return <ColorContext.Provider value={value}>{children}</ColorContext.Provider>;
}

export function useColor(name: string): string {
    const context = useContext(ColorContext);
    if (!context) throw new Error('useColor must be used within a ColorProvider');
    return context.colorAssignments[name] || '#CCCCCC';
}

export function useEnsureColors(names: string[]) {
    const context = useContext(ColorContext);
    if (!context) throw new Error('useEnsureColors must be used within a ColorProvider');
    const { ensureColors } = context;

    useEffect(() => {
        if (names.length > 0) {
            ensureColors(names);
        }
    }, [ensureColors, JSON.stringify(names)]);
}

