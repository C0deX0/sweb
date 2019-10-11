class CalendarMainClass {

    /**
     * Calendar Object
     *
     * @type {ObjectConstructor}
     */
    calendarObj = Object;

    /**
     * Init calendar
     */
    loadCalendar ()
    {
        let calendarEl = document.getElementById('calendar');

        let calendar = new FullCalendar.Calendar(calendarEl, {
            lang: 'de',
            plugins: [ 'interaction', 'dayGrid', 'list' ],
            header: {
                left: 'today',
                center: 'title',
                right: 'dayGridMonth,listDay,listWeek,listMonth'
            },
            views: {
                listDay: { buttonText: 'list day' },
                listWeek: { buttonText: 'list week' },
                listMonth: { buttonText: 'list month'}
            },

            navLinks: true, // can click day/week names to navigate views
            selectable: true,
            selectMirror: true,
            editable: true,
            eventLimit: true, // allow "more" link when too many events
            eventTextColor: '#FFF'

        });

        calendar.render();

        this.calendarObj = calendar;
    };

    /**
     * Load the events from database
     *
     * @returns {Promise<void>}
     */
    async calendarLoadEvents ()
    {
        let currentMonth = this.toJSONLocal(new Date(this.calendarObj.view.currentStart));

        let eventsResponse = await fetch('index.php/calendarAjax?action=getCurrentEvents&current=' + currentMonth);

        if (eventsResponse.ok) {
            calendarClass.showCalendarEvents(await eventsResponse.json())
        } else {
            console.log('HTTP-Error: ' + eventsResponse.status);
        }
    }

    /**
     * Displays the Events
     *
     * @param currentEvents
     */
    showCalendarEvents (currentEvents)
    {
        console.log(currentEvents);

        for (let calendarEvent in currentEvents) {

            let eventId = currentEvents[calendarEvent].id;

            if (this.calendarObj.getEventById(eventId) === null) {

                let eventStart = currentEvents[calendarEvent].start_event.date;
                eventStart = eventStart.substring(0, eventStart.indexOf(' '));

                let eventEnd = currentEvents[calendarEvent].end_event.date;
                eventEnd = eventEnd.substring(0, eventEnd.indexOf(' '));

                calendarClass.calendarObj.addEvent({
                    id: eventId,
                    title: currentEvents[calendarEvent].title,
                    color: currentEvents[calendarEvent].color,
                    start: eventStart,
                    end: eventEnd
                });

            } else {
                console.log('Found!');
            }
        }
    }

    /**
     * Add the heading and formula to the modal body
     *
     * @param action
     */
    createEventModal (action)
    {
        // Heading element
        let modalTitle = document.getElementById('addEventModalTitle');
        // Body element
        let modalBody = document.getElementById('addEventModalBody');

        if ('createEvent' === action) {

            // Add heading
            modalTitle.innerHTML = 'Create Event';
            // Add formula to body
            modalBody.innerHTML = ''+
                '<form id="createEventModalForm">' +
                '  <div class="form-row">' +
                '    <div class="form-group col-md-6">' +
                '       <label for="eventTitle">Title:</label>' +
                '       <input type="text" class="form-control" id="eventTitle" name="eventTitle" placeholder="Title" maxlength="100">' +
                '    </div>' +
                '    <div class="form-group col-md-6">' +
                '       <label for="eventTitle">Color:</label>' +
                '       <select class="form-control" id="eventColor" name="eventColor" onchange="calendarClass.setColorSelector(this)">' +
                '           <option class="color-black bg-color-white" value="withe">-- choose --</option>' +
                '           <option class="color-white bg-color-red" value="red">Red</option>' +
                '           <option class="color-white bg-color-green" value="green">Green</option>' +
                '           <option class="color-white bg-color-blue" value="blue">Blue</option>' +
                '           <option class="color-white bg-color-deeppink" value="deeppink">Pink</option>' +
                '           <option class="color-white bg-color-black" value="black">Black</option>' +
                '       </select>' +
                '    </div>' +
                '  </div>' +
                '  <div class="form-row">' +
                '    <div class="form-group col-md-6">' +
                '      <label for="eventStart">Start:</label>' +
                '      <input type="date" class="form-control" id="eventStart" name="eventStart">' +
                '    </div>' +
                '    <div class="form-group col-md-6">' +
                '      <label for="eventEnd">End:</label>' +
                '      <input type="date" class="form-control" id="eventEnd" name="eventEnd">' +
                '    </div>' +
                '  </div>' +
                '  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>' +
                '  <button type="submit" class="btn btn-success float-right" onclick="calendarClass.saveEvent();">Save changes</button>' +
                '</form>';
        }
    }

    /**
     * Create event from calendar (clicking on a day) (Modal)
     */
    createEventFromCalendar ()
    {
        this.calendarObj.on('select', function (arg) {
            calendarClass.createEventModal('createEvent');
            document.getElementById('eventStart').valueAsDate = arg.end;
            document.getElementById('eventEnd').valueAsDate = arg.end;
            $('#addEventModal').modal('toggle');
        });
    }

    /**
     * Create event from Action Panel (Modal)
     */
    createEvent ()
    {
        this.createEventModal('createEvent');
        document.getElementById('eventStart').value = this.toJSONLocal(new Date());
        document.getElementById('eventEnd').value = this.toJSONLocal(new Date());
        $('#addEventModal').modal('toggle');
    }

    /**
     * Add the event to the calendar and in database
     */
    saveEvent ()
    {
        createEventModalForm.onsubmit = async (e) => {
            e.preventDefault();

            let formData = new FormData(createEventModalForm);

            if (formData.get('eventTitle')) {
                calendarClass.calendarObj.addEvent({
                    title: formData.get('eventTitle'),
                    color: formData.get('eventColor'),
                    start: formData.get('eventStart'),
                    end: formData.get('eventEnd')
                });

                await fetch('index.php/calendarAjax?action=saveEvent&saveType=insert', {
                    method: 'POST',
                    body: formData
                });
            }
        };
    }

    

    /**
     * Go to last month and load the events
     */
    preView()
    {
        this.calendarObj.prev();
        this.calendarLoadEvents();
    }

    /**
     * Go to next month and load the events
     */
    nextView ()
    {
        this.calendarObj.next();
        this.calendarLoadEvents();
    }

    rrrrrrrr ()
    {

    }

    /**
     * Format date to date for MySQL (YYYY-mm-dd)
     *
     * @param date
     * @returns {string}
     */
    toJSONLocal (date) {
        var local = new Date(date);
        local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return local.toJSON().slice(0, 10);
    }

    setColorSelector (element)
    {
        if ('withe' === element.value) {
            element.style.color = 'black';
        } else {
            element.style.color = 'white';
        }
        element.style.backgroundColor = element.value;
    }
}