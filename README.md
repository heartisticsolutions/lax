# LAX State Management for Salesforce Lightning

LAX is a low-opinionated single state management framework for AURA and LWC, enables you to develop complex applications with ease. It elemenates need of most of application level events and promotes design oriented development

Example of State Management Usage and Documentation Can be found in below

https://heartistic-developer-edition.ap4.force.com/laux/s/

## [Functional Documentation](https://heartistic-dev-ed.my.salesforce.com/sfc/p/#6F000001HBQR/a/6F000000DOAL/sohTuVh4243lKrAjXzHX7oSHbEmdh4Sg2BYqUyliVus)

## [Technical Documentation](https://heartistic-dev-ed.my.salesforce.com/sfc/p/6F000001HBQR/a/6F000000DOAQ/5Blnbru97uZrSahgwL4XvlDy7tmMjY.PFaRxC3rMoTc)

## Basic Usage

### Aura

For Store Provider which implements all functional logic for the apps
<c:LAX aura:id="counter" name="_counter"/>

<aura:handler name="init" value="{!this}" action="{!c.createstore}"/>

createstore : function(component, event, helper) {
        console.log('Counter Store Creation');
		var lax = component.find("lax");               
        var connector = lax.createStore({
            state:{ 
                counters: {
                    
                },
                errors: [],
                warnings: [],                
            }, 
            actions: { 
                //Asyncrhous execution codes - Actions                
            },
            mutations: {
                //Pure functions - executes synchrously                
                initialize: function(state, payload){ state.counters[payload.name] = payload.value || 0; },
                increment: function(state, payload){ 
                    if(typeof payload == 'object') 
        				state.counters[payload.name] += payload.value;                         
                    else
                        state.counters[payload]++ ; 
                },
                decrement: function(state, payload){
                    if(typeof payload == 'object') 
        				state.counters[payload.name] -= payload.value;                         
                    else
                        state.counters[payload]-- ; 
                } 
            },
            getters: {                 
            },
            debuglevel:'debug'
        });
	}

Twin Button
.cmp
<c:LAX aura:id="lax" name="{!v.storename}"/>
<c:LAX aura:id="laxconfig" name="_config"/>
<aura:handler name="init" value="{!this}" action="{!c.connect}"/> 

controller

    connect : function(component, event, helper) {		
        if(component.find("laxconfig").getconnector()){
            console.log('Using Config Provider')
            component.find("laxconfig").connect({
                "v.type":"buttons.type",
                "v.steps":"twinbuttons.steps"                
        	}, component);   
        }        	
        console.log('Twin Button Connect');
	},
    increment:function(component, event, helper) {
        component.find("lax").getconnector().dispatch('increment',{name: component.get('v.countername'), value: parseInt(component.get('v.steps'))});
	},
    decrement:function(component, event, helper) {
		component.find("lax").getconnector().dispatch('decrement',{name: component.get('v.countername'), value: parseInt(component.get('v.steps'))});
	}

### LWC

import { lwx, LWXLightningElement } from 'c/lxutil';
export default class UIComp extends LWXLightningElement {
    store;
    localattr;
    localattr2;
    connectedCallback(){   
        this.store = new lwx('_config');
        this.store.connect({"localattr1":"storegetter1", "localattr2": "storegetter2|filter"}, this._LWXgetset);  
    }
    onuserinteraction(event){
        this.store.getconnector().dispatch('actionname',{event.detail.payload});
    }
}

## LAX Pro
LAX Basic contains all state management with out any restrictions and free to use. But LAX Pro comes with framework level default debug features, which provides a debug store and UI for debugging. Developers can concentrate more on functionality than debugging with these features. The DEMO page also shows the debugging feature. [Contact us](mailto:heartisticsolutions@gmail.com) for more details.