import * as React from 'react';
import { useItemData } from 'Controls/grid';

export default React.forwardRef(function NodeTemplate(_: object, ref): JSX.Element {
    const { renderValues } = useItemData(['country', 'footer']);

    return (
        <div style={{ height: '40px' }}>
            <div>{renderValues.country}</div>
            <span
                style={{
                    zIndex: 5,
                    position: 'absolute',
                    width: '600px',
                    color: 'var(--unaccented_text-color)',
                }}
                className="controls-listTemplates__tableCellTemplate__footer"
            >
                {renderValues.footer}
            </span>
        </div>
    );
});
