import * as React from 'react';
import { useItemData } from 'Controls/grid';

export default React.forwardRef(function NodeTemplate(_: object, ref): JSX.Element {
    const { renderValues } = useItemData(['population']);

    return (
        <div className="controls-listTemplates__tableCellTemplate__footer">
            <div>{renderValues.population}</div>
        </div>
    );
});
