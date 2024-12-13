import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EventModal.css";

function EventModal({ date, onClose, refreshEvents }) {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ name: "", startTime: "", endTime: "", description: "" });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);

  // Fetch events for the selected date
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/events?date=${date}`);
      setEvents(response.data);
      refreshEvents();
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [date]);

  // Add or update an event
  const handleSave = async () => {
    if (!newEvent.name || !newEvent.startTime || !newEvent.endTime) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      if (isEditing) {
        // Update existing event
        await axios.put(`http://localhost:5000/events/${editingEventId}`, { ...newEvent, date });
      } else {
        // Add new event
        await axios.post("http://localhost:5000/events", { ...newEvent, date });
      }

      fetchEvents();
      refreshEvents();
      handleFormClose();
    } catch (error) {
      console.error(isEditing ? "Error updating event:" : "Error adding event:", error);
    }
  };

  // Delete an event
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/events/${id}`);
      fetchEvents();
      refreshEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Open form for editing an event
  const handleEdit = (event) => {
    setNewEvent({
      name: event.name,
      startTime: event.startTime,
      endTime: event.endTime,
      description: event.description,
    });
    setEditingEventId(event.id);
    setIsEditing(true);
    setIsFormVisible(true);
  };

  // Close the form
  const handleFormClose = () => {
    setNewEvent({ name: "", startTime: "", endTime: "", description: "" });
    setIsEditing(false);
    setEditingEventId(null);
    setIsFormVisible(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h3>Events for {date}</h3>
        <table className="event-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.name}</td>
                <td>{event.startTime}</td>
                <td>{event.endTime}</td>
                <td>{event.description}</td>
                <td>
                  <button onClick={() => handleEdit(event)}>Edit</button>
                  <button onClick={() => handleDelete(event.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => setIsFormVisible(true)}>Add Event</button>
        {isFormVisible && (
          <div className="form-overlay">
            <h4>{isEditing ? "Edit Event" : "Add New Event"}</h4>
            <div className="new-event-form">
              <input
                type="text"
                placeholder="Event Name"
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
              />
              <input
                type="time"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
              />
              <input
                type="time"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
              />
              <textarea
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
              <div className="form-actions">
                <button onClick={handleSave}>{isEditing ? "Update Event" : "Create Event"}</button>
                <button onClick={handleFormClose}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventModal;
