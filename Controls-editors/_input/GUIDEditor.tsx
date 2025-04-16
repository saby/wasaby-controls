import { Fragment, memo } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { default as GUID } from 'Controls-Input/GUID';
import { Button } from 'Controls/buttons';
import { Guid as createGUID } from 'Types/entity';
import { useInputEditorValue } from './useInputValue';

export interface IGUIDValue {
    value: string;
}

export interface IGUIDEditorProps extends IPropertyGridPropertyEditorProps<string> {
    /**
     * Значение GUID
     */
    value: string;
    /**
     * Маска, по которой отобразится поле вводы GUID
     */
    mask?: string;
}

// 33ch - значение при котором не меняется размер поля ввода при разных значениях GUID
const GUIDStyle = { width: '33ch' };

/**
 * Реакт компонент, редактор GUID
 * @class Controls-editors/_properties/GUIDEditor
 * @public
 */
export const GUIDEditor = memo((props: IGUIDEditorProps) => {
    const {
        type,
        value,
        onChange: onChangeOrigin,
        LayoutComponent = Fragment,
        mask = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    } = props;
    const readOnly = type?.isEnabled();

    const { changeHandler, localValue } = useInputEditorValue<string>({
        value,
        onChange: onChangeOrigin,
    });

    const onButtonClick = () => {
        const newGUID = createGUID.create();
        changeHandler(newGUID);
    };

    return (
        <LayoutComponent>
            <GUID
                data-qa="controls-PropertyGrid__editor_guid"
                style={GUIDStyle}
                value={localValue}
                mask={mask}
                readOnly={readOnly}
            />
            <Button
                className="controls-margin_left-m"
                viewMode="outlined"
                icon="icon-ConnectionPeriod"
                buttonStyle="primary"
                onClick={onButtonClick}
            />
        </LayoutComponent>
    );
});
