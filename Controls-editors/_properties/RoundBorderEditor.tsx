import { Fragment, memo, useCallback } from 'react';
import { Checkbox } from 'Controls/checkbox';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { IRoundBorder } from 'Controls/interface';

interface IRoundBorderEditorProps extends IPropertyGridPropertyEditorProps<IRoundBorder> {}

const CUSTOM_EVENTS = ['onValueChanged'];
/**
 * Реакт компонент, редактор скругления
 * @class Controls-editors/_properties/RoundBorder
 * @public
 */
export const RoundBorderEditor = memo((props: IRoundBorderEditorProps) => {
    const { onChange, value, LayoutComponent = Fragment } = props;
    const onValueChanged = useCallback((res) => {
        if (res) {
            onChange({
                tl: 'null',
                tr: 'null',
                bl: 'm',
                br: 'm',
            });
        } else {
            onChange({});
        }
    }, []);

    return (
        <LayoutComponent>
            <Checkbox
                value={!!value?.tl}
                onValueChanged={onValueChanged}
                customEvents={CUSTOM_EVENTS}
            />
        </LayoutComponent>
    );
});
