({
    initialize: function(component, event, helper){
        let lxutil = component.find('lxutil');        
        lxutil.initialize();                  
    },
    getconnector: function(component, event, helper){ 
        return _lax.getconnector(component.get("v.name"));
    },
    disconnect: function(component, event, helper) {        
        var subscriptionid = component.get("v.subscriptionid"); 
        var connector = _lax.getconnector(component.get("v.name"));;
        connector.unsubscribe('all', subscriptionid);             
    },
    connect: function(component, event, helper) {        
        var args = event.getParam("arguments");
        // console.log(args);
        var accessprovider = args && args.parentcomp ? args.parentcomp : event.getSource();
      
        var attributesmap = args ? args.attributesmap : null;
        var callback = args ? args.callback : null;
        
        var connector = _lax.getconnector(component.get("v.name"));;
        // console.log(connector);
        let lxutil = component.find('lxutil');   
        let subscriptionid = lxutil.lxsubscribe(connector, attributesmap,accessprovider,callback,'lax');
        component.set("v.subscriptionid",subscriptionid);               
        
        return connector;
    },
    createStore: function(component, event, helper) {
		console.log('createStore', event);
         var args = event.getParam("arguments");
        //console.log(args);
        if(args && window._lax) {            
            var props = args.props;
            var storename = component.get("v.name");
            var connector = window._lax.create(storename,props);            
            return connector;
        }
        return null;
	}
})