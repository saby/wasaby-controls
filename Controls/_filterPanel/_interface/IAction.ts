import { IAction as IBaseItemAction } from 'Controls/interface';

/**
 * Интерфейс {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опций записи}.
 * @remark
 * Опции записи могут быть использованы в следующих вариантах:
 *
 * 1. Панель опций записи, отображаемая в desktop браузерах.
 * 2. Панель опций записи, появляющаяся при свайпе по записи влево.
 * 3. Всплывающее меню, появляющееся при нажатии на кнопку дополнительных опций записи.
 * 4. Всплывающее (контекстное) меню, появляющееся при нажатии правой кнопкой мыши.
 *
 * {@link http://axure.tensor.ru/StandardsV8/%D0%BE%D0%BF%D1%86%D0%B8%D0%B8_%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D0%B8.html Спецификация Axure}
 * @public
 */
export interface IAction extends IBaseItemAction {
    /**
     * Имя команды, выполняемой при клике на кнопку действия. Список стандартных команд вы можете посмотреть в библиотеке {@link Controls/listCommands}.
     * Если задано, то передаётся в конфигурацию {@link actionName исполняемого действия}.
     * @name Controls/_filterPanel/_interface/IAction#commandName
     * @cfg {String}
     */
    /**
     * Опции команды, выполняемой при клике на кнопку действия.
     * Если задано, то передаётся в конфигурацию {@link actionName исполняемого действия}.
     * @name Controls/_filterPanel/_interface/IAction#commandOptions
     * @cfg {Object}
     */
}
