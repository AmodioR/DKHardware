const sellerProfile = document.querySelector('#sellerProfile');
const sellerRating = document.querySelector('#sellerRating');
const sellerListingGrid = document.querySelector('#sellerListingGrid');
const sellerId = new URLSearchParams(window.location.search).get('id');

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
      <a class="read-more" href="#">Læs mere</a>
      <button class="btn btn-primary" type="button">Skriv til sælger</button>
      <button class="btn btn-secondary" type="button">Giv et bud</button>
    </article>
  `;
};

const renderMissingSeller = () => {
  sellerProfile.innerHTML = '<h1>Sælger ikke fundet</h1><p>Denne profil findes ikke.</p>';
  sellerRating.innerHTML = '';
  sellerListingGrid.innerHTML = '';
};

const renderSeller = (seller) => {
  sellerProfile.innerHTML = `
    <img class="seller-avatar" src="${seller.image}" alt="Profilbillede af ${seller.name}" />
    <div class="seller-meta">
      <h1>${seller.name}</h1>
      <p class="seller-location">Lokation: ${seller.location}</p>
      <p class="seller-bio">${seller.bio}</p>
    </div>
    <button class="btn btn-primary follow-btn" type="button" id="followSellerBtn">Følg sælger</button>
  `;

  sellerRating.innerHTML = `
    <span class="rating-star" aria-hidden="true">★</span>
    <div>
      <h3>${seller.ratingTitle}</h3>
      <p>${seller.ratingText}</p>
    </div>
  `;

  const followButton = document.querySelector('#followSellerBtn');
  followButton?.addEventListener('click', () => {
    followButton.classList.toggle('is-following');
    followButton.textContent = followButton.classList.contains('is-following') ? 'Følger' : 'Følg sælger';
  });
};

const renderSellerListings = (listings) => {
  if (!listings.length) {
    sellerListingGrid.innerHTML = '<p>Ingen aktive annoncer fra denne sælger.</p>';
    return;
  }

  sellerListingGrid.innerHTML = listings.map(createListingCard).join('');
};

const initSellerPage = async () => {
  const [sellerResponse, listingsResponse] = await Promise.all([fetch('data/sellers.json'), fetch('data/listings.json')]);
  const sellers = await sellerResponse.json();
  const listings = await listingsResponse.json();

  const seller = sellers.find((item) => item.id === sellerId);

  if (!seller) {
    renderMissingSeller();
    return;
  }

  renderSeller(seller);
  const sellerListings = listings.filter((listing) => listing.sellerId === seller.id);
  renderSellerListings(sellerListings);
};

initSellerPage();
