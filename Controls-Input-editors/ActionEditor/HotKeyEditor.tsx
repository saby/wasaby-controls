import { forwardRef, useMemo } from 'react';
import { Input } from 'Controls/lookup';
import { RecordSet } from 'Types/collection';
import { Memory } from 'Types/source';
import { IActionOptions } from 'Controls-Input/interface';

const layouts = {
    ru: 'йцукенгшщзхъфывапролджэячсмитьбю.ЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ,"№;:?',
    en: 'qwertyuiop[]asdfghjkl;\'zxcvbnm,./QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>?@#$^&',
};

function getCorrectKeyCode(str?: string): number {
    if (str) {
        const index = str[0].indexOf(layouts.ru);
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
        !(event.keyCode > 46 && event.keyCode < 91) /* ||
        !(event.altKey || event.ctrlKey || event.shiftKey)
        */
    ) {
        return true;
    }
    return false;
}

function getSelectedKey(value: IActionOptions['hotKey']): string[] {
    if (value && value.keyCode) {
        let prefix = '';
        switch (true) {
            case value?.altKey:
                prefix = 'Alt + ';
                break;
            case value?.ctrlKey:
                prefix = 'Ctrl + ';
                break;
            case value?.shiftKey:
                prefix = 'Shift + ';
                break;
        }
        return [`${prefix}${String.fromCharCode(value?.keyCode || 81)}`];
    }
    return [];
}

export default forwardRef(function HotKeyEditor(props: Record<string, unknown>, ref) {
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
                {
                    id: `Alt + ${key}`,
                    title: `Alt + ${key}`,
                    caption: `Alt + ${key}`,
                    value: {
                        keyCode,
                        altKey: true,
                        ctrlKey: false,
                        shiftKey: false,
                    },
                },
                {
                    id: `Ctrl + ${key}`,
                    title: `Ctrl + ${key}`,
                    caption: `Ctrl + ${key}`,
                    value: {
                        keyCode,
                        altKey: false,
                        ctrlKey: true,
                        shiftKey: false,
                    },
                },
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
            className="tw-w-full"
            showSelectButton={false}
            multiSelect={false}
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
            footerTemplate={null}
            suggestFooterTemplate={null}
            validationStatus={props.validationStatus}
            onSelectedKeysChanged={(selectedKeys) => {
                let value = null;
                if (selectedKeys) {
                    source.data.forEach((item) => {
                        if (item.id === selectedKeys[0]) {
                            value = item.value;
                        }
                    });
                }
                props.onPropertyValueChanged(value, true);
            }}
            onKeyDown={(e: KeyboardEvent) => {
                e.preventDefault();
                e.nativeEvent.stopImmediatePropagation();
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
