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
      eventContent: function(arg) {
        var view = calendar.view;
        var title = '';
        console.log(arg.event._def.extendedProps.description)
        if (view.type === 'dayGridDay') {
          title = arg.event._def.extendedProps.description +": "+ arg.event.title;
        } else {
          // Handle other views as needed
          title = arg.event.title;
        }
  
        return {
          html: '<div class="custom-event">' + title + '</div>'
        };
      }
      
      
      
      
    });
    function updatePopoverContent(info) {
    var isMonthView = calendar.view.type === 'timeGridMonth' || calendar.view.type === 'dayGridMonth';

    var title = isMonthView ? info.event.title :  info.event.extendedProps.description;
    var content = isMonthView ? info.event.extendedProps.description  :  info.event.title;

    $(info.el).popover({
        title: title,
        placement: 'bottom',
        html: true,
        content: content,
        trigger: 'hover',
        container: 'body',
    });
}
  calendar.render();
  // $('#calendar').fullCalendar()

});
