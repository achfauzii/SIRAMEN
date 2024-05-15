$(document).ready(function () {
    $("#search").select2({
        placeholder: "Choose Sales Projection",
        allowClear: false,
        tags: true,
    });

    $('.bg-success').attr('style', 'min-height:100px')
    getSalesProjectionData()

    $('#search').change(function (e) {
        e.preventDefault()
        const selected = $(this).val()
        getActivity(selected)
    })
})

function getActivity(id) {
    $.ajax({
        url: 'https://localhost:7177/api/ActivitySalesProjection/bySpId?id='+id,
        type: 'GET',
        dataType: 'json',
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (data) {
            console.log(data)
           
        },
        error: function (err) {
            console.error(err)
        }
    })
}
function getSalesProjectionData() {
    $.ajax({
        url: 'https://localhost:7177/api/SalesProjection/allData',
        type: 'GET',
        dataType: 'json',
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (data) {
            console.log(data)
            data.data.forEach(function (option) {
                let optionElement = $(`<option>`);
                optionElement.attr('value', option.id);
                optionElement.text(option.client.nameOfClient + " (" + option.projectStatus + ")");
            $('#search').append(optionElement);
            })
        },
        error: function (err) {
            console.error(err)
        }
    })
}