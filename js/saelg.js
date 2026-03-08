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

const categoryImageMap = {
  Grafikkort: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80',
  CPU: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80',
  RAM: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80',
  Bundkort: 'https://images.unsplash.com/photo-1591799265444-d66432b91588?auto=format&fit=crop&w=1200&q=80',
  Lager: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=1200&q=80',
  Strømforsyning: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=1200&q=80',
  Kabinetter: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80',
  'CPU-kølere': 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80',
  Kabinetkølere: 'https://images.unsplash.com/photo-1593642633279-1796119d5482?auto=format&fit=crop&w=1200&q=80'
};

const sellForm = document.getElementById('sellForm');
const feedback = document.getElementById('sellFeedback');
const categorySelect = document.getElementById('category');
const brandSelect = document.getElementById('brand');
const seriesSelect = document.getElementById('series');
const brandGroup = document.getElementById('brandGroup');
const seriesGroup = document.getElementById('seriesGroup');
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('imagePreview');

const populateSelectOptions = (select, placeholder, options = []) => {
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

const setDropdownState = (group, select, enabled) => {
  group.classList.toggle('filter-group-disabled', !enabled);
  select.disabled = !enabled;
};

const syncBrandOptions = () => {
  const selectedCategory = categorySelect.value;
  const brands = selectedCategory ? Object.keys(filterHierarchy[selectedCategory] || {}) : [];

  populateSelectOptions(brandSelect, 'Vælg mærke', brands);
  populateSelectOptions(seriesSelect, 'Vælg serie');

  brandSelect.value = '';
  seriesSelect.value = '';

  setDropdownState(brandGroup, brandSelect, Boolean(selectedCategory));
  setDropdownState(seriesGroup, seriesSelect, false);
};

const syncSeriesOptions = () => {
  const selectedCategory = categorySelect.value;
  const selectedBrand = brandSelect.value;
  const series = selectedCategory && selectedBrand ? filterHierarchy[selectedCategory]?.[selectedBrand] || [] : [];

  populateSelectOptions(seriesSelect, 'Vælg serie', series);
  seriesSelect.value = '';
  setDropdownState(seriesGroup, seriesSelect, Boolean(selectedBrand));
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

const saveUserListing = (listing) => {
  const listings = getUserListings();
  listings.unshift(listing);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
};

const toTitle = (brand, series) => `${brand} ${series}`.trim();

const readImageAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('Kunne ikke læse billedfilen.'));
    reader.readAsDataURL(file);
  });

const getFallbackImage = (category) => categoryImageMap[category] || 'images/placeholders/default.jpg';

const updateImagePreview = (src) => {
  if (!src) {
    imagePreview.removeAttribute('src');
    imagePreview.classList.remove('is-visible');
    return;
  }

  imagePreview.src = src;
  imagePreview.classList.add('is-visible');
};

const buildListing = (formData, imageSrc) => {
  const category = formData.get('category');
  const brand = formData.get('brand');
  const series = formData.get('series');
  const price = Number(formData.get('price'));

  return {
    id: `listing-user-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    title: toTitle(brand, series),
    condition: formData.get('condition'),
    category,
    brand,
    series,
    price,
    estimatedMarketPrice: price,
    location: formData.get('location').trim(),
    description: formData.get('description').trim(),
    dealRating: 'fair',
    image: imageSrc || getFallbackImage(category)
  };
};

categorySelect.addEventListener('change', syncBrandOptions);
brandSelect.addEventListener('change', syncSeriesOptions);

imageInput.addEventListener('change', async () => {
  const [selectedFile] = imageInput.files || [];

  if (!selectedFile) {
    updateImagePreview('');
    return;
  }

  try {
    const previewSrc = await readImageAsDataUrl(selectedFile);
    updateImagePreview(previewSrc);
    feedback.textContent = '';
  } catch {
    updateImagePreview('');
    feedback.textContent = 'Billedet kunne ikke indlæses. Prøv en anden fil.';
  }
});

sellForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  feedback.textContent = '';

  const formData = new FormData(sellForm);
  const category = formData.get('category');
  const [selectedFile] = imageInput.files || [];

  let imageSrc = getFallbackImage(category);

  if (selectedFile) {
    try {
      imageSrc = await readImageAsDataUrl(selectedFile);
    } catch {
      feedback.textContent = 'Billedet kunne ikke gemmes. Opslaget blev oprettet med standardbillede.';
    }
  }

  const listing = buildListing(formData, imageSrc);
  saveUserListing(listing);

  if (!feedback.textContent) {
    feedback.textContent = 'Opslag oprettet og gemt lokalt.';
  }
  sellForm.reset();
  updateImagePreview('');
  syncBrandOptions();
});

syncBrandOptions();
