import { Button } from 'Controls/buttons';
import * as React from 'react';

/**
 * Редактор свойства "Значение" в колонке
 * @param props
 * @constructor
 */
export function ColumnValueEditor(props): JSX.Element {
    const { value, onChange, LayoutComponent, onClick } = props;
    const onButtonClick = React.useCallback(() => {
        onClick(onChange);
    }, [onClick, onChange]);
    return (
        <LayoutComponent>
            <Button caption={value.caption} viewMode={'link'} onClick={onButtonClick} />
        </LayoutComponent>
    );
}
