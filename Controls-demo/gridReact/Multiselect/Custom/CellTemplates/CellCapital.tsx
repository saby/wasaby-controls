import { CheckboxComponent, useItemData } from 'Controls/gridReact';
import { Model } from 'Types/entity';
import { CSSProperties, useMemo } from 'react';

export function CellCapital() {
    const { renderValues } = useItemData<Model>(['capital']);

    const styleMap = useMemo<CSSProperties>(
        () => ({
            display: 'flex',
            gap: '5px',
            alignItems: 'center',
        }),
        []
    );

    return (
        <div style={styleMap}>
            {renderValues.capital}
            <CheckboxComponent />
        </div>
    );
}
