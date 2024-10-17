import * as React from 'react';
import { constants } from 'Env/Env';
import { correctDateFromClientToServer } from 'Controls-Lists/timelineGrid';

export default function DemoDynamicColumnComponent(props): React.ReactElement {
    const { item, columnData, date } = props;
    let dynamicTitle;
    let correctDate = date;
    if (constants.isServerSide) {
        correctDate = correctDateFromClientToServer(date);
    }

    if (item.get('type') === true) {
        return null;
    }

    if (columnData) {
        dynamicTitle = columnData.get('dynamicTitle');
    } else {
        dynamicTitle =
            correctDate.getDate().toString().padStart(2, '0') +
            '.' +
            (correctDate.getMonth() + 1).toString().padStart(2, '0');
    }
    return dynamicTitle;
}

// export default function DemoDynamicColumnComponent(): React.ReactElement {
//     const displayProperty = 'dynamicTitle';
//     const { renderValues } = useItemData([displayProperty]);
//     return (
//         <div className="tw-overflow-hidden">
//             {renderValues[displayProperty]}
//         </div>
//     );
// }
