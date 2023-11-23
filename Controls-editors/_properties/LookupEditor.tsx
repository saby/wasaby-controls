import { Fragment, memo, useCallback } from 'react';
import { ILookupOptions, Input as LookupInput } from 'Controls/lookup';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import 'css!Controls-editors/_properties/LookupEditor';

interface ILookupEditorProps extends IPropertyGridPropertyEditorProps<boolean> {
    options?: ILookupOptions;
}

/**
 * Реакт компонент, редактор поля выбора из справочника
 * @class Controls-editors/_properties/LookupEditor
 * @public
 */
export const LookupEditor = memo((props: ILookupEditorProps) => {
    const { value, onChange, options = {}, LayoutComponent = Fragment } = props;

    const handleChange = useCallback(
        (_, value) => {
            return onChange(value);
        },
        [value, onChange]
    );

    return (
        <LayoutComponent>
            <LookupInput
                className="property-grid__lookup-input"
                selectedKeys={value}
                onSelectedKeysChanged={handleChange}
                customEvents={['onSelectedKeysChanged']}
                {...props?.options}
            />
        </LayoutComponent>
    );
});
