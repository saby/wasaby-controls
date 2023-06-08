import type { IGridViewProps } from 'Controls/gridReact';
import type { INavigationComponentProps } from 'Controls/columnScrollReact';

export interface IGridViewColumnScrollClearProps {
    stickyColumnsCount?: number;
    columnScrollViewMode?: INavigationComponentProps['mode'] | 'unaccented';
    columnScrollNavigationPosition?: 'custom';
    columnScrollStartPosition?: number | 'end';
}

export interface IGridViewColumnScrollProps
    extends IGridViewProps,
        IGridViewColumnScrollClearProps {}

export interface IInnerDeviceViewProps extends IGridViewColumnScrollProps {
    shouldUseFakeRender: boolean;
    viewClassName: string;
    fixedWrapperClassName: string;
    transformedWrapperClassName: string;
    hydrationPreRenderClassName: string;
}
