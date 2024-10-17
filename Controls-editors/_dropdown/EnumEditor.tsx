import * as rk from 'i18n!Controls';
import { Fragment, memo, ReactNode, useCallback, useMemo } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { RecordSet } from 'Types/collection';
import { Selector as SelectorControl } from 'Controls/dropdown';
import 'css!Controls-editors/_properties/EnumbEditor';
import { IFontSize, IFontColorStyle } from 'Controls/interface';

const CUSTOM_EVENTS = ['onSelectedKeysChanged'];

export interface IEnumOption<TMetaType> {
    value: TMetaType;
    caption: string;
}

export const genericMemo: <T>(component: T) => T = memo;

interface IEnumEditorProps<TMetaType>
    extends IPropertyGridPropertyEditorProps<TMetaType | undefined> {
    options?: Readonly<IEnumOption<TMetaType>[]>;
    emptyField?: string;
    itemTemplate?: ReactNode;
    fontSize?: IFontSize;
    fontColorStyle?: IFontColorStyle;
}

/**
 * Реакт компонент, редактор для выбора из перечисляемых строк
 * @class Controls-editors/_dropdown/EnumEditor
 * @public
 */
export const EnumEditor = genericMemo(
    <TMetaType extends any>(props: IEnumEditorProps<TMetaType>): JSX.Element => {
        const {
            type,
            value,
            onChange,
            options = [],
            LayoutComponent = Fragment,
            emptyField,
            itemTemplate,
            fontSize,
            fontColorStyle,
        } = props;
        const readOnly = type.isDisabled();
        const items = useMemo(() => {
            return new RecordSet({ keyProperty: 'value', rawData: options || [] });
        }, [options]);

        const onValueChanged = useCallback(
            (value) => {
                const newKey = value[0];
                const newValue =
                    newKey === null
                        ? null
                        : options.find((item) => {
                              return item.value === newKey;
                          }).value;

                onChange(newValue);
            },
            [onChange, options]
        );

        return (
            <LayoutComponent>
                <SelectorControl
                    fontSize={fontSize}
                    fontColorStyle={fontColorStyle}
                    itemTemplate={itemTemplate}
                    data-qa="controls-PropertyGrid__editor_enum"
                    className={'controls-PropertyGrid__editor_enum'}
                    items={items}
                    closeMenuOnOutsideClick={true}
                    selectedKeys={[value === undefined ? null : value]}
                    readOnly={readOnly}
                    displayProperty="caption"
                    keyProperty="value"
                    emptyKey={emptyField || value === undefined ? null : undefined}
                    emptyText={value === undefined ? rk('Не выбрано') : emptyField}
                    onSelectedKeysChanged={onValueChanged}
                    customEvents={CUSTOM_EVENTS}
                />
            </LayoutComponent>
        );
    }
);
