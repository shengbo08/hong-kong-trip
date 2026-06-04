export type CurrencyCode = 'TWD' | 'HKD' | 'VND' | 'JPY' | 'USD' | 'EUR' | 'KRW' | 'THB';

export interface Money {
  amount: number;
  currency: CurrencyCode;
}

export interface ItineraryActivity {
  id: string;
  time: string;
  place: string;
  activity: string;
  address?: string;
  googleMapsUrl?: string;
  note?: string;
  transport?: string;
  estimatedCost?: Money;
}

export interface TripDay {
  id: string;
  day: number;
  date: string;
  city: string;
  highlights: string[];
  activities: ItineraryActivity[];
}

export interface Accommodation {
  id: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  address?: string;
  bookingInfo?: string;
  googleMapsUrl?: string;
  phone?: string;
  price?: Money;
  facilities?: string[];
}

export type TransportType = 'flight' | 'train' | 'bus' | 'car' | 'other';

export interface TransportInfo {
  id: string;
  type: TransportType;
  title: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  ticketNote?: string;
}

export type BudgetCategory =
  | 'flight'
  | 'accommodation'
  | 'transport'
  | 'food'
  | 'ticket'
  | 'other';

export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  label: string;
  cost: Money;
  note?: string;
}

export interface ImportantInfo {
  passportVisa?: string;
  emergencyContact?: string;
  localNotes?: string[];
  internet?: string;
  currencyNote?: string;
  transferNotices?: TransferNotice[];
}

export interface TransferNotice {
  title: string;
  highlight?: string;
  warning?: string;
  details: string[];
}

export interface TripData {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  intro: string;
  companionsNote?: string;
  coverImageUrl: string;
  homeBaseCurrency: CurrencyCode;
  days: TripDay[];
  accommodations: Accommodation[];
  transports: TransportInfo[];
  budget: BudgetItem[];
  importantInfo: ImportantInfo;
  emergencyContacts: EmergencyContact[];
  mapPlaces: MapPlace[];
  mapCollectionUrl?: string;
  foodRecommendations: FoodCategory[];
  flightTracks: FlightTrack[];
  eveningPlans: HighlightItem[];
  nightViews: HighlightItem[];
  transportGuides: TransportGuide[];
}

export interface EmergencyContact {
  id: string;
  category: string;
  name: string;
  phone?: string;
  address?: string;
  googleMapsUrl?: string;
}

export type MapPlaceStatus = 'planned' | 'optional';

export interface MapPlace {
  id: string;
  category: string;
  name: string;
  googleMapsUrl: string;
  status: MapPlaceStatus;
}

export interface FoodCategory {
  category: string;
  restaurants: FoodRecommendation[];
}

export type ReservationStatus = 'available' | 'recommended' | 'walkIn';

export interface FoodRecommendation {
  id: string;
  name: string;
  recommendedItems: string;
  googleMapsUrl: string;
  photoUrl: string;
  rating: string;
  hours: string;
  averageSpend: string;
  reservationStatus: ReservationStatus;
}

export interface FlightTrack {
  id: string;
  direction: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  terminal?: string;
  flightRadarUrl: string;
  flightAwareUrl: string;
  airlineUrl: string;
  airportUrl: string;
}

export interface HighlightItem {
  id: string;
  title: string;
  area: string;
  note: string;
  googleMapsUrl: string;
}

export interface TransportGuide {
  id: string;
  title: string;
  subtitle: string;
  points: string[];
}

const maps = (query: string) => `https://maps.google.com/?q=${encodeURIComponent(query)}`;

export const trip: TripData = {
  name: '香港 3 天 2 夜自由行',
  destination: '香港',
  startDate: '2026-09-01',
  endDate: '2026-09-03',
  intro:
    '暫定 9 月從高雄出發，安排維港夜景、港島電車、尖沙咀、中環、太平山與在地茶餐廳。航班、飯店與日期都先以待確認狀態保留，方便後續補齊。',
  companionsNote: '3 天 2 夜短天數版本，預算先以 TWD / HKD 雙幣估算。',
  coverImageUrl:
    'https://images.unsplash.com/photo-1534070157457-617f008b2c9a?auto=format&fit=crop&fm=jpg&q=85&w=2400',
  homeBaseCurrency: 'TWD',
  days: [
    {
      id: 'day-1',
      day: 1,
      date: '2026-09-01',
      city: '高雄出發、尖沙咀與維港夜景',
      highlights: ['高雄飛香港', '尖沙咀散步', '星光大道', '維多利亞港夜景'],
      activities: [
        {
          id: 'd1-a1',
          time: '上午或中午',
          place: '高雄小港機場 KHH -> 香港國際機場 HKG',
          activity: '搭機前往香港。航班尚未確認，建議優先查詢直飛或轉機時間較短的班次。',
          address: 'Hong Kong International Airport',
          googleMapsUrl: maps('Hong Kong International Airport'),
          transport: '航班待確認',
          estimatedCost: { amount: 6500, currency: 'TWD' },
        },
        {
          id: 'd1-a2',
          time: '抵達後',
          place: '市區住宿 Check-in',
          activity: '建議住尖沙咀、佐敦、旺角或中上環，方便用港鐵串接主要景點。',
          googleMapsUrl: maps('Tsim Sha Tsui Hong Kong'),
          transport: '機場快線 / 機場巴士 / 的士',
          note: '住宿先列待訂，確認飯店後可替換地址與訂房資訊。',
        },
        {
          id: 'd1-a3',
          time: '傍晚',
          place: '尖沙咀、海港城、星光大道',
          activity: '沿海濱散步，順逛海港城與 K11 MUSEA，等天色轉暗看維港。',
          address: 'Avenue of Stars, Tsim Sha Tsui',
          googleMapsUrl: maps('Avenue of Stars Hong Kong'),
          transport: '港鐵尖沙咀站 / 尖東站',
        },
        {
          id: 'd1-a4',
          time: '20:00',
          place: '幻彩詠香江',
          activity: '在尖沙咀海濱看維港燈光秀，若天氣不好可改到商場或酒吧看夜景。',
          googleMapsUrl: maps('Tsim Sha Tsui Promenade'),
          estimatedCost: { amount: 0, currency: 'HKD' },
        },
      ],
    },
    {
      id: 'day-2',
      day: 2,
      date: '2026-09-02',
      city: '香港迪士尼樂園與夜景備案',
      highlights: ['香港迪士尼樂園', '迪士尼煙火', '太平山頂備案', '維港夜景'],
      activities: [
        {
          id: 'd2-a1',
          time: '上午',
          place: '香港迪士尼樂園',
          activity: '搭港鐵到迪士尼站，入園後先排熱門設施與拍城堡。若想看夜間煙火，這天就以樂園為主行程。',
          googleMapsUrl: maps('Hong Kong Disneyland'),
          transport: '港鐵東涌線轉迪士尼線',
          estimatedCost: { amount: 3000, currency: 'TWD' },
          note: '門票先以台幣暫估，實際票價依日期與購票平台調整。',
        },
        {
          id: 'd2-a2',
          time: '中午到下午',
          place: '樂園午餐與遊行',
          activity: '午餐可在園區內解決，下午安排遊行、商店與室內設施，避開最熱時段。',
          googleMapsUrl: maps('Hong Kong Disneyland restaurants'),
          transport: '園區步行',
        },
        {
          id: 'd2-a3',
          time: '晚上',
          place: '迪士尼夜間煙火',
          activity: '若樂園當天有夜間表演，建議留到最後再離園；回市區後只安排輕鬆宵夜。',
          googleMapsUrl: maps('Hong Kong Disneyland fireworks'),
          transport: '港鐵迪士尼線',
        },
        {
          id: 'd2-a4',
          time: '備案',
          place: '太平山頂或維港夜景',
          activity: '若不看迪士尼夜間煙火，晚餐後可改去太平山或尖沙咀海濱看夜景。',
          googleMapsUrl: maps('Victoria Peak Hong Kong'),
          transport: '山頂纜車 / 15 號巴士 / 的士',
          estimatedCost: { amount: 500, currency: 'TWD' },
          note: '二選一即可，避免迪士尼日排太滿。',
        },
      ],
    },
    {
      id: 'day-3',
      day: 3,
      date: '2026-09-03',
      city: '旺角採買、回程高雄',
      highlights: ['旺角與女人街', '波鞋街', '機場採買', '香港回高雄'],
      activities: [
        {
          id: 'd3-a1',
          time: '上午',
          place: '旺角、波鞋街、女人街',
          activity: '安排最後採買與街區散步，行李多的話可先寄放飯店或車站置物櫃。',
          googleMapsUrl: maps('Mong Kok Hong Kong'),
          transport: '港鐵旺角站',
        },
        {
          id: 'd3-a2',
          time: '中午',
          place: '茶餐廳或燒味午餐',
          activity: '回程前補一餐港式經典，可視住宿位置選附近餐廳。',
          googleMapsUrl: maps('Hong Kong cha chaan teng Mong Kok'),
          estimatedCost: { amount: 100, currency: 'HKD' },
        },
        {
          id: 'd3-a3',
          time: '下午或晚上',
          place: '香港國際機場 HKG -> 高雄小港機場 KHH',
          activity: '前往機場辦理登機，預留交通與退稅、採買時間。',
          googleMapsUrl: maps('Hong Kong International Airport'),
          transport: '機場快線 / 機場巴士 / 航班待確認',
          estimatedCost: { amount: 6500, currency: 'TWD' },
        },
      ],
    },
  ],
  accommodations: [
    {
      id: 'hong-kong-stay',
      hotelName: '香港市區住宿待訂',
      checkIn: '2026-09-01',
      checkOut: '2026-09-03',
      address: '建議區域：尖沙咀、佐敦、旺角、中上環',
      bookingInfo: '飯店、房型、訂房編號與入住時間待確認。',
      googleMapsUrl: maps('Tsim Sha Tsui Hong Kong hotels'),
      price: { amount: 2000, currency: 'TWD' },
      facilities: ['鄰近港鐵', 'WiFi', '可寄放行李', '雙人房待確認'],
    },
  ],
  transports: [
    {
      id: 'khh-hkg',
      type: 'flight',
      title: '高雄 -> 香港',
      from: 'KHH 高雄小港機場',
      to: 'HKG 香港國際機場',
      departureTime: '2026-09-01 待確認',
      arrivalTime: '2026-09-01 待確認',
      ticketNote: '暫以高雄出發規劃，實際航空公司、航班時間與票價待查。',
    },
    {
      id: 'hkg-khh',
      type: 'flight',
      title: '香港 -> 高雄',
      from: 'HKG 香港國際機場',
      to: 'KHH 高雄小港機場',
      departureTime: '2026-09-03 待確認',
      arrivalTime: '2026-09-03 待確認',
      ticketNote: '回程建議選下午或晚上班機，保留最後一天採買時間。',
    },
  ],
  budget: [
    { id: 'flight-ticket', category: 'flight', label: '機票', cost: { amount: 8000, currency: 'TWD' }, note: 'NT$8,000 TWD' },
    { id: 'stay', category: 'accommodation', label: '住宿', cost: { amount: 2000, currency: 'TWD' }, note: 'NT$2,000 TWD' },
    { id: 'local-transport', category: 'transport', label: '交通', cost: { amount: 2000, currency: 'TWD' }, note: 'NT$2,000 TWD' },
    { id: 'disneyland', category: 'ticket', label: '香港迪士尼門票', cost: { amount: 3000, currency: 'TWD' }, note: '暫估，依實際購票日期調整' },
    { id: 'food', category: 'food', label: '餐飲與飲料', cost: { amount: 4000, currency: 'TWD' }, note: 'NT$4,000 TWD' },
  ],
  importantInfo: {
    passportVisa:
      '台灣旅客赴港規定請以出發前官方公告為準；護照效期建議至少 6 個月，並預先確認是否需要入境登記或其他文件。',
    emergencyContact: '香港緊急電話：999。駐香港台北經濟文化辦事處電話：+852-2525-8642。',
    internet: '可事先購買香港 eSIM，或抵達機場後購買上網卡。飯店通常提供 WiFi。',
    currencyNote:
      '香港使用港幣 HKD，八達通可搭港鐵、巴士、電車，也能在便利商店與部分餐飲使用；小店仍建議保留現金。',
    localNotes: ['9 月香港仍偏熱且可能有午後雨，建議帶輕便雨具。', '港鐵與機場快線班次密集，短天數建議減少跨區來回。'],
  },
  emergencyContacts: [
    {
      id: 'taiwan-office',
      category: '台灣辦事處',
      name: '駐香港台北經濟文化辦事處',
      phone: '+852-2525-8642',
      address: 'Hong Kong',
      googleMapsUrl: maps('Taipei Economic and Cultural Office Hong Kong'),
    },
    {
      id: 'hong-kong-emergency',
      category: '緊急電話',
      name: '警察、消防、救護',
      phone: '999',
      address: 'Hong Kong',
      googleMapsUrl: maps('Hong Kong'),
    },
  ],
  mapCollectionUrl:
    'https://www.google.com/maps/search/?api=1&query=Hong+Kong+Tsim+Sha+Tsui+Central+Victoria+Peak+Mong+Kok',
  mapPlaces: [
    { id: 'hkg-airport', category: '交通', name: '香港國際機場', googleMapsUrl: maps('Hong Kong International Airport'), status: 'planned' },
    { id: 'hong-kong-disneyland', category: '離島', name: '香港迪士尼樂園', googleMapsUrl: maps('Hong Kong Disneyland'), status: 'planned' },
    { id: 'tsim-sha-tsui', category: '九龍', name: '尖沙咀', googleMapsUrl: maps('Tsim Sha Tsui Hong Kong'), status: 'planned' },
    { id: 'avenue-stars', category: '九龍', name: '星光大道', googleMapsUrl: maps('Avenue of Stars Hong Kong'), status: 'planned' },
    { id: 'harbour-city', category: '九龍', name: '海港城', googleMapsUrl: maps('Harbour City Hong Kong'), status: 'optional' },
    { id: 'k11-musea', category: '九龍', name: 'K11 MUSEA', googleMapsUrl: maps('K11 MUSEA Hong Kong'), status: 'optional' },
    { id: 'central', category: '港島', name: '中環', googleMapsUrl: maps('Central Hong Kong'), status: 'planned' },
    { id: 'mid-levels', category: '港島', name: '中環半山手扶梯', googleMapsUrl: maps('Central Mid-Levels Escalator Hong Kong'), status: 'planned' },
    { id: 'tai-kwun', category: '港島', name: '大館', googleMapsUrl: maps('Tai Kwun Hong Kong'), status: 'planned' },
    { id: 'pmq', category: '港島', name: 'PMQ 元創方', googleMapsUrl: maps('PMQ Hong Kong'), status: 'optional' },
    { id: 'victoria-peak', category: '港島', name: '太平山頂', googleMapsUrl: maps('Victoria Peak Hong Kong'), status: 'planned' },
    { id: 'causeway-bay', category: '港島', name: '銅鑼灣', googleMapsUrl: maps('Causeway Bay Hong Kong'), status: 'optional' },
    { id: 'mong-kok', category: '九龍', name: '旺角', googleMapsUrl: maps('Mong Kok Hong Kong'), status: 'planned' },
    { id: 'sneaker-street', category: '九龍', name: '波鞋街', googleMapsUrl: maps('Sneaker Street Hong Kong'), status: 'planned' },
    { id: 'ladies-market', category: '九龍', name: '女人街', googleMapsUrl: maps('Ladies Market Hong Kong'), status: 'planned' },
  ],
  foodRecommendations: [
    {
      category: '港式經典',
      restaurants: [
        { id: 'australia-dairy', name: '澳洲牛奶公司', recommendedItems: '炒蛋、多士、燉奶', googleMapsUrl: maps('Australia Dairy Company Hong Kong'), photoUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=900&q=80', rating: '人氣名店', hours: '出發前以 Google Maps 為準', averageSpend: 'HK$60-120 / 人', reservationStatus: 'walkIn' },
        { id: 'kam-wah', name: '金華冰廳', recommendedItems: '菠蘿油、蛋撻、奶茶', googleMapsUrl: maps('Kam Wah Cafe Hong Kong'), photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80', rating: '人氣名店', hours: '出發前以 Google Maps 為準', averageSpend: 'HK$50-100 / 人', reservationStatus: 'walkIn' },
      ],
    },
    {
      category: '燒味與點心',
      restaurants: [
        { id: 'yat-lok', name: '一樂燒鵝', recommendedItems: '燒鵝、燒味飯', googleMapsUrl: maps('Yat Lok Restaurant Hong Kong'), photoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80', rating: '米其林推薦', hours: '出發前以 Google Maps 為準', averageSpend: 'HK$100-200 / 人', reservationStatus: 'walkIn' },
        { id: 'tim-ho-wan', name: '添好運', recommendedItems: '酥皮焗叉燒包、點心', googleMapsUrl: maps('Tim Ho Wan Hong Kong'), photoUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=80', rating: '人氣點心', hours: '出發前以 Google Maps 為準', averageSpend: 'HK$100-180 / 人', reservationStatus: 'available' },
      ],
    },
    {
      category: '甜品與宵夜',
      restaurants: [
        { id: 'kai-kai', name: '佳佳甜品', recommendedItems: '芝麻糊、湯圓、糖水', googleMapsUrl: maps('Kai Kai Dessert Hong Kong'), photoUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80', rating: '人氣甜品', hours: '出發前以 Google Maps 為準', averageSpend: 'HK$40-80 / 人', reservationStatus: 'walkIn' },
        { id: 'temple-street', name: '廟街夜市周邊', recommendedItems: '煲仔飯、海鮮、宵夜', googleMapsUrl: maps('Temple Street Night Market Hong Kong'), photoUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80', rating: '夜市區域', hours: '出發前以 Google Maps 為準', averageSpend: 'HK$100-250 / 人', reservationStatus: 'walkIn' },
      ],
    },
  ],
  flightTracks: [
    {
      id: 'khh-hkg-track',
      direction: '去程',
      airline: '待確認',
      flightNumber: '待確認',
      from: 'KHH 高雄',
      to: 'HKG 香港',
      departureTime: '2026-09-01 待確認',
      arrivalTime: '2026-09-01 待確認',
      flightRadarUrl: 'https://www.flightradar24.com/data/airports/khh',
      flightAwareUrl: 'https://www.flightaware.com/live/airport/RCKH',
      airlineUrl: 'https://www.hongkongairport.com/',
      airportUrl: 'https://www.hongkongairport.com/',
    },
  ],
  eveningPlans: [
    { id: 'evening-harbour', title: '維港夜景', area: '尖沙咀', note: '第一晚最適合安排，距離市區飯店近。', googleMapsUrl: maps('Victoria Harbour Hong Kong') },
    { id: 'evening-peak', title: '太平山夜景', area: '山頂', note: '天氣好時放 Day 2，若雲霧重可改中環酒吧或海濱。', googleMapsUrl: maps('Victoria Peak Hong Kong') },
  ],
  nightViews: [
    { id: 'night-avenue-stars', title: '星光大道', area: '尖沙咀', note: '近距離看維港天際線，免費且彈性最高。', googleMapsUrl: maps('Avenue of Stars Hong Kong') },
    { id: 'night-sky100', title: 'Sky100', area: '西九龍', note: '室內觀景選項，雨天備案。', googleMapsUrl: maps('Sky100 Hong Kong') },
    { id: 'night-peak', title: '太平山頂', area: '港島', note: '經典高處夜景，需預留排隊與交通時間。', googleMapsUrl: maps('Victoria Peak Hong Kong') },
  ],
  transportGuides: [
    {
      id: 'airport-express',
      title: '機場快線',
      subtitle: '機場往市區最快選項',
      points: ['到香港站或九龍站後轉港鐵、的士或飯店接駁。', '票價較高，但短天數可以省時間。'],
    },
    {
      id: 'octopus',
      title: '八達通',
      subtitle: '香港交通與小額付款核心',
      points: ['可搭港鐵、巴士、電車與天星小輪。', '便利商店與部分餐飲也能使用，仍建議帶少量現金。'],
    },
    {
      id: 'mtr',
      title: '港鐵',
      subtitle: '主要景點移動首選',
      points: ['尖沙咀、中環、旺角、銅鑼灣都很方便。', '尖沙咀與尖東站步行轉乘要預留一點時間。'],
    },
  ],
};
