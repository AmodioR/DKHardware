const detailsContainer = document.getElementById("listingDetails");
const listingId = new URLSearchParams(window.location.search).get("id");

async function renderDetails() {
  const listings = await getAllListings();
  const listing = listings.find((item) => item.id === listingId);

  if (!listing) {
    detailsContainer.innerHTML = "<p>Annonce ikke fundet.</p>";
    return;
  }

  const deal = calculateDealLabel(listing.price, listing.estimatedMarketPrice);

  detailsContainer.innerHTML = `
    <h2>${listing.title}</h2>
    <p><strong>Kategori:</strong> ${listing.category}</p>
    <p><strong>Pris:</strong> ${formatDKK(listing.price)}</p>
    <p><strong>Markedspris:</strong> ${formatDKK(listing.estimatedMarketPrice)}</p>
    <p><span class="deal-label ${deal.className}">${deal.text}</span></p>
    <p>${listing.description}</p>
  `;
}

renderDetails();
