const { config } = await import('dotenv');
config({ path: './.env' });

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

async function supabaseFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok && res.status !== 204) {
    const t = await res.text();
    throw new Error(`Supabase ${res.status}: ${t}`);
  }
  return res;
}

const names = [
  'Faith Wanjiku', 'Grace Akinyi', 'Esther Wambui', 'Mary Njoki', 'Sarah Chepkoech',
  'Elizabeth Mutanu', 'Ann Wairimu', 'Jane Nyambura', 'Margaret Wangari', 'Rose Kemunto',
  'Catherine Naliaka', 'Dorothy Chebet', 'Martha Jerono', 'Susan Kiprono', 'Ruth Nasimiyu',
  'Alice Mwende', 'Joyce Kanini', 'Lydia Ndinda', 'Helen Syombua', 'Nancy Muthoki',
  'Florence Wanjala', 'Beatrice Nekesa', 'Monica Kwamboka', 'Pauline Kerubo', 'Agnes Moraa',
  'Veronica Nyaboke', 'Priscilla Bosibori', 'Diana Kwamboka', 'Christine Moraa', 'Janet Nyakundi',
  'Zipporah Wangui', 'Edith Njeri', 'Rebecca Wanjiru', 'Deborah Nyaguthii', 'Naomi Wangechi',
  'Lilian Wanja', 'Caroline Muthoni', 'Maryanne Waithera', 'Nancy Wambugu', 'Grace Nduta',
  'Faith Wamboi', 'Joyce Nyokabi', 'Ruth Wanjiku', 'Sarah Nyambura', 'Anne Wacheke',
  'Jane Waithira', 'Margaret Nyambeki', 'Rose Wangeci', 'Catherine Mumbe', 'Dorothy Kavata',
  'Martha Wayua', 'Susan Mutindi', 'Ruth Mueni', 'Alice Mwikali', 'Joyce Ndanu',
  'Lydia Syombua', 'Helen Mwongeli', 'Nancy Mwanzia', 'Beatrice Mwongeli', 'Pauline Ndunge',
  'Veronica Mwende', 'Priscilla Nduku', 'Diana Mwende', 'Christine Mwongela', 'Janet Ndinda',
  'Sarah Chemutai', 'Faith Jepchirchir', 'Grace Jebet', 'Esther Jepkoech', 'Mary Chepngetich',
  'Elizabeth Chemengich', 'Ann Jepkemboi', 'Jane Cherotich', 'Margaret Jelagat', 'Rose Cherop',
  'Catherine Jemutai', 'Dorothy Chelangat', 'Martha Chelangat', 'Susan Kipserem', 'Ruth Chumba',
  'Alice Chepkorir', 'Joyce Jepkoech', 'Lydia Chebet', 'Helen Chepkemoi', 'Nancy Serem',
  'Achieng Omondi', 'Atieno Okello', 'Akinyi Owino', 'Awino Otieno', 'Adhiambo Ochieng',
  'Anyango Onyango', 'Apiyo Omondi', 'Auma Okoth', 'Awuor Odhiambo', 'Nyar Ogolla',
  'Chepkurui Kimutai', 'Chelangat Koech', 'Chebet Langat', 'Jepchirchir Rono', 'Chepwogen Bett',
  'Jerotich Rotich', 'Jebet Yegon', 'Chepngeno Kiprop', 'Kiprono Cheruiyot', 'Cherotich Sang',
  'Khadija Hassan', 'Amina Abdullahi', 'Fatuma Ali', 'Mariam Hussein', 'Zainab Ibrahim',
  'Halima Omar', 'Saumu Juma', 'Aziza Salim', 'Mwanahamisi Bakari', 'Rehema Mwinyi',
  'Kadzo Mwambire', 'Mwanajuma Mwinyi', 'Subira Kombo', 'Rehema Ali', 'Baharati Omar',
  'Mwanasha Hamisi', 'Amina Juma', 'Mwanamvua Salim', 'Halima Bakari', 'Saada Mwinyi',
];

const locations = [
  'Nairobi, Kenya', 'Mombasa, Kenya', 'Kisumu, Kenya', 'Nakuru, Kenya', 'Eldoret, Kenya',
  'Thika, Kenya', 'Malindi, Kenya', 'Kitale, Kenya', 'Nyeri, Kenya', 'Machakos, Kenya',
  'Meru, Kenya', 'Nanyuki, Kenya', 'Naivasha, Kenya', 'Kakamega, Kenya', 'Kericho, Kenya',
  'Embu, Kenya', 'Muranga, Kenya', 'Kiambu, Kenya', 'Narok, Kenya', 'Kilifi, Kenya',
  'Lamu, Kenya', 'Watamu, Kenya', 'Diani, Kenya', 'Nyahururu, Kenya', 'Isiolo, Kenya',
  'Marsabit, Kenya', 'Lodwar, Kenya', 'Garissa, Kenya', 'Wajir, Kenya', 'Busia, Kenya',
  'Bungoma, Kenya', 'Vihiga, Kenya', 'Siaya, Kenya', 'Homa Bay, Kenya', 'Migori, Kenya',
  'Kisii, Kenya', 'Nyamira, Kenya', 'Kirinyaga, Kenya', 'Laikipia, Kenya', 'Samburu, Kenya',
  'Turkana, Kenya', 'West Pokot, Kenya', 'Trans Nzoia, Kenya', 'Uasin Gishu, Kenya',
  'Elgeyo Marakwet, Kenya', 'Nandi, Kenya', 'Bomet, Kenya', 'Taita Taveta, Kenya',
];

const ages = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];

const bios = [
  'Nairobian through and through. Love exploring new cafes in Kilimani and catching sunsets at The Alchemist. Looking for genuine vibes only.',
  'Mombasa girl who loves the ocean breeze. Scuba diving enthusiast and Swahili food lover. Come join me for a beach date.',
  'Kisumu sweetheart. Lake Victoria sunsets hit different. Looking for someone whos honest, ambitious, and loves nyama choma.',
  'Fitness instructor based in Nairobi. If you can keep up with my morning runs at Karura, we are off to a great start.',
  'Book lover and aspiring writer. My happy place is a quiet corner with a good book and chai. Looking for my plot twist.',
  'Fashion designer from Thika. I speak fluent sarcasm and love trying new restaurants. Sunday brunch is sacred.',
  'Adventure seeker based in Nakuru. Hiked Mt Longonot 12 times and counting. Love camping and road trips.',
  'Yoga instructor in Eldoret. High altitude training taught me discipline. Looking for someone with a kind heart and good energy.',
  'Food blogger from Nairobi. If you know the best ugali fry spots in town, we will get along just fine.',
  'Travel nurse based in Nyeri. Love the quiet life but also enjoy weekend getaways. Looking for meaningful conversations.',
  'Kenyan living in Malindi. Beach bum, coconut water addict, and full-time people watcher. Life is good.',
  'Marketing professional by day, musician by night. I play guitar and sing. Looking for my duet partner.',
  'Freelance photographer from Meru. I capture moments for a living but looking for someone to create memories with.',
  'Dental surgeon with a soft spot for romcoms and road trips. Based in Nairobi but love exploring upcountry.',
  'Coffee farmer from Kirinyaga. Yes I know my way around a french press. Looking for someone who appreciates the simple life.',
  'Software engineer who also loves dancing. Yes we exist! Look at me breaking stereotypes and the dance floor.',
  'Mama mboga at heart but also a university graduate. Hardworking, ambitious, and looking for a real connection.',
  'Flight attendant based in Nairobi. Ive been to 20+ countries but Kenya will always be home. Looking for my travel buddy.',
  'Law student whos learning to cook on YouTube. Results may vary but the effort is there. Looking for honest vibes.',
  'Makeup artist and beauty influencer. I believe in looking good, feeling good, and doing good. Looking for genuine energy.',
  'Pharmacist from Kisii highlands. I love nature walks, gospel music, and warm cups of tea. Looking for a God-fearing partner.',
  'Architect in Nairobi. I design buildings during the day and dream of building a family at night. Looking for the real deal.',
  'Journalist based in Nairobi. I ask questions for a living and Im not afraid to ask the hard ones. Authenticity matters.',
  'Small business owner from Nakuru. I sell shoes online and in real life. Looking for someone who walks beside me, not behind me.',
  'Data analyst who loves cooking. I analyze patterns all day then come home to create culinary masterpieces. Looking for a taste tester.',
];

function generateReferralCode(name) {
  const prefix = name.slice(0, 5).toUpperCase();
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${suffix}`;
}

async function seedUsers() {
  const password = 'Mingle123!';
  const hashed = bcrypt.hashSync(password, 10);
  let created = 0;
  let skipped = 0;

  console.log(`Seeding ${names.length} users into Supabase...`);

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const email = `${name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z.]/g, '')}${i}@mingle.app`;
    const checkRes = await supabaseFetch(`/users?email=eq.${encodeURIComponent(email)}&select=id`);
    const existing = await checkRes.json();
    if (existing.length > 0) { skipped++; continue; }

    const id = uuidv4();
    const code = generateReferralCode(name);
    const age = ages[Math.floor(Math.random() * ages.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const bio = bios[Math.floor(Math.random() * bios.length)];

    await supabaseFetch('/users', {
      method: 'POST',
      body: JSON.stringify({
        id, name, email, phone: `2547${String(70000000 + i).slice(0, 8)}`,
        password: hashed, gender: 'female', age,
        interested_in: Math.random() > 0.3 ? 'men' : 'everyone',
        location, bio, referral_code: code, is_verified: 0,
      }),
    });

    await supabaseFetch('/payments', {
      method: 'POST',
      body: JSON.stringify({
        id: uuidv4(), user_id: id, method: `SEED${Date.now()}${i}`,
        amount: 100, status: 'pending',
      }),
    });

    created++;
    if (created % 25 === 0) console.log(`  Progress: ${created}/${names.length}...`);
  }

  console.log(`\n✅ Done! Created ${created} accounts.`);
  console.log(`Skipped ${skipped} existing.`);
  console.log(`\n📋 Login: ${names[0].toLowerCase().replace(/\s+/g, '.').replace(/[^a-z.]/g, '')}0@mingle.app`);
  console.log(`   Password: ${password}`);
}

seedUsers().catch(e => { console.error('Fatal:', e); process.exit(1); });
