const ownerProfile = document.querySelector('#ownerProfile');
const ownerRating = document.querySelector('#ownerRating');
const ownerImprovement = document.querySelector('#ownerImprovement');
const ownerListingGrid = document.querySelector('#ownerListingGrid');
const sellerId = new URLSearchParams(window.location.search).get('id') || 'demo-seller-1';

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

const createOwnerListingCard = (listing) => {
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
      <button class="btn btn-primary" type="button">Redigér</button>
    </article>
  `;
};

const renderMissingSeller = () => {
  ownerProfile.innerHTML = '<h1>Profil ikke fundet</h1><p>Denne profil findes ikke.</p>';
  ownerRating.innerHTML = '';
  ownerImprovement.innerHTML = '';
  ownerListingGrid.innerHTML = '';
};

const renderOwner = (seller) => {
  ownerProfile.innerHTML = `
    <img class="seller-avatar" src="${seller.image}" alt="Profilbillede af ${seller.name}" />
    <div class="seller-meta">
      <h1>${seller.name}</h1>
      <p class="seller-location">Lokation: ${seller.location}</p>
      <p class="seller-bio">${seller.bio}</p>
    </div>
    <button class="btn btn-primary follow-btn owner-edit-profile-btn" type="button">Redigér profil</button>
  `;

  ownerRating.innerHTML = `
    <span class="rating-star" aria-hidden="true">★</span>
    <div>
      <h3>${seller.ratingTitle}</h3>
      <p>${seller.ratingText}</p>
    </div>
  `;

  ownerImprovement.innerHTML = `
    <div>
      <p>Der er flere forskellige måder du kan få en bedre rating på, du kan her under se de forskellige ting du kan forbedre for at din rating bliver højere, nogle ting har effekt med det samme, og nogle ting vil gøre din rating bedre overtid, negative handlinger vægter højere end gode. Dette vil sige din troværdighed kan falde hurtigere end den stiger.</p>
    </div>
  `;
};

const renderOwnerListings = (listings) => {
  if (!listings.length) {
    ownerListingGrid.innerHTML = '<p>Ingen aktive annoncer endnu.</p>';
    return;
  }

  ownerListingGrid.innerHTML = listings.map(createOwnerListingCard).join('');
};

const initOwnerPage = async () => {
  const [sellerResponse, listingsResponse] = await Promise.all([fetch('data/sellers.json'), fetch('data/listings.json')]);
  const sellers = await sellerResponse.json();
  const listings = await listingsResponse.json();

  const seller = sellers.find((item) => item.id === sellerId);

  if (!seller) {
    renderMissingSeller();
    return;
  }

  renderOwner(seller);
  const sellerListings = listings.filter((listing) => listing.sellerId === seller.id).slice(0, 6);
  renderOwnerListings(sellerListings);
};

initOwnerPage();
