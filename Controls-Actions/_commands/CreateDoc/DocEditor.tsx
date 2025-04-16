import { ReactElement, forwardRef, ForwardedRef, useState, memo } from 'react';
import { default as DocSource } from './DocSource';
import { Input, ItemTemplate } from 'Controls/lookup';
import { usePropertyValue, IEditorProps } from 'Controls/propertyGridEditors';
import { Query } from 'Types/source';
import * as rk from 'i18n!Controls-Actions';

function DocChooserEditor(props: IEditorProps, ref: ForwardedRef<HTMLElement>): ReactElement {
    const { value, onChange, onPropertyValueChanged } = usePropertyValue(props);
    const [source, setSource] = useState(() => new DocSource({}));
    const [inputValue, setInputValue] = useState<string>('');
    return (
        <div className={'tw-w-full'} ref={ref}>
            <Input
                className={'tw-w-full'}
                placeholder={rk('Регламент')}
                multiLine={false}
                multiSelect={false}
                autoDropDown={true}
                showSelectButton={false}
                displayProperty={'name'}
                searchParam={'name'}
                keyProperty={'id'}
                source={source}
                filter={{}}
                value={inputValue}
                onValueChanged={(newValue: string) => {
                    setInputValue(newValue);
                    onChange(newValue);
                }}
                onSelectedKeysChanged={(newSelectedKeys: string[]) => {
                    if (newSelectedKeys.length) {
                        source.query(new Query().where({ id: newSelectedKeys })).then((result) => {
                            const item = result.getAll().at(0);
                            const newPropertyValue = {
                                id: item.get('id'),
                                name: item.get('name'),
                                meta: item.get('meta'),
                            };
                            onPropertyValueChanged?.(newPropertyValue);
                        });
                    } else {
                        onPropertyValueChanged?.(null);
                    }
                }}
                selectedKeys={value?.id ? [value.id] : []}
                horizontalPadding={'null'}
                contrastBackground={false}
                footerTemplate={{}}
                itemTemplate={(itemProps) => {
                    return <ItemTemplate {...itemProps} displayProperty={'name'}></ItemTemplate>;
                }}
            ></Input>
        </div>
    );
}

export default memo(forwardRef(DocChooserEditor));
