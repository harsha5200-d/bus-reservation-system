# Bus Reservation System - Presentation Content

## 1. Introduction
- **Project Overview**: A full-stack, comprehensive web application designed to streamline the bus booking process for passengers and simplify management for administrators.
- **Key Features**: 
  - User and Admin authorization schemas.
  - Bus searching based on source, destination, and travel dates.
  - Interactive **3D seat visualization** and selection using Three.js.
  - Real-time booking history and ticket management.
  - Admin dashboard for bus schedule and user management.
- **Tech Stack**:
  - **Frontend**: React.js, Three.js (for 3D UI), Tailwind CSS.
  - **Backend**: Node.js, Express.js.
  - **Database**: MongoDB.

## 2. Step by step procedure for Application Development
1. **Requirement Analysis & Planning**: Defined user roles (Admin, Passenger), core features (search, book, manage), and selected the MERN stack along with Three.js for 3D interactions.
2. **Database Design**: Created MongoDB schemas for Users, Buses, and Bookings to establish non-relational data structures.
3. **Backend Development (Node.js & Express.js)**: 
   - Set up RESTful APIs for user authentication (JWT).
   - Developed endpoints for CRUD operations on buses and processing bookings securely.
4. **Frontend Development (React.js)**:
   - Designed responsive UI layouts including a landing page, search forms, and dashboards.
   - Integrated state management for complex booking flows.
5. **3D Seat Visualization (Three.js)**: 
   - Modeled the bus interior and seat layouts.
   - Implemented interactive seat selection mechanics mapping 3D objects to the React booking state.
6. **Integration & Testing**: Connected frontend React components with backend Express routes. Conducted end-to-end testing of the authorization and booking workflows.
7. **Refinement & Styling**: Improved the visual aesthetics, ensuring responsive design across devices, and adding animations (like the moving buses on the landing page).

## 3. Sample Code

### Frontend: Fetching Bus Details (React)
```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const useBusDetails = (busId) => {
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const response = await axios.get(`/api/buses/${busId}`);
        setBus(response.data);
      } catch (error) {
        console.error("Error fetching bus details", error);
      } finally {
        setLoading(false);
      }
    };
    if (busId) fetchBus();
  }, [busId]);

  return { bus, loading };
};
export default useBusDetails;
```

### Backend: Creating a Booking (Express & Mongoose)
```javascript
const Booking = require('../models/Booking');
const Bus = require('../models/Bus');

exports.createBooking = async (req, res) => {
  try {
    const { busId, seatNumbers, passengerDetails, totalAmount } = req.body;
    
    // Create new booking record mapped to the logged-in user
    const newBooking = new Booking({
      user: req.user.id,
      bus: busId,
      seats: seatNumbers,
      passengers: passengerDetails,
      totalAmount: totalAmount
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking successful', booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during booking process' });
  }
};
```

## 4. Screenshots
> *(Note: During the presentation, insert your actual application screenshots in these slots)*
- **Slide 1: Landing Page**: Showcase the dynamic background, moving buses animation, and the main search interface.
- **Slide 2: Search Results**: Display the list of available buses for a queried route.
- **Slide 3: 3D Seat Selection**: Highlight the Three.js interactive bus interior and seat picking mechanism.
- **Slide 4: Booking Confirmation**: Show the user's ticket summary and confirmation screen.
- **Slide 5: Dashboard**: Show the booking history for users or the bus management interface for admins.

## 5. Conclusion
- The Bus Reservation System successfully demonstrates a modern, full-stack approach to solving real-world transit booking problems.
- By integrating interactive web technologies like Three.js into a robust MERN stack foundation, the application provides an intuitive and highly engaging user experience.
- The modular architecture ensures the system is scalable and can be expanded with further features such as live bus tracking, dynamic pricing, or integrated payment gateways in the future.
