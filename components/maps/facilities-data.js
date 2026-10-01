/**
 * Centralized facility data for Report Animal map pages.
 * Each facility: id, name, type, latitude, longitude, address, description, availability
 */
const FACILITIES_DATA = [
    // Treatment
    {
        id: 101,
        name: "Paws & Claws Veterinary Hospital",
        facilityType: "treatment",
        type: "Veterinary Hospital",
        latitude: 18.6298,
        longitude: 73.7997,
        address: "Koregaon Park, Pune, Maharashtra 411001",
        description: "24/7 emergency care for injured and sick animals.",
        availability: "available"
    },
    {
        id: 102,
        name: "Blue Cross Animal Clinic",
        facilityType: "treatment",
        type: "Animal Clinic",
        latitude: 18.6185,
        longitude: 73.8037,
        address: "Camp Area, Pune, Maharashtra 411001",
        description: "Low-cost treatment for street and domestic animals.",
        availability: "available"
    },
    {
        id: 103,
        name: "Pet Care Treatment Center",
        facilityType: "treatment",
        type: "Treatment Center",
        latitude: 18.6425,
        longitude: 73.7892,
        address: "Aundh, Pune, Maharashtra 411007",
        description: "Specialized trauma and post-rescue rehabilitation.",
        availability: "busy"
    },
    {
        id: 104,
        name: "Animal Wellness NGO Clinic",
        facilityType: "treatment",
        type: "NGO Care Facility",
        latitude: 18.6089,
        longitude: 73.8156,
        address: "Kothrud, Pune, Maharashtra 411038",
        description: "Free treatment camps for abandoned animals.",
        availability: "available"
    },

    // Emergency Rescue
    {
        id: 201,
        name: "Rapid Animal Rescue Unit",
        facilityType: "rescue",
        type: "Emergency Rescue Center",
        latitude: 18.6352,
        longitude: 73.7745,
        address: "Baner, Pune, Maharashtra 411045",
        description: "Immediate response for animals in danger.",
        availability: "available"
    },
    {
        id: 202,
        name: "Street Animal Rescue NGO",
        facilityType: "rescue",
        type: "NGO Rescue Location",
        latitude: 18.6502,
        longitude: 73.8089,
        address: "Viman Nagar, Pune, Maharashtra 411014",
        description: "Street rescue and safe transport services.",
        availability: "available"
    },
    {
        id: 203,
        name: "Emergency Animal Services Pune",
        facilityType: "rescue",
        type: "Emergency Animal Service",
        latitude: 18.6123,
        longitude: 73.7921,
        address: "Shivajinagar, Pune, Maharashtra 411005",
        description: "Critical rescue operations and night helpline support.",
        availability: "busy"
    },
    {
        id: 204,
        name: "Hope Rescue Foundation",
        facilityType: "rescue",
        type: "Rescue Center",
        latitude: 18.6578,
        longitude: 73.7812,
        address: "Hinjewadi, Pune, Maharashtra 411057",
        description: "Large animal and roadside emergency rescue.",
        availability: "available"
    },

    // Adoption
    {
        id: 301,
        name: "Happy Tails Adoption Center",
        facilityType: "adoption",
        type: "Adoption Center",
        latitude: 18.6245,
        longitude: 73.8123,
        address: "Hadapsar, Pune, Maharashtra 411028",
        description: "Dogs and cats ready for loving homes.",
        availability: "available"
    },
    {
        id: 302,
        name: "Second Chance Shelter",
        facilityType: "adoption",
        type: "Animal Shelter",
        latitude: 18.6389,
        longitude: 73.8267,
        address: "Wanowrie, Pune, Maharashtra 411040",
        description: "Rehabilitated rescues available for adoption.",
        availability: "available"
    },
    {
        id: 303,
        name: "Pawsome Homes NGO",
        facilityType: "adoption",
        type: "Adoption NGO",
        latitude: 18.6012,
        longitude: 73.7689,
        address: "Karve Nagar, Pune, Maharashtra 411052",
        description: "Home visits and adoption counseling provided.",
        availability: "busy"
    },

    // Vaccination
    {
        id: 401,
        name: "City Vaccination Drive Center",
        facilityType: "vaccination",
        type: "Vaccination Center",
        latitude: 18.6312,
        longitude: 73.7856,
        address: "Deccan Gymkhana, Pune, Maharashtra 411004",
        description: "Anti-rabies and core vaccines for street animals.",
        availability: "available"
    },
    {
        id: 402,
        name: "Pet Immunization Clinic",
        facilityType: "vaccination",
        type: "Veterinary Clinic",
        latitude: 18.6456,
        longitude: 73.8012,
        address: "Yerwada, Pune, Maharashtra 411006",
        description: "Scheduled vaccination camps every weekend.",
        availability: "available"
    },
    {
        id: 403,
        name: "Community Vet Vaccination Hub",
        facilityType: "vaccination",
        type: "Vaccination Hub",
        latitude: 18.6178,
        longitude: 73.8234,
        address: "Magarpatta, Pune, Maharashtra 411028",
        description: "Bulk vaccination for community animals.",
        availability: "closed"
    },

    // Sterilization
    {
        id: 501,
        name: "ABC Sterilization Facility",
        facilityType: "sterilization",
        type: "Sterilization Facility",
        latitude: 18.6289,
        longitude: 73.7567,
        address: "Bavdhan, Pune, Maharashtra 411021",
        description: "Animal Birth Control program for street dogs.",
        availability: "available"
    },
    {
        id: 502,
        name: "Humane Spay & Neuter Center",
        facilityType: "sterilization",
        type: "Animal Hospital",
        latitude: 18.6534,
        longitude: 73.7945,
        address: "Kalyani Nagar, Pune, Maharashtra 411006",
        description: "Safe sterilization with post-op recovery care.",
        availability: "available"
    },
    {
        id: 503,
        name: "NGO Neuter Clinic",
        facilityType: "sterilization",
        type: "NGO Facility",
        latitude: 18.6098,
        longitude: 73.7789,
        address: "Pashan, Pune, Maharashtra 411021",
        description: "Free sterilization for rescued animals.",
        availability: "busy"
    },

    // Shelter
    {
        id: 601,
        name: "Safe Haven Animal Shelter",
        facilityType: "shelter",
        type: "Animal Shelter",
        latitude: 18.6412,
        longitude: 73.8345,
        address: "Mohammed Wadi, Pune, Maharashtra 411060",
        description: "Temporary housing for rescued animals.",
        availability: "available"
    },
    {
        id: 602,
        name: "Rescue Home Sanctuary",
        facilityType: "shelter",
        type: "Rescue Home",
        latitude: 18.5987,
        longitude: 73.8123,
        address: "Dhankawadi, Pune, Maharashtra 411043",
        description: "Long-term care for injured and abandoned animals.",
        availability: "available"
    },
    {
        id: 603,
        name: "Pune Animal Refuge",
        facilityType: "shelter",
        type: "Nearby Shelter",
        latitude: 18.6678,
        longitude: 73.8156,
        address: "Lohegaon, Pune, Maharashtra 411047",
        description: "Capacity for 120 animals with medical support.",
        availability: "busy"
    },

    // Feeding Centers
    {
        id: 701,
        name: "Community Feeding Point - FC Road",
        facilityType: "feeding",
        type: "Animal Feeding Point",
        latitude: 18.6267,
        longitude: 73.8089,
        address: "FC Road, Pune, Maharashtra 411004",
        description: "Daily meals for street dogs and cats.",
        availability: "available"
    },
    {
        id: 702,
        name: "NGO Daily Feeding Station",
        facilityType: "feeding",
        type: "NGO Feeding Location",
        latitude: 18.6145,
        longitude: 73.7912,
        address: "Swargate, Pune, Maharashtra 411042",
        description: "Volunteer-run feeding twice daily.",
        availability: "available"
    },
    {
        id: 703,
        name: "Park Feeding Center",
        facilityType: "feeding",
        type: "Feeding Center",
        latitude: 18.6523,
        longitude: 73.7678,
        address: "Sinhagad Road, Pune, Maharashtra 411051",
        description: "Nutritious meals and water stations.",
        availability: "available"
    },

    // Mating - Cat
    {
        id: 801,
        name: "Feline Match Registry - Pune",
        facilityType: "mating",
        filterType: "cat",
        type: "Registered Breeding Center",
        latitude: 18.6234,
        longitude: 73.7978,
        address: "Model Colony, Pune, Maharashtra 411016",
        description: "Verified cat mating partners with health records.",
        availability: "available"
    },
    {
        id: 802,
        name: "Whiskers Partner Network",
        facilityType: "mating",
        filterType: "cat",
        type: "Mating Facility",
        latitude: 18.6367,
        longitude: 73.8234,
        address: "Kondhwa, Pune, Maharashtra 411048",
        description: "Pedigree and community cat matchmaking.",
        availability: "available"
    },

    // Mating - Dog
    {
        id: 811,
        name: "Canine Connect Center",
        facilityType: "mating",
        filterType: "dog",
        type: "Registered Breeding Center",
        latitude: 18.6489,
        longitude: 73.7867,
        address: "Senapati Bapat Road, Pune, Maharashtra 411016",
        description: "Health-checked dog mating partners.",
        availability: "available"
    },
    {
        id: 812,
        name: "Paw Match Dog Registry",
        facilityType: "mating",
        filterType: "dog",
        type: "Mating Facility",
        latitude: 18.6056,
        longitude: 73.8045,
        address: "Bibwewadi, Pune, Maharashtra 411037",
        description: "Breed-specific and mixed-breed matching.",
        availability: "busy"
    },

    // Mating - Other
    {
        id: 821,
        name: "Exotic Pet Match Center",
        facilityType: "mating",
        filterType: "other",
        type: "Mating Facility",
        latitude: 18.6598,
        longitude: 73.8023,
        address: "Kharadi, Pune, Maharashtra 411014",
        description: "Rabbits, birds, and small mammals.",
        availability: "available"
    },
    {
        id: 822,
        name: "Farm Animal Breeding Hub",
        facilityType: "mating",
        filterType: "other",
        type: "Registered Breeding Center",
        latitude: 18.5789,
        longitude: 73.8345,
        address: "Undri, Pune, Maharashtra 411060",
        description: "Cows, goats, and farm animal pairing.",
        availability: "available"
    },

    // Wildlife Emergency
    {
        id: 901,
        name: "Maharashtra Wildlife Rescue Unit",
        facilityType: "wildlife-emergency",
        type: "Wildlife Rescue Authority",
        latitude: 18.6334,
        longitude: 73.7612,
        address: "Pashan Lake Area, Pune, Maharashtra 411021",
        description: "Emergency response for injured wildlife.",
        availability: "available"
    },
    {
        id: 902,
        name: "Forest Department Wildlife Helpline",
        facilityType: "wildlife-emergency",
        type: "Emergency Wildlife Service",
        latitude: 18.6712,
        longitude: 73.7889,
        address: "Sus Road, Pune, Maharashtra 411021",
        description: "Snake rescue, bird trauma, and large wildlife.",
        availability: "available"
    },
    {
        id: 903,
        name: "Wildlife Trauma Care Center",
        facilityType: "wildlife-emergency",
        type: "Wildlife Rescue Center",
        latitude: 18.5923,
        longitude: 73.7956,
        address: "Parvati Hill, Pune, Maharashtra 411009",
        description: "Treatment and safe release back to habitat.",
        availability: "busy"
    },

    // Wildlife Spotting / Reporting
    {
        id: 1001,
        name: "Urban Wildlife Spotting Desk",
        facilityType: "wildlife-spotting",
        type: "Wildlife Reporting Center",
        latitude: 18.6278,
        longitude: 73.8167,
        address: "Kalyani Nagar, Pune, Maharashtra 411006",
        description: "Report wildlife sightings for monitoring.",
        availability: "available"
    },
    {
        id: 1002,
        name: "Biodiversity Observation Point",
        facilityType: "wildlife-spotting",
        type: "Spotting & Reporting Hub",
        latitude: 18.6445,
        longitude: 73.8456,
        address: "Empress Garden, Pune, Maharashtra 411001",
        description: "Log sightings and get expert guidance.",
        availability: "available"
    },
    {
        id: 1003,
        name: "Community Wildlife Watch",
        facilityType: "wildlife-spotting",
        type: "Wildlife Monitoring Station",
        latitude: 18.6156,
        longitude: 73.7734,
        address: "Law College Road, Pune, Maharashtra 411004",
        description: "Citizen science wildlife reporting network.",
        availability: "available"
    }
];

const FACILITY_MAP_CONFIGS = {
    treatment: {
        title: "Find Nearby Treatment Centers",
        subtitle: "Locate veterinary hospitals, treatment centers, animal clinics, and care facilities near you.",
        listTitle: "Treatment Facilities Near You",
        facilityType: "treatment",
        backLink: "../../animal_rescue.html",
        showEmergencyBanner: true
    },
    rescue: {
        title: "Find Nearby Rescue Centers",
        subtitle: "Locate rescue centers, emergency animal services, and NGO rescue locations.",
        listTitle: "Rescue Facilities Near You",
        facilityType: "rescue",
        backLink: "../../animal_rescue.html",
        showEmergencyBanner: true
    },
    adoption: {
        title: "Find Adoption Centers",
        subtitle: "Locate adoption centers and animal shelters with animals ready for a loving home.",
        listTitle: "Adoption Centers Near You",
        facilityType: "adoption",
        backLink: "../../animal_rescue.html",
        showEmergencyBanner: false
    },
    vaccination: {
        title: "Find Vaccination Centers",
        subtitle: "Locate vaccination centers and veterinary clinics offering immunization services.",
        listTitle: "Vaccination Centers Near You",
        facilityType: "vaccination",
        backLink: "../../animal_rescue.html",
        showEmergencyBanner: false
    },
    sterilization: {
        title: "Find Sterilization Facilities",
        subtitle: "Locate sterilization facilities and animal hospitals offering spay/neuter programs.",
        listTitle: "Sterilization Facilities Near You",
        facilityType: "sterilization",
        backLink: "../../animal_rescue.html",
        showEmergencyBanner: false
    },
    shelter: {
        title: "Find Animal Shelters",
        subtitle: "Locate nearby shelters and rescue homes for animals in need.",
        listTitle: "Shelters Near You",
        facilityType: "shelter",
        backLink: "../../animal_rescue.html",
        showEmergencyBanner: false
    },
    feeding: {
        title: "Find Feeding Centers",
        subtitle: "Locate animal feeding points and NGO feeding locations.",
        listTitle: "Feeding Centers Near You",
        facilityType: "feeding",
        backLink: "../../report_animal.html",
        showEmergencyBanner: false
    },
    mating: {
        title: "Find Registered Breeding Centers",
        subtitle: "Locate registered breeding centers and animal mating facilities.",
        listTitle: "Mating Facilities Near You",
        facilityType: "mating",
        backLink: "../../matting.html",
        showEmergencyBanner: false
    },
    "wildlife-emergency": {
        title: "Wildlife Emergency Rescue Map",
        subtitle: "Locate wildlife rescue authorities and emergency wildlife services.",
        listTitle: "Wildlife Rescue Centers Near You",
        facilityType: "wildlife-emergency",
        backLink: "../../wildlife.html",
        showEmergencyBanner: true
    },
    "wildlife-spotting": {
        title: "Wildlife Spotting & Reporting Map",
        subtitle: "Locate wildlife reporting centers and spotting observation points.",
        listTitle: "Reporting Centers Near You",
        facilityType: "wildlife-spotting",
        backLink: "../../wildlife.html",
        showEmergencyBanner: false
    }
};

function getFacilitiesByType(facilityType, filterType) {
    return FACILITIES_DATA.filter(function (facility) {
        if (facility.facilityType !== facilityType) {
            return false;
        }
        if (facilityType === "mating" && filterType) {
            return facility.filterType === filterType;
        }
        return true;
    });
}
