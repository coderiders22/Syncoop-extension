$.fn.syncloop = function(options) {
    var settings = $.extend({
        save: false,
        test: true,
        export: false,
        unique_id: new Date().getTime(),
        import: false,
        documentation: false,
        width: 400,
        height: 400,
        config: {
            service: {
                list_options: {
                    embedded_services_label: "embedded",
                    embedded_services_context: "contexts",
                    embedded_services_function: "functions"
                }
            }
        },
        service_base_url: "https://cloud.syncloop.com/",
        save_callback: function (data) {}
    }, options );

    return this.each(function() {
        var $this = $(this);
        var iframe = document.createElement('iframe');

        // Set attributes for the iframe
        iframe.setAttribute('src', '../web/editor/editor.html?_id=' + settings.unique_id);
        iframe.setAttribute('width', settings.width);
        iframe.setAttribute('height', settings.height);
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '');

        this.appendChild(iframe);

        iframe.addEventListener('load', function () {
            let iframeWindow = iframe.contentWindow;
            iframeWindow.SERVICE_ENDPOINT = settings.service_base_url;
            iframeWindow.embedded_services_label = settings.config.service.list_options.embedded_services_label;
            iframeWindow.embedded_services_context = settings.config.service.list_options.embedded_services_context;
            iframeWindow.embedded_services_function = settings.config.service.list_options.embedded_services_function;

            if (settings.test) {
                iframeWindow.enableEmbeddedTest();
            }
            //iframeWindow.getServices();

            if (settings.save) {
                $(iframeWindow.document.getElementById('save_btn')).show();
                $(iframeWindow.document.getElementById('save_btn')).click(function(){
                    let data = JSON.parse(iframeWindow.save());
                    settings.save_callback(data);
                });

            }

            if (settings.import) {
                $(iframeWindow.document.getElementById('import_btn')).show();
            }

            if (settings.export) {
                $(iframeWindow.document.getElementById('export_btn')).show();
                $(iframeWindow.document.getElementById('export_btn')).click(function(){
                    let api_json = iframeWindow.save();
                    const blob = new Blob([api_json], { type: 'application/json' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = 'syncloopAPI.api';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                });
            }

            if (settings.documentation) {
                $(iframeWindow.document.getElementById('documentation_btn')).show();
            }

            $(iframeWindow.document.getElementById('full_screen_btn')).click(function(){
                if ($(this).data('fullScreen') == 'true') {
                    $this.css({
                        position: '',
                        top: '',
                        left: '',
                        height: '100%',
                        width: '100%',
                        'z-index': ''
                    });
                    iframe.setAttribute('width', settings.width);
                    iframe.setAttribute('height', settings.height);
                    $(this).data('fullScreen', 'false');
                    $(this).html('<svg xmlns="http://www.w3.org/2000/svg" class="full_scrn" width="18" height="17" viewBox="0 0 18 17" fill="none">\n' +
                        '                        <path d="M2.25 5.45839V4.24872C2.25 2.59186 3.59315 1.24872 5.25 1.24872H13.75C15.4069 1.24872 16.75 2.59186 16.75 4.24872V11.8132C16.75 13.4701 15.4069 14.8132 13.75 14.8132H11.25" stroke="#33363F" stroke-width="1.3" stroke-linecap="round"/>\n' +
                        '                        <path class="ar" d="M12 5.62769V4.97769H12.65V5.62769H12ZM6.57181 11.6602C6.31109 11.907 5.89969 11.8957 5.65292 11.635C5.40615 11.3743 5.41747 10.9629 5.67819 10.7161L6.57181 11.6602ZM11.35 9.83736V5.62769H12.65V9.83736H11.35ZM12 6.27769H7.5V4.97769H12V6.27769ZM12.4468 6.09977L6.57181 11.6602L5.67819 10.7161L11.5532 5.1556L12.4468 6.09977Z" fill="#33363F"/>\n' +
                        '                        <rect x="1.25" y="10.8374" width="5.25" height="4.91129" rx="2" stroke="#33363F" stroke-width="1.3" stroke-linecap="round"/>\n' +
                        '                    </svg>');
                } else {
                    $this.css({
                        position: 'absolute',
                        top: '0px',
                        left: '0px',
                        height: '100%',
                        width: '100%',
                        'z-index': 9999999999
                    });
                    iframe.setAttribute('width', "100%");
                    iframe.setAttribute('height', "100%");
                    $(this).data('fullScreen', 'true');
                    $(this).html('<svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                        '<path d="M2.375 6.75V5.25C2.375 3.59315 3.71815 2.25 5.375 2.25H13.625C15.2819 2.25 16.625 3.59315 16.625 5.25V12.75C16.625 14.4069 15.2819 15.75 13.625 15.75H11.875" stroke="#222222" stroke-width="1.2" stroke-linecap="round"/>\n' +
                        '<path d="M9.51953 8.875L9.51953 9.475L8.91953 9.475L8.91953 8.875L9.51953 8.875ZM14.2527 3.56443C14.4933 3.33653 14.873 3.3468 15.1009 3.58736C15.3288 3.82792 15.3186 4.20768 15.078 4.43557L14.2527 3.56443ZM10.1195 4.375L10.1195 8.875L8.91953 8.875L8.91953 4.375L10.1195 4.375ZM9.51953 8.275L14.2695 8.275L14.2695 9.475L9.51953 9.475L9.51953 8.275ZM9.10688 8.43943L14.2527 3.56443L15.078 4.43557L9.93218 9.31057L9.10688 8.43943Z" fill="#222222"/>\n' +
                        '<rect x="2.375" y="10.5" width="5.54167" height="5.25" rx="2" stroke="#222222" stroke-width="1.2" stroke-linecap="round"/>\n' +
                        '</svg>\n');
                }
            });

        });

        $this.data('syncloopInstance', {
            updateDimensions: function(width, height) {
                iframe.setAttribute('width', width);
                iframe.setAttribute('height', height);
            }
        });

    });
}
