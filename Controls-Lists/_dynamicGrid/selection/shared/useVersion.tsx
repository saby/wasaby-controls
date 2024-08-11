/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';

function incrementVersionReducer(state: number): number {
    return state + 1;
}

export default function useVersion(): [version: number, incrementVersion: () => void] {
    return React.useReducer(incrementVersionReducer, 0);
}
