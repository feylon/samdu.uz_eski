import { AnnouncementType } from '../../common/enums/announcement-type.enum';
import { Locale } from '../../common/enums/locale.enum';

type Tri<T> = Record<Locale, T>;

export interface SeedMenu {
  title: Tri<string>;
  url?: string;
  isExternal?: boolean;
  icon?: string;
  children?: SeedMenu[];
}

export const tri = <T>(uz: T, ru: T, en: T): Tri<T> => ({ uz, ru, en });

export const slidesSeed = [
  {
    image: '/images/hero-1.svg',
    link: '/about',
    title: tri(
      'Samarqand davlat universiteti',
      'Самаркандский государственный университет',
      'Samarkand State University',
    ),
    subtitle: tri(
      'Bilim, ilm-fan va innovatsiyalar markazi — 1927-yildan buyon',
      'Центр знаний, науки и инноваций — с 1927 года',
      'A centre of knowledge, science and innovation since 1927',
    ),
    buttonText: tri('Universitet haqida', 'Об университете', 'About the university'),
  },
  {
    image: '/images/hero-2.svg',
    link: '/announcements?type=admission',
    title: tri('Qabul — 2025', 'Приём — 2025', 'Admissions 2025'),
    subtitle: tri(
      'Bakalavriat va magistratura yo\'nalishlariga hujjatlar qabuli boshlandi',
      'Начат приём документов на бакалавриат и магистратуру',
      'Applications for bachelor\'s and master\'s programmes are now open',
    ),
    buttonText: tri('Batafsil', 'Подробнее', 'Learn more'),
  },
  {
    image: '/images/hero-3.svg',
    link: '/faculties',
    title: tri('Fakultetlar va kafedralar', 'Факультеты и кафедры', 'Faculties and departments'),
    subtitle: tri(
      'Tabiiy, ijtimoiy-gumanitar va aniq fanlar bo\'yicha keng yo\'nalishlar',
      'Широкий спектр направлений естественных, гуманитарных и точных наук',
      'A wide range of programmes in natural sciences, humanities and exact sciences',
    ),
    buttonText: tri('Fakultetlar', 'Факультеты', 'Faculties'),
  },
];

const paragraph = (uz: string, ru: string, en: string): Tri<string> =>
  tri(`<p>${uz}</p>`, `<p>${ru}</p>`, `<p>${en}</p>`);

export const newsSeed = [
  {
    slug: 'yangi-oquv-yili-boshlanishi',
    category: 'university',
    coverImage: '/images/news-1.svg',
    isFeatured: true,
    publishedAt: '2025-07-28T09:00:00.000Z',
    title: tri(
      'Universitetda yangi o\'quv yiliga tayyorgarlik ko\'rilmoqda',
      'В университете идёт подготовка к новому учебному году',
      'The university is preparing for the new academic year',
    ),
    summary: tri(
      'O\'quv binolari, laboratoriyalar va talabalar turar joylari yangi o\'quv yiliga tayyorlanmoqda.',
      'Учебные корпуса, лаборатории и общежития готовятся к новому учебному году.',
      'Academic buildings, laboratories and dormitories are being prepared for the new academic year.',
    ),
    content: paragraph(
      'Universitet rahbariyati yangi o\'quv yiliga tayyorgarlik jarayonini ko\'zdan kechirdi. Auditoriyalar zamonaviy jihozlar bilan ta\'minlanmoqda.',
      'Руководство университета ознакомилось с ходом подготовки к новому учебному году. Аудитории оснащаются современным оборудованием.',
      'The university leadership reviewed preparations for the new academic year. Classrooms are being equipped with modern facilities.',
    ),
  },
  {
    slug: 'xalqaro-ilmiy-konferensiya-2025',
    category: 'science',
    coverImage: '/images/news-2.svg',
    isFeatured: true,
    publishedAt: '2025-07-15T10:30:00.000Z',
    title: tri(
      'Xalqaro ilmiy-amaliy konferensiya muvaffaqiyatli o\'tkazildi',
      'Успешно проведена международная научно-практическая конференция',
      'International scientific conference successfully held',
    ),
    summary: tri(
      'Konferensiyada 15 dan ortiq davlatdan olimlar ishtirok etdi.',
      'В конференции приняли участие учёные из более чем 15 стран.',
      'Scholars from more than 15 countries took part in the conference.',
    ),
    content: paragraph(
      'Konferensiya doirasida tabiiy va gumanitar fanlarning dolzarb masalalari muhokama qilindi, hamkorlik memorandumlari imzolandi.',
      'В рамках конференции обсуждены актуальные вопросы естественных и гуманитарных наук, подписаны меморандумы о сотрудничестве.',
      'Topical issues of natural sciences and humanities were discussed, and memoranda of cooperation were signed.',
    ),
  },
  {
    slug: 'hamkorlik-memorandumi-imzolandi',
    category: 'international',
    coverImage: '/images/news-3.svg',
    isFeatured: false,
    publishedAt: '2025-06-24T08:00:00.000Z',
    title: tri(
      'Xorijiy universitet bilan hamkorlik memorandumi imzolandi',
      'Подписан меморандум о сотрудничестве с зарубежным университетом',
      'Memorandum of cooperation signed with a foreign university',
    ),
    summary: tri(
      'Memorandum talabalar va professor-o\'qituvchilar almashinuvini nazarda tutadi.',
      'Меморандум предусматривает обмен студентами и преподавателями.',
      'The memorandum provides for student and faculty exchange.',
    ),
    content: paragraph(
      'Hamkorlik doirasida qo\'shma ta\'lim dasturlari va ilmiy loyihalar amalga oshiriladi.',
      'В рамках сотрудничества будут реализованы совместные образовательные программы и научные проекты.',
      'Joint educational programmes and research projects will be implemented within the partnership.',
    ),
  },
  {
    slug: 'talabalar-sport-musobaqasi',
    category: 'student-life',
    coverImage: '/images/news-4.svg',
    isFeatured: false,
    publishedAt: '2025-06-02T12:00:00.000Z',
    title: tri(
      'Talabalar o\'rtasida sport musobaqalari yakunlandi',
      'Завершились спортивные соревнования среди студентов',
      'Student sports competitions have concluded',
    ),
    summary: tri(
      'Musobaqalarda barcha fakultetlar jamoalari ishtirok etdi.',
      'В соревнованиях участвовали команды всех факультетов.',
      'Teams from all faculties took part in the competitions.',
    ),
    content: paragraph(
      'G\'olib jamoalar diplom va esdalik sovg\'alari bilan taqdirlandi.',
      'Команды-победители награждены дипломами и памятными подарками.',
      'Winning teams were awarded diplomas and souvenirs.',
    ),
  },
  {
    slug: 'yangi-ilmiy-laboratoriya-ochildi',
    category: 'science',
    coverImage: '/images/news-5.svg',
    isFeatured: false,
    publishedAt: '2025-05-19T09:15:00.000Z',
    title: tri(
      'Yangi zamonaviy ilmiy laboratoriya ochildi',
      'Открыта новая современная научная лаборатория',
      'A new modern research laboratory has opened',
    ),
    summary: tri(
      'Laboratoriya biotexnologiya va kimyo yo\'nalishidagi tadqiqotlar uchun mo\'ljallangan.',
      'Лаборатория предназначена для исследований в области биотехнологии и химии.',
      'The laboratory is designed for research in biotechnology and chemistry.',
    ),
    content: paragraph(
      'Laboratoriya xalqaro standartlarga javob beradigan uskunalar bilan jihozlangan.',
      'Лаборатория оснащена оборудованием, соответствующим международным стандартам.',
      'The laboratory is equipped with instruments meeting international standards.',
    ),
  },
  {
    slug: 'bitiruvchilar-bilan-uchrashuv',
    category: 'university',
    coverImage: '/images/news-6.svg',
    isFeatured: false,
    publishedAt: '2025-04-30T11:00:00.000Z',
    title: tri(
      'Bitiruvchilar bilan an\'anaviy uchrashuv bo\'lib o\'tdi',
      'Состоялась традиционная встреча с выпускниками',
      'Traditional alumni meeting held',
    ),
    summary: tri(
      'Uchrashuvda turli sohalarda faoliyat yuritayotgan bitiruvchilar tajriba almashdi.',
      'Выпускники, работающие в разных сферах, поделились опытом.',
      'Alumni working in various fields shared their experience.',
    ),
    content: paragraph(
      'Bitiruvchilar talabalarga kasbiy maslahatlar berib, universitetga minnatdorchilik bildirdi.',
      'Выпускники дали студентам профессиональные советы и выразили благодарность университету.',
      'Alumni gave students career advice and expressed their gratitude to the university.',
    ),
  },
];

export const announcementsSeed = [
  {
    slug: 'qabul-2025-hujjatlar',
    type: AnnouncementType.ADMISSION,
    isPinned: true,
    eventDate: '2025-08-01T09:00:00.000Z',
    deadline: '2025-08-25T18:00:00.000Z',
    publishedAt: '2025-07-20T08:00:00.000Z',
    title: tri('2025/2026 o\'quv yili uchun qabul', 'Приём на 2025/2026 учебный год', 'Admissions for the 2025/2026 academic year'),
    summary: tri(
      'Bakalavriat va magistraturaga hujjatlar onlayn qabul qilinadi.',
      'Документы на бакалавриат и магистратуру принимаются онлайн.',
      'Applications for bachelor\'s and master\'s programmes are accepted online.',
    ),
    content: paragraph(
      'Hujjatlar my.uzbmb.uz platformasi orqali topshiriladi.',
      'Документы подаются через платформу my.uzbmb.uz.',
      'Applications are submitted via the my.uzbmb.uz platform.',
    ),
    location: tri('Qabul komissiyasi, bosh bino', 'Приёмная комиссия, главный корпус', 'Admissions office, main building'),
  },
  {
    slug: 'yosh-olimlar-konferensiyasi',
    type: AnnouncementType.CONFERENCE,
    isPinned: false,
    eventDate: '2025-09-18T10:00:00.000Z',
    deadline: '2025-09-01T23:59:00.000Z',
    publishedAt: '2025-07-10T08:00:00.000Z',
    title: tri('Yosh olimlar respublika konferensiyasi', 'Республиканская конференция молодых учёных', 'National conference of young scientists'),
    summary: tri('Maqolalar qabuli davom etmoqda.', 'Продолжается приём статей.', 'Paper submissions are open.'),
    content: paragraph(
      'Konferensiya materiallari to\'plam shaklida nashr etiladi.',
      'Материалы конференции будут опубликованы в сборнике.',
      'Conference proceedings will be published as a collection.',
    ),
    location: tri('Majlislar zali', 'Актовый зал', 'Assembly hall'),
  },
  {
    slug: 'ochiq-eshiklar-kuni',
    type: AnnouncementType.EVENT,
    isPinned: false,
    eventDate: '2025-07-31T10:00:00.000Z',
    deadline: null,
    publishedAt: '2025-07-05T08:00:00.000Z',
    title: tri('Ochiq eshiklar kuni', 'День открытых дверей', 'Open day'),
    summary: tri(
      'Abituriyentlar va ota-onalar universitet bilan yaqindan tanishadi.',
      'Абитуриенты и родители смогут поближе познакомиться с университетом.',
      'Applicants and parents can get to know the university up close.',
    ),
    content: paragraph(
      'Fakultetlar taqdimoti, laboratoriyalarga sayohat va savol-javoblar.',
      'Презентации факультетов, экскурсии по лабораториям, вопросы и ответы.',
      'Faculty presentations, laboratory tours and Q&A sessions.',
    ),
    location: tri('Universitet xiyoboni, 15', 'Университетский бульвар, 15', '15 University Boulevard'),
  },
  {
    slug: 'professor-oqituvchilar-tanlovi',
    type: AnnouncementType.VACANCY,
    isPinned: false,
    eventDate: null,
    deadline: '2025-08-15T18:00:00.000Z',
    publishedAt: '2025-06-28T08:00:00.000Z',
    title: tri(
      'Professor-o\'qituvchilar lavozimlariga tanlov',
      'Конкурс на замещение должностей ППС',
      'Competition for academic staff positions',
    ),
    summary: tri('Bo\'sh lavozimlar ro\'yxati e\'lon qilindi.', 'Объявлен список вакантных должностей.', 'The list of vacancies has been announced.'),
    content: paragraph(
      'Hujjatlar kadrlar bo\'limiga topshiriladi.',
      'Документы принимаются в отделе кадров.',
      'Documents are accepted by the HR department.',
    ),
    location: tri('Kadrlar bo\'limi', 'Отдел кадров', 'HR department'),
  },
];

export const facultiesSeed = [
  {
    slug: 'matematika',
    icon: 'sigma',
    studentsCount: 1450,
    name: tri('Matematika fakulteti', 'Факультет математики', 'Faculty of Mathematics'),
    short: tri(
      'Matematika, amaliy matematika va mexanika yo\'nalishlari',
      'Математика, прикладная математика и механика',
      'Mathematics, applied mathematics and mechanics',
    ),
    departments: [
      tri('Algebra va geometriya kafedrasi', 'Кафедра алгебры и геометрии', 'Department of Algebra and Geometry'),
      tri('Matematik analiz kafedrasi', 'Кафедра математического анализа', 'Department of Mathematical Analysis'),
      tri('Differensial tenglamalar kafedrasi', 'Кафедра дифференциальных уравнений', 'Department of Differential Equations'),
    ],
  },
  {
    slug: 'fizika',
    icon: 'atom',
    studentsCount: 980,
    name: tri('Fizika fakulteti', 'Физический факультет', 'Faculty of Physics'),
    short: tri('Fizika, astronomiya va energetika', 'Физика, астрономия и энергетика', 'Physics, astronomy and energy'),
    departments: [
      tri('Nazariy fizika kafedrasi', 'Кафедра теоретической физики', 'Department of Theoretical Physics'),
      tri('Yarimo\'tkazgichlar fizikasi kafedrasi', 'Кафедра физики полупроводников', 'Department of Semiconductor Physics'),
    ],
  },
  {
    slug: 'kimyo',
    icon: 'flask-conical',
    studentsCount: 860,
    name: tri('Kimyo fakulteti', 'Химический факультет', 'Faculty of Chemistry'),
    short: tri('Kimyo va kimyoviy texnologiya', 'Химия и химическая технология', 'Chemistry and chemical technology'),
    departments: [
      tri('Organik kimyo kafedrasi', 'Кафедра органической химии', 'Department of Organic Chemistry'),
      tri('Analitik kimyo kafedrasi', 'Кафедра аналитической химии', 'Department of Analytical Chemistry'),
    ],
  },
  {
    slug: 'biologiya',
    icon: 'leaf',
    studentsCount: 1120,
    name: tri('Biologiya fakulteti', 'Биологический факультет', 'Faculty of Biology'),
    short: tri('Biologiya, biotexnologiya va ekologiya', 'Биология, биотехнология и экология', 'Biology, biotechnology and ecology'),
    departments: [
      tri('Botanika kafedrasi', 'Кафедра ботаники', 'Department of Botany'),
      tri('Zoologiya kafedrasi', 'Кафедра зоологии', 'Department of Zoology'),
    ],
  },
  {
    slug: 'tarix',
    icon: 'landmark',
    studentsCount: 1300,
    name: tri('Tarix fakulteti', 'Исторический факультет', 'Faculty of History'),
    short: tri('Tarix, arxeologiya va muzeyshunoslik', 'История, археология и музееведение', 'History, archaeology and museum studies'),
    departments: [
      tri('O\'zbekiston tarixi kafedrasi', 'Кафедра истории Узбекистана', 'Department of the History of Uzbekistan'),
      tri('Arxeologiya kafedrasi', 'Кафедра археологии', 'Department of Archaeology'),
    ],
  },
  {
    slug: 'filologiya',
    icon: 'book-open',
    studentsCount: 1600,
    name: tri('Filologiya fakulteti', 'Филологический факультет', 'Faculty of Philology'),
    short: tri('O\'zbek tili va adabiyoti', 'Узбекский язык и литература', 'Uzbek language and literature'),
    departments: [
      tri('O\'zbek tilshunosligi kafedrasi', 'Кафедра узбекского языкознания', 'Department of Uzbek Linguistics'),
      tri('O\'zbek adabiyoti kafedrasi', 'Кафедра узбекской литературы', 'Department of Uzbek Literature'),
    ],
  },
  {
    slug: 'xorijiy-filologiya',
    icon: 'languages',
    studentsCount: 1750,
    name: tri('Xorijiy filologiya fakulteti', 'Факультет иностранной филологии', 'Faculty of Foreign Philology'),
    short: tri('Ingliz, nemis, fransuz tillari', 'Английский, немецкий, французский языки', 'English, German and French'),
    departments: [
      tri('Ingliz tili kafedrasi', 'Кафедра английского языка', 'Department of English'),
      tri('Roman-german filologiyasi kafedrasi', 'Кафедра романо-германской филологии', 'Department of Romance and Germanic Philology'),
    ],
  },
  {
    slug: 'iqtisodiyot',
    icon: 'trending-up',
    studentsCount: 1400,
    name: tri('Iqtisodiyot fakulteti', 'Экономический факультет', 'Faculty of Economics'),
    short: tri('Iqtisodiyot, menejment va moliya', 'Экономика, менеджмент и финансы', 'Economics, management and finance'),
    departments: [
      tri('Iqtisodiyot nazariyasi kafedrasi', 'Кафедра экономической теории', 'Department of Economic Theory'),
      tri('Moliya kafedrasi', 'Кафедра финансов', 'Department of Finance'),
    ],
  },
  {
    slug: 'yuridik',
    icon: 'scale',
    studentsCount: 900,
    name: tri('Yuridik fakultet', 'Юридический факультет', 'Faculty of Law'),
    short: tri('Huquqshunoslik', 'Юриспруденция', 'Jurisprudence'),
    departments: [
      tri('Davlat va huquq nazariyasi kafedrasi', 'Кафедра теории государства и права', 'Department of Theory of State and Law'),
    ],
  },
  {
    slug: 'raqamli-texnologiyalar',
    icon: 'cpu',
    studentsCount: 1250,
    name: tri('Raqamli texnologiyalar fakulteti', 'Факультет цифровых технологий', 'Faculty of Digital Technologies'),
    short: tri(
      'Kompyuter ilmlari, dasturiy injiniring va sun\'iy intellekt',
      'Компьютерные науки, программная инженерия и ИИ',
      'Computer science, software engineering and AI',
    ),
    departments: [
      tri('Dasturiy injiniring kafedrasi', 'Кафедра программной инженерии', 'Department of Software Engineering'),
      tri('Sun\'iy intellekt kafedrasi', 'Кафедра искусственного интеллекта', 'Department of Artificial Intelligence'),
    ],
  },
];

export const headerMenuSeed: SeedMenu[] = [
  {
    title: tri('Universitet', 'Университет', 'University'),
    url: '/about',
    children: [
      { title: tri('Universitet haqida', 'Об университете', 'About'), url: '/about' },
      { title: tri('Tarix', 'История', 'History'), url: '/about#history' },
      { title: tri('Missiya', 'Миссия', 'Mission'), url: '/about#mission' },
      { title: tri('Fakultetlar', 'Факультеты', 'Faculties'), url: '/faculties' },
    ],
  },
  {
    title: tri('Faoliyat', 'Деятельность', 'Activities'),
    children: [
      {
        title: tri('Ilmiy faoliyat', 'Научная деятельность', 'Research'),
        url: '/news?category=science',
        children: [
          { title: tri('Konferensiyalar', 'Конференции', 'Conferences'), url: '/announcements?type=conference' },
          { title: tri('Ilmiy yangiliklar', 'Научные новости', 'Science news'), url: '/news?category=science' },
        ],
      },
      { title: tri('Xalqaro aloqalar', 'Международные связи', 'International relations'), url: '/news?category=international' },
      { title: tri('Talabalar hayoti', 'Студенческая жизнь', 'Student life'), url: '/news?category=student-life' },
    ],
  },
  {
    title: tri('Abituriyentlarga', 'Абитуриентам', 'Applicants'),
    children: [
      { title: tri('Qabul 2025', 'Приём 2025', 'Admissions 2025'), url: '/announcements?type=admission' },
      { title: tri('Fakultetlar', 'Факультеты', 'Faculties'), url: '/faculties' },
      { title: tri('Vakansiyalar', 'Вакансии', 'Vacancies'), url: '/announcements?type=vacancy' },
    ],
  },
  { title: tri('Yangiliklar', 'Новости', 'News'), url: '/news' },
  { title: tri('E\'lonlar', 'Объявления', 'Announcements'), url: '/announcements' },
  { title: tri('Fakultetlar', 'Факультеты', 'Faculties'), url: '/faculties' },
];

export const footerMenuSeed: SeedMenu[] = [
  { title: tri('Hukumat portali', 'Правительственный портал', 'Government portal'), url: 'https://gov.uz', isExternal: true },
  {
    title: tri('Oliy ta\'lim vazirligi', 'Министерство высшего образования', 'Ministry of Higher Education'),
    url: 'https://edu.uz',
    isExternal: true,
  },
  { title: tri('Qonunchilik bazasi', 'База законодательства', 'Legislation database'), url: 'https://lex.uz', isExternal: true },
  { title: tri('Davlat xizmatlari', 'Госуслуги', 'Public services'), url: 'https://my.gov.uz', isExternal: true },
];
