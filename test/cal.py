from icalendar import Calendar, Event
from datetime import datetime, timedelta, time, date  # Added date import
import pytz


# Function to convert datetime.date to datetime.datetime
def ensure_datetime(dt):
    if isinstance(dt, datetime):
        return dt
    elif isinstance(dt, date):  # If it's a date, convert it to datetime
        return datetime.combine(dt, time.min)
    return dt


# Load the original ICS file
with open("szkhan.bee19@gmail.com.ics", "rb") as f:
    calendar = Calendar.from_ical(f.read())

# Get existing events
events = []
for component in calendar.walk():
    if component.name == "VEVENT":
        start = ensure_datetime(component.get("DTSTART").dt)
        end = ensure_datetime(component.get("DTEND").dt)
        summary = component.get("SUMMARY")
        events.append({"start": start, "end": end, "summary": summary})

# Simulate task durations (in hours)
tasks = [
    {
        "name": "Assignment 1",
        "duration": 3,
        "due": datetime(2024, 10, 10, 23, 59, tzinfo=pytz.UTC),
    },
    {
        "name": "Assignment 2",
        "duration": 2,
        "due": datetime(2024, 10, 15, 23, 59, tzinfo=pytz.UTC),
    },
    {
        "name": "Assignment 3",
        "duration": 1.5,
        "due": datetime(2024, 10, 8, 23, 59, tzinfo=pytz.UTC),
    },
]

# Calculate available time slots
free_slots = []
sorted_events = sorted(events, key=lambda x: x["start"])

# Get gaps between events as free slots
for i in range(len(sorted_events) - 1):
    current_end = sorted_events[i]["end"]
    next_start = sorted_events[i + 1]["start"]
    if next_start > current_end:
        free_slots.append({"start": current_end, "end": next_start})

# Assign tasks to free slots
scheduled_tasks = []
for task in tasks:
    task_duration = timedelta(hours=task["duration"])
    for slot in free_slots:
        slot_duration = slot["end"] - slot["start"]
        if slot_duration >= task_duration:
            task_start = slot["start"]
            task_end = task_start + task_duration
            scheduled_tasks.append(
                {"start": task_start, "end": task_end, "name": task["name"]}
            )
            # Update the free slot
            free_slots.remove(slot)
            if task_end < slot["end"]:
                free_slots.append({"start": task_end, "end": slot["end"]})
            break

# Create a new calendar with optimized tasks
optimized_calendar = Calendar()
for event in events:
    new_event = Event()
    new_event.add("summary", event["summary"])
    new_event.add("dtstart", event["start"])
    new_event.add("dtend", event["end"])
    optimized_calendar.add_component(new_event)

# Add the scheduled tasks to the calendar
for task in scheduled_tasks:
    task_event = Event()
    task_event.add("summary", task["name"])
    task_event.add("dtstart", task["start"])
    task_event.add("dtend", task["end"])
    optimized_calendar.add_component(task_event)

# Save the new calendar to an ICS file
with open("optimized_schedule.ics", "wb") as f:
    f.write(optimized_calendar.to_ical())
