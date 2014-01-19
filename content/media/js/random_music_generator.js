function generate_random_music() {
    $('#download_buttons a').hide();
    $('#waiting_message').show();
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8081/generate_random_music',
        data: JSON.stringify(get_music_params()),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function(data) {
        $('#waiting_message').hide();
        activate_download_button('ly', data.music_id);
        activate_download_button('pdf', data.music_id);
        activate_download_button('midi', data.music_id);
    });
}

function get_music_params() {
    var music_params = {};
    var measure_size = $('#measure_size').val();
    if (measure_size) {
        music_params.measure_size = parseInt(measure_size);
    }
    var rest_probability = $('#rest_probability').val();
    if (rest_probability) {
        music_params.rest_probability = parseFloat(rest_probability);
    }
    var tie_probability = $('#tie_probability').val();
    if (tie_probability) {
        music_params.tie_probability = parseFloat(tie_probability);
    }
    var length = $('#length').val();
    if (length) {
        music_params.length = parseInt(length);
    }
    return music_params;
}

function activate_download_button(output_type, music_id) {
    var url = 'http://localhost:8081/get_music_as_' + output_type + '/' + music_id;
    var $download_link = $('#get_music_as_' + output_type + '_btn');
    $download_link.attr('href', url);
    $download_link.show();
}
