const priceRange = document.querySelector('#priceRange');
const distanceRange = document.querySelector('#distanceRange');
const priceRangeValue = document.querySelector('#priceRangeValue');
const distanceRangeValue = document.querySelector('#distanceRangeValue');

const updateSliderVisual = (slider) => {
  const min = Number(slider.min) || 0;
  const max = Number(slider.max) || 100;
  const value = Number(slider.value);
  const percent = ((value - min) / (max - min)) * 100;

  slider.style.background = `linear-gradient(90deg, #8ea1ff ${percent}%, #4f5870 ${percent}%)`;
};

const formatDkk = (value) => `${new Intl.NumberFormat('da-DK').format(value)} kr.`;

priceRange?.addEventListener('input', () => {
  priceRangeValue.textContent = formatDkk(priceRange.value);
  updateSliderVisual(priceRange);
});

distanceRange?.addEventListener('input', () => {
  const value = Number(distanceRange.value);
  distanceRangeValue.textContent = value === 50 ? '50+ km' : `${value} km`;
  updateSliderVisual(distanceRange);
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
