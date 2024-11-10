import * as React from 'react';
interface IDragNDropContextValue {
    id: number;
    width: number;
}
export const DragNDropContext = React.createContext<IDragNDropContextValue | undefined>(undefined);
