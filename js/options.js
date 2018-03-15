(function () {

    'use strict';
    
    var utils,
        selectElement;

    function loopEls(className, callback) {
        Array.prototype.forEach.call(document.getElementsByClassName(className), callback);
    }

    function initOptionPage() {

        // utils = chrome.extension.getBackgroundPage().utils;
        
        let textArea = document.getElementById('mbUserFilters')

        textArea.value = "123"
        console.log(textArea)
        utils = chrome.extension.getBackgroundPage().utils;
        console.log(utils)
        utils.getOption('ids_to_block', function(val) {
            console.log(val)
            textArea.value = val
        })


        document.getElementById('mbUserFiltersSave').addEventListener('click', saveUserFilters);
    }

    function saveUserFilters() {
        let dxIds = document.getElementById('mbUserFilters').value
        utils.setOption('ids_to_block', dxIds, function(val) {
            console.log('save success.')
        })
    }


    initOptionPage();

}());