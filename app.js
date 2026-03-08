const priceRange = document.querySelector('#priceRange');
const distanceRange = document.querySelector('#distanceRange');
const priceRangeValue = document.querySelector('#priceRangeValue');
const distanceRangeValue = document.querySelector('#distanceRangeValue');

const categorySelect = document.querySelector('#category');
const brandSelect = document.querySelector('#brand');
const seriesSelect = document.querySelector('#series');
const brandGroup = document.querySelector('#brandGroup');
const seriesGroup = document.querySelector('#seriesGroup');

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
  }
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
  setDropdownState(seriesGroup, seriesSelect, Boolean(selectedBrand));
};

priceRange?.addEventListener('input', () => {
  priceRangeValue.textContent = formatDkk(priceRange.value);
  updateSliderVisual(priceRange);
});

distanceRange?.addEventListener('input', () => {
  const value = Number(distanceRange.value);
  distanceRangeValue.textContent = value === 50 ? '50+ km' : `${value} km`;
  updateSliderVisual(distanceRange);
});

categorySelect?.addEventListener('change', () => {
  syncBrandOptions();
});

brandSelect?.addEventListener('change', () => {
  syncSeriesOptions();
});

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

if (priceRange && distanceRange) {
  updateSliderVisual(priceRange);
  updateSliderVisual(distanceRange);
}

syncBrandOptions();
