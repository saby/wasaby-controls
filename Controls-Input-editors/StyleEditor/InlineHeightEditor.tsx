import { forwardRef, LegacyRef, useCallback, useMemo } from 'react';
import { Selector as SelectorControl } from 'Controls/dropdown';
import { ItemTemplate } from 'Controls/menu';
import { Button } from 'Controls/buttons';
import { RecordSet } from 'Types/collection';
import { IButtonStyle } from 'Controls-Input/buttonConnected';
import * as rk from 'i18n!Controls-Input';

interface IProps {
    editorStyle: IButtonStyle;
    propertyValue: string;
    onPropertyValueChanged: (value: string, notify: boolean) => void;
}

const items = new RecordSet({
    keyProperty: 'value',
    rawData: [
        { value: 'm', caption: rk('Основная') },
        { value: 'xl', caption: rk('Большая') },
        { value: '5xl', caption: rk('Огромная') },
    ],
});
const menuPopupOptions = {
    offset: {
        vertical: -3,
        horizontal: -8,
    },
};

export default forwardRef(function InlineHeightEditor(
    props: IProps,
    ref: LegacyRef<SelectorControl>
) {
    const { propertyValue, onPropertyValueChanged } = props;
    const selectedKeys = useMemo(() => {
        return [propertyValue === undefined ? null : propertyValue];
    }, [propertyValue]);
    const onSelectedKeysChanged = useCallback(
        (res: string[]) => {
            onPropertyValueChanged(res[0], true);
        },
        [onPropertyValueChanged]
    );
    const ContentTemplate = useCallback((itemTemplateProps: Record<string, unknown>) => {
        return (
            <Button
                {...itemTemplateProps}
                caption={itemTemplateProps.text}
                inlineHeight="default"
                viewMode="link"
                buttonStyle="secondary"
            />
        );
    }, []);
    return (
        <SelectorControl
            ref={ref}
            multiSelect={false}
            fontSize="default"
            fontColorStyle="secondary"
            data-qa="controls-PropertyGrid__editor_enum"
            className={'controls-PropertyGrid__editor_enum'}
            items={items}
            closeMenuOnOutsideClick={true}
            selectedKeys={selectedKeys}
            displayProperty="caption"
            keyProperty="value"
            menuPopupOptions={menuPopupOptions}
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
                        } controls-StyleEditor_item controls-LabelEditor-item`}
                        contentTemplate={() => {
                            const itemValue = itemTemplateProps.item.contents.get('value');
                            const captionText =
                                itemTemplateProps.item.contents.get('menuCaption') ||
                                itemTemplateProps.item.contents.get('caption');

                            return (
                                <div className="controls-padding-s tw-flex tw-w-full">
                                    <Button
                                        caption={captionText}
                                        inlineHeight={itemValue}
                                        icon="icon-SabyBird"
                                        viewMode={props.editorStyle.viewMode}
                                        buttonStyle={props.editorStyle.buttonStyle}
                                        fontSize="empty"
                                        iconSize="empty"
                                        fontColorStyle={undefined}
                                        iconStyle="empty"
                                    />
                                </div>
                            );
                        }}
                    />
                );
            }}
        />
    );
});
