$(function () {

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay'
        },
        themeSystem: 'bootstrap',
        lazyFetching: false,
        eventDidMount: function (info) {

            $(info.el).popover({
                title: info.event.extendedProps.description,
                placement: 'bottom',
                content: info.event.title,
                trigger: 'hover',
                container: 'body',
            });
        },

        events: function (info, successCallback, failureCallback) {
            let start = moment(info.start.valueOf()).format('YYYY-MM-DD');
            let end = moment(info.end.valueOf()).format('YYYY-MM-DD');
            $.ajax({
                url: "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" + '?start=' + start + "&end=" + end,
                type: 'GET',
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token")
                }, success: function (response) {
                    successCallback(response);
                }
            });
        },
        extraParams: function () {
            return {
                cachebuster: new Date().valueOf()
            }
        },


        editable: false,
        droppable: true, // this allows things to be dropped onto the calendar !!!

    });

    calendar.render();
    // $('#calendar').fullCalendar()

});