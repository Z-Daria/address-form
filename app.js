let url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
let token = '';
let choices = [];

$(document).ready(() => {
    // to request hints while entering address
    $('#address').on('focus', function() {
        $('#address').on('keyup change', function(event) {
            $('datalist').remove();
            let container = event.target;
            getSuggestions(container);
        });
    });
});

$('#address').on('blur', event => {
    if (choices) {
        $('address').unbind('keyup change');
        let selected = event.target.value;
        $('datalist').remove();
        if(choices.find(choice => choice.value == selected)) {
            fillinFields(choices.find(choice => choice.value == selected));
        }
    }
});

// to fetch address hints from API
function getSuggestions(container) {
    let request = $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify({query: $('#address').val()}),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + token
        }
    });
    request.done(function(data) {
        choices = data.suggestions;
        createOptionsList(container, data.suggestions);
    });
    request.fail(err => {
        console.log(err);
    });
};

// to create datalist for suggestions
function createOptionsList(container, suggestions) {
    let options = '<datalist id="' + container.attributes[1].value + '">';
    for (let i = 0; i < suggestions.length; i++) {
        options += '<option>' + suggestions[i].value + '</option>';
    }
    options += '</datalist>';
    $(options).insertAfter(container);
};


// to fill in the form fields when the suggestion is selected
function fillinFields(selected) {
    $('#region').val(selected.data.region);
    $('#district').val(selected.data.area_with_type);
    $('#city').val(selected.data.city);
    $('#settlement').val(selected.data.settlement_with_type);
    $('#street').val(selected.data.street);
    $('#house').val(selected.data.house);
};

