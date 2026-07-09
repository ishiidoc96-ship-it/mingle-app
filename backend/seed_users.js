import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { initDb, getDb, saveDb } from './db/db.js';

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
]

const locations = [
  'Nairobi, Kenya', 'Mombasa, Kenya', 'Kisumu, Kenya', 'Nakuru, Kenya', 'Eldoret, Kenya',
  'Thika, Kenya', 'Malindi, Kenya', 'Kitale, Kenya', 'Nyeri, Kenya', 'Machakos, Kenya',
  'Meru, Kenya', 'Nanyuki, Kenya', 'Naivasha, Kenya', 'Kakamega, Kenya', 'Kericho, Kenya',
  'Nyeri, Kenya', 'Embu, Kenya', 'Muranga, Kenya', 'Kiambu, Kenya', 'Narok, Kenya',
  'Kilifi, Kenya', 'Lamu, Kenya', 'Watamu, Kenya', 'Diani, Kenya', 'Nyahururu, Kenya',
  'Isiolo, Kenya', 'Marsabit, Kenya', 'Lodwar, Kenya', 'Garissa, Kenya', 'Wajir, Kenya',
  'Busia, Kenya', 'Bungoma, Kenya', 'Vihiga, Kenya', 'Siaya, Kenya', 'Homa Bay, Kenya',
  'Migori, Kenya', 'Kisii, Kenya', 'Nyamira, Kenya', 'Muranga, Kenya', 'Kirinyaga, Kenya',
  'Laikipia, Kenya', 'Samburu, Kenya', 'Turkana, Kenya', 'West Pokot, Kenya', 'Trans Nzoia, Kenya',
  'Uasin Gishu, Kenya', 'Elgeyo Marakwet, Kenya', 'Nandi, Kenya', 'Bomet, Kenya', 'Taita Taveta, Kenya',
]

const ages = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]

const genders = ['female', 'female', 'female', 'female', 'nonbinary']

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
]

function generateReferralCode(name) {
  const prefix = name.slice(0, 5).toUpperCase()
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}${suffix}`
}

async function seedUsers() {
  await initDb()
  const db = getDb()
  const password = 'Mingle123!'
  const hashed = bcrypt.hashSync(password, 10)

  let created = 0
  let skipped = 0

  for (let i = 0; i < names.length; i++) {
    const name = names[i]
    const email = `${name.toLowerCase().replace(/\\s+/g, '.').replace(/[^a-z.]/g, '')}${i}@mingle.app`
    const phone = `2547${String(70000000 + i).slice(0, 8)}`

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existing) { skipped++; continue }

    const id = uuidv4()
    const code = generateReferralCode(name)
    const age = ages[Math.floor(Math.random() * ages.length)]
    const location = locations[Math.floor(Math.random() * locations.length)]
    const bio = bios[Math.floor(Math.random() * bios.length)]
    const gender = 'female'
    const interestedIn = Math.random() > 0.3 ? 'men' : 'everyone'
    const occupation = [
      'Software Engineer', 'Teacher', 'Nurse', 'Designer', 'Photographer',
      'Marketing Manager', 'Accountant', 'Journalist', 'Doctor', 'Lawyer',
      'Entrepreneur', 'Architect', 'Flight Attendant', 'Chef', 'Fitness Coach',
      'Graphic Designer', 'Banker', 'Consultant', 'Pharmacist', 'Writer'
    ][Math.floor(Math.random() * 20)]

    // Assign avatar photo - use modulo to distribute photos evenly
    const avatarUrl = `https://example.com/women-photos/african_woman_${String(i + 1).padStart(4, '0')}.jpg`

    db.prepare(`INSERT INTO users (id, name, email, phone, password, gender, age, interested_in, location, bio, avatar_url, referral_code, is_verified)`
      .run(id, name, email, phone, hashed, gender, age, interestedIn, location, bio, avatarUrl, code))

    db.prepare(`INSERT INTO payments (id, user_id, method, amount, status, mpesa_receipt)`
      .run(uuidv4(), id, `SEED${Date.now()}${i}`))

    created++
    if (created % 25 === 0 || created === names.length) {
      console.log(`Progress: ${created}/${names.length} users created...`)
      saveDb()
    }
  }

  saveDb()
  console.log(`\n✅ Done! Created ${created} new female accounts.`)
  console.log(`Skipped ${skipped} existing accounts.`)
  console.log(`\n📋 Login credentials:`)
  console.log(`   Email format: firstname.lastnameINDEX@mingle.app`)
  console.log(`   Password: ${password}`)
  console.log(`   Example: ${names[0].toLowerCase().replace(/\\s+/g, '.').replace(/[^a-z.]/g, '')}0@mingle.app / ${password}`)
}

seedUsers().catch(console.error)
