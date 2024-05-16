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

    const timelineWrap = $('.timeline__items');
    timelineWrap.append(`
<div class="error">
    <div class="error__icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none"><path fill="#393a37" d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z"></path></svg>
    </div>
    <div class="error__title">Please Select Sales Projection</div>
    <div class="error__close"><svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 20 20" height="20"><path fill="#393a37" d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z"></path></svg></div>
</div>
    `)

    $('#buttonFilter').click(function (e) {
        let text = $(this).text();
        if (text.toLowerCase() === "vertical") {
            text = "Horizontal"
        } else {
            text = "Vertical"
        }
        $(this).text(text)
        getActivity($('#search').val())
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
            const timelineWrap = $('.timeline__items');
            const timelineItemsHtml = [];
            const divFilter = document.getElementById('divFilter');
            const buttonFilter = document.getElementById('buttonFilter');
            
            data !== null ? divFilter.style.display = "block" : divFilter.style.display = "none";

            data.data.forEach((timelineItem) => {
                const date = moment.utc(timelineItem.date);
                const displayDate = date.format('ddd, D MMMM YYYY');

                const timelineItemHtml = `
                    <div class="timeline__item">
                      <div class="timeline__content">
                        <h2>${displayDate}</h2>
                        <p>${timelineItem.activity ?? "No Description"}</p>
                      </div>
                    </div>
                  `;

                timelineItemsHtml.push(timelineItemHtml);
            });
            const noDataView = `
<div class="error">
    <div class="error__icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none"><path fill="#393a37" d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z"></path></svg>
    </div>
    <div class="error__title">There's No Data Found!</div>
    <div class="error__close"><svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 20 20" height="20"><path fill="#393a37" d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z"></path></svg></div>
</div>
    `
            console.log(buttonFilter.innerText);
            const noData = data.data.length === 0;
            timelineWrap.empty().append(noData ? noDataView : timelineItemsHtml.join(''));
            const selectedMode = buttonFilter.innerText.toLowerCase() ?? "vertical";
            const selectedItem = $('#item').val() ?? 3;
            jQuery(".timeline").timeline({
                mode: selectedMode, //default:vertical
                visibleItems: selectedItem,
                moveItems: 2,
            });
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