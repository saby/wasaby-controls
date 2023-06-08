import * as React from 'react';
import { useRenderData } from 'Controls-Lists/dynamicGrid';

export default function DemoDynamicColumnComponent(props) {
    const displayProperty = 'dynamicTitle';
    return (
        <span className="controlsListsDemo__dynamicGridBase-cell">
            {props[displayProperty]}
        </span>
    );
}

// export default function DemoDynamicColumnComponent(): React.ReactElement {
//     const displayProperty = 'dynamicTitle';
//     const { renderValues } = useRenderData([displayProperty]);
//     return (
//         <div className="tw-overflow-hidden">
//             {renderValues[displayProperty]}
//         </div>
//     );
// }
