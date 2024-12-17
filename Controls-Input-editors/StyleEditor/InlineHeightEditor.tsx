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
        {value: 'm', caption: rk('Основная')},
        {value: 'xl', caption: rk('Большая')},
        {value: '5xl', caption: rk('Огромная')},
    ]
});

export default forwardRef(function InlineHeightEditor(props: IProps, ref: LegacyRef<SelectorControl>) {
    const {propertyValue, onPropertyValueChanged} = props;
    return (
        <SelectorControl
            ref={ref}
            multiSelect={false}
            fontSize='default'
            fontColorStyle='secondary'
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
            contentTemplate={(itemTemplateProps: Record<string, unknown>) => {
                return <Button
                    {...itemTemplateProps}
                    caption={itemTemplateProps.text}
                    inlineHeight='default'
                    viewMode='link'
                    buttonStyle='secondary'
                />;
            }}
            itemTemplate={(itemTemplateProps) => {
                return <ItemTemplate
                    {...itemTemplateProps}
                    marker={true}
                    multiLine={true}
                    roundBorder={true}
                    className={`${
                        itemTemplateProps.item.isMarked()
                            ? 'controls-background-unaccented'
                            : ''
                    } controls-LabelEditor-item`}
                    contentTemplate={() => {
                        const itemValue = itemTemplateProps.item.contents.get('value');
                        const captionText =
                            itemTemplateProps.item.contents.get('menuCaption') ||
                            itemTemplateProps.item.contents.get('caption');

                        return (
                            <div className='controls-padding-s tw-flex tw-w-full'>
                                <Button
                                    caption={captionText}
                                    inlineHeight={itemValue}
                                    icon='icon-SabyBird'
                                    viewMode={props.editorStyle.viewMode}
                                    buttonStyle={props.editorStyle.buttonStyle}
                                    fontSize={itemValue}
                                    iconSize={itemValue === '5xl' ? 'l' : (itemValue === 'm' ? 's' : 'm')}
                                    fontColorStyle={
                                        getFontColorStyle(props.editorStyle.viewMode, props.editorStyle.buttonStyle)
                                    }
                                    iconStyle={getIconStyle(props.editorStyle.viewMode, props.editorStyle.buttonStyle)}
                                />
                            </div>
                        );
                    }}
                />;
            }}
        />
    );
});