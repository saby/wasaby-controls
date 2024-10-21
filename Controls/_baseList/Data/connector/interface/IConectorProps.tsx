/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type * as React from 'react';
import { IViewOptions } from './IViewOptions';

export interface IConnectorProps {
    storeId: string;
    children: React.ReactElement<IViewOptions>;
    preloadRoot?: boolean;
    ignoreOptionsValidate?: boolean;
    changeRootByItemClick?: boolean;
}
