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

interface IProps extends IPropertyGridPropertyEditorProps<string> {
    editorStyle: IInputStyle;
    LayoutComponent: JSX.Element;
}

const items = new RecordSet({
    keyProperty: 'value',
    rawData: [
        { value: 's', caption: rk('Основной') },
        { value: 'm', caption: rk('Большой') },
        { value: 'l', caption: rk('Огромный') },
    ],
});

export default forwardRef(function InputSizeEditor(props: IProps, ref: LegacyRef<SelectorControl>) {
    const { onChange, editorStyle, LayoutComponent } = props;
    const selectedKeys = useMemo(() => {
        return [editorStyle.size === undefined ? 's' : editorStyle.size];
    }, [editorStyle]);

    const onSelectedKeysChanged = useCallback(
        (res: string[]) => {
            onChange?.(res[0]);
        },
        [onChange]
    );
    const ContentTemplate = useCallback((itemTemplateProps: Record<string, unknown>) => {
        return (
            <Button
                {...itemTemplateProps}
                caption={itemTemplateProps?.item?.get('caption') || rk('Основной')}
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
                                const sizeValue = itemTemplateProps.item.contents.get('value');
                                const captionText =
                                    itemTemplateProps.item.contents.get('menuCaption') ||
                                    itemTemplateProps.item.contents.get('caption');
                                return (
                                    <div className="controls-padding-s tw-flex tw-w-full">
                                        <InputControl
                                            className="controls-InputStyleEditor-input"
                                            value={captionText}
                                            inlineHeight={sizeValue}
                                            contrastBackground={editorStyle.contrastBackground}
                                            fontSize={sizeValue}
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
