import type { GridCell } from 'Controls/gridDisplay';
import type { TreeGridGroupDataCell } from 'Controls/treeGridDisplay';

/*
 * Утилита проверяет, принадлежит ли ячейка узлу дерева в виде группы
 */
export function isTreeGroupNodeCell(cell: GridCell): boolean {
    return !!(cell as unknown as TreeGridGroupDataCell)?.[
        '[Controls/treeGrid:TreeGridGroupDataCell]'
    ];
}
