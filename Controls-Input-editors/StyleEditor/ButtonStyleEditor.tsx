import { forwardRef, LegacyRef } from 'react';
import { Selector as SelectorControl } from 'Controls/dropdown';
import { ItemTemplate } from 'Controls/menu';
import { Button } from 'Controls/buttons';
import { RecordSet } from 'Types/collection';
import * as rk from 'i18n!Controls-Actions';
import { IButtonStyle } from 'Controls-Input/buttonConnected';
import 'css!Controls-Input-editors/StyleEditor/ButtonStyleEditor';

interface IProps {
    editorStyle: IButtonStyle;
    propertyValue: string;
    onPropertyValueChanged: (value: string, notify: boolean) => void;
}

const items = new RecordSet({
    keyProperty: 'value',
    rawData: [
        { value: 'primary', caption: rk('Акцентная') },
        { value: 'secondary', caption: rk('Дополнительная') },
        { value: 'success', caption: rk('Успех') },
        { value: 'danger', caption: rk('Ошибка') },
        { value: 'warning', caption: rk('Предупреждение') },
        { value: 'info', caption: rk('Информирование') },
        { value: 'unaccented', caption: rk('Неакцентная') },
        { value: 'default', caption: rk('Базовая') },
    ],
});

export default forwardRef(function InlineHeightEditor(
    props: IProps,
    ref: LegacyRef<SelectorControl>
) {
    const { propertyValue = 'primary', onPropertyValueChanged } = props;
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
            selectedKeys={[propertyValue === undefined ? null : propertyValue]}
            displayProperty="caption"
            keyProperty="value"
            onSelectedKeysChanged={(res: string[]) => {
                onPropertyValueChanged(res[0], true);
            }}
            contentTemplate={() => {
                return (
                    <div className={'tw-cursor-pointer controls-ButtonStyleEditor_bubble'}>
                        <div
                            className={`tw-h-full tw-w-full controls-background-contrast-${propertyValue}`}
                        />
                    </div>
                );
            }}
            itemTemplate={(itemTemplateProps: Record<string, unknown>) => {
                return (
                    <ItemTemplate
                        {...itemTemplateProps}
                        marker={true}
                        multiLine={true}
                        roundBorder={true}
                        className={`${
                            itemTemplateProps.item.isMarked()
                                ? 'controls-background-unaccented'
                                : ''
                        }`}
                        contentTemplate={() => {
                            const itemValue = itemTemplateProps.item.contents.get('value');
                            const captionText =
                                itemTemplateProps.item.contents.get('menuCaption') ||
                                itemTemplateProps.item.contents.get('caption');

                            return (
                                <div className="controls-padding-s tw-flex tw-w-full">
                                    <Button
                                        caption={captionText}
                                        inlineHeight="m"
                                        icon="icon-SabyBird"
                                        viewMode={props.editorStyle.viewMode}
                                        buttonStyle={itemValue}
                                        fontColorStyle="empty"
                                        iconStyle="empty"
                                        iconSize="s"
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
