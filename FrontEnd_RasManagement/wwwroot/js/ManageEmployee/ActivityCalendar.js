$(function () {
  /* initialize the external events
  -----------------------------------------------------------------*/
  function ini_events(ele) {
    ele.each(function () {
      
      // create an Event Object (https://fullcalendar.io/docs/event-object)
      // it doesn't need to have a start or end
          var eventObject = {
              title: $.trim($(this).text()) // use the element's text as the event title
            }

          // store the Event Object in the DOM element so we can get to it later
          $(this).data('eventObject', eventObject)

          // make the event draggable using jQuery UI
          $(this).draggable({
              zIndex: 1070,
              revert: true, // will cause the event to go back to its
              revertDuration: 0  //  original position after the drag
          })

      })
  }

  ini_events($('#external-events div.external-event'))
  
  /* initialize the calendar
  -----------------------------------------------------------------*/
  //Date for the calendar events (dummy data)
  var date = new Date()
  var d = date.getDate(),
  m = date.getMonth(),
  y = date.getFullYear()
  
  var Calendar = FullCalendar.Calendar;
  var Draggable = FullCalendar.Draggable;
  
  var containerEl = document.getElementById('external-events');
  var checkbox = document.getElementById('drop-remove');
  var calendarEl = document.getElementById('calendar');
  
  // initialize the external events
  // -----------------------------------------------------------------
  
  new Draggable(containerEl, {
    itemSelector: '.external-event',
    eventData: function (eventEl) {
      return {
        title: eventEl.innerText,
              backgroundColor: window.getComputedStyle(eventEl, null).getPropertyValue('background-color'),
              borderColor: window.getComputedStyle(eventEl, null).getPropertyValue('background-color'),
              textColor: window.getComputedStyle(eventEl, null).getPropertyValue('color'),
          };
        }
      });
      
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
                  title: info.event.title,
                  placement: 'top',
                  content: info.event.extendedProps.description,
                  trigger: 'hover',
                  container: 'body',
              });
      },
      // events: { url: 'https://localhost:7177/api/TimeSheet/TimeSheetByMonth',

      
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
      extraParams: function () {
          return {
              cachebuster: new Date().valueOf()
          }
      },
      viewRender: function (view, element) {
          // Fetch data from your API based on the current view
          var startDate = view.start;
          var endDate = view.end;
          fetchDataAndUpdateEvents(startDate, endDate);
      },

      editable: false,
      droppable: true, // this allows things to be dropped onto the calendar !!!
      drop: function (info) {
          // is the "remove after drop" checkbox checked?
          if (checkbox.checked) {
              // if so, remove the element from the "Draggable Events" list
              info.draggedEl.parentNode.removeChild(info.draggedEl);
          }
      }
  });

  calendar.render();
  // $('#calendar').fullCalendar()

  /* ADDING EVENTS */
  var currColor = '#3c8dbc' //Red by default
  // Color chooser button
  $('#color-chooser > li > a').click(function (e) {
      e.preventDefault()
      // Save color
      currColor = $(this).css('color')
      // Add color effect to button
      $('#add-new-event').css({
          'background-color': currColor,
          'border-color': currColor
      })
  })
  $('#add-new-event').click(function (e) {
      e.preventDefault()
      // Get value and make sure it is not null
      var val = $('#new-event').val()
      if (val.length == 0) {
          return
      }

      // Create events
      var event = $('<div />')
      event.css({
          'background-color': currColor,
          'border-color': currColor,
          'color': '#fff'
      }).addClass('external-event')
      event.text(val)
      $('#external-events').prepend(event)

      // Add draggable funtionality
      ini_events(event)

      // Remove event from text input
      $('#new-event').val('')
  })
})