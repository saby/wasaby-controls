import { Base as MasterDetail, IMasterDetail } from 'Controls/masterDetail';
import { PropertyGrid, IPropertyGridByStoreProps } from 'Controls-editors/propertyGrid';
import { NavigationList } from './NavigationList';
import { Container as ScrollContainer } from 'Controls/scroll';
import { forwardRef } from 'react';
import { Container as DragNDropContainer } from 'Controls/dragnDrop';
import { IComponentPropsWithReadonly } from 'Controls/interface';

export type IMasterDetailPropertyGridLayoutProps = IPropertyGridByStoreProps &
    Pick<
        IMasterDetail,
        | 'detailContrastBackground'
        | 'contrastBackground'
        | 'initialMasterWidth'
        | 'masterPosition'
        | 'masterWidth'
        | 'masterMinWidth'
        | 'masterMaxWidth'
        | 'className'
    > &
    Pick<IComponentPropsWithReadonly, 'readOnly'>;

/**
 * Компонент отображения PG c MasterDetail раскладкой
 * @demo Controls-editors-demo/PropertyGrid/Layouts/Index
 * @public
 */
export const MasterDetailPropertyGridLayout = forwardRef<
    DragNDropContainer,
    IMasterDetailPropertyGridLayoutProps
>(function PropertyGridLayout(props, ref) {
    const {
        detailContrastBackground = false,
        contrastBackground,
        initialMasterWidth,
        masterPosition,
        masterWidth = '200px',
        masterMinWidth,
        masterMaxWidth,
        className,
    } = props;

    return (
        // @ts-ignore
        <DragNDropContainer ref={ref}>
            <MasterDetail
                detailContrastBackground={detailContrastBackground}
                contrastBackground={contrastBackground}
                initialMasterWidth={initialMasterWidth}
                masterPosition={masterPosition}
                masterWidth={masterWidth}
                masterMinWidth={masterMinWidth}
                masterMaxWidth={masterMaxWidth}
                className={className}
                master={<NavigationList storeId={props.storeId} />}
                detail={<Detail {...props} storeId={props.storeId} />}
            />
        </DragNDropContainer>
    );
});

interface IDetailProps extends IPropertyGridByStoreProps {
    attrs?: Record<string, string>;
}

function Detail(props: IDetailProps) {
    return (
        <ScrollContainer className={props.attrs?.className} backgroundStyle={'transparent'}>
            <PropertyGrid {...props} storeId={props.storeId} />
        </ScrollContainer>
    );
}
