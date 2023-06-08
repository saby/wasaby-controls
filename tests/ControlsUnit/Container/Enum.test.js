/**
 * Created by kraynovdo on 28.04.2018.
 */
define(['Controls/source', 'Types/collection', 'Types/source'], function (
   controlsSourceLib,
   collection,
   sourceLib
) {
   'use strict';

   var enumInstance, containerInstance;

   describe('Controls.Container.Adapter.Enum', function () {
      describe('private method', function () {
         beforeEach(function () {
            enumInstance = new collection.Enum({
               dictionary: ['First', 'Second', 'Third'],
               index: 1
            });
         });
         it('getArrayFromEnum', function () {
            var cfg = {
               enum: enumInstance
            };
            containerInstance = new controlsSourceLib.EnumAdapter(cfg);
            var arr = containerInstance._getArrayFromEnum(enumInstance);
            expect([
               { title: 'First' },
               { title: 'Second' },
               { title: 'Third' }
            ]).toEqual(arr);
         });
         it('getSourceFromEnum', function (done) {
            var cfg = {
               enum: enumInstance
            };
            containerInstance = new controlsSourceLib.EnumAdapter(cfg);
            var source = containerInstance._getSourceFromEnum(enumInstance);
            var queryInstance = new sourceLib.Query();
            source.query(queryInstance).addCallback(function (dataSet) {
               var rawData = dataSet.getAll().getRawData();
               expect([
                  { title: 'First' },
                  { title: 'Second' },
                  { title: 'Third' }
               ]).toEqual(rawData);
               done();
            });
         });
      });
      describe('life cycle', function () {
         beforeEach(function () {
            enumInstance = new collection.Enum({
               dictionary: ['First', 'Second', 'Third'],
               index: 1
            });
         });
         it('enumSubscribe', function () {
            var cfg = {
               enum: enumInstance
            };
            containerInstance = new controlsSourceLib.EnumAdapter(cfg);
            containerInstance._beforeMount(cfg);

            containerInstance._enumSubscribe(enumInstance);
            enumInstance.set(2);
            expect('Third').toEqual(containerInstance._selectedKey);
         });
         it('hooks', function () {
            var cfg = {
               enum: enumInstance
            };
            containerInstance = new controlsSourceLib.EnumAdapter(cfg);
            containerInstance.saveOptions(cfg);

            containerInstance._beforeMount(cfg);
            expect(enumInstance).toEqual(containerInstance._enum);
            expect('Second').toEqual(containerInstance._selectedKey);

            var newEnumInstance = new collection.Enum({
               dictionary: ['Red', 'Blue', 'Yellow'],
               index: 0
            });

            cfg = {
               enum: newEnumInstance
            };

            containerInstance._beforeUpdate(cfg);
            expect(newEnumInstance).toEqual(containerInstance._enum);
            expect('Red').toEqual(containerInstance._selectedKey);
         });

         it('_beforeUnmount', function () {
            var cfg = {
               enum: enumInstance
            };
            containerInstance = new controlsSourceLib.EnumAdapter(cfg);
            containerInstance.saveOptions(cfg);
            containerInstance._beforeMount(cfg);

            expect(enumInstance).toEqual(containerInstance._enum);
            expect('Second').toEqual(containerInstance._selectedKey);

            containerInstance._beforeUnmount();
            enumInstance.setByValue('Third');

            expect(containerInstance._enum).toBeNull();
            expect('Second').toEqual(containerInstance._selectedKey);
         });
      });
   });
});
