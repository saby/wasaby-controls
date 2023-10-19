import { Fragment, memo, ReactElement, useCallback, useMemo } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Model } from 'Types/entity';
import { default as CarouselControl } from 'Carousel/View';

const CUSTOM_EVENTS = ['onSlideChanged'];

interface ICarouselEditorProps extends IPropertyGridPropertyEditorProps<string> {
    itemTemplate?: ReactElement,
    items: object[],
    keyProperty?: string;
}

/**
 * Реакт компонент, редактор карусели
 * @class Controls-editors/_carousel/CarouselEditor
 * @public
 */
export const CarouselEditor = memo((props: ICarouselEditorProps) => {
    const {type, value, onChange, items, itemTemplate, keyProperty = 'id', LayoutComponent = Fragment} = props;
    const readOnly = type.isDisabled();
    const onSlideChanged = useCallback((model: Model) => {
        onChange(model.get('id'));
    }, []);
    const itemsContainerPadding = useMemo(()=>{
        return {left: '0', right: '0'};
    },[]);

    return (
        <LayoutComponent title={null}>
            <CarouselControl
                items={items}
                arrowSize="xl"
                infinite={true}
                fullSize={true}
                selectedKey={value}
                readOnly={readOnly}
                keyProperty={keyProperty}
                itemTemplate={itemTemplate}
                itemsContainerPadding={itemsContainerPadding}
                onSlideChanged={onSlideChanged}
                customEvents={CUSTOM_EVENTS}
            />
        </LayoutComponent>
    );
});
