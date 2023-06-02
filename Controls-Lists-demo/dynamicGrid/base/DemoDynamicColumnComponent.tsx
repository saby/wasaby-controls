import * as React from 'react';
// import { useRenderData } from 'Controls-Lists/dynamicGrid';

export default function DemoDynamicColumnComponent(props): React.ReactElement {
    const { item, columnData, date } = props;
    let dynamicTitle;

    if (item.get('type') === true) {
        return null;
    }

    if (columnData) {
        dynamicTitle = columnData.get('dynamicTitle');
    } else {
        dynamicTitle =
            date.getDate().toString().padStart(2, '0') +
            '.' +
            (date.getMonth() + 1).toString().padStart(2, '0');
    }
    return <span className="ControlsLists-dynamicGrid__dynamicCellComponent">{dynamicTitle}</span>;
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
