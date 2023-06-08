/**
 * @kaizen_zone 1eafdb06-eb75-4353-b8d8-60b6cf34618f
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { ICaption } from 'Controls/interface';
import template = require('wml!Controls/_search/Misspell');
import 'css!Controls/search';

/**
 * Контрол, отображающий подсказку, если в запросе при поиске найдена и исправлена опечатка.
 * @class Controls/_search/Misspell
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/ руководство разработчика по организации поиска и фильтрации в реестре}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/component-kinds/ руководство разработчика по классификации контролов Wasaby и схеме их взаимодействия}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/search/change-layout/ Поиск со сменой раскладки}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_search.less переменные тем оформления}
 *
 * @implements Controls/interface:ICaption
 * @extends UI/Base:Control
 *
 * @public
 */
/*
 * //TODO KONGO A control that displays a tooltip if misspell was in search text was found.
 *
 * @implements Controls/interface:ICaption
 * @extends UI/Base:Control
 *
 * @public
 * @author Крайнов Д.О.
 */

class Misspell extends Control<IControlOptions & ICaption> implements ICaption {
    protected _template: TemplateFunction = template;

    readonly '[Controls/_interface/ICaption]': true;
}

export default Misspell;
