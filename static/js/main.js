$(document).ready(function() {
    $(document).bind('keydown', function(e) {
        if (e.which === 116) {
            e.preventDefault();
        }
    });

    $.viewContent = function () {
        var cm = $('body').data('cm_instance');
        if (cm !== undefined) {
            cm.getWrapperElement().style.display = 'none';
        }
        $('#content').removeClass('hidden')
            .addClass('show');
        $('#toolbar').removeClass('show')
            .addClass('hidden');

        $('#action a:first').tab('show') // Select first tab
    }

    $.updateContent = function (data) {
        if (data.html != undefined) {
            $('#content').html(data.html);

            $.viewContent();
        }

        if (data.raw != undefined) {
            $('#editor').text(data.raw);
        }
    }

    $.editContent = function () {
        var cm = $('body').data('cm_instance');
        if (cm == undefined) {
             var codeMirrorUrl = window.location.href.replace(/#$/, '') + 'static/vendor/codemirror';

            // Load css for CodeMirror
            $("<link>")
              .appendTo('head')
              .attr({type : 'text/css', rel : 'stylesheet'})
              .attr('href', codeMirrorUrl + '/lib/codemirror.css');

            // Load main CodeMirror JS
            $.getScript(codeMirrorUrl + '/lib/codemirror.js', function () {
                // Load CodeMirror textile mode
                $.getScript(codeMirrorUrl + '/mode/textile/textile.js', function () {

                    var cm = CodeMirror.fromTextArea(document.getElementById('editor'), {
                        lineNumbers: false,
                        mode: 'textile',
                        lineWrapping: true
                    });

                    cm.setSize('100%', '480px');
                    $('body').data('cm_instance', cm);
                });
            });
        } else {
            cm.getWrapperElement().style.display = 'block';
            cm.setValue(cm.getTextArea().value);
        }

        $('#content').removeClass('show')
            .addClass('hide');
        $('#toolbar').removeClass('hidden')
            .addClass('show');
    }

    var nodeAction = function (elem) {
        var parent = elem.parents('li:first');
        //var parent = parents.first();

        //console.log(parents);
        console.log(parent);

        parent.hasClass('leaf') &&
            $('#save-src').attr('data-ref', elem.attr('data-ref'));

        if (parent.hasClass('open') && !parent.hasClass('leaf')) {
            parent.children('ul').remove('.tree');
        } else {
            $.post(window.location.href, { "slug" : elem.attr('data-ref') },
                function(response, status) {
                    var data = JSON.parse(response);
                    parent.append(data.tree).after(function() {
                        parent.find('ul.tree li div a').click(function () {
                            return nodeAction($(this));
                        });

                        $.updateContent(data);
                    });
                }
            );
        }

        parent.toggleClass('open');

        return false;
    };

    $('.tree a').click(function () {
        return nodeAction($(this));
    });

    $('#save-src').click(function () {
        var cm = $('body').data('cm_instance');
        if (cm != undefined) {
            $.post(window.location.href,
                {
                    "save" : "true",
                    "slug": $(this).attr('data-ref'),
                    "content": cm.getValue()
                },
                function(response, status) {
                    var data = JSON.parse(response);
                    $.updateContent(data);
                }
            );
        }

        return false;
    });


    // Action tabs
    $('#action a').click(function (e) {
        e.preventDefault();
        var index = $('#action a').index($(this));

        switch (index) {
            case 0: $.viewContent(); break;
            case 1: $.editContent(); break;
        }

        $(this).tab('show');
    });

    $('#cancel-src-edit').click(function () {
        $.viewContent();
    });
});
