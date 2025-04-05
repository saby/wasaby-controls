import { forwardRef, LegacyRef, useMemo, useCallback } from 'react';
import { Selector as SelectorControl } from 'Controls/dropdown';
import { ItemTemplate } from 'Controls/menu';
import { Button } from 'Controls/buttons';
import { RecordSet } from 'Types/collection';
import * as rk from 'i18n!Controls-Input';
import { IButtonStyle } from 'Controls-Input/buttonConnected';
import { WidgetThemeWrapper } from 'Controls-editors/propertyGridPopup';

interface IProps {
    editorStyle: IButtonStyle;
    propertyValue: string;
    onPropertyValueChanged: (value: string, notify: boolean) => void;
}

const baseStyle = [
    { value: 'primary', caption: rk('Акцентная') },
    { value: 'secondary', caption: rk('Дополнительная') },
    { value: 'success', caption: rk('Успех') },
    { value: 'danger', caption: rk('Ошибка') },
    { value: 'warning', caption: rk('Предупреждение') },
    { value: 'info', caption: rk('Информирование') },
    { value: 'unaccented', caption: rk('Неакцентная') },
    { value: 'default', caption: rk('Базовая') },
];

const baseFilledItems = new RecordSet({
    keyProperty: 'value',
    rawData: [
        { value: 'primary', caption: rk('Акцентная') },
        { value: 'secondary', caption: rk('Дополнительная') },
        { value: 'success', caption: rk('Успех') },
        { value: 'danger', caption: rk('Ошибка') },
        { value: 'warning', caption: rk('Предупреждение') },
        { value: 'info', caption: rk('Информирование') },
        { value: 'unaccented', caption: rk('Неакцентная') },
        { value: 'pale', caption: rk('Бледная') },
        { value: 'default', caption: rk('Базовая') },
    ],
});
const baseItems = new RecordSet({
    keyProperty: 'value',
    rawData: baseStyle,
});
const itemsForLink = new RecordSet({
    keyProperty: 'value',
    rawData: [
        ...baseStyle,
        { value: 'link', caption: rk('Ссылка') },
        { value: 'label', caption: rk('Метка') },
    ],
});
const menuPopupOptions = {
    offset: {
        vertical: -3,
        horizontal: -8,
    },
};

export default forwardRef(function ButtonStyleEditor(
    props: IProps,
    ref: LegacyRef<SelectorControl>
) {
    const { propertyValue = 'secondary', onPropertyValueChanged } = props;
    const items = useMemo(() => {
        return props.editorStyle.viewMode === 'link'
            ? itemsForLink
            : props.editorStyle.viewMode === 'filled'
            ? baseFilledItems
            : baseItems;
    }, [props.editorStyle.viewMode]);

    const selectedKeys = useMemo(() => {
        return [propertyValue === undefined ? null : propertyValue];
    }, [propertyValue]);
    const onSelectedKeysChanged = useCallback(
        (res: string[]) => {
            onPropertyValueChanged(res[0], true);
        },
        [onPropertyValueChanged]
    );
    const ContentTemplate = useCallback(() => {
        return (
            <WidgetThemeWrapper>
                <div className={'tw-cursor-pointer controls-ButtonStyleEditor_bubble'}>
                    <div
                        className={`tw-h-full tw-w-full controls-background-contrast-${propertyValue} controls-ButtonStyleEditor_bubble-${propertyValue}`}
                    />
                </div>
            </WidgetThemeWrapper>
        );
    }, [propertyValue]);

    return (
        <SelectorControl
            ref={ref}
            multiSelect={false}
            fontSize="m"
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
            itemTemplate={(itemTemplateProps: Record<string, unknown>) => {
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
                            const itemValue = itemTemplateProps.item.contents.get('value');
                            const captionText =
                                itemTemplateProps.item.contents.get('menuCaption') ||
                                itemTemplateProps.item.contents.get('caption');

                            return (
                                <WidgetThemeWrapper>
                                    <div className="controls-padding-s tw-flex tw-w-full">
                                        <Button
                                            caption={captionText}
                                            inlineHeight="m"
                                            icon="icon-SabyBird"
                                            viewMode={props.editorStyle.viewMode}
                                            buttonStyle={itemValue}
                                            fontColorStyle={undefined}
                                            iconStyle="empty"
                                            iconSize="s"
                                        />
                                    </div>
                                </WidgetThemeWrapper>
                            );
                        }}
                    />
                );
            }}
        />
    );
});
