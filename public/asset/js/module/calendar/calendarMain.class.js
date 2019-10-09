class CalendarMainClass {

    calendarObj = Object;

    loadCalendar ()
    {
        let calendarEl = document.getElementById('calendar');

        let calendar = new FullCalendar.Calendar(calendarEl, {
            lang: 'de',
            plugins: [ 'interaction', 'dayGrid', 'list' ],
            header: {
                left: 'prev,next today',
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

    async calendarLoadEvents ()
    {
        let lastMonthDay = moment().endOf('month').format('DD');
        let currentMonth = moment().month() + 1;

        let response = await fetch('index.php/calendarAjax?action=getCurrentEvents&lastDay=' + lastMonthDay + '&currentMonth=' + currentMonth);

        if (response.ok) {
            let currentEvents = await response.json();
        } else {
            console.log('HTTP-Error: ' + response.status);
        }

        for (let calendarEvent in currentEvents) {
            console.log(calendarEvent);
            calendarClass.calendarObj.addEvent({

            });
        }
    }

    enableAddEvents ()
    {
        let createIndicator = document.getElementById('createEventIndicator');

        this.calendarObj.on('select', function (arg) {
            var title = prompt('Event Title:');
            if (title) {
                this.addEvent({
                    title: title,
                    start: arg.start,
                    end: arg.end
                });
            }
            console.log(arg);
            this.unselect()
        });


        createIndicator.classList.remove('btn-danger');
        createIndicator.classList.add('btn-success');
    }

    createEventModal (action)
    {
        let modalTitle = document.getElementById('addEventModalTitle');
        let modalBody = document.getElementById('addEventModalBody');
        let modalFooter = document.getElementById('addEventModalFooter');

        if ('createEvent' === action) {
            modalTitle.innerHTML = 'Create Event';
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

    createEventFromCalendar ()
    {
        this.calendarObj.on('select', function (arg) {
            calendarClass.createEventModal('createEvent');
            document.getElementById('eventStart').valueAsDate = arg.end;
            document.getElementById('eventEnd').valueAsDate = arg.end;
            $('#addEventModal').modal('toggle');
        });
    }

    createEvent ()
    {
        this.createEventModal('createEvent');
        $('#addEventModal').modal('toggle');
    }

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


    getAllEvents ()
    {
        return this.calendarObj.getEvents();
    }

    loadEvents ()
    {
        return [
            {
                title: 'All Day Event',
                start: '2019-10-01T12:00:00',
                end: '2019-10-01T15:30:00'
            },
            {
                title: 'Long Event',
                start: '2019-10-07',
                end: '2019-10-10',
                color: 'green'
            },
            {
                groupId: 999,
                title: 'Repeating Event',
                start: '2019-10-09T16:00:00',
                end: '2019-10-10T16:00:00'
            },
            {
                groupId: 999,
                title: 'Repeating Event',
                start: '2019-10-16T16:00:00'
            },
            {
                title: 'Conference',
                start: '2019-10-11T09:00:00',
                end: '2019-10-11T13:00:00'
            },
            {
                title: 'Conference2',
                start: '2019-10-27',
                end: '2019-11-01',
                color: 'deeppink'
            }
        ];
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