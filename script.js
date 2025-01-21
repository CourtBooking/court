// Get elements
const currentMonthDisplay = document.getElementById("current-month");
const calendarBody = document.getElementById("calendar-body");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");

const modal = document.getElementById("booking-modal");
const closeModal = document.getElementById("close-modal");
const bookSlotButton = document.getElementById("book-slot");
const slotColorInput = document.getElementById("slot-color");
const startTimeInput = document.getElementById("start-time");
const endTimeInput = document.getElementById("end-time");
const personNameInput = document.getElementById("person-name");
const bookingsList = document.getElementById("bookings-ul");
const viewBookingsButton = document.getElementById("view-bookings");
const makeBookingButton = document.getElementById("make-booking");

// Store bookings with name, color, start time, and end time
let bookings = {};

// Initialize current date and month
let currentDate = new Date();

// Display current month on load
function loadCalendar() {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Set current month in the header
    currentMonthDisplay.textContent = `${getMonthName(currentMonth)} ${currentYear}`;
    
    // Get first day of the month and number of days in the month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    const firstDay = firstDayOfMonth.getDay();
    const totalDays = lastDateOfMonth.getDate();
    
    // Clear previous calendar days
    calendarBody.innerHTML = "";

    // Fill empty cells before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("day-cell", "disabled");
        calendarBody.appendChild(emptyCell);
    }

    // Create calendar days
    for (let day = 1; day <= totalDays; day++) {
        const dayCell = document.createElement("div");
        dayCell.classList.add("day-cell");
        dayCell.textContent = day;

        // Add click event to open booking modal
        dayCell.addEventListener("click", () => openDayView(day));

        // Check if the day has any bookings
        const bookingKey = `${currentYear}-${currentMonth}-${day}`;
        if (bookings[bookingKey]) {
            // Mark the day cell with a color
            dayCell.style.backgroundColor = bookings[bookingKey][0].color;
            // Add the times as a tooltip
            dayCell.title = bookings[bookingKey].map(b => `${b.name}: ${b.startTime} - ${b.endTime}`).join(", ");
        }

        calendarBody.appendChild(dayCell);
    }

    // Fill empty cells after the last day of the month
    const totalCells = calendarBody.children.length;
    const totalWeeks = Math.ceil(totalCells / 7);
    
    // Ensure there are 6 rows (weeks), so we fill any missing cells at the end
    const totalExpectedCells = totalWeeks * 7;
    for (let i = totalCells; i < totalExpectedCells; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("day-cell", "disabled");
        calendarBody.appendChild(emptyCell);
    }
}

// Helper function to get the month name
function getMonthName(monthIndex) {
    const months = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    return months[monthIndex];
}

// Switch to the previous month
prevMonthButton.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    loadCalendar();
});

// Switch to the next month
nextMonthButton.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    loadCalendar();
});

// Open the day view (to view bookings or make a booking)
let selectedDay;
function openDayView(day) {
    selectedDay = day;
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const bookingKey = `${currentYear}-${currentMonth}-${day}`;

    // Show the bookings for the day
    updateBookingsList(bookingKey);

    // Toggle buttons (View Bookings or Make Booking)
    viewBookingsButton.style.display = "block";
    makeBookingButton.style.display = "block";
}

// Update bookings list for a particular day
function updateBookingsList(bookingKey) {
    const bookingsForDay = bookings[bookingKey];
    bookingsList.innerHTML = "";
    if (bookingsForDay) {
        bookingsForDay.forEach(booking => {
            const listItem = document.createElement("li");
            listItem.textContent = `Day ${selectedDay}: ${booking.name} - ${booking.startTime} to ${booking.endTime}`;
            listItem.style.color = booking.color;
            bookingsList.appendChild(listItem);
        });
    } else {
        const noBookingsMessage = document.createElement("li");
        noBookingsMessage.textContent = `No bookings for day ${selectedDay}`;
        bookingsList.appendChild(noBookingsMessage);
    }
}

// View existing bookings (if any) on the selected day
viewBookingsButton.addEventListener("click", () => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const bookingKey = `${currentYear}-${currentMonth}-${selectedDay}`;

    updateBookingsList(bookingKey);
});

// Open the booking modal to create a new booking
makeBookingButton.addEventListener("click", () => {
    modal.style.display = "flex";
});

// Close the booking modal
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Book a slot with start and end times and name
bookSlotButton.addEventListener("click", () => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const bookingKey = `${currentYear}-${currentMonth}-${selectedDay}`;
    const selectedColor = slotColorInput.value;
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    const personName = personNameInput.value;

    if (!startTime || !endTime || !personName) {
        alert("Please provide a name, start time, and end time.");
        return;
    }

    // Store booking
    if (!bookings[bookingKey]) {
        bookings[bookingKey] = [];
    }

    bookings[bookingKey].push({
        name: personName,
        color: selectedColor,
        startTime: startTime,
        endTime: endTime
    });

    // Update the bookings list for the selected day
    updateBookingsList(bookingKey);

    // Reload the calendar to reflect the new booking
    loadCalendar();
    modal.style.display = "none";
});

// Load calendar initially
loadCalendar();
