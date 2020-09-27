let url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
let token = '1c332134a31a6b7c61298afafc21083d47d5d5d0';
let choices;

$(document).ready(() => {
    // to request hints while entering address
    $('#address').on('focus', function(event) {
        $('#address').on('keyup change', function(event) {
            $('datalist').remove();
            let container = event.target;
            getSuggestions(container);
        })
    })
});

// to fetch address hints from API
function getSuggestions(container) {
    const request = $.ajax({
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
        createOptionsList(container, data.suggestions);
    });
    request.fail(err => {
        console.log(err);
    });
};

// to create datalist for suggestions
function createOptionsList(container, suggestions) {
    choices = suggestions;
    let options = '<datalist id="' + container.attributes[1].value + '">';
    for (let i = 0; i < suggestions.length; i++) {
        options += '<option>' + suggestions[i].value + '</option>';
    };
    options += '</datalist>';
    $(options).insertAfter(container);
};

$('#address').on('blur', event => {
    if (choices) {
        $('address').unbind('keyup change');
        let selected = event.target.value;
        $('datalist').remove();
        fillinFields(choices.find(x => x.value == selected));
    }
});

// to fill in the form fields when the suggestion is selected
function fillinFields(selected) {
    $('#region').val(selected.data.region);
    $('#district').val(selected.data.area_with_type);
    $('#city').val(selected.data.city);
    $('#settlement').val(selected.data.settlement_with_type);
    $('#street').val(selected.data.street);
    $('#house').val(selected.data.house);
};

