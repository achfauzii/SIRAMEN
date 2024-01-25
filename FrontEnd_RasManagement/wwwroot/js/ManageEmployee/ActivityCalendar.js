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
        eventDidMount:  function (info) {
            updatePopoverContent(info);
        },
        // events: [
        //   {
        //     title: 'All Day Event',
        //     start: '2024-01-21',
        //     description: 'description1</br>767676767676',
        //     allDay: true,
        //   },
        //   {
        //     title: 'Long Event',
        //     description: '<ul><li>ina</li><li>fauuad</li></ul>',
        //     start: '2024-01-20',
        //     allDay: true,
        //   },
        // ],
        events: function (info, successCallback, failureCallback) {
          let start = moment(info.start.valueOf()).format('YYYY-MM-DD');
          let end = moment(info.end.valueOf()).format('YYYY-MM-DD');
          $.ajax({
              url: "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +  '?start='+ start + "&end=" + end,
              type: 'GET',
              headers: {
                  Authorization: "Bearer " + sessionStorage.getItem("Token")
              }, success: function (response) {
                      successCallback(response);
              }
          });
      },
      
      viewRender: function (view) {
        // Update popover content when the view changes
        calendar.getEvents().forEach(function (event) {
            var eventEl = calendar.getEventEl(event.id);
            if (eventEl) {
                updatePopoverContent({ el: eventEl, event: event });
            }
        });
    },
      
  });
  function updatePopoverContent(info) {
    var isMonthView = calendar.view.type === 'timeGridMonth' || calendar.view.type === 'dayGridMonth';

    var title = isMonthView ? info.event.title :  info.event.extendedProps.description;
    var content = isMonthView ? info.event.extendedProps.description  :  info.event.title;

    $(info.el).popover({
        title: title,
        html: true,
        placement: 'bottom',
        content: content,
        trigger: 'hover',
        container: 'body',
    });
  }

  calendar.render();

});
