import * as React from 'react';
import { useItemData } from 'Controls/grid';

export function SecondColumnCell(): React.ReactElement {
    const { renderValues } = useItemData(['message', 'fullName']);
    return (
        <div>
            <div>{renderValues.fullName}</div>
            {renderValues.message}
        </div>
    );
}
