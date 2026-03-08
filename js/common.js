const STORAGE_KEY = "dkhardware.userListings";

function calculateDealLabel(price, estimatedMarketPrice) {
  const ratio = price / estimatedMarketPrice;

  if (ratio <= 0.85) {
    return { text: "Good deal", className: "good" };
  }

  if (ratio <= 1.1) {
    return { text: "Fair", className: "fair" };
  }

  return { text: "Expensive", className: "expensive" };
}

function formatDKK(amount) {
  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: "DKK",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getUserListings() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveUserListing(listing) {
  const listings = getUserListings();
  listings.unshift(listing);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
}

async function getAllListings() {
  const response = await fetch("data/listings.json");
  const baseListings = await response.json();
  return [...getUserListings(), ...baseListings];
}

function createListingCard(listing) {
  const deal = calculateDealLabel(listing.price, listing.estimatedMarketPrice);
  return `
    <article class="card">
      <h3>${listing.title}</h3>
      <p><strong>Kategori:</strong> ${listing.category}</p>
      <p class="price">${formatDKK(listing.price)}</p>
      <span class="deal-label ${deal.className}">${deal.text}</span>
      <p><a href="listing.html?id=${encodeURIComponent(listing.id)}">Se detaljer</a></p>
    </article>
  `;
}
