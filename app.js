const priceRange = document.querySelector('#priceRange');
const distanceRange = document.querySelector('#distanceRange');
const priceRangeValue = document.querySelector('#priceRangeValue');
const distanceRangeValue = document.querySelector('#distanceRangeValue');

const categorySelect = document.querySelector('#category');
const brandSelect = document.querySelector('#brand');
const seriesSelect = document.querySelector('#series');
const brandGroup = document.querySelector('#brandGroup');
const seriesGroup = document.querySelector('#seriesGroup');
const listingGrid = document.querySelector('#listingGrid');

let allListings = [];

const STORAGE_KEY = 'dkhardware.userListings';

const filterHierarchy = {
  Grafikkort: {
    NVIDIA: ['RTX 5090', 'RTX 5080', 'RTX 5070', 'RTX 4090', 'RTX 4080', 'RTX 4070', 'RTX 3090', 'RTX 3080'],
    AMD: ['RX 7900 XTX', 'RX 7900 XT', 'RX 7800 XT', 'RX 7700 XT', 'RX 6800 XT'],
    Intel: ['Arc A770', 'Arc A750', 'Arc A580']
  },
  CPU: {
    AMD: ['Ryzen 9', 'Ryzen 7', 'Ryzen 5', 'Ryzen 3'],
    Intel: ['Core i9', 'Core i7', 'Core i5', 'Core i3']
  },
  RAM: {
    Corsair: ['Vengeance', 'Dominator'],
    Kingston: ['Fury Beast', 'Fury Renegade'],
    'G.Skill': ['Trident Z', 'Ripjaws'],
    Crucial: ['Pro', 'Ballistix']
  },
  Bundkort: {
    ASUS: ['ROG Strix', 'TUF Gaming', 'Prime'],
    MSI: ['MAG Tomahawk', 'MPG Edge', 'PRO Series'],
    Gigabyte: ['AORUS Elite', 'Gaming X', 'UD'],
    ASRock: ['Steel Legend', 'Pro RS', 'Taichi']
  },
  Lager: {
    Samsung: ['980 Pro', '990 Pro', '870 EVO'],
    'Western Digital': ['Black SN850X', 'Blue SN580', 'Red Plus'],
    Crucial: ['P5 Plus', 'MX500', 'P3'],
    Kingston: ['KC3000', 'NV2', 'Fury Renegade SSD']
  },
  Strømforsyning: {
    Corsair: ['RMx', 'RMe', 'HX'],
    Seasonic: ['Focus GX', 'Prime GX', 'Vertex GX'],
    'be quiet!': ['Pure Power', 'Straight Power', 'Dark Power']
  },
  Kabinetter: {
    NZXT: ['H5 Flow', 'H7 Flow', 'H9 Elite'],
    Fractal: ['North', 'Meshify 2', 'Pop Air'],
    Corsair: ['4000D', '5000D', '7000D'],
    'Lian Li': ['Lancool 216', 'O11 Dynamic', 'A3-mATX']
  },
  'CPU-kølere': {
    Noctua: ['NH-D15', 'NH-U12S', 'NH-L12S'],
    Corsair: ['iCUE H100i', 'iCUE H150i', 'iCUE H170i'],
    Arctic: ['Liquid Freezer II 240', 'Liquid Freezer II 360', 'Freezer 36'],
    DeepCool: ['AK620', 'LT720', 'AG400']
  },
  Kabinetkølere: {
    Noctua: ['NF-A12x25', 'NF-P12 redux', 'NF-A14'],
    'be quiet!': ['Silent Wings 4', 'Pure Wings 3', 'Light Wings'],
    Arctic: ['P12 PWM PST', 'P14 PWM PST', 'F12 PWM'],
    Corsair: ['AF120 Elite', 'SP140 RGB Elite', 'QL120']
  }
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

const updateSliderVisual = (slider) => {
  const min = Number(slider.min) || 0;
  const max = Number(slider.max) || 100;
  const value = Number(slider.value);
  const percent = ((value - min) / (max - min)) * 100;

  slider.style.background = `linear-gradient(90deg, #8ea1ff ${percent}%, #4f5870 ${percent}%)`;
};

const formatDkk = (value) => `${new Intl.NumberFormat('da-DK').format(value)} kr.`;

const setDropdownState = (group, select, enabled) => {
  if (!group || !select) {
    return;
  }

  group.classList.toggle('filter-group-disabled', !enabled);
  select.disabled = !enabled;
};

const populateSelectOptions = (select, placeholder, options = []) => {
  if (!select) {
    return;
  }

  select.innerHTML = '';

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = placeholder;
  select.append(defaultOption);

  options.forEach((optionValue) => {
    const option = document.createElement('option');
    option.value = optionValue;
    option.textContent = optionValue;
    select.append(option);
  });
};

const syncBrandOptions = () => {
  if (!categorySelect || !brandSelect || !seriesSelect) {
    return;
  }

  const selectedCategory = categorySelect.value;
  const brands = selectedCategory ? Object.keys(filterHierarchy[selectedCategory] || {}) : [];

  populateSelectOptions(brandSelect, 'Vælg mærke', brands);
  populateSelectOptions(seriesSelect, 'Vælg serie');
  brandSelect.value = '';
  seriesSelect.value = '';

  const hasCategory = Boolean(selectedCategory);
  setDropdownState(brandGroup, brandSelect, hasCategory);
  setDropdownState(seriesGroup, seriesSelect, false);
};

const syncSeriesOptions = () => {
  if (!categorySelect || !brandSelect || !seriesSelect) {
    return;
  }

  const selectedCategory = categorySelect.value;
  const selectedBrand = brandSelect.value;
  const series = selectedCategory && selectedBrand ? filterHierarchy[selectedCategory]?.[selectedBrand] || [] : [];

  populateSelectOptions(seriesSelect, 'Vælg serie', series);
  seriesSelect.value = '';
  setDropdownState(seriesGroup, seriesSelect, Boolean(selectedBrand));
};

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

const filterListings = () => {
  const selectedCategory = categorySelect?.value || '';
  const selectedBrand = selectedCategory && !brandSelect?.disabled ? brandSelect.value : '';
  const selectedSeries = selectedBrand && !seriesSelect?.disabled ? seriesSelect.value : '';
  const maxPrice = Number(priceRange?.value || 0);
  const maxDistance = Number(distanceRange?.value || 0);
  const isOpenDistance = maxDistance === Number(distanceRange?.max || 50);

  return allListings.filter((listing) => {
    if (selectedCategory && listing.category !== selectedCategory) {
      return false;
    }

    if (selectedBrand && listing.brand !== selectedBrand) {
      return false;
    }

    if (selectedSeries && listing.series !== selectedSeries) {
      return false;
    }

    if (listing.price > maxPrice) {
      return false;
    }

    if (!isOpenDistance && listing.distance > maxDistance) {
      return false;
    }

    return true;
  });
};

const renderListings = () => {
  if (!listingGrid) {
    return;
  }

  const listings = filterListings();

  if (!listings.length) {
    listingGrid.innerHTML = '<p>Ingen annoncer matcher de valgte filtre.</p>';
    return;
  }

  listingGrid.innerHTML = listings.map(createListingCard).join('');
};

const setupPriceRange = () => {
  if (!priceRange || !priceRangeValue || !allListings.length) {
    return;
  }

  const maxListingPrice = Math.max(...allListings.map((listing) => listing.price));
  const normalizedMaxPrice = Math.ceil(maxListingPrice / 1000) * 1000;

  priceRange.max = String(normalizedMaxPrice);
  priceRange.value = String(normalizedMaxPrice);
  priceRangeValue.textContent = formatDkk(normalizedMaxPrice);
  updateSliderVisual(priceRange);
};

const loadListings = async () => {
  const response = await fetch('data/listings.json');
  const baseListings = await response.json();
  allListings = [...getUserListings(), ...baseListings];
};

priceRange?.addEventListener('input', () => {
  priceRangeValue.textContent = formatDkk(priceRange.value);
  updateSliderVisual(priceRange);
  renderListings();
});

distanceRange?.addEventListener('input', () => {
  const value = Number(distanceRange.value);
  distanceRangeValue.textContent = value === 50 ? '50+ km' : `${value} km`;
  updateSliderVisual(distanceRange);
  renderListings();
});

categorySelect?.addEventListener('change', () => {
  syncBrandOptions();
  renderListings();
});

brandSelect?.addEventListener('change', () => {
  syncSeriesOptions();
  renderListings();
});

seriesSelect?.addEventListener('change', renderListings);

document.querySelector('.cta-results')?.addEventListener('click', renderListings);

document.querySelectorAll('button').forEach((button) => {
  button.addEventListener('click', () => {
    button.animate(
      [
        { transform: 'translateY(0)', filter: 'brightness(1)' },
        { transform: 'translateY(-1px)', filter: 'brightness(1.1)' },
        { transform: 'translateY(0)', filter: 'brightness(1)' }
      ],
      { duration: 240, easing: 'ease-out' }
    );
  });
});

const initMarketplace = async () => {
  syncBrandOptions();

  if (priceRange && distanceRange) {
    updateSliderVisual(priceRange);
    updateSliderVisual(distanceRange);
  }

  await loadListings();
  setupPriceRange();
  renderListings();
};

initMarketplace();
