(function (window) {
    console.log('utils.js')

    'use strict';

    var utils = {

        noop: function() {},

        getDefaultSettings: function() {
        
            let dxhSettings = {};
            
            return dxhSettings;
        },

        getSettings: function(callback) {

            let self = this;
            chrome.storage.local.get('dxhSettings', function(res) {
                if((Object.keys(res).length) === 0) {
                    res = self.getDefaultSettings();
                    self.setSettings(res);
                    callback(res);
                } else {
                    callback(res.dxhSettings);
                }
            });

        },

        setSettings: function(settings, callback) {
            callback = (callback === undefined) ? this.noop : callback;
            chrome.storage.local.set({'dxhSettings' : settings}, callback);
        },

        clearSettings: function(callback) {
            callback = (callback === undefined) ? this.noop : callback;
            chrome.storage.local.clear(callback);
        },

        setOption: function(option, value, callback) {

            let self = this;
            this.getSettings(function(res) {
                res[option] = value;
                self.setSettings(res, callback);
            });
        },

        getOption: function(option, callback) {


            let self = this;
            this.getSettings(function(res) {
                if(typeof(res[option]) === 'undefined') {
                    let dxhSettings = self.getDefaultSettings();
                    res[option] = dxhSettings[option];
                    self.setOption(option, dxhSettings[option], function() {
                        callback(dxhSettings[option]);
                    });
                } else {
                    callback(res[option]);
                }
            });
        },

        cleanArray: function(arr) {
            return arr.map(function(e){
                return e.trim();
            }).filter(function(str) { 
                return /\S/.test(str);
            });
        },

    };



    chrome.runtime.onConnect.addListener(function(port) {
      console.log(port);

      port.onMessage.addListener(function(message) {
        console.log("listener", message)
        if(message.action == 'getOption') {
            utils.getOption(message.option, function(res){
                port.postMessage(res)
            })
        }
       
      });
    });                                      
    utils.setOption('ids_to_block', "123456789,123,1", undefined)

    window.utils = utils
}(window));