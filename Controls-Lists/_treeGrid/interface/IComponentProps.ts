import { IContainerNewProps as IListContainerConnectedProps } from 'Controls/baseList';
import { Model } from 'Types/entity';
import * as React from 'react';

type TComponentDefaultProps = {
    theme: string;
};

interface ITreeGridProps {
    changeRootByItemClick: boolean;
}

interface ITreeGridHandlers {
    onItemClick: (item: Model | Model[], event: React.MouseEvent, columnIndex?: number) => void;
}

export type TComponentProps = Partial<TComponentDefaultProps> &
    Pick<IListContainerConnectedProps, 'storeId'> &
    ITreeGridProps &
    ITreeGridHandlers;

export { ITreeGridHandlers as IComponentHandlers };
