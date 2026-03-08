const featuredListingGrid = document.querySelector('#featuredListingGrid');
const STORAGE_KEY = 'dkhardware.userListings';

const dealBadgeMap = {
  good: { label: 'God deal', className: 'star-good' },
  fair: { label: 'Fair deal', className: 'star-fair' },
  unfair: { label: 'Dårlig deal', className: 'star-unfair' }
};

const normalizeDealRating = (dealRating) => {
  if (!dealRating) {
    return 'fair';
  }

  const normalized = String(dealRating).trim().toLowerCase();

  if (['good', 'god deal', 'god'].includes(normalized)) {
    return 'good';
  }

  if (['fair', 'fair deal'].includes(normalized)) {
    return 'fair';
  }

  if (['unfair', 'dårlig deal', 'darlig deal', 'dårlig'].includes(normalized)) {
    return 'unfair';
  }

  return 'fair';
};

const formatDkk = (value) => `${new Intl.NumberFormat('da-DK').format(value)} kr.`;

const createListingCard = (listing) => {
  const deal = dealBadgeMap[normalizeDealRating(listing.dealRating)] || dealBadgeMap.fair;

  return `
    <article class="product-card" data-id="${listing.id}">
      <div class="product-image-wrap">
        <span class="deal-badge ${deal.className}" aria-label="${deal.label}" title="${deal.label}">★</span>
        <img src="${listing.image}" alt="${listing.title} ${listing.condition.toLowerCase()} ${listing.category.toLowerCase()}" />
      </div>
      <div class="product-topline">
        <h3>${listing.title} (${listing.condition})</h3>
        <p class="price">${formatDkk(listing.price)}</p>
      </div>
      <p class="description">${listing.description}</p>
      <a href="#" class="read-more">Læs mere</a>
      <button class="btn btn-primary" type="button">Skriv til sælger</button>
      <button class="btn btn-secondary" type="button">Giv et bud</button>
    </article>
  `;
};

const getUserListings = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const loadListings = async () => {
  const response = await fetch('data/listings.json');
  const baseListings = await response.json();
  return [...getUserListings(), ...baseListings];
};

const renderFeaturedListings = (listings) => {
  if (!featuredListingGrid) {
    return;
  }

  const featuredListings = listings
    .filter((listing) => normalizeDealRating(listing.dealRating) === 'good')
    .slice(0, 4);

  if (!featuredListings.length) {
    featuredListingGrid.innerHTML = '<p>Ingen fremhævede deals endnu.</p>';
    return;
  }

  featuredListingGrid.innerHTML = featuredListings.map(createListingCard).join('');
};

const initHome = async () => {
  const listings = await loadListings();
  renderFeaturedListings(listings);
};

initHome();
