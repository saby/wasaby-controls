/**
 * Created by am.gerasimov on 17.07.2018.
 */
define('Controls-demo/Filter/Container', [
   'UI/Base',
   'wml!Controls-demo/Filter/Container',
   'Types/source',
   'Controls-demo/Utils/MemorySourceData',
   'Controls/search',
   'Controls/filter'
], function (Base, template, sourceLib, memorySourceData) {
   'use strict';
   var SearchContainer = Base.Control.extend({
      _template: template,
      _navigation: null,
      _filter: null,
      _filterTabs: null,
      _filterButtonData: null,

      _beforeMount: function () {
         this._navigation = {
            source: 'page',
            view: 'page',
            sourceConfig: {
               pageSize: 20,
               page: 0,
               hasMore: false
            }
         };
         this._filter = {};
         this._filterTabs = {};
         this._filterButtonData = [
            {
               name: 'department',
               resetValue: 'По департаменту',
               value: 'По департаменту',
               viewMode: 'frequent',
               editorOptions: {
                  keyProperty: 'title',
                  displayProperty: 'title',
                  source: new sourceLib.Memory({
                     data: [
                        { id: 0, title: 'По департаменту' },
                        { id: 1, title: 'Разработка' },
                        { id: 2, title: 'Продвижение СБИС' },
                        { id: 3, title: 'Федеральная клиентская служка' },
                        { id: 4, title: 'Служба эксплуатации' },
                        { id: 5, title: 'Технологии и маркетинг' },
                        {
                           id: 6,
                           title: 'Федеральный центр продаж. Call-центр Ярославль'
                        },
                        { id: 7, title: 'Сопровождение информационных систем' }
                     ]
                  })
               }
            },
            {
               name: 'owner',
               resetValue: '0',
               value: '0',
               viewMode: 'frequent',
               editorOptions: {
                  keyProperty: 'owner',
                  displayProperty: 'title',
                  source: new sourceLib.Memory({
                     data: [
                        { id: 0, title: 'По ответственному', owner: '0' },
                        { id: 1, title: 'Новиков Д.В.', owner: 'Новиков Д.В.' },
                        { id: 2, title: 'Кошелев А.Е.', owner: 'Кошелев А.Е.' },
                        {
                           id: 3,
                           title: 'Субботин А.В.',
                           owner: 'Субботин А.В.'
                        },
                        {
                           id: 4,
                           title: 'Чеперегин А.С.',
                           owner: 'Чеперегин А.С.'
                        }
                     ]
                  })
               }
            },
            {
               name: 'owner',
               resetValue: '0',
               value: '0',
               source: new sourceLib.Memory({
                  data: [
                     { id: '0', title: 'По ответственному', lastName: '0' },
                     {
                        id: '1',
                        title: 'Новиков Д.В.',
                        lastName: 'Новиков Д.В.'
                     },
                     {
                        id: '2',
                        title: 'Кошелев А.Е.',
                        lastName: 'Кошелев А.Е.'
                     },
                     {
                        id: '3',
                        title: 'Субботин А.В.',
                        lastName: 'Субботин А.В.'
                     },
                     {
                        id: '4',
                        title: 'Чеперегин А.С.',
                        lastName: 'Чеперегин А.С.'
                     }
                  ],
                  keyProperty: 'id'
               })
            }
         ];
         this._source = new sourceLib.Memory({
            data: memorySourceData.departments,
            keyProperty: 'id'
         });
      }
   });

   SearchContainer._styles = ['Controls-demo/Filter/Container'];

   return SearchContainer;
});
