/*!

* sense-navigation - Sense Sheet Navigation + Actions visualization extension for Qlik Sense.
* --
* @version v1.0.0-rc1-07
* @link https://github.com/stefanwalther/sense-navigation
* @author Stefan Walther
* @license MIT
*/

define(["angular","./lib/external/lodash/lodash.min","qlik","./lib/external/sense-extension-utils/index","text!./lib/data/icons-fa.json"],function(angular,__,qlik,extHelper,iconListRaw){const buttonIcons={type:"string",component:"dropdown",label:"Icon",ref:"props.buttonIcon",options:function(){return function(){const iconList=JSON.parse(iconListRaw).icons,propDef=[];return propDef.push({value:"",label:">> No icon <<"}),iconList.forEach(function(icon){propDef.push({value:icon.id,label:icon.name})}),__.sortBy(propDef,function(item){return item.label})}()}},appList={type:"string",component:"dropdown",label:"Select App",ref:"props.selectedApp",options:extHelper.getAppList(),show:function(data){return"openApp"===data.props.navigationAction}},sheetList={type:"string",component:"dropdown",label:"Select Sheet",ref:"props.selectedSheet",options:extHelper.getSheetList(),show:function(data){return"gotoSheet"===data.props.navigationAction}},storyList={type:"string",component:"dropdown",label:"Select Story",ref:"props.selectedStory",options:extHelper.getStoryList(),show:function(data){return"gotoStory"===data.props.navigationAction}},actionOptions=[{value:"applyBookmark",label:"Apply a bookmark",group:"bookmark"},{value:"clearAll",label:"Clear all selections",group:"selection"},{value:"clearOther",label:"Clear selections in other fields",group:"selection"},{value:"forward",label:"Move forwards (in your selections)",group:"selection"},{value:"back",label:"Move backwards (in your selections)",group:"selection"},{value:"clearField",label:"Clear selections in field",group:"selection"},{value:"lockAll",label:"Lock all selections",group:"selection"},{value:"lockField",label:"Lock a specific field",group:"selection"},{value:"unlockAll",label:"Unlock all selections",group:"selection"},{value:"unlockField",label:"Unlock a specific field",group:"selection"},{value:"unlockAllAndClearAll",label:"Unlock all and clear all",group:"selection"},{value:"selectField",label:"Select a value in a field",group:"selection"},{value:"selectAll",label:"Select all values in a field",group:"selection"},{value:"selectValues",label:"Select multiple values in a field",group:"selection"},{value:"selectAlternative",label:"Select alternatives",group:"selection"},{value:"selectAndLockField",label:"Select a value and lock field",group:"selection"},{value:"selectExcluded",label:"Select excluded",group:"selection"},{value:"selectPossible",label:"Select possible values in a field",group:"selection"},{value:"setVariable",label:"Set variable value",group:"variables"},{value:"toggleSelect",label:"Toggle field selection",group:"selection"}],bookmarkEnabler=["applyBookmark"],fieldEnabler=["clearField","clearOther","lockField","selectAll","selectAlternative","selectExcluded","selectField","selectPossible","selectValues","selectAndLockField","toggleSelect","unlockField"],valueEnabler=["selectField","selectValues","setVariable","selectAndLockField","toggleSelect"],valueDescEnabler=["selectValues"],variableEnabler=["setVariable"],overwriteLockedEnabler=["clearOther","selectAll","selectAlternative","selectExcluded","selectPossible","toggleSelect"];return{type:"items",component:"accordion",items:{settings:{uses:"settings",items:{general:{items:{showTitles:{defaultValue:!1}}},layout:{type:"items",label:"Layout",items:{label:{ref:"props.buttonLabel",label:"Label",type:"string",expression:"optional",show:function(){return!0},defaultValue:"My Button"},style:{type:"string",component:"dropdown",ref:"props.buttonStyle",label:"Style",defaultValue:"default",options:[{value:"default",label:"Default"},{value:"primary",label:"Primary"},{value:"success",label:"Success"},{value:"info",label:"Info"},{value:"warning",label:"Warning"},{value:"danger",label:"Danger"},{value:"link",label:"Link"}]},buttonWidth:{type:"boolean",component:"buttongroup",label:"Button Width",ref:"props.fullWidth",options:[{value:!0,label:"Full Width",tooltip:"Button has the same width as the element."},{value:!1,label:"Auto Width",tooltip:"Auto width depending on the label defined."}],defaultValue:!1},buttonAlignment:{ref:"props.buttonAlignment",type:"string",component:"dropdown",defaultValue:"top-left",options:[{label:"Top left",value:"top-left"},{label:"Top middle",value:"top-middle"},{label:"Top right",value:"top-right"},{label:"Left middle",value:"left-middle"},{label:"Centered",value:"centered"},{label:"Right middle",value:"right-middle"},{label:"Bottom left",value:"bottom-left"},{label:"Bottom middle",value:"bottom-middle"},{label:"Bottom right",value:"bottom-right"}]},buttonTextAlign:{ref:"props.buttonTextAlign",label:"Label Alignment",type:"string",component:"dropdown",defaultValue:"left",options:[{value:"center",label:"Center"},{value:"left",label:"Left"},{value:"right",label:"Right"}],show:function(data){return data.props.fullWidth}},buttonMultiLine:{ref:"props.isButtonMultiLine",label:"Multiline Label",type:"boolean",defaultValue:!1},buttonIcons:buttonIcons}},actionsList:{type:"array",ref:"props.actionItems",label:"Actions",itemTitleRef:function(data){let v=__.filter(actionOptions,{value:data.actionType});return v&&v.length>0?v[0].label:data.actionType},allowAdd:!0,allowRemove:!0,addTranslation:"Add Item",grouped:!0,items:{actionType:{type:"string",ref:"actionType",component:"dropdown",defaultValue:"none",options:actionOptions},bookmarkList:{type:"string",ref:"selectedBookmark",component:"dropdown",label:"Select bookmark",expression:"optional",options:extHelper.getBookmarkList(),show:function(data,defs){const def=__.find(defs.layout.props.actionItems,{cId:data.cId});return def&&bookmarkEnabler.indexOf(def.actionType)>-1}},fieldList:{type:"string",ref:"selectedField",component:"dropdown",label:"Select field",defaultValue:"",options:function(){return extHelper.getFieldList().then(function(fieldList){return fieldList.splice(0,0,{value:"by-expr",label:">> Define field by expression <<"}),fieldList})},show:function(data,defs){const def=__.find(defs.layout.props.actionItems,{cId:data.cId});return def&&fieldEnabler.indexOf(def.actionType)>-1}},field:{type:"string",ref:"field",label:"Field",expression:"optional",show:function(data,defs){const def=__.find(defs.layout.props.actionItems,{cId:data.cId});return def&&fieldEnabler.indexOf(def.actionType)>-1&&"by-expr"===def.selectedField}},value:{type:"string",ref:"value",label:"Value",expression:"optional",show:function(data,defs){const def=__.find(defs.layout.props.actionItems,{cId:data.cId});return def&&valueEnabler.indexOf(def.actionType)>-1}},valueDesc:{type:"text",component:"text",ref:"valueDesc",label:"Define multiple values separated with a semi-colon (;).",show:function(data,defs){const def=__.find(defs.layout.props.actionItems,{cId:data.cId});return def&&valueDescEnabler.indexOf(def.actionType)>-1}},variable:{type:"string",ref:"variable",label:"Variable Name",expression:"optional",show:function(data,defs){const def=__.find(defs.layout.props.actionItems,{cId:data.cId});return def&&variableEnabler.indexOf(def.actionType)>-1}},overwriteLocked:{type:"boolean",ref:"softLock",label:"Overwrite locked selections",defaultValue:!1,show:function(data,defs){const def=__.find(defs.layout.props.actionItems,{cId:data.cId});return def&&overwriteLockedEnabler.indexOf(def.actionType)>-1}}}},behavior:{type:"items",label:"Navigation Behavior",items:{action:{ref:"props.navigationAction",label:"Navigation Action",type:"string",component:"dropdown",default:"nextSheet",options:[{label:"None",value:"none"},{label:"Go to first sheet",value:"firstSheet"},{label:"Go to next sheet",value:"nextSheet"},{label:"Go to previous sheet",value:"prevSheet"},{label:"Go to last sheet",value:"lastSheet"},{label:"Go to a specific sheet",value:"gotoSheet"},{label:"Go to a sheet (defined by sheet Id)",value:"gotoSheetById"},{label:"Go to a story",value:"gotoStory"},{label:"Open a website / eMail",value:"openWebsite"},{label:"Switch to Edit mode",value:"switchToEdit"}]},sheetId:{ref:"props.sheetId",label:"Sheet ID",type:"string",expression:"optional",show:function(data){return"gotoSheetById"===data.props.navigationAction}},sheetList:sheetList,storyList:storyList,websiteUrl:{ref:"props.websiteUrl",label:"Website Url:",type:"string",expression:"optional",show:function(data){return"openWebsite"===data.props.navigationAction}},sameWindow:{ref:"props.sameWindow",label:"Open in same window",type:"boolean",defaultValue:!0,show:function(data){return"openWebsite"===data.props.navigationAction}},appList:appList}}}},addons:{type:"items",component:"expandable-items",translation:"properties.addons",items:{dataHandling:{uses:"dataHandling",items:{suppressZero:null}}}}}}});