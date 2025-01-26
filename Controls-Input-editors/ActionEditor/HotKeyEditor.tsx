import { forwardRef, useMemo, LegacyRef } from 'react';
import { Input } from 'Controls/lookup';
import { RecordSet } from 'Types/collection';
import { Memory } from 'Types/source';
import { IActionOptions } from 'Controls-Input/interface';
import { constants } from 'Env/Env';
import { default as validateHotKey } from './validateHotKey';
import * as rk from 'i18n!Controls-Input';

const DOT_KEY_CODE = 190;
const COMMA_KEY_CODE = 188;

const layouts = {
    ru: 'йцукенгшщзхъфывапролджэячсмитьбю.ЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ,"№;:?',
    en: 'qwertyuiop[]asdfghjkl;\'zxcvbnm,./QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>?@#$^&',
};

function getCorrectKeyCode(str?: string): number {
    if (str) {
        const index = layouts.ru.indexOf(str[0]);
        if (index !== -1) {
            return layouts.en[index].toUpperCase().charCodeAt(0);
        }
        return str[0].toUpperCase().charCodeAt(0);
    }
    return 81;
}

function isIgnoredHotkey(event: KeyboardEvent) {
    if (
        !event.keyCode ||
        !(
            (event.keyCode > 46 && event.keyCode < 91) ||
            event.keyCode === constants.key.space ||
            event.keyCode === DOT_KEY_CODE ||
            event.keyCode === COMMA_KEY_CODE
        ) ||
        !(event.altKey || event.ctrlKey || event.shiftKey)
    ) {
        return true;
    }
    return false;
}

function getSymbolOnKeyCode(keyCode: number) {
    switch (keyCode) {
        case constants.key.space:
            return rk('Пробел');
        case COMMA_KEY_CODE:
            return rk('Запятая');
        case DOT_KEY_CODE:
            return rk('Точка');
        default:
            return String.fromCharCode(keyCode);
    }
}

function getSelectedKey(value: IActionOptions['hotKey']): string[] {
    if (value && value.keyCode) {
        let prefix = '';
        if (value?.ctrlKey) {
            prefix += 'Ctrl + ';
        }
        if (value?.altKey) {
            prefix += 'Alt + ';
        }
        if (value?.shiftKey) {
            prefix += 'Shift + ';
        }
        return [`${prefix}${getSymbolOnKeyCode(value?.keyCode || 81)}`];
    }
    return [];
}

interface IHotKeyEditorProps {
    commandName?: string;
    validationStatus?: string;
    propertyValue?: IActionOptions['hotKey'];
    onPropertyValueChanged: (value: IActionOptions['hotKey'] | null, bubbling: true) => void;
}

interface IHotKeyEditorState {
    id: string;
    title: string;
    caption: string;
    value: Required<IActionOptions>['hotKey'],
}

function getCorrectKeyValue(data: IHotKeyEditorState): IHotKeyEditorState {
    if (validateHotKey({value: data.value as KeyboardEvent}) === true) {
        return data;
    }
    data.value.shiftKey = true;
    data.id = data.caption = data.title = data.id.replace(/(Ctrl|Alt|Shift)/g, '$1 + Shift');
    return data;
}

export default forwardRef(function HotKeyEditor(props: IHotKeyEditorProps, ref: LegacyRef<Input>) {
    const value = useMemo(() => {
        return getSelectedKey(props.propertyValue);
    }, [props.propertyValue]);
    const items = useMemo(() => {
        if (props.propertyValue) {
            return new RecordSet({
                rawData: [
                    {
                        id: value[0],
                        title: value[0],
                        caption: value[0],
                        value: props.propertyValue,
                    },
                ],
                keyProperty: 'id',
            });
        }
        return undefined;
    }, [value?.[0]]);
    const source = useMemo(() => {
        const keyCode = getCorrectKeyCode(props.commandName);
        const key = String.fromCharCode(keyCode);
        return new Memory({
            data: [
                getCorrectKeyValue({
                    id: `Alt + ${key}`,
                    title: `Alt + ${key}`,
                    caption: `Alt + ${key}`,
                    value: {
                        keyCode,
                        altKey: true,
                        ctrlKey: false,
                        shiftKey: false,
                    },
                }),
                getCorrectKeyValue({
                    id: `Ctrl + ${key}`,
                    title: `Ctrl + ${key}`,
                    caption: `Ctrl + ${key}`,
                    value: {
                        keyCode,
                        altKey: false,
                        ctrlKey: true,
                        shiftKey: false,
                    },
                }),
                {
                    id: `Shift + ${key}`,
                    title: `Shift + ${key}`,
                    caption: `Shift + ${key}`,
                    value: {
                        keyCode,
                        altKey: false,
                        ctrlKey: false,
                        shiftKey: true,
                    },
                },
            ],
            keyProperty: 'id',
            // Если не указать фильтр, то suggest всегда будет отображать "Нет данных"
            filter: () => true,
        });
    }, [props.commandName]);
    return (
        <Input
            ref={ref}
            placeholder={value?.[0] ? '' : rk('Нажмите сочетание клавиш')}
            placeholderVisibility="empty"
            className="tw-w-full"
            showSelectButton={false}
            multiSelect={true}
            items={items}
            source={source}
            value=""
            isReact={true}
            autoDropDown={true}
            closeButtonVisible={false}
            counterVisibility={false}
            keyProperty="id"
            displayProperty="title"
            searchParam="title"
            multiLine={false}
            selectedKeys={value}
            bubbling={true}
            // @ts-ignore
            footerTemplate={null}
            suggestFooterTemplate={null}
            validationStatus={props.validationStatus}
            onSelectedKeysChanged={(selectedKeys, added) => {
                let value = null;
                const keys = added.length ? added : selectedKeys;
                if (keys) {
                    source.data.forEach((item: Record<string, unknown>) => {
                        if (item.id === keys[0]) {
                            value = item.value;
                        }
                    });
                }
                props.onPropertyValueChanged(value, true);
            }}
            onKeyDown={(e: KeyboardEvent) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isIgnoredHotkey(e)) {
                    props.onPropertyValueChanged(
                        {
                            keyCode: e.keyCode,
                            altKey: e.altKey,
                            ctrlKey: e.ctrlKey,
                            shiftKey: e.shiftKey,
                        },
                        true
                    );
                }
            }}
        />
    );
});
