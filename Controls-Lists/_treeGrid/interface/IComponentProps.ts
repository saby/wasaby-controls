/**
 * @kaizen_zone e0faa54f-0242-4b8d-a3c5-10c9d5cf59b8
 */
import { IContainerNewProps as IListContainerConnectedProps } from 'Controls/baseList';
import { Model } from 'Types/entity';
import * as React from 'react';

type TComponentDefaultProps = {
    theme: string;
};

/**
 * Опции компонента
 */
interface ITreeGridProps {
    /**
     * Следует ли менять корень при клике по записи.
     */
    changeRootByItemClick: boolean;
}

/**
 * События компонента
 */
interface ITreeGridHandlers {
    onItemClick: (item: Model | Model[], event: React.MouseEvent, columnIndex?: number) => void;
}

export type TComponentProps = Partial<TComponentDefaultProps> &
    Pick<IListContainerConnectedProps, 'storeId'> &
    ITreeGridProps &
    ITreeGridHandlers;

export { ITreeGridHandlers as IComponentHandlers };
