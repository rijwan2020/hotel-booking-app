export const saveBooking = (booking) => {
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));
};

export const getBookings = (user_id) => {
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  return bookings.filter((booking) => booking.user_id === user_id);
};

export const cancelBooking = (bookingId) => {
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  bookings = bookings.map((booking) => {
    if (booking.id === bookingId) {
      return { ...booking, status: "cancelled" };
    }
    return booking;
  });
  localStorage.setItem("bookings", JSON.stringify(bookings));
};
