
function getTenant() {
    var cookies = document.cookie.split(";");
    for  (var i = 0 ; i < cookies.length ; i++) {
        var coo = cookies[i].split("=");
        if (coo[0].trim() == "tenant") {
            return coo[1].replaceAll('"', "").split(" ")[0];
        }
    }
}

$(document).ready(function () {
    var interval = null;
    $(".auto_refresh_dropdown").change(function () {

        clearInterval(interval);
        if (parseInt($(this).val()) > 1000) {
            interval = setInterval(function () {
                showLogs();
            }, parseInt($(this).val()));
        }
    });
});

function showLogs() {
    let serviceName = getTenant();
    if ("#" != getQueryVariable("serviceName")) {
        serviceName = getQueryVariable("serviceName");
    }
    $("#logFile").html("Log file: " + serviceName + ".log");
    var response=syncRestRequest("/packages.middleware.pub.server.browse.serviceLogs.main?numberOfLines=" + $("#number_of_lines").val() + "&serviceName=" + serviceName, "GET", "");
    if(response.status==200 && response.payload){
        var payload = JSON.parse(response.payload);
        var serverLogs = "";
        for (var i = 0 ; i < payload.logs.length ; i++) {
            serverLogs += payload.logs[i] + "\n";
        }
        $("#logs").val("");
        $("#logs").val(serverLogs);
    }
}

 jQuery(document).ready(function() {

    $('#contentview').on('change', function() {
        localStorage.setItem("market-place-view-type", this.value);
        if(this.value == "Grid view") {
            $('#mkp-wrapper').removeClass("list-view");
            $('#mkp-wrapper').addClass("grid-view");
        }
        if(this.value == "List view") {
            $('#mkp-wrapper').removeClass("grid-view");
            $('#mkp-wrapper').addClass("list-view");
        }
    });


 });



 function openPluginWorkspace(packageName) {
     if (packageName) {
         location.href = "workspace.html?sfocus=files/" + packageName;
     } else {
         console.error('Package name not available for Open button.');
     }
 }

 $("#search-on-market").keyup(function () {
     let apiData = JSON.parse(localStorage.getItem("apiData"));

     let searchableData = [];

     for (let i = 0 ; i < apiData.marketplace.plugins.length ; i++) {
         if (apiData.marketplace.plugins[i].name.toUpperCase().includes($(this).val().toUpperCase())) {
             searchableData.push(apiData.marketplace.plugins[i]);
         }
     }

     updatePageWithApiData({
         marketplace: {
             plugins: searchableData
         }
     })
 });

 let REQUIRED_SEARCH_V_CHANGE = false;

 function updatePageWithApiData(apiData) {
     const mkpWrapper = document.getElementById('mkp-wrapper');

     if (!mkpWrapper) {
         console.error('Element with ID "mkp-wrapper" not found.');
         return;
     }

     const plugins = apiData.marketplace.plugins;

     if (!plugins || plugins.length === 0) {
         //console.error('No plugins found in the API response.');
         mkpWrapper.innerHTML = 'No Plugins found!!!';
         return;
     }

     mkpWrapper.innerHTML = '';

     if (plugins.length <= 2 && false) {
         REQUIRED_SEARCH_V_CHANGE = $("#contentview").val() == "Grid view";
         $('#mkp-wrapper').removeClass("grid-view");
         $('#mkp-wrapper').addClass("list-view");
     } else if (REQUIRED_SEARCH_V_CHANGE) {
         $('#mkp-wrapper').removeClass("list-view");
         $('#mkp-wrapper').addClass("grid-view");
         REQUIRED_SEARCH_V_CHANGE = false;
     }

     plugins.forEach(plugin => {
         const buttonType = getButtonType(plugin);
         const lastUpdatedDate = new Date(plugin.modified_on);

         const dateOptions = {
             weekday: 'long',
             year: 'numeric',
             month: 'long',
             day: 'numeric'
         };

         const formattedDate = lastUpdatedDate.toLocaleDateString('en-US', dateOptions);

         let itemHtml = '<div class="mkp-content-wrap">' + '<div class="mkp-title-wrap"><div class="mkp-image-wrap">';

         if (null == plugin.service) {
             itemHtml += (plugin.name.slice(0, 1).toUpperCase());
         } else {
             itemHtml += '<img src="https://repo.syncloop.com/logo/logo_' + plugin.service + '.svg" />';
         }

         itemHtml += '</div>' +
             '<a class="mkp-title" href="marketplace-detail.html?plugin=' + plugin.unique_id + '&buttonType=' + buttonType + '">' + plugin.name + '</a>' +
             '<span class="button-type" style="display: none;">' + buttonType + '</span>' +
             '</div>' +
             '<p class="mkp-discription">' + plugin.short_description + '</p>' +
             '<div class="tag-list">' + plugin.tags.map(tag => '<span>' + tag + '</span>').join('') + '</div>' +
             '<p class="text-gray lastUpdateDate">Last Updated on ' + formattedDate + '</p>' +
             '<button type="button" class="mkp-button mkp-btn-primary installButton" data-name="' + plugin.name + '" data-pluginid="' + plugin.unique_id + '" data-version="' + plugin.latest_version + '" style="' + (!plugin.installed ? 'display: block;' : 'display: none;') + '" id="install-' + plugin.unique_id + '">Install</button>' +
             '<button type="button" class="mkp-button mkp-btn-border" data-pluginid="' + plugin.unique_id + '" data-version="' + plugin.latest_version + '" style="' + (plugin.installed && plugin.requiredUpdate ? 'display: block;' : 'display: none;') + '" id="update-' + plugin.unique_id + '">Update</button>' +
             '<button type="button" class="mkp-button mkp-btn-gray openButton" onclick="openPluginWorkspace(\'' + plugin.installing_path + '\')" data-packagename="' + (plugin.installed ? plugin.installing_path : '') + '" style="' + (plugin.installed && !plugin.requiredUpdate ? 'display: block;' : 'display: none;') + '" id="open-' + plugin.unique_id + '">Open</button>' +
             '</div>';
         mkpWrapper.innerHTML += itemHtml;
     });


     $(".installButton").click(function () {
         var pluginId = $(this).data("pluginid");
         var version = $(this).data("version");
         var name = $(this).data("name");

         let ref = this;

         swal({
                 title: "Do you want to install '" + name + "'?",
                 text: "",
                 type: "info",
                 showCancelButton: true,
                 confirmButtonColor: "#DD6B55",
                 cancelButtonText: "No, cancel it !!",
                 confirmButtonText: "Yes, install it !!",
                 showLoaderOnConfirm: true,
                 closeOnConfirm: false,
                 closeOnCancel: true
             },
             function (isConfirm) {
                 if (isConfirm) {
                     $(ref).html("Installing...");
                     $(ref).addClass("disabled");

                     var apiUrl = "/packages.middleware.pub.platform.installAPlugin.main";
                     var queryParams = `?pluginId=${encodeURIComponent(pluginId)}&version=${encodeURIComponent(version)}`;
                     $.ajax({
                         type: "POST",
                         url: apiUrl + queryParams,
                         headers: {
                             'Content-Type': 'application/json',
                         },
                         success: function (response) {
                             $(ref).html("Install");
                             $(ref).removeClass("disabled");
                             swal("Installed", "Plugin installed successfully", "success");
                             $("#install-" + pluginId).hide();
                             $("#open-" + pluginId).show();
                             //fetchDataFromApi();
                         },
                         error: function (error) {
                             $(ref).html("Install");
                             $(ref).removeClass("disabled");
                             swal("Error", "Error installing plugin", "error");
                         }
                     });
                 } else {
                     //swal("Cancelled !!", "Hey, '" + key + "' is safe !!", "error");
                 }
             });
     });
 }

 function fetchDataFromApi() {
     fetch("/packages.middleware.pub.platform.MarketPlace.main", {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
         },
     })
         .then(response => response.json())
         .then(data => {
             data.marketplace.plugins.sort((a, b) => {
                 const nameA = a.name.toUpperCase(); // Convert to uppercase to make comparison case-insensitive
                 const nameB = b.name.toUpperCase(); // Convert to uppercase to make comparison case-insensitive

                 if (nameA < nameB) {
                     return -1;
                 }
                 if (nameA > nameB) {
                     return 1;
                 }

                 // Names are equal
                 return 0;
             });
             updatePageWithApiData(data);
             localStorage.setItem('apiData', JSON.stringify(data));
         })
         .catch(error => console.error('Error fetching data:', error));
 }

 $(document).ready(function () {

     let viewType = localStorage.getItem("market-place-view-type");
     let sortBy = localStorage.getItem("market-place-sort-by");

     if (null != viewType) {
         $("#contentview").val(viewType);
         $("#contentview").trigger('change');
     }

     if (null != sortBy) {
         $("#sort_by").val(sortBy);
         $("#sort_by").trigger('change');
     }


     fetchDataFromApi();
     $("#sort_by").change(function () {
         let apiData = JSON.parse(localStorage.getItem("apiData"));
         localStorage.setItem("market-place-sort-by", $(this).val());

         apiData.marketplace.plugins.sort((a, b) => {
             let nameA = a.name.toUpperCase();
             let nameB = b.name.toUpperCase();

             if ($(this).val() == "CREATED_DATE") {
                 nameA = a.created_on
                 nameB = b.created_on;

                 if (nameA < nameB) {
                     return -1;
                 }
                 if (nameA > nameB) {
                     return 1;
                 }

             } else if ($(this).val() == "INSTALLED_DATE") {
                 nameA = a.installed_on
                 nameB = b.installed_on;

                 if (nameA > nameB) {
                     return -1;
                 }
                 if (nameA < nameB) {
                     return 1;
                 }

             } else {
                 if (nameA < nameB) {
                     return -1;
                 }
                 if (nameA > nameB) {
                     return 1;
                 }
             }

             // Names are equal
             return 0;
         });
         updatePageWithApiData(apiData);
     });
 });

 function getButtonType(plugin) {
     if (!plugin.installed) {
         return 'install';
     } else if (plugin.installed && plugin.requiredUpdate) {
         return 'update';
     } else {
         return 'open';
     }
 }
