/**
 * Created by am.gerasimov on 21.06.2017.
 */
define(['Controls/lookup', 'Types/collection', 'Types/source', 'Types/entity'], function (
   lookup,
   collection,
   sourceLib,
   entity
) {
   'use strict';

   /* Сделаем кастомную модель,
      чтобы не совпадал _moduleName */
   class customModel extends entity.Model {
      constructor(...args) {
         super(...args);
         this._moduleName = 'customModel';
         this._$properties = {
            isCustom: {
               get: function () {
                  return true;
               }
            }
         };
      }
   }

   let dataSource = new sourceLib.SbisService({ model: customModel });
   let list = new collection.List();
   let recordSet = new collection.RecordSet();
   let model = new entity.Model();

   list.add(new entity.Model());
   model.set('recordSet', recordSet);
   recordSet._getMediator().addRelationship(model, recordSet, 'customRelationship');
   let ToSourceModel = lookup.ToSourceModel;

   describe('Controls/_lookup/resources/ToSourceModel', function () {
      describe('check collections', function () {
         it('check list', function () {
            var res = true;

            try {
               ToSourceModel(list.clone(), dataSource, '', true);
            } catch (e) {
               res = false;
            }

            expect(res).toEqual(true);
         });

         it('check recordset', function () {
            var res = true;

            try {
               ToSourceModel(recordSet.clone(), dataSource, '', true);
            } catch (e) {
               res = false;
            }

            expect(res).toEqual(true);
         });
      });

      describe('to source model', function () {
         it('check model by step', function () {
            expect(model.isChanged()).toEqual(true);
            model.acceptChanges();
            expect(model.isChanged()).toEqual(false);
            expect(list.at(0)._moduleName).toEqual('Types/entity:Model');
            expect(ToSourceModel(list.clone(), dataSource, '').at(0)._moduleName).toEqual(
               'customModel'
            );
            expect(model.isChanged()).toEqual(false);

            var prefetchSource = new sourceLib.PrefetchProxy({
               target: dataSource
            });
            expect(ToSourceModel(list.clone(), prefetchSource, '').at(0)._moduleName).toEqual(
               'customModel'
            );
         });

         it('toSourceModel without source', () => {
            const items = list.clone();
            expect(ToSourceModel(items, undefined, '')).toEqual(items);
         });
      });
   });
});
