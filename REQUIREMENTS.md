# SMARTSERVE System Requirements Documentation

This section defines the scope and functionality of SMARTSERVE. It establishes the agreement between the project proponents and the stakeholders regarding system capabilities. The following requirements serve as the foundation for the system's design, ensuring that the software effectively addresses the identified needs for event management, catering service coordination, and administrative efficiency.

## Functional Requirements

Functional requirements define the specific behaviors and services that SMARTSERVE must perform to meet the needs of its stakeholders. These requirements are categorized by the four (4) primary modules of the system:

### 1. Public Website Portal

**Institutional Landing Page**
- The system shall display general company information, mission, and vision to external users.
- The system shall provide an interactive hero section showcasing catering services and event packages.
- The system shall support light/dark theme toggling with persistent user preference storage.

**Catalog & Package Management**
- The system shall provide a browsable catalog organized by categories: Food & Dishes, Desserts & Drinks, Decorations, Equipment & Setup, and Entertainment.
- The system shall display pre-made event packages with dynamic pricing based on guest count (pax).
- The system shall enable users to filter catalog items by category and search by name.
- The system shall provide detailed item information including ingredients, pricing, and availability.

**Custom Package Builder**
- The system shall allow users to create custom packages by selecting items from the catalog.
- The system shall enforce minimum requirements (at least one item from Food and Equipment categories) before package finalization.
- The system shall provide real-time price calculation based on selected items and guest count.
- The system shall enable users to name and save custom packages to their cart.

**AI-Integrated Event Planning**
- The system shall provide an AI chat interface (Halden's AI Planner) to assist users with event planning recommendations.
- The system shall maintain context of the user's current package and event details in the AI conversation.
- The system shall offer quick-action chips for common queries (birthday events, wedding receptions, package reviews, corporate events).
- The system shall generate AI responses with event-specific suggestions and package analysis.

**Venue Selection & GPS Integration**
- The system shall provide a GPS map interface using Leaflet.js for venue location selection.
- The system shall restrict venue selection to locations within NCR (National Capital Region).
- The system shall enable address search with geocoding capabilities.
- The system shall display selected venue location on an interactive map with markers.

**User Authentication & Access Control**
- The system shall provide a welcome modal allowing users to continue as guest or sign in with an account.
- The system shall enforce account requirements for reservation submission (guest users can browse but cannot book).
- The system shall support Google OAuth authentication for secure login.
- The system shall provide email/password authentication with forgot password functionality.
- The system shall enable user registration with email verification.

**Cart & Checkout Management**
- The system shall provide a cart drawer for managing selected packages and custom packages.
- The system shall enable modification of cart items (edit, remove, adjust quantities).
- The system shall support VIP field toggling for special event requirements.
- The system shall provide meeting time slot selection for consultation appointments.
- The system shall integrate with PayMongo API for secure payment processing.
- The system shall display real-time payment status and confirmation.

**Event Calendar Integration**
- The system shall display a public event calendar showing available dates and existing bookings.
- The system shall enable users to view event availability and plan their events accordingly.
- The system shall integrate FullCalendar.js for interactive calendar visualization.

### 2. Administrator Web Portal

**User Authentication & RBAC**
- The system shall perform secure validation of credentials for Super Admins to ensure role-appropriate data access.
- The system shall implement session management with automatic logout on inactivity.
- The system shall provide secure logout functionality with session cleanup.

**Dashboard & Overview**
- The system shall display a comprehensive dashboard with reservation statistics, revenue metrics, and operational insights.
- The system shall provide an interactive calendar view of all reservations and events.
- The system shall enable filtering of reservations by status (pending, approved, rejected, completed, cancelled).
- The system shall display key performance indicators including booking trends and revenue analytics.

**Reservation Management**
- The system shall allow administrators to view, approve, or reject reservation requests with optional rejection reasons.
- The system shall enable administrators to modify reservation details including dates, guest count, and venue information.
- The system shall support reservation status updates with automated notification triggers.
- The system shall provide reservation lifecycle tracking with activity logs.
- The system shall enable administrators to access detailed reservation information including packages, venue, and customer details.

**Meeting Management**
- The system shall enable administrators to schedule and manage consultation meetings with clients.
- The system shall provide video call integration for remote meetings.
- The system shall support meeting mode for real-time collaboration with clients during design sessions.
- The system shall enable file sharing and document collaboration during meetings.
- The system shall provide meeting chat functionality for real-time communication.
- The system shall allow administrators to set custom meeting time slots and manage availability.

**Meeting Mode & Real-Time Collaboration**
- The system shall provide a dedicated meeting mode interface for interactive package customization.
- The system shall enable real-time package editing with client synchronization.
- The system shall support venue assessment with GPS route planning and distance calculation.
- The system shall provide food panel for menu customization during meetings.
- The system shall enable venue panel for location verification and route optimization.
- The system shall support design details panel for décor and entertainment planning.
- The system shall allow administrators to conclude meetings and finalize contracts.

**Staff Management**
- The system shall enable administrators to create, edit, deactivate, or delete staff accounts.
- The system shall allow staff assignment to specific reservations and events.
- The system shall provide staff availability tracking and scheduling capabilities.
- The system shall enable administrators to view staff activity logs and performance metrics.

**Equipment Inventory Management**
- The system shall maintain a comprehensive inventory of all equipment items with status tracking.
- The system shall enable equipment allocation to specific reservations and events.
- The system shall support batch tracking for equipment items with QR code generation.
- The system shall provide equipment status updates (available, allocated, in-use, maintenance).
- The system shall enable administrators to generate QR codes for equipment tracking and validation.

**Activity Logging & Audit Trail**
- The system shall automatically log all system activities including reservations, meetings, and staff assignments.
- The system shall provide a searchable activity log with filtering capabilities.
- The system shall enable administrators to view detailed activity history for each reservation.
- The system shall support activity log categorization for easier tracking and auditing.

**Billing & Finance**
- The system shall provide billing management for reservations with payment status tracking.
- The system shall enable administrators to view payment history and generate invoices.
- The system shall support contract finalization with automated billing triggers.
- The system shall provide revenue reporting and financial analytics.

### 3. Staff Portal

**User Authentication & Access**
- The system shall perform secure validation of staff credentials.
- The system shall implement role-based access control for staff members.
- The system shall provide secure logout functionality with session cleanup.

**Staff Dashboard**
- The system shall display a personalized dashboard showing assigned reservations and upcoming events.
- The system shall provide real-time updates on reservation status and task assignments.
- The system shall enable staff to view their activity history and performance metrics.

**Execution Day Management**
- The system shall allow staff to view detailed execution plans for assigned events.
- The system shall provide task lists with status tracking (pending, in-progress, completed).
- The system shall enable staff to update task status in real-time during event execution.
- The system shall support equipment checklist verification with status updates.
- The system shall provide venue information and GPS navigation to event locations.

**Live Execution Tracking**
- The system shall enable staff to track live execution phases of events.
- The system shall provide real-time phase status updates (setup, service, teardown).
- The system shall allow staff to log issues and incidents during event execution.
- The system shall support photo documentation and note-taking during execution.

**Payroll Management**
- The system shall display staff earnings based on assigned events and hours worked.
- The system shall provide detailed breakdown of earnings by event and task.
- The system shall enable staff to view payment history and pending payments.
- The system shall support hourly rate calculation with overtime tracking.

**Strategy & Planning View**
- The system shall enable staff to view execution strategy documents for assigned events.
- The system shall provide access to event-specific plans and checklists.
- The system shall allow staff to reference venue layouts and equipment assignments.

### 4. Customer Portal (Integrated in Public Website)

**Profile Management**
- The system shall enable customers to manage their profile information including name, email, and contact details.
- The system shall support profile picture updates.
- The system shall provide password management functionality.

**Reservation Tracking**
- The system shall enable customers to view their reservation history and current status.
- The system shall provide real-time updates on reservation approval status.
- The system shall allow customers to view detailed reservation information including packages, venue, and timeline.

**Communication & Notifications**
- The system shall provide notification system for reservation status updates.
- The system shall enable customers to respond to meeting requests and confirm appointments.
- The system shall support email notifications for important reservation milestones.

## Non-Functional Requirements

Non-functional requirements describe the quality attributes and constraints that ensure the platform is robust, secure, and user-friendly:

**Security**
- All administrative and user data, particularly customer personal information and payment details, must be encrypted to comply with the Data Privacy Act of 2012.
- The system shall implement secure authentication mechanisms including OAuth 2.0 for Google login.
- The system shall use Firebase Authentication for secure user management and session handling.
- The system shall implement role-based access control (RBAC) to ensure appropriate data access based on user roles.
- All payment transactions shall be processed through secure PayMongo API integration with PCI DSS compliance.

**Performance**
- The AI chat interface shall generate responses within 3 seconds to maintain conversational flow.
- The GPS map interface shall load and display location data within 2 seconds.
- The catalog search and filtering functions shall return results within 1 second for optimal user experience.
- The payment processing system shall complete transactions within 5 seconds to prevent cart abandonment.
- The meeting mode interface shall support real-time synchronization with latency under 500ms for collaborative editing.

**Reliability**
- The system architecture must support continuous availability, particularly for the reservation booking and payment processing systems.
- The system shall implement automatic data backup and recovery mechanisms to prevent data loss.
- The system shall maintain 99.5% uptime during business hours to ensure customer accessibility.
- The system shall implement error handling and graceful degradation for service interruptions.

**Usability**
- The interface for customers must be designed for simplicity, requiring minimal technical training to perform core tasks like package selection and reservation booking.
- The admin portal shall provide intuitive navigation and clear visual indicators for system status.
- The staff portal shall be optimized for mobile use to support on-site event execution.
- The system shall provide contextual help and tooltips for complex features.
- The system shall support responsive design for optimal viewing across desktop, tablet, and mobile devices.

**Scalability**
- The system shall support concurrent user access for up to 1000 simultaneous users during peak booking periods.
- The system shall handle database growth to accommodate 10,000+ reservations without performance degradation.
- The system shall support horizontal scaling for increased demand during event seasons.

**Maintainability**
- The system shall be built with modular architecture to facilitate easy updates and feature additions.
- The system shall implement comprehensive logging for debugging and issue resolution.
- The system shall provide clear documentation for API endpoints and system integration points.

**Compatibility**
- The system shall be compatible with modern web browsers including Chrome, Firefox, Safari, and Edge.
- The system shall support mobile browsers on iOS and Android platforms.
- The system shall integrate with external services including Firebase, PayMongo, Google OAuth, and Leaflet Maps.
