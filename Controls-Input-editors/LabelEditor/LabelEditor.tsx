import { Fragment, memo, ReactElement, useCallback, useMemo, useRef } from 'react';
import { TInternalProps } from 'UICore/executor';
import { TemplateFunction } from 'UI/Base';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { IComponent, IPropertyEditorProps } from 'Meta/types';
import { InputContainer } from 'Controls/jumpingLabel';
import { PreviewerTarget } from 'Controls/popupTargets';
import { ItemTemplate } from 'Controls/menu';
import { Label, Text } from 'Controls/input';
import { default as Combobox } from 'Controls/ComboBox';
import { Button } from 'Controls/buttons';
import { Icon } from 'Controls/icon';
import { Memory } from 'Types/source';
import { IconEditorPopup } from 'Controls-editors/properties';
import { useInputChanged } from 'Controls-editors/hooks';
import * as rk from 'i18n!Controls-editors';
import 'css!Controls-Input-editors/LabelEditor/LabelEditor';

interface IValue {
    labelPosition?: 'start' | 'top' | 'hidden';
    jumping?: boolean;
    label?: string;
    icon?: string;
}

interface IControlProps extends TInternalProps {
    placeholder?: string;
    placeholderVisibility?: string;
    value?: string;

    [name: string]: unknown;
}

export type ILabelEditorProps = IPropertyEditorProps<IValue | undefined> & {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    Control?: ReactElement<IControlProps> | TemplateFunction;
    controlProps?: object;
    isJumping?: boolean;
    defaultValue?: IValue;
    customData?: object[];
};

/**
 * Реакт компонент, редактор выбора метки
 * @class Controls-editors/_properties/LabelEditor
 * @public
 */
export const LabelEditor = memo((props: ILabelEditorProps) => {
    const {
        type,
        value,
        defaultValue,
        onChange,
        LayoutComponent = Fragment,
        Control = Text,
        controlProps = {},
        isJumping = true,
    } = props;
    const readOnly = type.isDisabled();

    const source = useMemo(() => {
        const data = props.customData
            ? props.customData
            : [
                  {
                      caption: rk('Отсутствует'),
                      value: 'hidden',
                  },
                  {
                      caption: rk('Текстом слева'),
                      menuCaption: rk('Метка слева'),
                      value: 'start',
                  },
                  {
                      caption: rk('Текстом сверху'),
                      menuCaption: rk('Метка сверху'),
                      value: 'top',
                  },
                  {
                      caption: rk('Иконка слева'),
                      value: 'icon',
                  },
              ];
        if (isJumping) {
            data.push({
                caption: rk('Прыгающая'),
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
        [onChange, value.jumping, value.labelPosition]
    );
    const textValueProps = useInputChanged(
        value.label === undefined ? defaultValue?.label : value.label,
        onInput
    );
    const selectedKey = useMemo(() => {
        if (value.labelPosition === 'hidden') {
            return 'hidden';
        }
        if (typeof value.icon !== 'undefined') {
            return 'icon';
        }
        if (value.jumping) {
            return 'jumping';
        }
        return value.labelPosition || 'hidden';
    }, [value]);

    const chooseIconHandler = (icon) => {
        onChange({ ...value, icon: icon.name !== 'empty' ? icon.name : '' });
        previewerTarget.current?.close();
    };

    const getIcon = () => {
        return value.icon || 'icon-Close';
    };

    const getIconStyle = () => {
        return value.icon ? 'secondary' : 'unaccented';
    };

    return (
        <LayoutComponent>
            <>
                <Combobox
                    closeMenuOnOutsideClick={true}
                    selectedKey={selectedKey}
                    readOnly={readOnly}
                    displayProperty="caption"
                    fontColorStyle="label"
                    keyProperty="value"
                    itemsSpacing="s"
                    dropdownClassName="controls-LabelEditor-dropdownContainer"
                    placeholder={rk('Отсутствует')}
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
                                    let className = 'controls-padding-s tw-flex tw-w-full';
                                    const itemValue = itemTemplateProps.item.contents.get('value');
                                    const isLabelHidden =
                                        itemTemplateProps.item.contents.get('isLabelHidden');
                                    const isFlexRow = itemValue === 'start' || itemValue === 'icon';
                                    const isHidden = itemValue === 'hidden';
                                    const isJumping = itemValue === 'jumping';
                                    if (isFlexRow) {
                                        className += ' tw-flex-row tw-items-baseline';
                                    } else {
                                        className += ' tw-flex-col';
                                    }
                                    const contentProps = {
                                        placeholder: isHidden ? rk('Без метки') : rk('Поле'),
                                        placeholderVisibility: 'empty',
                                        className: `${
                                            isFlexRow ? 'controls-margin_left-s' : ''
                                        } tw-flex-grow controls-LabelEditor-Control`,
                                        readOnly: true,
                                        itemValue,
                                        itemCaption: itemTemplateProps.item.contents.get('caption'),
                                        ...controlProps,
                                    };
                                    const inputValue = rk('Текст в поле');
                                    const captionText =
                                        itemTemplateProps.item.contents.get('menuCaption') ||
                                        itemTemplateProps.item.contents.get('caption');

                                    return (
                                        <div className={className}>
                                            {!(isHidden || isJumping || isLabelHidden) &&
                                                (itemValue !== 'icon' ? (
                                                    <Label caption={captionText} />
                                                ) : (
                                                    <Icon
                                                        icon="icon-SabyBird"
                                                        iconSize="s"
                                                        iconStyle="secondary"
                                                    />
                                                ))}
                                            {isJumping ? (
                                                <InputContainer
                                                    caption={captionText}
                                                    value={inputValue}
                                                    content={
                                                        <Control
                                                            {...contentProps}
                                                            value={inputValue}
                                                        />
                                                    }
                                                />
                                            ) : (
                                                <Control {...contentProps} />
                                            )}
                                        </div>
                                    );
                                }}
                            />
                        );
                    }}
                    onValueChanged={(caption) => {
                        const selectedValue = source.data.find((item) => {
                            return item.caption === caption;
                        })?.value;
                        switch (selectedValue) {
                            case 'hidden':
                                onChange({ labelPosition: 'hidden' });
                                break;
                            case 'top':
                            case 'start':
                                onChange({
                                    label: value?.label || defaultValue?.label || rk('Метка'),
                                    labelPosition: selectedValue,
                                });
                                break;
                            case 'icon':
                                onChange({ icon: 'icon-SabyBird' });
                                break;
                            case 'jumping':
                                onChange({
                                    label: value?.label || defaultValue?.label || rk('Метка'),
                                    jumping: true,
                                });
                                break;
                            default:
                                onChange({
                                    label: value?.label || defaultValue?.label || '',
                                    labelPosition: selectedValue,
                                });
                        }
                    }}
                    source={source}
                    customEvents={['onValueChanged']}
                />
                {selectedKey &&
                    selectedKey !== 'hidden' &&
                    (typeof value.icon === 'undefined' ? (
                        value.jumping ? null : (
                            <Text
                                className="controls-margin_top-m tw-w-full"
                                placeholder={rk('Введите текст')}
                                {...textValueProps}
                                readOnly={readOnly}
                                data-qa="controls-PropertyGrid__editor_label"
                            />
                        )
                    ) : (
                        <PreviewerTarget
                            ref={previewerTarget}
                            delay={200}
                            trigger="click"
                            actionOnScroll="none"
                            targetPoint={{ vertical: 'top', horizontal: 'left' }}
                            direction={{ vertical: 'top', horizontal: 'right' }}
                            content={(contentTemplate) => {
                                return (
                                    <Button
                                        {...contentTemplate}
                                        ref={contentTemplate.$wasabyRef}
                                        className="iconEditor_icon-button controls-margin_top-s"
                                        viewMode="link"
                                        icon={getIcon()}
                                        iconSize="m"
                                        iconStyle={getIconStyle()}
                                    />
                                );
                            }}
                            template={() => {
                                return <IconEditorPopup onSendResult={chooseIconHandler} />;
                            }}
                        />
                    ))}
            </>
        </LayoutComponent>
    );
});
