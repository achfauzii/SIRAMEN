$(function () {
    $('#popover-dismiss').popover({
        trigger: 'focus'
      })
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

      editable: true,
      droppable: true, // this allows things to be dropped onto the calendar !!!
      
  });
  function updatePopoverContent(info) {
    var isWeekView = calendar.view.type === 'timeGridWeek' || calendar.view.type === 'dayGridWeek';

    var title = isWeekView ?  info.event.extendedProps.description : info.event.title;
    var content = isWeekView ? info.event.title :  info.event.extendedProps.description;

    $(info.el).popover({
        title: title,
        placement: 'bottom',
        content: content,
        trigger: 'hover',
        container: 'body',
    });
}
  calendar.render();
  // $('#calendar').fullCalendar()

});
