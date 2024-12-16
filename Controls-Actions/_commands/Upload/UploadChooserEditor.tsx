import { ReactElement, forwardRef, ForwardedRef, useState, memo } from 'react';
import { default as UploadSource } from './UploadSource';
import { Input, ItemTemplate } from 'Controls/lookup';
import { usePropertyValue, IEditorProps } from 'Controls/propertyGridEditors';
import { Query } from 'Types/source';
import * as rk from 'i18n!Controls-Actions';

function UploadChooserEditor(props: IEditorProps, ref: ForwardedRef<HTMLElement>): ReactElement {
    const { value, onChange, onPropertyValueChanged } = usePropertyValue(props);
    const [source, setSource] = useState(
        () =>
            new UploadSource({
                filter: (item, query) => {
                    console.log('filter', item, query);
                    return true;
                },
            })
    );
    const [inputValue, setInputValue] = useState<string>('');
    return (
        <div className={'tw-w-full'} ref={ref}>
            <Input
                className={'tw-w-full'}
                placeholder={rk('Выберите источник загрузки')}
                multiLine={false}
                multiSelect={false}
                autoDropDown={true}
                showSelectButton={false}
                displayProperty={'title'}
                searchParam={'title'}
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
                        source
                            .query(new Query().where({ id: newSelectedKeys }))
                            .then((result) => {
                                const item = result.getAll().at(0);
                                const newPropertyValue = {
                                    id: item.get('id'),
                                    params: item.get('params'),
                                    integration: item.get('integration'),
                                    title: item.get('title'),
                                };
                                onPropertyValueChanged?.(newPropertyValue);
                            });
                    } else {
                        onPropertyValueChanged?.(null);
                    }
                }}
                selectedKeys={value?.id ? [value.id] : []}
                // TODO selectorTemplate={ }
                horizontalPadding={'null'}
                contrastBackground={false}
                footerTemplate={null}
                itemTemplate={(itemProps) => {
                    return <ItemTemplate {...itemProps} displayProperty={'title'}></ItemTemplate>;
                }}
            ></Input>
        </div>
    );
}

export default memo(forwardRef(UploadChooserEditor));
