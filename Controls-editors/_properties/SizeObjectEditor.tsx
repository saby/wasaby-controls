import { ComponentProps, memo } from 'react';
import {
    IHeightOptions,
    IFontSizeOptions,
    IIconSizeOptions,
} from 'Controls/interface';
import { SizeEditor } from './SizeEditor';

interface ISizeEditorValue
    extends IHeightOptions,
        IFontSizeOptions,
        IIconSizeOptions {}

interface ISizeEditorProps
    extends Omit<ComponentProps<typeof SizeEditor>, 'value'> {
    value: ISizeEditorValue;
}

/**
 * Реакт компонент, редактор размеров
 * @class Controls-editors/_properties/SizeEditor
 * @public
 */
export const SizeObjectEditor = memo((props: ISizeEditorProps) => {
    const { options, onChange, value = {} } = props;

    return (
        <SizeEditor
            {...props}
            onChange={(selectedKey) => {
                const item = options.filter((option) => {
                    return option.id === selectedKey;
                })[0];
                onChange({
                    fontSize: item.id,
                    inlineHeight: item.id,
                    iconSize: item.value,
                });
            }}
            value={value.inlineHeight}
        />
    );
});
