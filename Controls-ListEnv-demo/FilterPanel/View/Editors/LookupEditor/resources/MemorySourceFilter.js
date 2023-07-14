/**
 * Created by am.gerasimov on 17.07.2018.
 */
define('Controls-ListEnv-demo/FilterPanel/View/Editors/LookupEditor/resources/MemorySourceFilter', [
   'Types/object'
], function (TypesObject) {
   'use strict';

   function compareValues(given, expect, operator) {
      var i;
      var isDate = function (date) {
         return new Date(given).toString() !== 'Invalid Date' && !Number.isNaN(new Date(date));
      };

      if (isDate(given)) {
         var givenDate = given instanceof Date ? given : new Date(given);
         if (expect instanceof Array) {
            return (
               (!expect[0] || givenDate.getTime() > expect[0].getTime()) &&
               (!expect[1] || givenDate.getTime() < expect[1].getTime())
            );
         }
         if (expect instanceof Date) {
            return givenDate.getTime() === expect.getTime();
         }
         return false;
      }

      // If array expected, use "given in expect" logic
      if (expect instanceof Array) {
         if (!expect.length) {
            return true;
         }
         for (i = 0; i < expect.length; i++) {
            if (compareValues(given, expect[i], operator)) {
               return true;
            }
         }
         return false;
      }

      // If array given, use "given has only expect" logic
      if (given instanceof Array) {
         for (i = 0; i < given.length; i++) {
            if (!compareValues(given[i], expect, operator)) {
               return false;
            }
         }
         return true;
      }

      // Otherwise - just compare
      return given === expect;
   }

   function memorySourceFilter(emptyFields) {
      return function (item, queryFilter) {
         var addToData = true;

         for (var filterField in queryFilter) {
            if (queryFilter.hasOwnProperty(filterField) && item.get(filterField) && addToData) {
               var filterValue = queryFilter[filterField];
               var itemValue = item.get(filterField);
               var itemValueLowerCase;
               var filterValueLowerCase;

               if (typeof itemValue === 'string') {
                  itemValueLowerCase = itemValue.toLowerCase();
               }

               if (typeof filterValue === 'string') {
                  filterValueLowerCase = filterValue.toLowerCase();
               }

               if (typeof filterValue === 'string') {
                  addToData =
                     compareValues(itemValue, filterValue, '=') ||
                     itemValueLowerCase.indexOf(filterValueLowerCase) !== -1;
               } else {
                  addToData = compareValues(itemValue, filterValue, '=');
               }
               if (emptyFields && TypesObject.isEqual(filterValue, emptyFields[filterField])) {
                  addToData = true;
               }
            }
         }
         return addToData;
      };
   }
   return memorySourceFilter;
});
