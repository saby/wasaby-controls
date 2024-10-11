import { Fragment, memo } from 'react';
import { Control as Tumbler } from 'Controls/Tumbler';
import { RecordSet } from 'Types/collection';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';

interface ISizeEditorOption {
    id: string;
    value: string;
    caption: string;
}

interface ISizeEditorProps extends IPropertyGridPropertyEditorProps<string> {
    options?: string[] | ISizeEditorOption[];
}

/**
 * Реакт компонент, редактор размера
 * @class Controls-editors/_properties/SizeEditor
 * @public
 */
export const SizeEditor = memo((props: ISizeEditorProps) => {
    const { options, onChange, value = '', LayoutComponent = Fragment } = props;
    const items = new RecordSet({
        keyProperty: 'id',
        rawData: options.map((option) => {
            if (typeof option === 'string') {
                return {
                    caption: option.toUpperCase(),
                    id: option,
                    value: option,
                };
            }
            return { ...option, caption: option.caption.toUpperCase() };
        }),
    });

    return (
        <LayoutComponent>
            <Tumbler
                data-qa="controls-PropertyGrid__editor_size"
                {...props}
                selectedKey={value || 'm'}
                inlineHeight="m"
                fontSize="m"
                items={items}
                keyProperty="id"
                onSelectedKeyChanged={onChange}
                customEvents={['onSelectedKeyChanged']}
            />
        </LayoutComponent>
    );
});
