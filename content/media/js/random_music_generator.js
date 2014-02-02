(function() {
    var HOST = 'http://api.random-music-generator.fvieira.pt/';

    function generate_random_music() {
        $('#download_buttons a').hide();
        $('#waiting_message').show();
        $.ajax({
            type: 'POST',
            url: HOST + 'generate_random_music',
            data: JSON.stringify(get_music_params()),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        }).done(function(data) {
            $('#waiting_message').hide();
            activate_download_button('ly', data.music_id);
            activate_download_button('pdf', data.music_id);
            activate_download_button('midi', data.music_id);
        });
    }

    function get_music_params() {
        var music_params = {};

        var pitches = [];
        var pitch_checkboxes = document.getElementsByName('pitches');
        var i;
        for(i = 0; i < pitch_checkboxes.length; i++) {
            if(pitch_checkboxes[i].checked){
                pitches.push(parseInt(pitch_checkboxes[i].value));
            }
        }
        music_params.pitches = pitches;


        var durations = [];
        music_params.durations = durations;
        var duration_checkboxes = document.getElementsByName('durations');
        var duration_probabilities = document.getElementsByName('duration_probability');
        for(i = 0; i < duration_checkboxes.length; i++) {
            if(duration_checkboxes[i].checked){
                durations.push([parseFloat(duration_checkboxes[i].value), parseInt(duration_probabilities[i].value)]);
            }
        }
        music_params.durations = durations;

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
        var url = HOST + 'get_music_as_' + output_type + '/' + music_id;
        var $download_link = $('#get_music_as_' + output_type + '_btn');
        $download_link.attr('href', url);
        $download_link.show();
    }

    document.getElementById('generate_random_music_btn').onclick = generate_random_music;

    function render_notes_on_canvas(canvas, notes, addStave) {
        var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
        var ctx = renderer.getContext();
        var stave = new Vex.Flow.Stave(10, 0, canvas.width);
        stave.addClef('treble').setContext(ctx).draw();
        // Create the notes
        var vexNotes = [];
        var numBeats = 0;
        var durationsMap = {
            '1': 4,
            '2dd': 3.5,
            '2d': 3,
            '2': 2,
            '4d': 1.5,
            '4': 1,
            '8': 0.5,
        };
        var i;
        for (i = 0; i < notes.length; i++) {
            var pitch = notes[i].pitch;
            var duration = notes[i].duration;
            numBeats += durationsMap[duration];
            var note = new Vex.Flow.StaveNote({keys: [pitch], duration: duration});
            if (pitch.substring(1, 2) == '#') {
                note.addAccidental(0, new Vex.Flow.Accidental('#'));
            } else if (pitch.substring(1, 2) == 'b') {
                note.addAccidental(0, new Vex.Flow.Accidental('b'));
            }
            if (duration.substring(1, 2) == 'd') {
                note.addDotToAll();
            }
            if (duration.substring(2, 3) == 'd') {
                note.addDotToAll();
            }
            vexNotes.push(note);
        }

        var voice = new Vex.Flow.Voice({
            num_beats: numBeats,
            beat_value: 4,
            resolution: Vex.Flow.RESOLUTION
        });

        console.log(vexNotes);
        console.log(numBeats);
        // Add notes to voice
        voice.addTickables(vexNotes);

        // Format and justify the notes
        var formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], canvas.width - 50);

        // Render voice
        voice.draw(ctx, stave);
    }

    render_notes_on_canvas(document.getElementById('pitches_canvas1'), [
        {'pitch': 'e/3', 'duration': '1'},
        {'pitch': 'f/3', 'duration': '1'},
        {'pitch': 'f#/3', 'duration': '1'},
        {'pitch': 'g/3', 'duration': '1'},
        {'pitch': 'g#/3', 'duration': '1'},
        {'pitch': 'a/3', 'duration': '1'},
        {'pitch': 'a#/3', 'duration': '1'},
        {'pitch': 'b/3', 'duration': '1'},
        {'pitch': 'c/4', 'duration': '1'},
        {'pitch': 'c#/4', 'duration': '1'},
        {'pitch': 'd/4', 'duration': '1'},
        {'pitch': 'd#/4', 'duration': '1'},

        {'pitch': 'e/4', 'duration': '1'},
        {'pitch': 'f/4', 'duration': '1'},
        {'pitch': 'f#/4', 'duration': '1'},
        {'pitch': 'g/4', 'duration': '1'},
        {'pitch': 'g#/4', 'duration': '1'},
        {'pitch': 'a/4', 'duration': '1'},
        {'pitch': 'a#/4', 'duration': '1'},
    ]);

    render_notes_on_canvas(document.getElementById('pitches_canvas2'), [
        {'pitch': 'b/4', 'duration': '1'},
        {'pitch': 'c/5', 'duration': '1'},
        {'pitch': 'c#/5', 'duration': '1'},
        {'pitch': 'd/5', 'duration': '1'},
        {'pitch': 'd#/5', 'duration': '1'},

        {'pitch': 'e/5', 'duration': '1'},
        {'pitch': 'f/5', 'duration': '1'},
        {'pitch': 'f#/5', 'duration': '1'},
        {'pitch': 'g/5', 'duration': '1'},
        {'pitch': 'g#/5', 'duration': '1'},
        {'pitch': 'a/5', 'duration': '1'},
        {'pitch': 'a#/5', 'duration': '1'},
        {'pitch': 'b/5', 'duration': '1'},
        {'pitch': 'c/6', 'duration': '1'},
        {'pitch': 'c#/6', 'duration': '1'},
        {'pitch': 'd/6', 'duration': '1'},
        {'pitch': 'd#/6', 'duration': '1'},

        {'pitch': 'e/6', 'duration': '1'},
        {'pitch': 'e#/6', 'duration': '1'},
    ]);

    render_notes_on_canvas(document.getElementById('durations_canvas'), [
        {'pitch': 'g/4', 'duration': '1'},
        {'pitch': 'g/4', 'duration': '2dd'},
        {'pitch': 'g/4', 'duration': '2d'},
        {'pitch': 'g/4', 'duration': '2'},
        {'pitch': 'g/4', 'duration': '4d'},
        {'pitch': 'g/4', 'duration': '4'},
        {'pitch': 'g/4', 'duration': '8'},
    ]);

})();
