// Connect > Individuals > Romantic Matchmaking (Cesar, Nov 24 Figma).
// Field list transcribed from his screenshots. Each item is asked twice:
//   Me       — how I describe myself (single choice / checkboxes / range score)
//   Seeking  — what I want in others: Required (Deal-Killer) / Not Applicable, plus min–max
// kind: "range" (0–100 slider, endpoints in `ends`), "multi" (checkboxes), "choice" (radio), "text".
export const ROMANTIC_KEY = "mc_romantic_profile_v1";

const R = (id, label, ends) => ({ id, label, kind: "range", ends });
const M = (id, label, options) => ({ id, label, kind: "multi", options });
const C = (id, label, options) => ({ id, label, kind: "choice", options });
const T = (id, label) => ({ id, label, kind: "text" });

export const ROMANTIC_SECTIONS = [
  { id: "about", title: "About", items: [
    C("marital", "Marital Status", ["Single, Never Married", "Separated", "Divorced", "Widowed"]),
    C("education", "Education (highest level)", ["Grammar School", "High School", "College / Technical School", "University (BA, BS)", "Higher Education (MA, MS, MBA)", "Graduate Education (MD, PhD)", "Post-Graduate Education"]),
    M("employment", "Employment Status", ["Self-Employed / Entrepreneur", "Consultant / Contractor / Freelancer", "Employee", "Homemaker", "Student", "Retired / On Sabbatical", "Not Employed", "Seeking Employment / Opportunities"]),
    M("level", "Employment Level", ["Founder / Owner", "C-Level Executive", "Executive", "Management", "Staff"]),
    C("english", "English Language Fluency", ["Beginner", "Intermediate", "Fluent", "Native"]),
    C("citizenship", "Citizenship", ["US Citizen", "Foreign-Born / Immigrant"]),
  ]},
  { id: "standards", title: "Relationship Standards", items: [
    R("attraction", "Attraction — spark, impressions, magnetism"),
    R("compat", "Compatibility — simply getting along"),
    R("sexcompat", "Sexual Compatibility — connecting sexually"),
  ]},
  { id: "background", title: "Background / Family", items: [
    C("children", "Children", ["Have no children, and do not want them", "Have no children, and want them", "Have children, and want more", "Have children, and do not want more"]),
    M("ethnicity", "Ethnicity, Race", ["American Indian or Alaska Native", "Asian", "Black or African American", "Latinx", "Middle Eastern or North African", "Pacific Islander", "White"]),
    C("childhood", "Childhood", ["Very Happy", "Normal", "Dysfunctional", "Very Dysfunctional"]),
    C("upbringing", "Family Upbringing", ["Grew up with both Parents", "Grew up with Single Parent", "Grew up with Guardian(s) / Relative(s)", "Foster child", "Adopted", "Only Child", "1 Sibling", "2 Siblings", "3+ Siblings"]),
    C("parents", "Parent(s) / Guardian(s)", ["Married / United", "Divorced / Separated", "Widowed", "Deceased / Unknown"]),
    M("socialclass", "Grew up in Social Class / Wealth", ["Extremely Poor", "Very Poor", "Poor", "Middle Income", "Wealthy", "Very Wealthy", "Extremely Wealthy"]),
    M("neighborhood", "Grew up in Neighborhood(s)", ["Urban", "Suburban", "Rural"]),
    M("pets", "Pets", ["Have no pets, but like / love them", "Have no pets, and want them", "Have no pets, and do not want them", "Have pets, and want more", "Have pets, and do not want more"]),
  ]},
  { id: "beliefs", title: "Beliefs / Politics", items: [
    C("political", "Political Affiliation", ["Anarchist", "Communist", "Democrat", "Independent", "Republican", "Socialist", "Do Not Vote or Care"]),
    C("religion", "Religious Affiliation", ["Atheism", "Baha'i", "Buddhism", "Christianity", "Hinduism", "Islam", "Jainism", "Shinto", "Sikhism", "Spiritual, No Affiliation", "Taoism", "Zoroastrianism"]),
    R("lib", "Political Leniency — Radical >> Liberal >> Conservative"),
    R("ar2", "Politics — 2nd Amendment (NRA >> Ban Assault Weapons)"),
    R("ar14", "Politics — 14th Amendment (Pro-Life >> Pro-Choice)"),
    R("spirit", "Spirituality — Atheist >> Agnostic >> Religious"),
    R("ghosts", "Believe in Ghosts / Spirits — No >> Yes"),
    R("miracles", "Believe in Miracles — No >> Yes"),
    R("et", "Believe in Extraterrestrials — No >> Yes"),
    R("cryptids", "Believe in Cryptids — No >> Yes"),
  ]},
  { id: "physical", title: "Physical", items: [
    R("height", "Height (inches)", ["3'0\"", "7'0\""]),
    R("bodytype", "Body Type — Obese >> Healthy >> Athletic"),
    R("hair", "Hair — Bald >> Hairy"),
    R("skin", "Skin Tone — Pale >> Dark"),
    R("age", "Appear Younger — vs actual age"),
    R("attractive", "Attractive"),
    R("sexy", "Sexy — Not >> HOT"),
  ]},
  { id: "practices", title: "Practices", items: [
    R("community", "Community Involvement / Volunteering"),
    R("exercise", "Exercise Regularly"),
    R("explore", "Explore / Travel"),
    R("dining", "Fine Dining"),
    R("parenting", "Parenting Style — Indulgent >> Very Strict"),
    R("philanthropy", "Philanthropy — None >> Donate Often"),
    R("romantic", "Romantic — None >> Like a Romance Novel"),
    R("adventure", "Sexually Adventurous — Not >> Freak"),
    R("travel", "Travel — Not >> Road Warrior"),
    R("vacations", "Vacations — Stay at Home >> Explore the World"),
  ]},
  { id: "preferences", title: "Preferences", items: [
    R("career", "Career — Blue Collar >> White Collar"),
    R("commitment", "Commitment — Multiple Partners >> Monogamous"),
    R("culture", "Culture / Heritage Importance"),
    R("fame", "Desire Fame"),
    R("wealth", "Desire Wealth"),
    R("fastfood", "Dining — Fast Food >> Fancy Restaurants"),
    R("picky", "Dining — Very Picky >> Adventurous"),
    R("drinking", "Drinking — Alcohol, Spirits, Top-Shelf"),
    R("firstdate", "First Date / Meeting — Slow >> Wild"),
    R("splitbill", "First Date / Meeting — Split the Bill >> Splurge"),
    R("happiness", "Happiness — Negative >> Realistic >> Positive"),
    R("lifestyle", "Lifestyle — Minimalist >> Extravagant"),
  ]},
  { id: "personality", title: "Personality", items: [
    M("astro", "Astrological Sign", ["Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn"]),
    M("mbti", "Myers-Briggs Type (MBTI)", ["ESTJ", "ENTJ", "ESFJ", "ENFJ", "ISTJ", "ISFJ", "INTJ", "INFJ", "ESTP", "ESFP", "ENTP", "ENFP", "ISTP", "ISFP", "INTP", "INFP"]),
    R("adventurous", "Adventurous"), R("adaptable", "Adaptable"), R("ambitious", "Ambitious"),
    R("carefree", "Carefree"), R("charming", "Charming"), R("classy", "Classy — Sophisticated"),
    R("curious", "Curious"), R("decisive", "Decisive"), R("empathetic", "Empathetic"),
    R("faithful", "Faithful"), R("funny", "Funny"), R("generous", "Generous"),
    R("humble", "Humility"), R("honesty", "Honesty / Truthfulness"), R("intelligent", "Intelligent"),
    R("leader", "Leadership — Follower >> Leader"), R("organized", "Organized"), R("playful", "Playful"),
    R("polite", "Polite"), R("popular", "Popular"), R("risk", "Risk-Taker"), R("humor", "Sense of Humor"),
    R("spontaneous", "Spontaneous"), R("trusting", "Trusting of Others"), R("wild", "Wild"),
  ]},
  { id: "vices", title: "Vices / Hobbies", items: [
    R("cosplay", "Cosplay / Role-Playing"), R("alcohol", "Drinking — Alcohol, Spirits, Wine"),
    R("marijuana", "Drugs — Marijuana >> Hard Stuff"), R("smoking", "Drugs — Smoking, Vaping"),
    R("gluttony", "Food — Gluttony"), R("xsports", "Extreme Sports"),
    R("bodycount", "Sexual Body Count"), R("shopping", "Shopping"),
  ]},
  { id: "skills", title: "Skills", items: [
    R("artistic", "Artistic"), R("listening", "Communication — Listening"), R("speaking", "Communication — Public Speaking"),
    R("cooking", "Cooking"), R("dancing", "Dancing"), R("financial", "Financial"),
    R("kids", "Good with Children"), R("pets_skill", "Good with Pets"), R("music", "Music — Plays Musical Instruments"),
    R("singing", "Music — Sings"), R("networking", "Professional Networking / Schmoozing"),
  ]},
  { id: "bucket", title: "My Bucket List, Experiences, Goals", items: [
    T("b_athletics", "Athletics"), T("b_career", "Career, Profession"), T("b_education", "Education, Knowledge"),
    T("b_entertainment", "Entertainment"), T("b_family", "Family"), T("b_financial", "Financial"),
    T("b_give", "Give: Donate, Volunteer"), T("b_health", "Health"), T("b_language", "Learn Language(s)"),
    T("b_pet", "Pet(s)"), T("b_public", "Public Service: Community, Government, Military"),
    T("b_purchase", "Purchase: Boat, Business, Car, Home, Yacht"), T("b_travel", "Travel: Countries, Locations"),
  ]},
  { id: "favorites", title: "My Favorites", items: [
    T("f_amusement", "Amusement Park(s)"), T("f_animal", "Animal Spirit — If I was an animal I would be"),
    T("f_art", "Art, Artist(s)"), T("f_bev", "Beverage(s)"), T("f_book", "Book(s)"),
    T("f_city", "City / Region / Town"), T("f_clothing", "Clothing Type"), T("f_convo", "Conversation Topic(s)"),
    T("f_culture", "Culture(s)"), T("f_dance", "Dance(s)"), T("f_dessert", "Dessert(s)"),
    T("f_exercise", "Exercise(s)"), T("f_food", "Food(s)"), T("f_historic", "Historical Figure(s)"),
    T("f_period", "Historical Period(s)"), T("f_hobby", "Hobbies, Interests"), T("f_lang", "Language(s)"),
    T("f_movie", "Movie(s), Actor(s)"), T("f_music", "Music: Musician(s), Singer(s)"), T("f_nature", "Nature Spot(s)"),
    T("f_quote", "Quote(s), Life Lesson(s)"), T("f_sport", "Sport(s), Team(s)"), T("f_tv", "Television Show(s)"),
    T("f_vacation", "Vacation Spot(s)"),
  ]},
];

export const SAMPLE_MATCHES = ["A", "B", "C", "D", "E"].map((k) => ({ key: k, name: "Individual • Name, Title", tagline: "Tagline / Business / Organization / Group", where: "City, State" }));
