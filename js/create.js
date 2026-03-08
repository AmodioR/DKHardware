const form = document.getElementById("createListingForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const listing = {
    id: `u-${Date.now()}`,
    title: formData.get("title").trim(),
    category: formData.get("category"),
    price: Number(formData.get("price")),
    estimatedMarketPrice: Number(formData.get("estimatedMarketPrice")),
    description: formData.get("description").trim(),
  };

  saveUserListing(listing);
  window.location.href = "index.html";
});
