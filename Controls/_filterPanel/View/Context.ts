import { createContext } from 'react';
import { IFilterDescriptionItem } from 'Controls/filter';
import { TEditorsViewMode } from './ViewModel';

export const FilterDescriptionContext = createContext<IFilterDescriptionItem>({});
FilterDescriptionContext.displayName = 'FilterDescriptionContext';
export const FilterDescriptionContextProvider = FilterDescriptionContext.Provider;

interface IFilterDescriptionContext {
    filterViewMode: 'default' | 'popup';
    editorsViewMode: TEditorsViewMode;
    contrastBackground: boolean;
}
export const FilterPanelContext = createContext<IFilterDescriptionContext>({});
FilterPanelContext.displayName = 'FilterPanelContext';
export const FilterPanelContextProvider = FilterPanelContext.Provider;
