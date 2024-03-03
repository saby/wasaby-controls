import { Fragment, memo, ReactElement, useCallback, useMemo } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Model } from 'Types/entity';
import { default as CarouselControl } from 'Carousel/View';
import 'css!Controls-editors/_carousel/CarouselEditor';

const CUSTOM_EVENTS = ['onSlideChanged'];

/**
 * @public
 */
export interface ICarouselEditorProps extends IPropertyGridPropertyEditorProps<string> {
    /**
     * Шаблон, который будет отображен в карусели
     */
    itemTemplate?: ReactElement;
    /**
     * Массив, с данными, по которым будет строиться карусель
     */
    items: object[];
    /**
     * Имя поля записи, в котором хранится ключ элемента.
     */
    keyProperty?: string;
}

/**
 * Реакт компонент, редактор карусели
 * @class Controls-editors/_carousel/CarouselEditor
 * @implements Controls-editors/carousel:ICarouselEditorProps
 * @public
 */
export const CarouselEditor = memo((props: ICarouselEditorProps) => {
    const {
        type,
        value,
        onChange,
        items,
        itemTemplate,
        keyProperty = 'id',
        LayoutComponent = Fragment,
    } = props;
    const readOnly = type.isDisabled();
    const onSlideChanged = useCallback((model: Model) => {
        onChange(model.get('id'));
    }, []);
    const itemsContainerPadding = useMemo(() => {
        return { left: '0', right: '0' };
    }, []);

    return (
        <LayoutComponent title={null}>
            <CarouselControl
                className="controls-CarouselEditor-wrapper"
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
