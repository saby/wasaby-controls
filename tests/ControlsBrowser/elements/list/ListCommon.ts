/**
 * Селекторы, которые используются во многих демках списков.
 * @author Зайцев А.С.
 */

export enum ItemText {
    Notebooks = 'Notebooks',
    Tablets = 'Tablets',
    Laptops = 'Laptop computers',
    AndroidGadgets = 'Android gadgets',
    AppleGadgets = 'Apple gadgets',
}

export const notebooksSelector = {
    textContaining: ItemText.Notebooks,
};

export const tabletsSelector = {
    textContaining: ItemText.Tablets,
};

export const laptopsSelector = {
    textContaining: ItemText.Laptops,
};

export const androidGadgetsSelector = {
    textContaining: ItemText.AndroidGadgets,
};

export const appleGadgetsSelector = {
    textContaining: ItemText.AppleGadgets,
};
