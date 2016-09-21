// Let's get that CSS3 working in IE, shall we?
function yieldedAddClass(selector, className, yieldTime) {
   setTimeout(function() {
       $(selector).addClass(className);
   }, yieldTime);
}
function addClassesToElements(elementsClassesArray, yieldTime) {
   $.each(elementsClassesArray, function(index, selectorClassKVP) {
       yieldedAddClass(selectorClassKVP.selector, selectorClassKVP.className, yieldTime);
   });
};


$(document).ready(function() {
   // Make magic happen, with very little bloat :)
   addClassesToElements([
       {
       selector: 'li:first-child',
           className: 'first-child'
       },
       {
           selector: 'li:last-child',
           className: 'last-child'
       }
   ], 10);
});