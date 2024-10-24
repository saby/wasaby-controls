import { memo, useMemo, useCallback } from 'react';
import { BackgroundEditor } from 'Controls-editors/properties';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { IComponent } from 'Meta/types';

interface IColorEditorProps extends IPropertyGridPropertyEditorProps<string> {
    LayoutComponent?: IComponent<object>;
}

const DEFAULT_COLOR = '#000000';

/**
 * Реакт компонент, редактор для настройки цвета шрифта
 * @class Controls-editors/_style/ColorEditor
 * @public
 */
export const ColorEditor = memo((props: IColorEditorProps) => {
    const { value, onChange } = props;

    const backgroundValue = useMemo(() => {
        return {
            backgroundColor: value ?? DEFAULT_COLOR,
        };
    }, [value]);

    const onChangeCallback = useCallback(
        (result: Record<string, string>) => {
            if (typeof onChange === 'function') {
                onChange(result.backgroundColor);
            }
        },
        [onChange]
    );

    return <BackgroundEditor {...props} value={backgroundValue} onChange={onChangeCallback} />;
});
