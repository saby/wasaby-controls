/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { Model } from 'Types/entity';
import type * as React from 'react';

export interface IAbstractComponentEventHandlers {
    onItemClick?: (item: Model | Model[], event: React.MouseEvent) => void;
}
