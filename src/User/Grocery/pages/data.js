import oil from "../../../assets/User/Grocery/oil.jpg"
import corn from "../../../assets/User/Grocery/corn.jpg"
import dets from "../../../assets/User/Grocery/dets.jpg"
import kurkure from "../../../assets/User/Grocery/KURKURE.jpg"
import besan from "../../../assets/User/Grocery/besan.jpg"
import numak from "../../../assets/User/Grocery/numak.jpg"
import tatNumak from "../../../assets/User/Grocery/tataNumk.jpg"
import rice from "../../../assets/User/Grocery/Basmati.jpg"
import tor from "../../../assets/User/Grocery/Tor Daal.jpg"
import chana from "../../../assets/User/Grocery/Chana Daal.jpg"
import Tika from "../../../assets/User/Grocery/Tikat.jpg"
import milk from "../../../assets/User/Grocery/Milk.jpg"
import curd from "../../../assets/User/Grocery/Curd.jpg"
import Panner from "../../../assets/User/Grocery/Paneer.jpg"
import Butter from "../../../assets/User/Grocery/Butter.jpg"
import ghee from "../../../assets/User/Grocery/Ghee.jpg"
import Biscuits from "../../../assets/User/Grocery/Biscuits.jpg"
import Choclate from "../../../assets/User/Grocery/download.jpg"
import Popcorn from "../../../assets/User/Grocery/Popcorn.jpg"
import Peanut from "../../../assets/User/Grocery/Peanut_bar.jpg"
import cake from "../../../assets/User/Grocery/Cake.jpg"

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
    { id: 1, name: " Sunflower Oil", price: 145, oldPrice: 199, weight: "1 L", rating: 4.5, discount: "27%", image: oil },
    { id: 2, name: "Tata Salt Vacuum Evaporated Iodised Salt", price: 28, oldPrice: 30, weight: "1 kg", rating: 4.8, discount: "6%", image: tatNumak },
    { id: 3, name: "Fortune Besan (Gram Flour) Premium", price: 85, oldPrice: 110, weight: "500g", rating: 4.3, discount: "22%", image: besan },
    { id: 4, name: "Local Mandi Fine Salt", price: 15, oldPrice: 20, weight: "1 kg", rating: 4.1, discount: "25%", image: numak },
    { id: 5, name: "Basmati Rice (5 kg)", price: 145, oldPrice: 199, weight: "1 L", rating: 4.5, discount: "27%", image: rice },
    { id: 6, name: "Toor Daal", price: 28, oldPrice: 30, weight: "1 kg", rating: 4.8, discount: "6%", image: tor },
    { id: 7, name: "Chana Dal", price: 85, oldPrice: 110, weight: "500g", rating: 4.3, discount: "22%", image: chana },
    { id: 8, name: "Red Chilli", price: 15, oldPrice: 20, weight: "1 kg", rating: 4.1, discount: "25%", image: Tika },
  ],
  dailyNeeds: [
    { id: 101, name: "Fresh Milk (1 L)", price: 28, weight: "500ml", rating: 4.4, discount: "10%", image: milk },
    { id: 102, name: "Curd", price: 427, oldPrice: 799, weight: "600 ml", rating: 4.4, discount: "47%", isAd: true, image: curd },
    { id: 103, name: "Paneer", price: 55, oldPrice: 99, weight: "200g", rating: 4.2, discount: "44%", image: Panner },
    { id: 104, name: "Butter (100g)", price: 28, weight: "100g", rating: 4.4, discount: "10%", image: Butter },
    { id: 105, name: "Ghee", price: 427, oldPrice: 799, weight: "600 g", rating: 4.4, discount: "47%", isAd: true, image: ghee },
    { id: 106, name: "Sweet Corn Kernels Frozen", price: 55, oldPrice: 99, weight: "200g", rating: 4.2, discount: "44%", image: corn },
  ],
  snacks: [
    { id: 301, name: "Kurkure", price: 20, oldPrice: 25, weight: "90g", rating: 4.5, discount: "20%", image: kurkure },
    { id: 302, name: "Biscuits", price: 450, oldPrice: 600, weight: "200g", rating: 4.6, discount: "25%", image: Biscuits },
    { id: 303, name: "Chocolate", price: 20, oldPrice: 25, weight: "90g", rating: 4.5, discount: "20%", image: Choclate },
    { id: 304, name: "Popcorn", price: 450, oldPrice: 600, weight: "200g", rating: 4.6, discount: "25%", image:Popcorn },
    { id: 305, name: "Peanut Bar", price: 20, oldPrice: 25, weight: "90g", rating: 4.5, discount: "20%", image:Peanut  },
    { id: 306, name: "Cake", price: 450, oldPrice: 600, weight: "200g", rating: 4.6, discount: "25%", image:cake },
  ]
};
