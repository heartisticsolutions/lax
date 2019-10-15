import { LightningElement} from 'lwc';
class LWXLightningElement extends LightningElement{    
  constructor(){
      super();
      this._LWXgetset = {
          get : (prop) => {        
              return this[prop];
          },
          set: (prop,val) => {              
              return this[prop] = val;
          }
      }
  }
}

  const initialize = function(){
      if(!window.objectPath)(function (root, factory){
          'use strict';
            root.objectPath = factory();
        })(window, function(){
          'use strict';
        
          var toStr = Object.prototype.toString;
          function hasOwnProperty(obj, prop) {
            if(obj == null) {
              return false
            }
            //to handle objects with null prototypes (too edge case?)
            return Object.prototype.hasOwnProperty.call(obj, prop)
          }
          
          let isArray = Array.isArray || function(obj){
            /*istanbul ignore next:cant test*/
            return toStr.call(obj) === '[object Array]';
          }

          function isEmpty(value){
            if (!value) {
              return true;
            }
            if (isArray(value) && value.length === 0) {
                return true;
            } else if (typeof value !== 'string') {
                for (let i in value) {
                    if (hasOwnProperty(value, i)) {
                        return false;
                    }
                }
                return true;
            }
            return false;
          }
        
          function toString(type){
            return toStr.call(type);
          }
        
          function isObject(obj){
            return typeof obj === 'object' && toString(obj) === "[object Object]";
          }
        
          
        
          function isBoolean(obj){
            return typeof obj === 'boolean' || toString(obj) === '[object Boolean]';
          }
        
          function getKey(key){
            var intKey = parseInt(key);
            if (intKey.toString() === key) {
              return intKey;
            }
            return key;
          }
        
          function factory(options) {
            options = options || {}
        
            let objectPath = function(obj) {
              return Object.keys(objectPath).reduce(function(proxy, prop) {
                if(prop === 'create') {
                  return proxy;
                }
        
                /*istanbul ignore else*/
                if (typeof objectPath[prop] === 'function') {
                  proxy[prop] = objectPath[prop].bind(objectPath, obj);
                }
        
                return proxy;
              }, {});
            };
        
            function hasShallowProperty(obj, prop) {
              return (options.includeInheritedProps || (typeof prop === 'number' && Array.isArray(obj)) || hasOwnProperty(obj, prop))
            }
        
            function getShallowProperty(obj, prop) {
              if (hasShallowProperty(obj, prop)) {
                return obj[prop];
              }
            }
        
            function set(obj, path, value, doNotReplace){
              if (typeof path === 'number') {
                path = [path];
              }
              if (!path || path.length === 0) {
                return obj;
              }
              if (typeof path === 'string') {
                return set(obj, path.split('.').map(getKey), value, doNotReplace);
              }
              let currentPath = path[0];
              let currentValue = getShallowProperty(obj, currentPath);
              if (path.length === 1) {
                if (currentValue === void 0 || !doNotReplace) {
                  obj[currentPath] = value;
                }
                return currentValue;
              }
        
              if (currentValue === void 0) {
                //check if we assume an array
                if(typeof path[1] === 'number') {
                  obj[currentPath] = [];
                } else {
                  obj[currentPath] = {};
                }
              }
        
              return set(obj[currentPath], path.slice(1), value, doNotReplace);
            }
        
            objectPath.has = function (obj, path) {
              if (typeof path === 'number') {
                path = [path];
              } else if (typeof path === 'string') {
                path = path.split('.');
              }
        
              if (!path || path.length === 0) {
                return !!obj;
              }
        
              for (let i = 0; i < path.length; i++) {
                let j = getKey(path[i]);
        
                if((typeof j === 'number' && isArray(obj) && j < obj.length) ||
                  (options.includeInheritedProps ? (j in Object(obj)) : hasOwnProperty(obj, j))) {
                  obj = obj[j];
                } else {
                  return false;
                }
              }
        
              return true;
            };
        
            objectPath.ensureExists = function (obj, path, value){
              return set(obj, path, value, true);
            };
        
            objectPath.set = function (obj, path, value, doNotReplace){
              return set(obj, path, value, doNotReplace);
            };
        
            objectPath.insert = function (obj, path, value, at){
              var arr = objectPath.get(obj, path);
              at = ~~at;
              if (!isArray(arr)) {
                arr = [];
                objectPath.set(obj, path, arr);
              }
              arr.splice(at, 0, value);
            };
        
            objectPath.empty = function(obj, path) {
              if (isEmpty(path)) {
                return void 0;
              }
              if (obj == null) {
                return void 0;
              }
        
              let value, i;
              if (!(value = objectPath.get(obj, path))) {
                return void 0;
              }
        
              if (typeof value === 'string') {
                return objectPath.set(obj, path, '');
              } else if (isBoolean(value)) {
                return objectPath.set(obj, path, false);
              } else if (typeof value === 'number') {
                return objectPath.set(obj, path, 0);
              } else if (isArray(value)) {
                value.length = 0;
              } else if (isObject(value)) {
                for (i in value) {
                  if (hasShallowProperty(value, i)) {
                    delete value[i];
                  }
                }
              } else {
                return objectPath.set(obj, path, null);
              }
            };
        
            objectPath.push = function (obj, path /*, values */){
              var arr = objectPath.get(obj, path);
              if (!isArray(arr)) {
                arr = [];
                objectPath.set(obj, path, arr);
              }
        
              arr.push.apply(arr, Array.prototype.slice.call(arguments, 2));
            };
        
            objectPath.coalesce = function (obj, paths, defaultValue) {
              var value;
        
              for (let i = 0, len = paths.length; i < len; i++) {
                if ((value = objectPath.get(obj, paths[i])) !== void 0) {
                  return value;
                }
              }
        
              return defaultValue;
            };
        
            objectPath.get = function (obj, path, defaultValue){
              if (typeof path === 'number') {
                path = [path];
              }
              if (!path || path.length === 0) {
                return obj;
              }
              if (obj == null) {
                return defaultValue;
              }
              if (typeof path === 'string') {
                return objectPath.get(obj, path.split('.'), defaultValue);
              }
        
              let currentPath = getKey(path[0]);
              let nextObj = getShallowProperty(obj, currentPath)
              if (nextObj === void 0) {
                return defaultValue;
              }
        
              if (path.length === 1) {
                return nextObj;
              }
        
              return objectPath.get(obj[currentPath], path.slice(1), defaultValue);
            };
        
            objectPath.del = function del(obj, path) {
              if (typeof path === 'number') {
                path = [path];
              }
        
              if (obj == null) {
                return obj;
              }
        
              if (isEmpty(path)) {
                return obj;
              }
              if(typeof path === 'string') {
                return objectPath.del(obj, path.split('.'));
              }
        
              let currentPath = getKey(path[0]);
              if (!hasShallowProperty(obj, currentPath)) {
                return obj;
              }
        
              if(path.length === 1) {
                if (isArray(obj)) {
                  obj.splice(currentPath, 1);
                } else {
                  delete obj[currentPath];
                }
              } else {
                return objectPath.del(obj[currentPath], path.slice(1));
              }
        
              return obj;
            }
        
            return objectPath;
          }
        
          let mod = factory();
          mod.create = factory;
          mod.withInheritedProps = factory({includeInheritedProps: true})
          return mod;
        });
      
      if(!window._lax) window._lax = (function(){
          console.log('LAX Script loading..');
          const stores = {              
          };    
          let tranfuncs = {
              keys: function(obj) { if(typeof obj == 'object') return Object.keys(obj); return obj; },
              values: function(obj) { if(typeof obj == 'object') return Object.values(obj); return obj; }
          };
          let helpermethods = {              
              sendState: function(resp, filters, filterfuncs,params){
                  if(filters)
                  for(let key in filters){
                      resp = filterfuncs[filters[key]](resp,params);
                  }
                  return this.cloneObject(resp);
              },
              cloneObject: function(obj) {
                  if(obj == null || typeof(obj) !== "object") return obj;
                  let clone = Array.isArray(obj)? []: {};
                  for(let i in obj) {
                      if(typeof(obj[i])=="object" && obj[i] != null)
                          clone[i] = this.cloneObject(obj[i]);
                      else
                          clone[i] = obj[i];
                  }
                  return clone;
              }
          }
          return {
              isstoreavilable(sname){
                return stores.hasOwnProperty(sname);
              },          
              destroy: function(sname){
                delete stores[sname];
              },     
              create: function(sname, props, overwrite){
                  if(typeof stores[sname] != 'object' || overwrite){
                      stores[sname] = {
                          state: props.state,                            
                          actions: props.actions || {}, // async actions - Does not mutate state.. Eventually calls commit in functions
                          mutations: props.mutations || {}, // Pure functions - Synchrounous - Execute subscriptions after state changes
                          getters: props.getters || {},
                          subscriptions: {},
                          filters: props.filters || {},
                          connector: {
                              dispatch: this.dispatch.bind(this,sname), // actions and mutations both are called only with this from client
                              commit: this.commit.bind(this,sname),
                              getstate: this.getstate.bind(this,sname),
                              subscribe: this.subscribe.bind(this,sname),
                              unsubscribe: this.unsubscribe.bind(this,sname),
                              addaction: this.addaction.bind(this,sname),
                              addgetter:this.addgetter.bind(this,sname),
                              removeaction:this.removeaction.bind(this,sname),
                              addmutation: this.addmutation.bind(this,sname),
                              removemutation: this.removemutation.bind(this,sname),
                              removegetter: this.removegetter.bind(this,sname),
                              addfilter: this.removefilter.bind(this,sname),
                              removefilter: this.removefilter.bind(this,sname),
                              removestore: this.removestore.bind(this,sname)
                          }
                      };   
                      for(let func in tranfuncs){
                          stores[sname].filters[func] = tranfuncs[func];
                      }
                  }           
                  return this.getconnector(sname);        
              },
              removestore: function(sname, source){                
                delete stores[sname];
                },
              addmutation: function(sname,mutation, func, source){                
                stores[sname].mutations[mutation] = func;
                },
              removemutation:function(sname,mutation,source){                
                if(stores[sname].mutations && stores[sname].mutations[mutation]) delete stores[sname].mutations[mutation];
              },
              addaction: function(sname,action, func, source){                  
                  stores[sname].actions[action] = func;
              },
              removeaction:function(sname,action, source){                  
                  if(stores[sname].actions && stores[sname].actions[action]) delete stores[sname].actions[action];
              },
              addfilter: function(sname,type,func){
                  stores[sname].filters[type] = func;
              },
              removefilter: function(sname,type){
                  if(stores[sname].filters && stores[sname].filters[type]) delete stores[sname].filters[type];
              },
              addgetter: function(sname,type,func){
                  stores[sname].getters[type] = func;
              },
              removegetter: function(sname,type){
                  if(stores[sname].getters && stores[sname].getters[type]) delete stores[sname].getters[type];
              },
              commit: function(sname,mutation,payload,source,createflag){
                  function executesubscription(subs){
                      if(subs){
                          let keys = Object.keys(subs)
                          for(let i=0;i<keys.length;i++){
                            try{
                              subs[keys[i]](stores[sname].state);
                            }catch(e){
                              console.log(e);
                            }
                          }
                      }  
                  }   
                  function runexecsubs(){                    
                      let defsubs = stores[sname].subscriptions.all;
                      executesubscription(defsubs);                
                      let subs = stores[sname].subscriptions[mutation];
                      executesubscription(subs);                     
                  }                            
                  if(stores[sname].mutations[mutation])
                  {                
                      stores[sname].mutations[mutation](stores[sname].state, helpermethods.cloneObject(payload));  
                      runexecsubs();                      
                  }    
                  else{                
                      if(createflag || objectPath.has(stores[sname].state,mutation)) { 
                          //Auto Mutations using object path
                          objectPath.set(stores[sname].state,mutation,helpermethods.cloneObject(payload)); 
                          runexecsubs();                          
                      }
                      else {
                        throw(new Error('Warning: No Mutation with name: ' + mutation));
                      }                          
                  }                
              },
              dispatch: function(sname,action, payload, source, createflag){            
                  // dispatch automatically calls mutation of action name if it action is just mutation (for synchronous)                  
                  if(stores[sname].actions[action])
                  {                      
                    stores[sname].actions[action](stores[sname].state, payload, stores[sname].connector);             
                  }    
                  else if(stores[sname].mutations[action] || createflag || objectPath.has(stores[sname].state,action))
                  {
                    this.commit(sname,action,payload, source, createflag);
                  }    
                  else{
                    throw(new Error('Warning: No Action with name: ' + action));
                  }
                
              },
              getstate: function(sname, gtype, params, source){
                  let filters = gtype?gtype.split('|'):[];
                  let type = filters[0]
                  filters = filters.splice(1,1);                  
                  if(!type) return helpermethods.sendState(stores[sname].state);
                  if(stores[sname].getters && stores[sname].getters[type]){
                      let result = stores[sname].getters[type](stores[sname].state,params);
                      return helpermethods.sendState(result,filters,stores[sname].filters,params);                
                  }
                  
                  let st = stores[sname].state;
                  if(objectPath.has(st,type)) 
                      return  helpermethods.sendState(objectPath.get(st,type) ,filters, stores[sname].filters,params); // Auto Getters - All Object Paths and thier filters
                  
                  throw(new Error('Warning: No key or getter with type: ' + type));                    
              },
              getconnector:  function(sname){          
                console.log('inGetConnector', sname, stores);  
                  return (stores[sname])?stores[sname].connector:null;
              },
              subscribe:  function(sname,action,key,func, source){
                  let subs = stores[sname].subscriptions;
                  if(!subs[action]) subs[action] = {};
                  subs[action][key] = func;
              },
              unsubscribe:  function(sname,action,key,source){
                  let subs = stores[sname].subscriptions;
                  if(subs[action] && subs[action][key]) delete subs[action][key];
              }
          }
      })();      
  }
  var subscriptionid = 1;
  const getnextsubscriptionid = function(prefix){
    return (prefix || '') + (subscriptionid++);
  }

 const lxsubscribe = function(connector,attributesmap, accessprovider, callback, source){
    if(_lax && attributesmap){                     
      let subsciptionid = getnextsubscriptionid(source);
      let subsfunc = function (attrmap,getset){                  
        var callcallbakflg = false;
        for(var key in attrmap) {
          if(attrmap.hasOwnProperty(key)){
            try {             
              let getter;
              let params = {};
              if(typeof attrmap[key] == 'string'){
                getter = attrmap[key];
              }
              else if(typeof attrmap[key] == 'object' && attrmap[key].getter)
              {
                getter = attrmap[key].getter;
                if(attrmap[key].params){
                  for(let paramkey in attrmap[key].params){
                    if(attrmap[key].params.hasOwnProperty(paramkey)){
                      let param = attrmap[key].params[paramkey];
                      if(param.indexOf('attribute:') == 0){
                          let attr = param.split(':')[1];
                          param = getset.get(attr);
                      }
                      params[paramkey] = param;
                    }                         
                  }                                         
                }
              }
              else{
                console.log('Incorrect Getter Config',attrmap[key]);
                continue;
              }
              let attrval = connector.getstate(getter,params);
              let preval = getset.get(key);                            
              //console.log(JSON.stringify(attrval), JSON.stringify(preval));
              if(JSON.stringify(preval) !== JSON.stringify(attrval)){
                  // console.log('For ' + subsciptionid + ' setting ' + key + ' to ', JSON.stringify(attrval));
                  //  console.log(attrmap[key] + ' of ' + subsciptionid + ' Changed. Updating..');
                  getset.set(key, attrval);  
                  callcallbakflg = true;
              }else
              {
                  //console.log(attrmap[key] + ' of ' + subsciptionid + ' unchanged. Not updating..');
              }                            
          } catch(e) {
              console.log(e);
          }   
        }                                
      }
      if(callcallbakflg && callback){
          callback();
      }                            
    }
    var subsfuncBound = subsfunc.bind(this,attributesmap,accessprovider);
    subsfuncBound();            
    connector.subscribe('all', subsciptionid,subsfuncBound);             
    return subsciptionid;
  }      
}

class lwx {
  name;
  subsciptionid;
  constructor(name){
      console.log(name);
      this.name  = name;
      if(!window._lax)
          initialize();
  }
  
  getconnector(){    
      return _lax.getconnector(this.name);
  }
  
  createStore(props){
      var connector = _lax.create(this.name,props);
      return connector;
  }
  
  connect(attributesmap, accessprovider, callback){   
      var connector = _lax.getconnector(this.name);  
      console.log('Inconnecor',this.name, connector);   
      this.subscriptionid = lxsubscribe(connector, attributesmap,accessprovider,callback,'lwx');        
  }    

  disconnect(){
      var connector = _lax.getconnector(name);     
      if(this.subsciptionid)
          connector.unsubscribe('all', this.subsciptionid);  
  }
}

export {lwx, initialize, getnextsubscriptionid, LWXLightningElement, lxsubscribe};