const flow_response = {
    1001 : {"status": 200,
        "payload": {
            "latest" : {
                "createdTS" : "",
                "input" : [ {
                    "id" : "j2_1",
                    "text" : "*payload",
                    "li_attr" : {
                        "id" : "j2_1"
                    },
                    "a_attr" : {
                        "href" : "#",
                        "id" : "j2_1_anchor"
                    },
                    "state" : {
                        "loaded" : true,
                        "opened" : true,
                        "selected" : false,
                        "disabled" : false
                    },
                    "data" : { },
                    "children" : [ {
                        "id" : "j2_2",
                        "text" : "id",
                        "li_attr" : {
                            "id" : "j2_2"
                        },
                        "a_attr" : {
                            "href" : "#",
                            "id" : "j2_2_anchor"
                        },
                        "state" : {
                            "loaded" : true,
                            "opened" : false,
                            "selected" : true,
                            "disabled" : false
                        },
                        "data" : { },
                        "children" : [ ],
                        "type" : "number"
                    }, {
                        "id" : "j2_3",
                        "text" : "name",
                        "li_attr" : {
                            "id" : "j2_3"
                        },
                        "a_attr" : {
                            "href" : "#",
                            "id" : "j2_3_anchor"
                        },
                        "state" : {
                            "loaded" : true,
                            "opened" : false,
                            "selected" : true,
                            "disabled" : false
                        },
                        "data" : { },
                        "children" : [ ],
                        "type" : "string"
                    } ],
                    "type" : "document"
                } ],
                "output" : [ {
                    "id" : "j3_1",
                    "text" : "*200",
                    "li_attr" : {
                        "id" : "j3_1"
                    },
                    "a_attr" : {
                        "href" : "#",
                        "id" : "j3_1_anchor"
                    },
                    "state" : {
                        "loaded" : true,
                        "opened" : true,
                        "selected" : false,
                        "disabled" : false
                    },
                    "data" : { },
                    "children" : [ {
                        "id" : "j3_3",
                        "text" : "response",
                        "li_attr" : {
                            "id" : "j3_3"
                        },
                        "a_attr" : {
                            "href" : "#",
                            "id" : "j3_3_anchor"
                        },
                        "state" : {
                            "loaded" : true,
                            "opened" : true,
                            "selected" : true,
                            "disabled" : false
                        },
                        "data" : { },
                        "children" : [ {
                            "id" : "j3_4",
                            "text" : "id",
                            "li_attr" : {
                                "id" : "j3_4"
                            },
                            "a_attr" : {
                                "href" : "#",
                                "id" : "j3_4_anchor"
                            },
                            "state" : {
                                "loaded" : true,
                                "opened" : false,
                                "selected" : false,
                                "disabled" : false
                            },
                            "data" : { },
                            "children" : [ ],
                            "type" : "number"
                        }, {
                            "id" : "j3_5",
                            "text" : "name",
                            "li_attr" : {
                                "id" : "j3_5"
                            },
                            "a_attr" : {
                                "href" : "#",
                                "id" : "j3_5_anchor"
                            },
                            "state" : {
                                "loaded" : true,
                                "opened" : false,
                                "selected" : false,
                                "disabled" : false
                            },
                            "data" : { },
                            "children" : [ ],
                            "type" : "string"
                        } ],
                        "type" : "document"
                    } ],
                    "type" : "document"
                } ],
                "flow" : [ {
                    "id" : "j1_1",
                    "text" : "MAP",
                    "li_attr" : {
                        "id" : "j1_1"
                    },
                    "a_attr" : {
                        "href" : "javascript:void(0)",
                        "id" : "j1_1_anchor"
                    },
                    "state" : {
                        "loaded" : true,
                        "opened" : false,
                        "selected" : true,
                        "disabled" : false
                    },
                    "data" : {
                        "transformers" : [ {
                            "op" : "copy",
                            "from" : "/*payload/id",
                            "to" : "/response/id",
                            "inTypePath" : "document/number",
                            "outTypePath" : "document/number"
                        }, {
                            "op" : "copy",
                            "from" : "/*payload/name",
                            "to" : "/response/name",
                            "inTypePath" : "document/string",
                            "outTypePath" : "document/string"
                        } ],
                        "lines" : [ {
                            "inputPath" : "*payload/id",
                            "outputPath" : "response/id",
                            "inpJsTree" : "#launching_arrow_jsTree",
                            "outpJsTree" : "#landing_arrow_jsTree",
                            "INPath" : "*payload/id",
                            "OUTPath" : "response/id",
                            "op" : "copy",
                            "line" : 0,
                            "dashedLine" : false,
                            "inType" : "number",
                            "outType" : "number",
                            "inTypePath" : "document/number",
                            "outTypePath" : "document/number"
                        }, {
                            "inputPath" : "*payload/name",
                            "outputPath" : "response/name",
                            "inpJsTree" : "#launching_arrow_jsTree",
                            "outpJsTree" : "#landing_arrow_jsTree",
                            "INPath" : "*payload/name",
                            "OUTPath" : "response/name",
                            "op" : "copy",
                            "line" : 0,
                            "dashedLine" : false,
                            "inType" : "string",
                            "outType" : "string",
                            "inTypePath" : "document/string",
                            "outTypePath" : "document/string"
                        } ],
                        "dropList" : [ {
                            "path" : "*payload",
                            "typePath" : "document"
                        } ],
                        "createList" : [ ]
                    },
                    "children" : [ ],
                    "type" : "map"
                } ],
                "api_info" : {
                    "title" : "",
                    "description" : ""
                },
                "lockedByUser" : "admin"
            },
            "consumers" : "",
            "developers" : "developers",
            "enableServiceDocumentValidation" : false
        }
    },
    1002: {"status": 200,
        "payload": {
            "latest" : {
                "createdTS" : "",
                "input" : [ {
                    "id" : "j2_1",
                    "text" : "name",
                    "icon" : null,
                    "li_attr" : {
                        "id" : "j2_1"
                    },
                    "a_attr" : {
                        "href" : "#",
                        "id" : "j2_1_anchor"
                    },
                    "state" : {
                        "loaded" : true,
                        "opened" : false,
                        "selected" : true,
                        "disabled" : false
                    },
                    "data" : { },
                    "children" : [ ],
                    "type" : "string"
                } ],
                "output" : [ {
                    "id" : "j3_1",
                    "text" : "welcome",
                    "icon" : null,
                    "li_attr" : {
                        "id" : "j3_1"
                    },
                    "a_attr" : {
                        "href" : "#",
                        "id" : "j3_1_anchor"
                    },
                    "state" : {
                        "loaded" : true,
                        "opened" : false,
                        "selected" : false,
                        "disabled" : false
                    },
                    "data" : { },
                    "children" : [ ],
                    "type" : "string"
                } ],
                "flow" : [ {
                    "id" : "j1_1",
                    "text" : "MAP",
                    "icon" : null,
                    "li_attr" : {
                        "id" : "j1_1"
                    },
                    "a_attr" : {
                        "href" : "javascript:void(0)",
                        "id" : "j1_1_anchor"
                    },
                    "state" : {
                        "loaded" : true,
                        "opened" : false,
                        "selected" : false,
                        "disabled" : false
                    },
                    "data" : {
                        "transformers" : [ ],
                        "lines" : [ ],
                        "dropList" : [ ],
                        "createList" : [ {
                            "path" : "welcome",
                            "value" : "Hello #{name}",
                            "evaluate" : "EEV",
                            "typePath" : "string"
                        } ],
                        "comment" : "Create a Hello World Variable"
                    },
                    "children" : [ ],
                    "type" : "map"
                } ],
                "api_info" : {
                    "title" : "",
                    "description" : ""
                },
                "lockedByUser" : "saurabh.pec@gmail.com"
            },
            "consumers" : "",
            "developers" : "administrators,developers",
            "enableServiceDocumentValidation" : false
        }
    }
}

function getFlowData(flowId) {
    return flow_response[flowId];
}


function saveFlowData(flowData) {
    console.log("Saving Data: \n " + flowData)
}

function getFlowDataFromServer(flowId) {

    //AJAX success code
    var response = flow_response[flowId];
    validateCache(response, true);
    loadRemoteFile(true);

}


function validateCache(response, overwrite) {
    if(response.status==200 && response.payload){
        response=response.payload;
        //response=JSON.parse(response); //SS
        if(response.consumers) {
            if (Array.isArray(response.consumers)) {
                $("#serviceConsumers").val(response.consumers).trigger('change');
            } else {
                $("#serviceConsumers").val(response.consumers.split(",")).trigger('change');
            }
        }

        if(response.developers) {
            if (Array.isArray(response.developers)) {
                $("#serviceDevelopers").val(response.developers).trigger('change');
            } else {
                $("#serviceDevelopers").val(response.developers.split(",")).trigger('change');
            }
        }
        if(response.enableServiceDocumentValidation)
            $("#enableServiceDocumentValidation").prop( "checked", response.enableServiceDocumentValidation);//val()

        response=response.latest;
        //   console.log(window.atob(response.imports));
        removeIcons(response.input);
        removeIcons(response.output);
        removeIcons(response.flow);

        if (null != response.api_info) {
            $("#api_info_title").val(response.api_info.title);
            $("#api_info_description").val(response.api_info.description);
        }



        var inputJsTree_data=localStorage.getItem(inputJsTree_id);
        if(inputJsTree_data==null || inputJsTree_data.trim().length==0 || overwrite){
            var data=response.input;
            if(data!=null){
                var dataJson=JSON.stringify(data);
                localStorage.setItem(inputJsTree_id,dataJson);
            }
        }

        var outputJsTree_data=localStorage.getItem(outputJsTree_id);
        if(outputJsTree_data==null || outputJsTree_data.trim().length==0 || overwrite){
            var data=response.output;
            if(data!=null)
                localStorage.setItem(outputJsTree_id,JSON.stringify(data));
        }

        var flowJsTree_data=localStorage.getItem(flowJsTree_id);
        if(flowJsTree_data==null || flowJsTree_data.trim().length==0 || overwrite){
            var data=response.flow;
            if(data!=null)
                localStorage.setItem(flowJsTree_id,JSON.stringify(data));
        }
    }
}
