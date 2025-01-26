import { useRef, useCallback, forwardRef } from 'react';
import { View, ItemTemplate, EditingTemplate, EmptyTemplate } from 'Controls/list';
import { Text } from 'Controls/input';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { Memory } from 'Types/source';

function itemTemplate(itemTemplateProps) {
    return (
        <ItemTemplate
            {...itemTemplateProps}
            contentTemplate={(contentTemplateProps) => {
                return (
                    <EditingTemplate
                        {...contentTemplateProps}
                        editorTemplate={
                            <Text
                                value={itemTemplateProps.item.contents.title}
                                onValueChanged={(newValue) => {
                                    itemTemplateProps.item.contents.set('title', newValue);
                                }}
                                contrastBackground={true}
                            />
                        }
                        enabled={true}
                        value={itemTemplateProps.item.contents.title}
                    />
                );
            }}
        ></ItemTemplate>
    );
}

const Component = forwardRef(function (props, ref) {
    const listRef = useRef<View>();
    const beginAdd = useCallback(() => {
        listRef.current?.beginAdd();
    }, []);

    function emptyTemplate(emptyTemplateProps) {
        return (
            <EmptyTemplate
                {...emptyTemplateProps}
                align="left"
                bottomSpacing="s"
                topSpacing="s"
                isEditing={true}
                contentTemplate={(editingTemplateProps) => {
                    return (
                        <EditingTemplate
                            {...editingTemplateProps}
                            enabled={true}
                            viewTemplate={<div onClick={beginAdd}>Нажми...</div>}
                        />
                    );
                }}
            />
        );
    }

    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__maxWidth200  controlsDemo_list-new_EmptyTemplate';
    return (
        <div className={rootClass} ref={ref}>
            <View
                ref={listRef}
                storeId="EmptyListEditing"
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate}
            />
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        EmptyListEditing: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new Memory({
                    keyProperty: 'key',
                    data: [],
                }),
            },
        },
    };
};
