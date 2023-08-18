import * as React from 'react';

function incrementVersionReducer(state: number): number {
    return state + 1;
}

export default function useVersion(): [version: number, incrementVersion: () => void] {
    return React.useReducer(incrementVersionReducer, 0);
}

