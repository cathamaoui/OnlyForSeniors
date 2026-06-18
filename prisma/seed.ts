import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Top-level categories inspired by 80s Yellow Pages "Book of the Year"
// Bold, color-coded sections seniors can scan quickly.
const categories = [
  {
    slug: "home-care",
    name: "Daily In-Home Support & Personal Care",
    description:
      "Help with everyday tasks so seniors can stay safe and comfortable at home.",
    icon: "🏠",
    color: "#059669",
    order: 1,
    subcategories: [
      { slug: "personal-care", name: "Personal Care", description: "Bathing, dressing, grooming, and hygiene." },
      { slug: "meal-services", name: "Meal Services", description: "In-home meal prep, grocery delivery, Meals on Wheels." },
      { slug: "housekeeping", name: "Housekeeping", description: "Cleaning, laundry, vacuuming, dusting." },
      { slug: "companionship", name: "Companionship", description: "Friendly visits and escorted outings." },
    ],
  },
  {
    slug: "home-maintenance",
    name: "Home Maintenance & Safety",
    description:
      "Yard care, handyman work, and safety modifications for aging in place.",
    icon: "🛠️",
    color: "#ea580c",
    order: 2,
    subcategories: [
      { slug: "yard-care", name: "Seasonal Yard Care", description: "Snow removal, lawn mowing, gutter cleaning." },
      { slug: "handyman", name: "Handyman Services", description: "Plumbing, electrical, pest control." },
      { slug: "safety-mods", name: "Safety Modifications", description: "Grab bars, ramps, stairlifts." },
      { slug: "downsizing", name: "Downsizing & Junk Removal", description: "Packing, organizing, and hauling." },
    ],
  },
  {
    slug: "health-wellness",
    name: "Health & Wellness",
    description:
      "Medical services, therapy, memory support, and medical equipment.",
    icon: "🩺",
    color: "#dc2626",
    order: 3,
    subcategories: [
      { slug: "medication", name: "Medication Management", description: "Reminders, pill dispensers, nursing." },
      { slug: "specialized-care", name: "Specialized Health Care", description: "Physio, occupational, foot care." },
      { slug: "memory-support", name: "Memory & Dementia Support", description: "Cognitive training, day programs." },
      { slug: "medical-equipment", name: "Medical Equipment", description: "Walkers, wheelchairs, alert systems." },
    ],
  },
  {
    slug: "transportation",
    name: "Mobility & Transportation",
    description:
      "Rides to appointments, accessible transit, and errand help.",
    icon: "🚗",
    color: "#2563eb",
    order: 4,
    subcategories: [
      { slug: "medical-transport", name: "Medical Transportation", description: "Escorted rides to doctor or pharmacy." },
      { slug: "paratransit", name: "Paratransit & Shuttles", description: "Wheelchair-accessible transit." },
      { slug: "errand-help", name: "Errand Assistance", description: "Shopping, banking, and errands." },
    ],
  },
  {
    slug: "legal-financial",
    name: "Legal, Financial & Benefits",
    description:
      "Estate planning, tax help, pension navigation, and fraud protection.",
    icon: "📝",
    color: "#7c3aed",
    order: 5,
    subcategories: [
      { slug: "estate-planning", name: "Estate Planning", description: "Power of Attorney, advance directives." },
      { slug: "tax-help", name: "Tax Assistance", description: "DTC, age amount credits, filing." },
      { slug: "benefit-navigation", name: "Benefit Navigation", description: "CPP, OAS, GIS applications." },
      { slug: "fraud-protection", name: "Fraud & Scam Protection", description: "Advocacy against elder financial abuse." },
    ],
  },
  {
    slug: "community",
    name: "Community, Recreation & Caregiver Relief",
    description:
      "Social clubs, fitness, classes, and respite for family caregivers.",
    icon: "🎨",
    color: "#db2777",
    order: 6,
    subcategories: [
      { slug: "senior-centres", name: "Senior Centres", description: "Fitness classes, hobby clubs, dining." },
      { slug: "respite-care", name: "Respite Care", description: "Short-term stays and day programs." },
      { slug: "tech-training", name: "Technology Training", description: "Smartphones, online safety, digital literacy." },
    ],
  },
  {
    slug: "housing",
    name: "Alternative Housing & Residential Care",
    description:
      "Independent living, assisted living, and nursing home options.",
    icon: "🏢",
    color: "#0891b2",
    order: 7,
    subcategories: [
      { slug: "independent-living", name: "Independent Living", description: "Private apartments with social activities." },
      { slug: "assisted-living", name: "Assisted Living / Special Care", description: "24-hour non-nursing supervision." },
      { slug: "nursing-homes", name: "Nursing Homes", description: "Full-time skilled nursing care." },
    ],
  },
  {
    slug: "shopping",
    name: "Products, Shopping & Delivery",
    description:
      "Where seniors can buy, order, or rent everyday products with delivery.",
    icon: "🛍️",
    color: "#f59e0b",
    order: 8,
    subcategories: [
      { slug: "groceries", name: "Grocery Delivery", description: "Local stores that deliver to your door." },
      { slug: "pharmacy", name: "Pharmacy Delivery", description: "Prescription and OTC medication delivery." },
      { slug: "rental-equipment", name: "Mobility & Medical Rentals", description: "Wheelchairs, scooters, hospital beds." },
      { slug: "clothing", name: "Adaptive Clothing & Footwear", description: "Easy-on, easy-wear senior-friendly apparel." },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding OnlyForSeniors.ca...");

  // Clear in dependency order
  await prisma.review.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.businessImage.deleteMany();
  await prisma.businessHours.deleteMany();
  await prisma.business.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.user.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();

  for (const cat of categories) {
    const { subcategories, ...catData } = cat;
    const created = await prisma.category.create({
      data: {
        ...catData,
        subcategories: {
          create: subcategories,
        },
      },
    });
    console.log(`  ✓ ${created.icon}  ${created.name}`);
  }

  console.log(`\n✅ Seeded ${categories.length} categories with subcategories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
