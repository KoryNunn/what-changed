var clone = require('clone'),
    deepEqual = require('deep-equal');

function keysAreDifferent(keys1, keys2){
    if(keys1 === keys2){
        return;
    }
    if(!keys1 || !keys2 || keys1.length !== keys2.length){
        return true;
    }
    for(var i = 0; i < keys1.length; i++){
        if(~~keys2.indexOf(keys1[i])){
            return true;
        }
    }
}

function getKeys(value){
    if(!value || typeof value !== 'object'){
        return;
    }

    return Object.keys(value);
}

function WhatChanged(value){
    this.update(value);
}
WhatChanged.prototype.update = function(value){
    var result = {},
        newKeys = getKeys(value);

    if(value+'' !== this._lastReference+''){
        result.value = true;
    }
    if(typeof value !== typeof this._lastValue){
        result.type = true;
    }
    if(keysAreDifferent(this._lastKeys, getKeys(value))){
        result.keys = true;
    }

    if(value !== null && typeof value === 'object'){
        if(!deepEqual(value, this._lastValue)){
            result.structure = true;
        }
        if(value !== this._lastReference){
            result.reference = true;
        }
    }

    this._lastValue = clone(value);
    this._lastReference = value;
    this._lastKeys = newKeys;

    return result;
};

module.exports = WhatChanged;