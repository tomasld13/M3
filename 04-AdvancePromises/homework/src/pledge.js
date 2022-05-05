'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:

function $Promise(executor){
    this._state = "pending"
    this._value = undefined
    this._handlerGroups = []
    if(typeof executor !== "function"){
        throw new TypeError("executor no es una function")
    }
    executor(this._internalResolve.bind(this), this._internalReject.bind(this))
}

$Promise.prototype._internalResolve = function(data){
    if(this._state === "pending"){
        this._state = "fulfilled"
        this._value = data
    }
    this._callHandlers()
}

$Promise.prototype._internalReject = function(reason){
    if(this._state === "pending"){
        this._state = "rejected"
        this._value = reason
    }
    this._callHandlers()
}

$Promise.prototype.then = function(success, error){
    const downstreamPromise = new $Promise(() => { })
    if(typeof success !== "function") success = false;
    if(typeof error !== "function") error = false;
    this._handlerGroups.push({
        successCb : success,
        errorCb: error,
        downstreamPromise
    })
    if(this._state !== "pending"){
        this._callHandlers()
    }
    return downstreamPromise
}

$Promise.prototype._callHandlers = function(){
    while(this._handlerGroups.length > 0) {
        let actual = this._handlerGroups.shift()
        let downstreamPromise = actual.downstreamPromise;
        if(this._state === "fulfilled"){
            if(!actual.successCb){
                downstreamPromise._internalResolve(this._value)
            }else{
                try{
                    let result = actual.successCb(this._value)
                    if(result instanceof $Promise){
                        result.then(
                            function(value){downstreamPromise._internalResolve(value)},
                            function(reason){downstreamPromise._internalReject(reason)}
                        )
                    }else{
                        downstreamPromise._internalResolve(result)
                    }
                }catch(error){
                    downstreamPromise._internalReject(error)
                }
            }
        }else{
            if(!actual.errorCb){
                downstreamPromise._internalReject(this._value)
            }else{
                try{
                    let result = actual.errorCb(this._value)
                    if(result instanceof $Promise){
                        result.then(
                            value => {downstreamPromise._internalResolve(value)},
                            reason => {downstreamPromise._internalReject(reason)}
                        )
                    }else{
                        downstreamPromise._internalResolve(result)
                    }
                }catch(error){
                    downstreamPromise._internalReject(error)
                }
            }
        }
    }
}

$Promise.prototype.catch = function(error){
    return this.then(null, error)
}

module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesxitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
