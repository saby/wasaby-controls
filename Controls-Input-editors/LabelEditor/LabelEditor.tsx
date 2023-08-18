import { Fragment, memo, ReactElement, useCallback, useMemo, useRef } from 'react';
import { TInternalProps } from 'UICore/executor';
import { TemplateFunction } from 'UI/Base';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { InputContainer } from 'Controls/jumpingLabel';
import { PreviewerTarget } from 'Controls/popup';
import { ItemTemplate } from 'Controls/menu';
import { Label, Text } from 'Controls/input';
import { Combobox } from 'Controls/dropdown';
import { Button } from 'Controls/buttons';
import { Icon } from 'Controls/icon';
import { Memory } from 'Types/source';
import { IconEditorPopup } from 'Controls-editors/properties';
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

type ILabelEditorProps = IPropertyEditorProps<IValue | undefined> & {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    Control?: ReactElement<IControlProps> | TemplateFunction;
    controlProps?: object;
    isJumping?: boolean;
    defaultValue?: IValue;
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
        const data = [
            {
                caption: rk('Отсутствует'),
                value: 'hidden',
            },
            {
                caption: rk('Метка слева'),
                value: 'start',
            },
            {
                caption: rk('Метка сверху'),
                value: 'top',
            },
            {
                caption: rk('Иконка'),
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
        (e) => {
            return onChange({ ...value, label: e.target.value });
        },
        [onChange, value.jumping, value.labelPosition]
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
                    keyProperty="value"
                    itemsSpacing="s"
                    dropdownClassName="controls-LabelEditor-dropdownContainer"
                    placeholder={rk('Отсутствует')}
                    itemTemplate={(itemTemplateProps) => {
                        return (
                            <ItemTemplate
                                {...itemTemplateProps}
                                marker={false}
                                multiLine={true}
                                roundBorder={false}
                                className={`${
                                    itemTemplateProps.item.treeItem.isMarked()
                                        ? 'controls-background-unaccented'
                                        : ''
                                } controls-LabelEditor-item`}
                                contentTemplate={() => {
                                    let className = 'controls-padding-s tw-flex tw-w-full';
                                    const itemValue = itemTemplateProps.item.contents.get('value');
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
                                        ...controlProps,
                                    };
                                    const inputValue = rk('Текст в поле');

                                    return (
                                        <div className={className}>
                                            {!(isHidden || isJumping) &&
                                                (itemValue !== 'icon' ? (
                                                    <Label
                                                        caption={itemTemplateProps.item.contents.get(
                                                            'caption'
                                                        )}
                                                    />
                                                ) : (
                                                    <Icon
                                                        icon="icon-SabyBird"
                                                        iconSize="s"
                                                        iconStyle="secondary"
                                                    />
                                                ))}
                                            {isJumping ? (
                                                <InputContainer
                                                    caption={itemTemplateProps.item.contents.get(
                                                        'caption'
                                                    )}
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
                                    label: value?.label || defaultValue?.label || '',
                                    labelPosition: selectedValue,
                                });
                                break;
                            case 'icon':
                                onChange({ icon: '' });
                                break;
                            case 'jumping':
                                onChange({
                                    label: value?.label || defaultValue?.label || '',
                                    jumping: true,
                                });
                                break;
                        }
                    }}
                    source={source}
                    customEvents={['onValueChanged']}
                />
                {selectedKey &&
                    selectedKey !== 'hidden' &&
                    (typeof value.icon === 'undefined' ? (
                        <Text
                            className="controls-margin_top-m tw-w-full"
                            placeholder={rk('Введите текст')}
                            onInput={onInput}
                            customEvents={['onInput']}
                            value={value.label === undefined ? defaultValue?.label : value.label}
                            readOnly={readOnly}
                            data-qa="controls-PropertyGrid__editor_label"
                        />
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
