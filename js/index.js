const listingGrid = document.getElementById("listingGrid");
const categoryFilter = document.getElementById("categoryFilter");

let allListings = [];

function renderListings() {
  const selected = categoryFilter.value;
  const filteredListings =
    selected === "ALL"
      ? allListings
      : allListings.filter((listing) => listing.category === selected);

  if (!filteredListings.length) {
    listingGrid.innerHTML = '<p>Ingen annoncer i den valgte kategori.</p>';
    return;
  }

  listingGrid.innerHTML = filteredListings.map(createListingCard).join("");
}

async function init() {
  allListings = await getAllListings();
  renderListings();
}

categoryFilter.addEventListener("change", renderListings);
init();
