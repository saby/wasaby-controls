import { forwardRef, LegacyRef, useCallback, useMemo } from 'react';
import { Selector as SelectorControl } from 'Controls/dropdown';
import { ItemTemplate } from 'Controls/menu';
import { RecordSet } from 'Types/collection';
import * as rk from 'i18n!Controls-Input';
import { IInputStyle } from 'Controls-Input/inputConnected';
import { Text as InputControl } from 'Controls/input';
import { Button } from 'Controls/buttons';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import 'css!Controls-Input-editors/InputStyleEditor/StyleEditor';

interface IProps extends IPropertyGridPropertyEditorProps<boolean> {
    editorStyle: IInputStyle;
    LayoutComponent: JSX.Element;
}

const items = new RecordSet({
    keyProperty: 'value',
    rawData: [
        { value: 'outlined', caption: rk('Прозрачное') },
        { value: 'filled', caption: rk('Залитое') },
    ],
});

export default forwardRef(function InputContrastEditor(
    props: IProps,
    ref: LegacyRef<SelectorControl>
) {
    const { editorStyle, onChange, LayoutComponent } = props;
    const selectedKeys = useMemo(() => {
        return [editorStyle.contrastBackground ? 'filled' : 'outlined'];
    }, [editorStyle]);

    const onSelectedKeysChanged = useCallback(
        (res: string[]) => {
            onChange?.(res[0] === 'filled');
        },
        [onChange]
    );
    const ContentTemplate = useCallback((itemTemplateProps: Record<string, unknown>) => {
        return (
            <Button
                {...itemTemplateProps}
                caption={editorStyle.contrastBackground ? rk('Залитое') : rk('Прозрачное')}
                inlineHeight="default"
                viewMode="link"
                buttonStyle="link"
            />
        );
    }, []);
    return (
        <LayoutComponent>
            <SelectorControl
                ref={ref}
                multiSelect={false}
                data-qa="controls-PropertyGrid__editor_enum"
                className={'controls-PropertyGrid__editor_enum'}
                items={items}
                closeMenuOnOutsideClick={true}
                selectedKeys={selectedKeys}
                displayProperty="title"
                menuBackgroundStyle="unaccented"
                keyProperty="value"
                onSelectedKeysChanged={onSelectedKeysChanged}
                contentTemplate={ContentTemplate}
                itemTemplate={(itemTemplateProps) => {
                    return (
                        <ItemTemplate
                            {...itemTemplateProps}
                            marker={true}
                            multiLine={true}
                            roundBorder={false}
                            className={`${
                                itemTemplateProps.item.isMarked()
                                    ? 'controls-StyleEditor_item_active'
                                    : ''
                            } controls-StyleEditor_item`}
                            contentTemplate={() => {
                                const itemData = itemTemplateProps.item.contents;
                                const contrastBackground = itemData.get('value');
                                const captionText = itemData.get('caption');
                                return (
                                    <div className="controls-padding-s tw-flex tw-w-full">
                                        <InputControl
                                            className="controls-InputStyleEditor-input"
                                            value={captionText}
                                            contrastBackground={contrastBackground === 'filled'}
                                        />
                                    </div>
                                );
                            }}
                        />
                    );
                }}
            />
        </LayoutComponent>
    );
});
