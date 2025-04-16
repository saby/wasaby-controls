import { Fragment, memo, ReactElement, useCallback, useMemo, useRef } from 'react';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { IComponent, IPropertyEditorProps } from 'Meta/types';
import { PreviewerTarget } from 'Controls/popupTargets';
import { Text } from 'Controls/input';
import { OnlyIconEditor } from 'Controls-editors/properties';
import { Memory } from 'Types/source';
import { useInputChanged } from 'Controls-editors/hooks';
import { Selector, ItemTemplate } from 'Controls/dropdown';
import * as rk from 'i18n!Controls-editors';
import 'css!Controls-Input-editors/LabelEditor/LabelEditor';

interface IValue {
    labelPosition?: 'start' | 'top' | 'hidden';
    jumping?: boolean;
    label?: string;
    icon?: string;
}

export type ILabelEditorProps = IPropertyEditorProps<IValue> & {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    contentTemplate?: ReactElement;
    isJumping?: boolean;
    defaultValue?: IValue;
    customData?: object[];
    titlePosition?: string;
};
/* todo вернуть после задачи
    https://online.saby.ru/opendoc.html?guid=ed7aa959-917e-49be-993c-1992beff2ae2&client=3
const LABEL_FONT_COLOR_STYLE_ITEMS = new RecordSet({
    keyProperty: 'variable',
    rawData: [
        {
            variable: '--label_text-color',
            value: 'label',
        },
        {
            variable: '--unaccented_text-color',
            value: 'unaccented',
        },
        {
            variable: '--link_text-color',
            value: 'link',
        },
        {
            variable: '--primary_text-color',
            value: 'primary',
        },
        {
            variable: '--success_text-color',
            value: 'success',
        },
        {
            variable: '--info_text-color',
            value: 'info',
        },
    ],
});
const LABEL_ICON_STYLE_ITEMS = new RecordSet({
    keyProperty: 'variable',
    rawData: [
        {
            variable: '--label_text-color',
            value: 'label',
        },
        {
            variable: '--unaccented_text-color',
            value: 'unaccented',
        },
        {
            variable: '--link_text-color',
            value: 'link',
        },
        {
            variable: '--primary_text-color',
            value: 'primary',
        },
        {
            variable: '--success_text-color',
            value: 'success',
        },
        {
            variable: '--warning_text-color',
            value: 'warning',
        },
        {
            variable: '--danger_text-color',
            value: 'danger',
        },
        {
            variable: '--info_text-color',
            value: 'info',
        },
    ],
});
*/
// todo удалить когда добавят шрифтовые иконки
// Добавят после https://online.sbis.ru/opendoc.html?guid=b305f159-fb0e-4a9d-8192-ae9038e6955b&client=3
const ICONS = {
    start: (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M2 12C2 12.2761 2.22386 12.5 2.5 12.5H6.5C6.77614 12.5 7 12.2761 7 12C7 11.7239 6.77614 11.5 6.5 11.5H2.5C2.22386 11.5 2 11.7239 2 12Z"
                fill="var(--label_text-color)"
            />
            <path
                d="M21 9.5V14.5C21 15.0523 20.5523 15.5 20 15.5H11C10.4477 15.5 10 15.0523 10 14.5V9.5C10 8.94772 10.4477 8.5 11 8.5H20C20.5523 8.5 21 8.94772 21 9.5ZM22 14.5V9.5C22 8.39543 21.1046 7.5 20 7.5H11C9.89543 7.5 9 8.39543 9 9.5V14.5C9 15.6046 9.89543 16.5 11 16.5H20C21.1046 16.5 22 15.6046 22 14.5Z"
                fill="var(--label_text-color)"
            />
        </svg>
    ),
    top: (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M2 7.5C2 7.22386 2.22386 7 2.5 7H10.5C10.7761 7 11 7.22386 11 7.5C11 7.77614 10.7761 8 10.5 8H2.5C2.22386 8 2 7.77614 2 7.5Z"
                fill="var(--label_text-color)"
            />
            <path
                d="M21 17V12C21 11.4477 20.5523 11 20 11H4C3.44772 11 3 11.4477 3 12V17C3 17.5523 3.44772 18 4 18H20C20.5523 18 21 17.5523 21 17ZM22 12V17C22 18.1046 21.1046 19 20 19H4C2.89543 19 2 18.1046 2 17V12C2 10.8954 2.89543 10 4 10H20C21.1046 10 22 10.8954 22 12Z"
                fill="var(--label_text-color)"
            />
        </svg>
    ),
    jumping: (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M2.5 7.5C2.5 7.22386 2.72386 7 3 7H11C11.2761 7 11.5 7.22386 11.5 7.5C11.5 7.77614 11.2761 8 11 8H3C2.72386 8 2.5 7.77614 2.5 7.5Z"
                fill="var(--label_text-color)"
            />
            <path
                d="M13.5 7.5C13.5 7.22386 13.7239 7 14 7H19.5C20.8807 7 22 8.11929 22 9.5V14.5C22 15.8807 20.8807 17 19.5 17H4.5C3.11929 17 2 15.8807 2 14.5V10.5C2 10.2239 2.22386 10 2.5 10C2.77614 10 3 10.2239 3 10.5V14.5C3 15.3284 3.67157 16 4.5 16H19.5C20.3284 16 21 15.3284 21 14.5V9.5C21 8.67157 20.3284 8 19.5 8H14C13.7239 8 13.5 7.77614 13.5 7.5Z"
                fill="var(--label_text-color)"
            />
        </svg>
    ),
};

function getStyleValue(value: string = 'label'): string {
    return `--${value}_text-color`;
}

function ItemContentTemplate(props) {
    return (
        <div className="tw-flex">
            {ICONS[props.item.item.get('value')]}
            <span className="controls-margin_left-s">{props.item.item.get('title')}</span>
        </div>
    );
}

/**
 * Реакт компонент, редактор выбора метки
 * @class Controls-editors/_properties/LabelEditor
 * @public
 */
export const LabelEditor = memo((props: ILabelEditorProps) => {
    const {
        type,
        value = {},
        defaultValue,
        onChange,
        LayoutComponent = Fragment,
        isJumping = true,
    } = props;
    const readOnly = type.isDisabled();
    // Для оптимизации и избавления от лишних перерисовок
    const currentValue = useRef(value);
    currentValue.current = value;

    const source = useMemo(() => {
        const data = props.customData
            ? props.customData
            : [
                  {
                      title: rk('Текстом слева'),
                      value: 'start',
                  },
                  {
                      title: rk('Текстом сверху'),
                      value: 'top',
                  },
              ];
        if (isJumping) {
            data.push({
                title: rk('Малая метка сверху'),
                value: 'jumping',
            });
        }
        return new Memory({ keyProperty: 'value', data });
    }, []);

    const previewerTarget = useRef<PreviewerTarget>();
    const onInput = useCallback(
        (res) => {
            return onChange({ ...value, label: res });
        },
        [onChange, value.jumping, value.labelPosition, value.icon]
    );
    const textValueProps = useInputChanged(
        value.label === undefined ? defaultValue?.label : value.label,
        onInput
    );
    const selectedKey = useMemo(() => {
        if (value.jumping) {
            return ['jumping'];
        }
        return [value.labelPosition || 'start']; //'hidden'];
    }, [value]);

    const chooseIconHandler = useCallback(
        (icon) => {
            onChange({ ...value, icon });
            previewerTarget.current?.close();
        },
        [onChange, value]
    );

    /* todo вернуть после задачи
    https://online.saby.ru/opendoc.html?guid=ed7aa959-917e-49be-993c-1992beff2ae2&client=3
    const selectedStyle = useMemo(() => {
        return getStyleValue(value.labelStyle || 'label');
    }, [value.labelStyle]);

    const onSelectedStyleChanged = useCallback((res) => {
        onChange({ ...currentValue.current, labelStyle: res });
    }, []);
     */

    const SelectorItemTemplate = useCallback(
        (itemTemplateProps) => {
            return (
                <ItemTemplate
                    {...itemTemplateProps}
                    // todo удалить когда перейду на шрифтовые иконки
                    markerPosition="right"
                    multiLine={true}
                    contentTemplate={props.contentTemplate || ItemContentTemplate}
                />
            );
        },
        [props.contentTemplate]
    );

    const onSelectedKeyChanged = useCallback((keys: string[]) => {
        const selectedValue = keys[0];
        switch (selectedValue) {
            case 'icon':
                onChange({ icon: 'icon-SabyBird' });
                break;
            case 'jumping':
                onChange({
                    label: currentValue.current?.label || defaultValue?.label,
                    jumping: true,
                    icon: currentValue.current?.icon || defaultValue?.icon,
                });
                break;
            default:
                onChange({
                    label: currentValue.current?.label || defaultValue?.label || '',
                    labelPosition: selectedValue,
                    icon: currentValue.current?.icon || defaultValue?.icon,
                });
        }
    }, []);

    const rightFieldTemplate = useCallback(() => {
        return (
            <div className="tw-flex tw-items-center tw-self-end tw-h-full">
                {/* todo вернуть после задачи
            https://online.saby.ru/opendoc.html?guid=ed7aa959-917e-49be-993c-1992beff2ae2&client=3
            selectedKey[0] !== 'hidden' && (
                <ColorButton
                    className="controls-margin_left-s"
                    items={value?.icon ? LABEL_ICON_STYLE_ITEMS : LABEL_FONT_COLOR_STYLE_ITEMS}
                    keyProperty="value"
                    colorProperty="variable"
                    selectedKey={selectedStyle}
                    onSelectedKeyChanged={onSelectedStyleChanged}
                    columnsCount={2}
                    dataQa="Controls-Input-editors_LabelEditor__style"
                />
            )*/}
                <Selector
                    keyProperty="value"
                    source={source}
                    className="controls-LabelEditor-selector tw-self-stretch controls-margin_left-s"
                    readOnly={readOnly}
                    multiSelect={false}
                    selectedKeys={selectedKey}
                    contentTemplate={ICONS[selectedKey[0]] || ICONS.start}
                    itemTemplate={SelectorItemTemplate}
                    onSelectedKeysChanged={onSelectedKeyChanged}
                    dataQa="Controls-Input-editors_LabelEditor__type"
                />
            </div>
        );
    }, [selectedKey[0], value.icon]);

    return (
        <LayoutComponent titlePosition={props.titlePosition}>
            <div className="tw-flex">
                {selectedKey[0] === 'start' && (
                    <OnlyIconEditor
                        className="controls-margin_right-s"
                        value={value.icon}
                        onChange={chooseIconHandler}
                    />
                )}
                <Text
                    placeholder={rk('Метка')}
                    shortPlaceholder={rk('метка')}
                    rightFieldTemplate={rightFieldTemplate}
                    placeholderVisibility="empty"
                    className="tw-w-full"
                    {...textValueProps}
                    readOnly={readOnly}
                    data-qa="controls-PropertyGrid__editor_label"
                />
            </div>
        </LayoutComponent>
    );
});
