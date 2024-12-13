import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "./components/Calendar";
import EventModal from "./components/EventModal";

function App() {
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    refreshEvents();
  }, []);
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };
  const refreshEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/events");
      const fetchedEvents = {};
      response.data.forEach((event) => {
        const { date } = event;
        if (!fetchedEvents[date]) {
          fetchedEvents[date] = [];
        }
        fetchedEvents[date].push(event);
      });
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  

  return (
    <div>
      <Calendar events={events} onDateClick={handleDateClick} />
      {isModalOpen && (
        <EventModal
        date={selectedDate}
        // events={events}
        // setEvents={setEvents}
        refreshEvents={refreshEvents}
        onClose={() => setIsModalOpen(false)}
      />
      
      )}
    </div>
  );
}

export default App;
