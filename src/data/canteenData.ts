import { CanteenItem } from '../types/canteen';

export const CANTEEN_RECIPIENT_NAME = "Bizimana Fabrice";
export const CANTEEN_MOMO_NUMBER = "0794513444";
export const CANTEEN_LOCATION = "Kigali Smart Canteen Hub, Ground Floor Main Hall";
export const CANTEEN_HOURS = "Mon - Sat: 06:30 AM - 09:30 PM";

export const INITIAL_CANTEEN_ITEMS: CanteenItem[] = [
  {
    id: "dish-01",
    name: "Rwandan Buffet Plate (Special)",
    category: "meals",
    priceRwf: 2800,
    description: "Hearty signature plate with tender slow-cooked beef stew, steamed fragrant rice, seasoned red beans, fresh sautéed dodo greens, and sweet fried plantains (Aloco).",
    prepTimeMins: 12,
    calories: 680,
    rating: 4.9,
    isAvailable: true,
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    tags: ["Chef Special", "High Protein", "Traditional"],
    dietary: "Halal & Balanced",
    customOptions: {
      sides: ["Extra Plantains", "Extra Red Beans", "Fried Cassava"],
      spiciness: ["Mild", "Medium", "Hot pili-pili"]
    }
  },
  {
    id: "dish-02",
    name: "Tender Beef Brochette (2 Skewers)",
    category: "brochettes",
    priceRwf: 1500,
    description: "Two prime flame-grilled beef skewers marinated in local herbs, garlic, and caramelized red onions, served with roasted plantain and chili sambal.",
    prepTimeMins: 15,
    calories: 460,
    rating: 4.8,
    isAvailable: true,
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    tags: ["Best Seller", "Charcoal Grilled"],
    dietary: "Gluten-Free",
    customOptions: {
      sides: ["Roasted Plantain", "Salted Chips", "Fresh Salad"],
      spiciness: ["Mild", "Medium", "Hot pili-pili"]
    }
  },
  {
    id: "dish-03",
    name: "Goat Brochette (Chèvre Grilled Skewer)",
    category: "brochettes",
    priceRwf: 2000,
    description: "Classic Rwandan grilled goat meat brochette seasoned with spiced aromatics and roasted over real wood charcoal. Succulent and intensely flavorful.",
    prepTimeMins: 18,
    calories: 510,
    rating: 4.9,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80",
    tags: ["Canteen Classic", "High Protein"],
    dietary: "Halal",
    customOptions: {
      sides: ["Roasted Plantain", "Potato Wedges"],
      spiciness: ["Medium", "Hot pili-pili"]
    }
  },
  {
    id: "dish-04",
    name: "Crispy Chicken Brochette & Hand-Cut Chips",
    category: "brochettes",
    priceRwf: 3000,
    description: "Juicy marinated chicken thigh skewers grilled with sweet bell peppers, served alongside a basket of golden hand-cut Belgian-style canteen chips and tangy dip.",
    prepTimeMins: 15,
    calories: 620,
    rating: 4.8,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
    tags: ["Crowd Favorite", "Lunch Hit"],
    dietary: "Halal",
    customOptions: {
      sides: ["Garlic Mayonnaise", "Pili-pili Dip"],
      spiciness: ["Mild", "Medium", "Hot pili-pili"]
    }
  },
  {
    id: "dish-05",
    name: "Chips Mayai (French Fries Omelette)",
    category: "meals",
    priceRwf: 1800,
    description: "Hot crispy french fries bound together in a fluffy double-egg herb omelette, served with zesty chopped tomato-onion kachumbari salad.",
    prepTimeMins: 10,
    calories: 540,
    rating: 4.7,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    tags: ["Quick Grab", "Street Favorite"],
    dietary: "Vegetarian",
    customOptions: {
      sides: ["Extra Cheese Melt", "Kachumbari Extra"],
      spiciness: ["Mild", "Medium"]
    }
  },
  {
    id: "dish-06",
    name: "Crispy Rwandan Sambusa Trio (Beef & Veg)",
    category: "bakery_breakfast",
    priceRwf: 800,
    description: "Three handcrafted crispy pastry triangles filled with aromatic minced beef, fresh coriander, ginger, cumin, and vegetables. Golden-fried to perfection.",
    prepTimeMins: 5,
    calories: 320,
    rating: 4.9,
    isAvailable: true,
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    tags: ["Snack Hit", "Freshly Baked"],
    dietary: "Halal",
    customOptions: {
      sides: ["Lime wedge", "Chili relish"],
      spiciness: ["Mild", "Hot pili-pili"]
    }
  },
  {
    id: "dish-07",
    name: "Fresh Mandazi & Rolled Chapati Pair",
    category: "bakery_breakfast",
    priceRwf: 600,
    description: "Two freshly baked fluffy golden East African cardamom doughnuts (Mandazi) alongside a warm, layered pan-toasted wheat chapati.",
    prepTimeMins: 3,
    calories: 390,
    rating: 4.6,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    tags: ["Breakfast Staple", "Bakery Fresh"],
    dietary: "Vegetarian"
  },
  {
    id: "dish-08",
    name: "Spiced African Milk Tea (Thé au Lait)",
    category: "beverages",
    priceRwf: 1000,
    description: "Rich whole milk gently simmered with premium Rwandan Gisovu black tea leaves, crushed ginger root, cardamom pods, and cinnamon bark.",
    prepTimeMins: 5,
    calories: 180,
    rating: 5.0,
    isAvailable: true,
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    tags: ["Signature Hot Drink", "Organic Spices"],
    dietary: "Vegetarian"
  },
  {
    id: "dish-09",
    name: "Cold-Pressed Passion Fruit Juice (Maracuja)",
    category: "beverages",
    priceRwf: 1200,
    description: "100% natural, freshly squeezed Rwandan passion fruit juice. Tangy, aromatic, lightly sweetened with cane sugar, served chilled over ice.",
    prepTimeMins: 3,
    calories: 140,
    rating: 4.9,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    tags: ["Fresh Juice", "Rich in Vitamin C"],
    dietary: "Vegan"
  },
  {
    id: "dish-10",
    name: "Tropical Mango-Papaya Smoothie",
    category: "beverages",
    priceRwf: 1500,
    description: "Thick velvety blended smoothie made with sweet Rubavu mangoes, ripe papaya, fresh lemon zest, and raw natural honey.",
    prepTimeMins: 5,
    calories: 220,
    rating: 4.8,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=800&q=80",
    tags: ["Immunity Booster", "No Preservatives"],
    dietary: "Vegetarian"
  },
  {
    id: "dish-11",
    name: "Rwandan Single-Origin Bourbon Coffee",
    category: "beverages",
    priceRwf: 1200,
    description: "Freshly brewed high-altitude Arabica coffee from Huye Mountain volcanic soils with notes of dark chocolate, berry undertones, and citrus brightness.",
    prepTimeMins: 4,
    calories: 10,
    rating: 4.9,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    tags: ["Barista Brew", "Direct Trade"],
    dietary: "Vegan"
  },
  {
    id: "dish-12",
    name: "Worker & Student Power Combo",
    category: "combos",
    priceRwf: 3500,
    description: "Full combo: 2 Grilled Beef Brochettes + Generous portion of French Fries + Chilled Fresh Passion Fruit Juice. Save 600 RWF!",
    prepTimeMins: 15,
    calories: 820,
    rating: 5.0,
    isAvailable: true,
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    tags: ["Value Saver", "Complete Meal"],
    dietary: "Halal",
    customOptions: {
      sides: ["Extra Kachumbari Salad", "Roasted Plantain"],
      spiciness: ["Mild", "Medium", "Hot pili-pili"]
    }
  },
  {
    id: "dish-13",
    name: "Lake Kivu Tilapia Fish Brochette & Plantain",
    category: "brochettes",
    priceRwf: 3200,
    description: "Fresh Lake Kivu tilapia fillet skewers marinated with lemon-garlic butter, grilled to delicate tenderness, served with fried yellow plantains.",
    prepTimeMins: 18,
    calories: 530,
    rating: 4.8,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    tags: ["Fresh Fish", "Omega-3"],
    dietary: "Pescatarian",
    customOptions: {
      sides: ["Tartar Sauce", "Lemon Butter Sauce"],
      spiciness: ["Mild", "Medium"]
    }
  },
  {
    id: "dish-14",
    name: "Vegetarian Harvest Bowl & Steamed Rice",
    category: "meals",
    priceRwf: 2200,
    description: "Steamed white or brown rice with garlic-braised red kidney beans, tender sautéed dodo spinach, sliced avocado, and crispy plantain coins.",
    prepTimeMins: 10,
    calories: 520,
    rating: 4.7,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    tags: ["Plant-Based", "Fiber Rich"],
    dietary: "Vegan",
    customOptions: {
      sides: ["Extra Avocado", "Fried Cassava"],
      spiciness: ["Mild", "Medium"]
    }
  },
  {
    id: "dish-15",
    name: "Morning Sunrise Breakfast Deal",
    category: "combos",
    priceRwf: 2400,
    description: "Hot Spiced African Milk Tea + Double Egg Cheese Omelette + 2 Fresh Hot Samosas + 1 Layered Chapati.",
    prepTimeMins: 8,
    calories: 640,
    rating: 4.9,
    isAvailable: true,
    isSpecial: true,
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80",
    tags: ["Breakfast Saver", "Energy Starter"],
    dietary: "Halal"
  }
];
