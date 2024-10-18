import { forwardRef, LegacyRef } from 'react';
import { Selector as SelectorControl } from 'Controls/dropdown';
import { ItemTemplate } from 'Controls/menu';
import { Button } from 'Controls/buttons';
import { RecordSet } from 'Types/collection';
import { getFontColorStyle, getIconStyle, IButtonStyle } from 'Controls-Input/buttonConnected';
import * as rk from 'i18n!Controls-Actions';

interface IProps {
    editorStyle: IButtonStyle;
    propertyValue: string;
    onPropertyValueChanged: (value: string, notify: boolean) => void;
}

const items = new RecordSet({
    keyProperty: 'value',
    rawData: [
        {value: 'outlined', caption: rk('Контурная')},
        {value: 'filled', caption: rk('Залитая')},
        {value: 'link', caption: rk('Ссылка')},
        {value: 'ghost', caption: rk('С заливкой по ховеру')},
        {value: 'squared', caption: rk('Квадратная')},
    ]
});

export default forwardRef(function InlineHeightEditor(props: IProps, ref: LegacyRef<SelectorControl>) {
    const {propertyValue = 'outlined', onPropertyValueChanged} = props;
    return (
        <SelectorControl
            ref={ref}
            multiSelect={false}
            fontSize='default'
            fontColorStyle='secondary'
            data-qa="controls-PropertyGrid__editor_enum"
            className={'controls-PropertyGrid__editor_enum'}
            viewMode={propertyValue}
            items={items}
            closeMenuOnOutsideClick={true}
            selectedKeys={[propertyValue === undefined ? null : propertyValue]}
            displayProperty="caption"
            keyProperty="value"
            onSelectedKeysChanged={(res: string[]) => {
                onPropertyValueChanged(res[0], true);
            }}
            contentTemplate={(itemTemplateProps) => {
                return <Button
                    {...itemTemplateProps}
                    caption={items.getRecordById(propertyValue).get('caption')}
                    inlineHeight='default'
                    icon='icon-SabyBird'
                    viewMode={propertyValue}
                    buttonStyle={props.editorStyle?.buttonStyle}
                    fontColorStyle={getFontColorStyle(propertyValue, props.editorStyle.buttonStyle)}
                    iconStyle={getIconStyle(propertyValue, props.editorStyle.buttonStyle)}
                />;
            }}
            itemTemplate={(itemTemplateProps) => {
                return <ItemTemplate
                    {...itemTemplateProps}
                    marker={true}
                    multiLine={true}
                    roundBorder={'s'}
                    className={`${
                        itemTemplateProps.item.isMarked()
                            ? 'controls-background-unaccented'
                            : ''
                    } controls-LabelEditor-item`}
                    contentTemplate={() => {
                        let className = 'controls-padding-s tw-flex tw-w-full';
                        const itemValue = itemTemplateProps.item.contents.get('value');
                        const captionText =
                            itemTemplateProps.item.contents.get('menuCaption') ||
                            itemTemplateProps.item.contents.get('caption');

                        if (itemValue === 'link') {
                            className += ' controls-margin_left-m';
                        }

                        return (
                            <div className={className}>
                                <Button
                                    caption={captionText}
                                    inlineHeight='default'
                                    icon='icon-SabyBird'
                                    iconSize='s'
                                    viewMode={itemValue}
                                    buttonStyle={props.editorStyle?.buttonStyle}
                                    fontColorStyle={getFontColorStyle(itemValue, props.editorStyle.buttonStyle)}
                                    iconStyle={getIconStyle(itemValue, props.editorStyle.buttonStyle)}
                                />
                            </div>
                        );
                    }}
                />;
            }}
        />
    );
});