/**
 * Short, plain-language descriptions for every subcategory across the
 * site. Keys are "{categorySlug}/{subcategorySlug}" so callers can look
 * them up with one map lookup per render.
 *
 * Tone: friendly, plain, addresses the senior directly. Used as the
 * description text on the subcategory tile cards.
 */
export const SUB_CATEGORY_BLURBS: Record<string, string> = {
  // transition-downsizing
  "transition-downsizing/senior-move-managers":
    "Help planning, packing, and settling into your next home.",
  "transition-downsizing/estate-liquidation":
    "Estate sales, decluttering, and digital file cleanup.",
  "transition-downsizing/legacy-memoir":
    "Memoir writers, family-history services, and legacy keepsakes.",
  "transition-downsizing/grandparent-gift-logistics":
    "Gift selection and shipping to grandchildren across the country.",

  // home-adaptations
  "home-adaptations/senior-handyman":
    "Small jobs, repairs, and modifications for safer daily living.",
  "home-adaptations/mobile-grooming-vets":
    "Mobile pet groomers and vets that come to your door.",
  "home-adaptations/smart-home-techs":
    "Smart speakers, lighting, and security setup for seniors.",
  "home-adaptations/errand-concierges":
    "Reliable help with errands, deliveries, and pickups.",

  // active-aging
  "active-aging/encore-career":
    "Coaching for a meaningful second career after retirement.",
  "active-aging/intergenerational":
    "Social groups that bring generations together.",
  "active-aging/senior-travel":
    "Travel experts who specialize in senior-friendly trips.",
  "active-aging/adaptive-fitness":
    "Fitness trainers and adaptive sports for every ability.",

  // wellness-comfort
  "wellness-comfort/mobile-beauty":
    "Hair, nails, and beauty services in your own home.",
  "wellness-comfort/adult-day-clubs":
    "Daytime social clubs and activity programs for adults.",
  "wellness-comfort/loneliness-grief":
    "Friendly visitors, grief support, and companionship.",

  // concierge-tech
  "concierge-tech/adult-day-centres":
    "Structured daytime programs with activities and meals.",
  "concierge-tech/senior-concierge":
    "Personal concierge help for errands, scheduling, and life admin.",
  "concierge-tech/fraud-prevention":
    "Help recognizing scams and securing your accounts.",
  "concierge-tech/tech-training":
    "Patient, one-on-one tech lessons for any skill level.",
  "concierge-tech/digital-organization":
    "Photo, document, and password organization made simple.",
  "concierge-tech/smartphone-help":
    "iPhone and Android setup, lessons, and troubleshooting.",
  "concierge-tech/video-calls":
    "Get set up on Zoom, FaceTime, or WhatsApp video calls.",
  "concierge-tech/online-banking":
    "Patient help with banking apps, transfers, and bill pay.",
  "concierge-tech/companion-drivers":
    "Friendly drivers for appointments, errands, and visits.",
  "concierge-tech/errand-services":
    "Grocery runs, pharmacy pickup, and personal shopping.",

  // falls-wandering
  "falls-wandering/fall-detection":
    "Wearables and home sensors that detect falls and call for help.",
  "falls-wandering/medical-alerts":
    "Pendants and watches that connect you to emergency help 24/7.",
  "falls-wandering/gps-trackers":
    "GPS wearables for loved ones who wander or get lost.",
  "falls-wandering/grab-bars":
    "Grab bars and handrails professionally installed.",
  "falls-wandering/non-slip":
    "Non-slip mats, flooring, and treads for safer floors.",
  "falls-wandering/bed-exit-alarms":
    "Alarms that alert a caregiver when you leave bed or a chair.",
  "falls-wandering/hip-protectors":
    "Protective underwear that cushions hip impact during falls.",
  "falls-wandering/walkers-rollators":
    "Walkers, rollators, canes, and fitting help.",
  "falls-wandering/home-assessments":
    "In-home visits to identify and fix fall hazards.",

  // pet-therapy
  "pet-therapy/therapy-animal-visits":
    "Therapy dogs and cats that visit seniors in person.",
  "pet-therapy/service-dogs":
    "Service dog training and acquisition support.",
  "pet-therapy/pet-sitting":
    "Trusted pet sitters for when you're away or in hospital.",
  "pet-therapy/dog-walking":
    "Daily or weekly dog walking from reliable local walkers.",
  "pet-therapy/pet-grooming":
    "Mobile pet grooming at your home.",
  "pet-therapy/veterinary-house-calls":
    "Vets that come to your home — less stress for your pet.",
  "pet-therapy/pet-fostering":
    "Foster and adoption help for senior pet owners.",

  // pastoral
  "pastoral/in-home-visits":
    "Pastors, priests, and rabbis who visit you at home.",
  "pastoral/worship-services":
    "Worship services designed for seniors and those at home.",
  "pastoral/sacramental-care":
    "Sacramental and end-of-life spiritual care.",
  "pastoral/bible-study":
    "Bible study groups and faith-based fellowship.",
  "pastoral/interfaith":
    "Interfaith spiritual care for any tradition.",
  "pastoral/chaplaincy":
    "Hospital and care-home chaplains.",

  // volunteer
  "volunteer/for-individuals":
    "Find a volunteer role that matches your interests and schedule.",
  "volunteer/for-companies":
    "Corporate and group volunteer opportunities.",
  "volunteer/seeking-volunteers":
    "Organizations looking for senior volunteers right now.",
  "volunteer/board-members":
    "Board and committee positions for experienced leaders.",
  "volunteer/peer-support":
    "Peer-support and befriending volunteer roles.",
  "volunteer/skills-based":
    "Share your professional skills with a cause you care about.",
  "volunteer/one-time-events":
    "Single-day or one-off volunteer events.",

  // home-care
  "home-care/personal-care":
    "Help with bathing, dressing, grooming, and daily routines.",
  "home-care/meal-services":
    "Meal prep, delivery, and dietary-specific home cooking.",
  "home-care/housekeeping":
    "Light housekeeping and home tidying services.",
  "home-care/companionship":
    "Friendly visitors and conversation companions.",

  // home-maintenance
  "home-maintenance/handyman":
    "Handyperson services for small home repairs.",
  "home-maintenance/snow-removal":
    "Driveway and walkway snow clearing all winter.",
  "home-maintenance/lawn-care":
    "Lawn mowing, hedge trimming, and yard upkeep.",
  "home-maintenance/home-modifications":
    "Ramps, walk-in tubs, and accessibility modifications.",
  "home-maintenance/house-cleaning":
    "Regular or one-time house cleaning services.",

  // health-wellness
  "health-wellness/nursing-care":
    "In-home nursing and clinical care services.",
  "health-wellness/physiotherapy":
    "Physiotherapy for balance, mobility, and recovery.",
  "health-wellness/foot-care":
    "Chiropody and senior foot-care specialists.",
  "health-wellness/dental":
    "Dentists, denturists, and dental hygienists.",
  "health-wellness/dental-care":
    "Mobile dental hygiene and denture care at home.",
  "health-wellness/hearing-vision":
    "Hearing tests, glasses, and vision care.",
  "health-wellness/massage":
    "Therapeutic massage for seniors and chronic pain.",
  "health-wellness/patient-advocates":
    "Advocates who help you navigate the healthcare system.",

  // transportation
  "transportation/medical-transport":
    "Non-emergency medical transportation services.",
  "transportation/rides":
    "On-demand rides for errands and appointments.",
  "transportation/wheelchair-van":
    "Wheelchair-accessible van transportation.",
  "transportation/mobility-equipment":
    "Mobility scooters, lifts, and vehicle adaptations.",

  // legal-financial
  "legal-financial/estate-law":
    "Estate planning, wills, and power of attorney.",
  "legal-financial/financial-planning":
    "Retirement income, investments, and financial planning.",
  "legal-financial/tax-services":
    "Personal tax preparation and filing help.",
  "legal-financial/benefits-help":
    "Help applying for CPP, OAS, GIS, and senior benefits.",

  // community
  "community/senior-centres":
    "Local senior centres, drop-ins, and programs.",
  "community/day-programs":
    "Structured day programs for older adults.",
  "community/recreation":
    "Recreation, hobby clubs, and social activities.",
  "community/caregiver-relief":
    "Respite and relief for family caregivers.",

  // housing
  "housing/retirement-living":
    "Independent retirement living residences.",
  "housing/long-term-care":
    "Long-term care home placement and resources.",
  "housing/assisted-living":
    "Assisted living residences with personal care.",
  "housing/respite-care":
    "Short-term respite stays for caregivers.",

  // dating
  "dating/senior-dating-sites":
    "Senior-friendly dating sites and apps.",
  "dating/matchmaking":
    "Personal matchmaking services for older adults.",
  "dating/social-clubs":
    "Clubs and events for singles and companionship.",
  "dating/companionship-dates":
    "Companionship-focused dating for slower-paced connection.",
  "dating/romantic-travel":
    "Group romantic and singles travel experiences.",
  "dating/friendship-pen-pals":
    "Friendship and pen-pal networks for seniors.",
  "dating/second-marriage":
    "Support and resources for second marriages later in life.",

  // sexual-health
  "sexual-health/pelvic-floor":
    "Pelvic floor physiotherapy and rehabilitation.",
  "sexual-health/menopause":
    "Menopause care, education, and support.",
  "sexual-health/ed-clinics":
    "Clinics specializing in erectile dysfunction treatment.",
  "sexual-health/sexual-health-edu":
    "Sexual health education tailored to older adults.",
  "sexual-health/couples-counseling":
    "Couples counseling with a sexual-health focus.",
  "sexual-health/sti-testing":
    "Confidential STI testing and sexual health screening.",

  // intimate-wellness
  "intimate-wellness/love-connection":
    "Resources for finding love and romantic connection.",
  "intimate-wellness/friendship-clubs":
    "Clubs focused on friendship and meaningful connection.",
  "intimate-wellness/intimacy-aids":
    "Discreet retailers of intimacy aids and wellness products.",
  "intimate-wellness/bedroom-safety":
    "Bedroom safety equipment and accessibility adaptations.",
  "intimate-wellness/relationship-coaching":
    "Coaching for couples at any stage of their relationship.",
  "intimate-wellness/mature-wellness":
    "Holistic wellness services for mature adults.",

  // shopping
  "shopping/pharmacy-delivery":
    "Prescription and pharmacy delivery to your door.",
  "shopping/grocery-delivery":
    "Grocery delivery from local stores.",
  "shopping/medical-supplies":
    "Medical supplies, mobility aids, and home health equipment.",
  "shopping/adaptive-clothing":
    "Adaptive clothing designed for comfort and ease.",

  // events
  "events/senior-fairs":
    "Senior expos, fairs, and trade shows.",
  "events/workshops-classes":
    "Workshops and classes for lifelong learners.",
  "events/social-events":
    "Social gatherings, dances, and community events.",
  "events/outdoor-trips":
    "Guided outdoor trips and nature excursions.",
  "events/fundraisers":
    "Charity events and fundraisers you can attend.",
  "events/support-groups":
    "Peer support groups for shared life experiences.",
};

/** Look up a subcategory blurb; returns undefined if not mapped. */
export function getSubcategoryBlurb(
  categorySlug: string,
  subcategorySlug: string
): string | undefined {
  return SUB_CATEGORY_BLURBS[`${categorySlug}/${subcategorySlug}`];
}