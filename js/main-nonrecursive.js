$(document).ready(function() {
    $(document).bind('keydown', function(e) {
        if (e.which === 116) {
            e.preventDefault();
        }
    });

    var nodeAction = function (elem) {
        var parent =  elem.parents('li:first');

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

                        if (data.html != undefined) {
                            var cm = $('body').data('cm_instance');
                            if (cm !== undefined) {
                                cm.getWrapperElement().style.display = 'none';
                            }

                            $('#content').html(data.html);

                            $('#content').show();
                        }

                        if (data.raw != undefined) {
                            $('#editor').text(data.raw);
                        }


                    });
                }
            );
        }

        parent.toggleClass('open')

        return false;
    };

    $('.tree a').click(function () {
        return nodeAction($(this));
    });

    $('#edit-src').click(function () {
        var cm = $('body').data('cm_instance');
        if (cm == undefined) {
             var codeMirrorUrl = window.location.href + 'js/vendor/codemirror-4.8';

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

                    cm.setSize('100%', '90%');
                    $('body').data('cm_instance', cm);
                });
            });
        } else {
            cm.getWrapperElement().style.display = 'block';
            cm.setValue(cm.getTextArea().value);
        }

        $('#content').hide();

        return false;
        /*$(this).addClass('active');
        $('#save-src').removeClass('active');
        $('#view-html').removeClass('active');*/
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
                }
            );
        }

        return false;
    });
});
