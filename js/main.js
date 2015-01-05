$(document).ready(function() {
   var storage = amplify.store();

    $.each(storage, function (it) {
        $('#' + it).siblings().toggle();
    });

    $('.branch').click(function() {
        $(this).siblings()
            .toggle();


        if (amplify.store($(this).attr('id')) == undefined) {
            amplify.store($(this).attr('id'), true);
        } else {
            amplify.store($(this).attr('id'), null);
        }

        /*var span = $(this).children('a:first-child').children('span:first-child');

        if (span.hasClass('glyphicon-folder-close')) {
            span.addClass('glyphicon-folder-open');
            span.removeClass('glyphicon-folder-close');
        } else {
            span.addClass('glyphicon-folder-close');
            span.removeClass('glyphicon-folder-open');
        }*/
        return false;
    })

    /*$('.leaf').click(function() {
        $.post(
            new String(HOST + '/'),
            {
                "fileName": $(this).attr('data-path')
            },
            function (data) {
                $('#doc').html(data.doc);
            }
        );
    });*/

});
