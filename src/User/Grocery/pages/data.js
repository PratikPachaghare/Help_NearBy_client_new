import oil from "../../../assets/User/Grocery/oil.jpg"
import corn from "../../../assets/User/Grocery/corn.jpg"
import dets from "../../../assets/User/Grocery/dets.jpg"
import kurkure from "../../../assets/User/Grocery/kurkure.jpg"
import besan from "../../../assets/User/Grocery/besan.jpg"
import numak from "../../../assets/User/Grocery/numak.jpg"
import tatNumak from "../../../assets/User/Grocery/tataNumk.jpg"

export const categories = [
  { name: 'Staples', icon: '🌾' },
  { name: 'Daily Needs', icon: '🥛' },
  { name: 'Beauty', icon: '💄' },
  { name: 'Sprouts', icon: '🌱' },
  { name: 'Snacks', icon: '🍪' },
  { name: 'Cleaning', icon: '🧼' },
];

export const productData = {
  staples: [
    { id: 1, name: "Fortune Sunlite Refined Sunflower Oil", price: 145, oldPrice: 199, weight: "1 L", rating: 4.5, discount: "27%", image: oil },
    { id: 2, name: "Tata Salt Vacuum Evaporated Iodised Salt", price: 28, oldPrice: 30, weight: "1 kg", rating: 4.8, discount: "6%", image: tatNumak },
    { id: 3, name: "Fortune Besan (Gram Flour) Premium", price: 85, oldPrice: 110, weight: "500g", rating: 4.3, discount: "22%", image: besan },
    { id: 4, name: "Local Mandi Fine Salt", price: 15, oldPrice: 20, weight: "1 kg", rating: 4.1, discount: "25%", image: numak },
    { id: 5, name: "Fortune Sunlite Refined Sunflower Oil", price: 145, oldPrice: 199, weight: "1 L", rating: 4.5, discount: "27%", image: oil },
    { id: 6, name: "Tata Salt Vacuum Evaporated Iodised Salt", price: 28, oldPrice: 30, weight: "1 kg", rating: 4.8, discount: "6%", image: tatNumak },
    { id: 7, name: "Fortune Besan (Gram Flour) Premium", price: 85, oldPrice: 110, weight: "500g", rating: 4.3, discount: "22%", image: besan },
    { id: 8, name: "Local Mandi Fine Salt", price: 15, oldPrice: 20, weight: "1 kg", rating: 4.1, discount: "25%", image: numak },
  ],
  dailyNeeds: [
    { id: 101, name: "Fresh Milk", price: 28, weight: "500ml", rating: 4.4, discount: "10%", image: "https://images.unsplash.com/photo-1563636619-e9107da5a163?w=200&q=80" },
    { id: 102, name: "Surf Excel Detergent Powder", price: 427, oldPrice: 799, weight: "600 ml", rating: 4.4, discount: "47%", isAd: true, image: dets },
    { id: 103, name: "Sweet Corn Kernels Frozen", price: 55, oldPrice: 99, weight: "200g", rating: 4.2, discount: "44%", image: corn },
    { id: 104, name: "Fresh Milk", price: 28, weight: "500ml", rating: 4.4, discount: "10%", image: "https://images.unsplash.com/photo-1563636619-e9107da5a163?w=200&q=80" },
    { id: 105, name: "Surf Excel Detergent Powder", price: 427, oldPrice: 799, weight: "600 ml", rating: 4.4, discount: "47%", isAd: true, image: dets },
    { id: 106, name: "Sweet Corn Kernels Frozen", price: 55, oldPrice: 99, weight: "200g", rating: 4.2, discount: "44%", image: corn },
  ],
  snacks: [
    { id: 301, name: "Kurkure Masala Munch Crispy Snacks", price: 20, oldPrice: 25, weight: "90g", rating: 4.5, discount: "20%", image: kurkure },
    { id: 302, name: "Roasted Almonds Premium", price: 450, oldPrice: 600, weight: "200g", rating: 4.6, discount: "25%", image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=200&q=80" },
    { id: 303, name: "Kurkure Masala Munch Crispy Snacks", price: 20, oldPrice: 25, weight: "90g", rating: 4.5, discount: "20%", image: kurkure },
    { id: 304, name: "Roasted Almonds Premium", price: 450, oldPrice: 600, weight: "200g", rating: 4.6, discount: "25%", image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=200&q=80" },
    { id: 305, name: "Kurkure Masala Munch Crispy Snacks", price: 20, oldPrice: 25, weight: "90g", rating: 4.5, discount: "20%", image: kurkure },
    { id: 306, name: "Roasted Almonds Premium", price: 450, oldPrice: 600, weight: "200g", rating: 4.6, discount: "25%", image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=200&q=80" },
  ]
};