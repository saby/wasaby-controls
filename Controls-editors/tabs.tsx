import { Fragment, memo, useState } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { default as Combobox } from 'Controls/ComboBox';
import * as rk from 'i18n!Controls-editors';
import { ItemTemplate } from 'Controls/menu';
import { Buttons as TabsButtons } from 'Controls/tabs';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';

interface IStyleEditorProps extends IPropertyGridPropertyEditorProps<String> {
    titlePosition?: string;
}

const TABS_STYLE_ITEMS = new Memory({
    keyProperty: 'id',
    data: [
        {
            id: 'online',
            caption: rk('Стандартный'),
        },
        {
            id: 'wide',
            caption: rk('Широкие вкладки'),
        },
    ],
});

const TABS_ITEMS = new RecordSet({
    keyProperty: 'id',
    rawData: [
        {
            id: '1',
            title: rk('Вкладка'),
            align: 'left',
        },
        {
            id: '2',
            title: rk('Новая вкладка'),
            align: 'left',
        },
    ],
});

export const ReferenceEditor = memo((props: IStyleEditorProps) => {
    const { type, value, onChange, LayoutComponent = Fragment } = props;
    const [selectedKey, setSelectedKey] = useState<string | null>(
        value?.replace?.('controls-Tabs_style-', '') || 'online'
    );
    const readOnly = type.isDisabled();

    return (
        <LayoutComponent>
            <Combobox
                closeMenuOnOutsideClick={true}
                selectedKey={selectedKey}
                readOnly={readOnly}
                displayProperty="caption"
                keyProperty="id"
                itemsSpacing="s"
                dropdownClassName="controls-LabelEditor-dropdownContainer"
                placeholder={rk('Стандартная')}
                data-qa={'Controls-Input-editors_LabelEditor__type'}
                itemTemplate={(itemTemplateProps) => {
                    return (
                        <ItemTemplate
                            {...itemTemplateProps}
                            marker={false}
                            multiLine={true}
                            roundBorder={false}
                            className={`${
                                itemTemplateProps.item.isMarked()
                                    ? 'controls-background-unaccented'
                                    : ''
                            } controls-LabelEditor-item`}
                            contentTemplate={() => {
                                const className = 'controls-padding-s tw-flex tw-w-full';
                                return (
                                    <div className={className}>
                                        <div
                                            className="tw-flex tw-flex-col controls_border-radius-xs tw-w-full"
                                            style={{
                                                border: 'var(--border-thickness) solid var(--unaccented_border-color)',
                                                pointerEvents: 'none',
                                            }}
                                        >
                                            <TabsButtons
                                                items={TABS_ITEMS}
                                                keyProperty="id"
                                                selectedKey="1"
                                                className={`controls-Tabs_style-${itemTemplateProps.item.contents.get(
                                                    'id'
                                                )}`}
                                            />
                                            <div
                                                style={{
                                                    minHeight: 30,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            }}
                        />
                    );
                }}
                onValueChanged={(caption) => {
                    const selectedValue = TABS_STYLE_ITEMS.data.find((item) => {
                        return item.caption === caption;
                    })?.id;
                    setSelectedKey(selectedValue);
                    onChange(`controls-Tabs_style-${selectedValue}`);
                }}
                source={TABS_STYLE_ITEMS}
                customEvents={['onValueChanged']}
            />
        </LayoutComponent>
    );
});
