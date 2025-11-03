// ========== Ticket Booking Logic ==========
const seatContainer = document.getElementById("seatContainer");
const eventSelect = document.getElementById("event");
const count = document.getElementById("count");
const total = document.getElementById("total");
const bookBtn = document.getElementById("bookBtn");
const summary = document.getElementById("summary");
let ticketPrice = 0;
let selectedSeats = new Set();

let bookedSeats = JSON.parse(localStorage.getItem("bookedSeats")) || [];

for (let i = 1; i <= 30; i++) {
  const seat = document.createElement("div");
  seat.classList.add("seat");
  seat.dataset.seat = i;
  if (bookedSeats.includes(seat.dataset.seat)) seat.classList.add("occupied");
  seatContainer.appendChild(seat);
}

eventSelect.addEventListener("change", (e) => {
  const selected = e.target.options[e.target.selectedIndex];
  ticketPrice = parseFloat(selected.dataset.price || 0);
  updateTotal();
});

seatContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("seat") && !e.target.classList.contains("occupied")) {
    e.target.classList.toggle("selected");
    const seatNum = e.target.dataset.seat;
    selectedSeats.has(seatNum) ? selectedSeats.delete(seatNum) : selectedSeats.add(seatNum);
    updateTotal();
  }
});

function updateTotal() {
  const seatCount = selectedSeats.size;
  count.innerText = seatCount;
  total.innerText = (seatCount * ticketPrice).toFixed(2);
}

bookBtn.addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const eventName = eventSelect.value;

  if (!name || !email || !eventName) {
    alert("Please fill in all fields and select an event!");
    return;
  }
  if (selectedSeats.size === 0) {
    alert("Please select at least one seat!");
    return;
  }

  selectedSeats.forEach((seatNum) => {
    bookedSeats.push(seatNum);
    const seatDiv = document.querySelector(`.seat[data-seat='${seatNum}']`);
    seatDiv.classList.remove("selected");
    seatDiv.classList.add("occupied");
  });

  localStorage.setItem("bookedSeats", JSON.stringify(bookedSeats));

  document.getElementById("summaryName").innerText = name;
  document.getElementById("summaryEmail").innerText = email;
  document.getElementById("summaryEvent").innerText = eventName;
  document.getElementById("summarySeats").innerText = Array.from(selectedSeats).join(", ");
  document.getElementById("summaryTotal").innerText = (selectedSeats.size * ticketPrice).toFixed(2);
  summary.classList.remove("hidden");

  selectedSeats.clear();
  updateTotal();
  alert("🎉 Booking Confirmed! Your seats are now saved.");
});

// ========== 📚 Book Store Logic ==========
const buyButtons = document.querySelectorAll(".buyBtn");
const purchasedList = document.getElementById("purchasedList");
const clearBtn = document.getElementById("clearBooks");

// Load previously purchased books
let purchasedBooks = JSON.parse(localStorage.getItem("purchasedBooks")) || [];
renderPurchasedBooks();

buyButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const title = btn.dataset.title;
    const price = parseFloat(btn.dataset.price);
    const date = new Date().toLocaleString();

    // Create purchase record
    const newPurchase = { title, price, date };

    // Save to array + localStorage
    purchasedBooks.push(newPurchase);
    localStorage.setItem("purchasedBooks", JSON.stringify(purchasedBooks));

    renderPurchasedBooks();
    alert(`📚 You purchased "{title}" for ETB{price.toFixed(2)}!`);
  });
});

// Display purchased books
function renderPurchasedBooks() {
  purchasedList.innerHTML = "";
  if (purchasedBooks.length === 0) {
    purchasedList.innerHTML = "<li>No books purchased yet.</li>";
    return;
  }
  purchasedBooks.forEach((book) => {
    const li = document.createElement("li");
    li.textContent = `"ETB{book.title}" - ETB{book.price.toFixed(2)} (Purchased on: ETB{book.date})`;
    purchasedList.appendChild(li);
  });
}