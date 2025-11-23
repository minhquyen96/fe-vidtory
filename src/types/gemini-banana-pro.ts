export enum AppMode {
  COMIC = 'COMIC',
  ADVERTISING = 'ADVERTISING',
  INFOGRAPHIC = 'INFOGRAPHIC',
}

export type Language = 'en' | 'vi'

export interface GenerationState {
  isLoading: boolean
  resultImage: string | null
  error: string | null
}

export interface BaseInputState {
  description: string
  style: string
  referenceImages: File[]
  aspectRatio: string // New field
}

// Specialized inputs extending base
export interface ComicInputs extends BaseInputState {
  story: string
  frameCount: number
  selectedManga: string
  taskAction: string
}

export interface AdInputs extends BaseInputState {
  brandName: string
  headline: string
  targetAudience: string
}

export interface InfoInputs extends BaseInputState {
  topic: string
  dataPoints: string
}

export type InputUnion = ComicInputs | AdInputs | InfoInputs

export interface HistoryItem {
  id: string
  url: string
  mode: AppMode
  params: InputUnion
  timestamp: number
}

// Localized Data
export const STYLE_PRESETS = {
  en: {
    [AppMode.COMIC]: [
      'Modern Manga',
      'American Superhero',
      'Noir',
      'Line Art',
      'Watercolor',
      'Webtoon',
    ],
    [AppMode.ADVERTISING]: [
      'Minimalist',
      'Luxury',
      'Pop Art',
      'Corporate',
      'Cyberpunk',
    ],
    [AppMode.INFOGRAPHIC]: [
      'Flat Design',
      'Isometric',
      'Hand Drawn',
      'Corporate Clean',
      'Neon Data',
    ],
  },
  vi: {
    [AppMode.COMIC]: [
      'Manga Hiện Đại',
      'Siêu Anh Hùng Mỹ',
      'Phim Noir',
      'Nét Vẽ Line Art',
      'Màu Nước',
      'Webtoon',
    ],
    [AppMode.ADVERTISING]: [
      'Tối Giản',
      'Sang Trọng',
      'Pop Art',
      'Doanh Nghiệp',
      'Cyberpunk',
    ],
    [AppMode.INFOGRAPHIC]: [
      'Thiết Kế Phẳng',
      'Góc Nhìn 3D',
      'Vẽ Tay',
      'Doanh Nghiệp Sạch',
      'Dữ Liệu Neon',
    ],
  },
}

export const POPULAR_MANGA_STYLES = [
  'Any Style',
  'Dragon Ball',
  'One Piece',
  'Naruto',
  'Attack on Titan',
  "JoJo's Bizarre Adventure",
  'Sailor Moon',
  'Demon Slayer',
  'My Hero Academia',
  'Bleach',
  'Studio Ghibli',
  'Junji Ito',
  'Berserk',
]

// New Task Actions for Comics
export const TASK_ACTIONS = {
  en: [
    {
      id: 'story',
      label: 'New Story',
      prompt: 'Visualize a new story based on the description.',
    },
    {
      id: 'continue',
      label: 'Continue Next Page',
      prompt:
        'The reference images are the previous pages. Draw the IMMEDIATE NEXT PAGE in the sequence.',
    },
    {
      id: 'mix',
      label: 'Mix Characters',
      prompt:
        'Blend the visual elements and characters from the reference images into a new visual scenario.',
    },
    {
      id: 'remake',
      label: 'Remake Style',
      prompt:
        'Keep the composition of the reference image but redraw it in the selected art style.',
    },
  ],
  vi: [
    {
      id: 'story',
      label: 'Sáng Tác Mới',
      prompt: 'Tạo một câu chuyện hoàn toàn mới dựa trên mô tả.',
    },
    {
      id: 'continue',
      label: 'Vẽ Trang Tiếp Theo',
      prompt:
        'Ảnh tham khảo là trang trước đó. Hãy vẽ TRANG TIẾP THEO của câu chuyện này.',
    },
    {
      id: 'mix',
      label: 'Mix Nhân Vật/Bối Cảnh',
      prompt:
        'Kết hợp các yếu tố hình ảnh và nhân vật từ ảnh tham khảo vào một kịch bản mới.',
    },
    {
      id: 'remake',
      label: 'Vẽ Lại Style Khác',
      prompt:
        'Giữ nguyên bố cục của ảnh tham khảo nhưng vẽ lại theo phong cách nghệ thuật đã chọn.',
    },
  ],
}

export interface StoryIdea {
  short: string
  full: string
}

export const STORY_IDEAS = {
  en: [
    {
      short: 'Cyberpunk Detective',
      full: 'A noir cyberpunk detective scene where a rugged investigator examines a glowing holographic clue in a rainy, neon-lit alleyway.',
    },
    {
      short: 'Wizard Library',
      full: 'A wide shot of a magical library with floating books, glowing runes, and a young wizard casting a spell that spirals into light.',
    },
    {
      short: 'Cat President',
      full: 'A serious press conference where the newly elected President is a fluffy orange cat. Reporters are holding out microphones, and the cat is knocking a glass of water off the podium.',
    },
    {
      short: 'Zombie Barista',
      full: "A tired zombie barista trying to make intricate latte art for a hipster vampire customer in a spooky coffee shop. The zombie's arm is falling off.",
    },
    {
      short: 'Alien Tourist',
      full: 'An alien tourist wearing a Hawaiian shirt and holding a camera, looking confused at a cow in a field, thinking it\'s the dominant species.',
    },
    {
      short: 'Cozy Cat Cafe',
      full: 'A warm, slice-of-life scene inside a sunny cat cafe. Detailed pastries on tables, cats sleeping on shelves, and customers chatting happily.',
    },
    {
      short: 'Space Battle',
      full: 'An intense sci-fi space battle. A small rebel fighter ship dodging laser beams from a massive dreadnought near a collapsing blue star.',
    },
  ],
  vi: [
    {
      short: 'Thám Tử Cyberpunk',
      full: 'Cảnh thám tử cyberpunk đen tối, nơi một điều tra viên gai góc đang kiểm tra manh mối hình ba chiều phát sáng trong con hẻm mưa, ngập tràn ánh đèn neon.',
    },
    {
      short: 'Thư Viện Phù Thủy',
      full: 'Góc rộng của một thư viện phép thuật với những cuốn sách trôi nổi, cổ ngữ phát sáng và một phù thủy trẻ đang niệm chú tạo ra vòng xoáy ánh sáng.',
    },
    {
      short: 'Mèo Tổng Thống',
      full: 'Một cuộc họp báo nghiêm túc nơi Tổng thống mới đắc cử là một chú mèo mướp màu cam. Các phóng viên đang đưa micro, còn chú mèo thì đang gạt ly nước rơi khỏi bục phát biểu.',
    },
    {
      short: 'Zombie Pha Chế',
      full: 'Một zombie mệt mỏi đang cố gắng vẽ hình nghệ thuật trên ly latte cho một khách hàng ma cà rồng sành điệu. Tay của zombie sắp rụng ra.',
    },
    {
      short: 'Khách Du Lịch Alien',
      full: 'Một người ngoài hành tinh mặc áo sơ mi Hawaii cầm máy ảnh, nhìn chằm chằm vào một con bò trên đồng cỏ với vẻ bối rối, tưởng đó là loài thống trị trái đất.',
    },
    {
      short: 'Cà Phê Mèo',
      full: 'Một cảnh đời thường ấm áp bên trong quán cà phê mèo đầy nắng. Bánh ngọt chi tiết trên bàn, mèo ngủ trên kệ và khách hàng trò chuyện vui vẻ.',
    },
    {
      short: 'Chiến Tranh Vũ Trụ',
      full: 'Trận chiến không gian khoa học viễn tưởng dữ dội. Một tàu chiến đấu nhỏ của quân nổi dậy né tránh các chùm tia laser từ một tàu dreadnought khổng lồ gần một ngôi sao xanh đang sụp đổ.',
    },
  ],
}

export const TRANSLATIONS = {
  en: {
    modes: {
      [AppMode.COMIC]: 'Comic Creator',
      [AppMode.ADVERTISING]: 'Ad Designer',
      [AppMode.INFOGRAPHIC]: 'Infographic',
    },
    sidebar: {
      [AppMode.COMIC]: 'Comic',
      [AppMode.ADVERTISING]: 'Ads',
      [AppMode.INFOGRAPHIC]: 'Info',
    },
    labels: {
      story: 'Story Idea',
      refImages: 'Reference Images',
      mangaRef: 'Manga Style',
      artStyle: 'Art Style',
      layout: 'Frame Count',
      task: 'Task Mode',
      brand: 'Brand Name',
      headline: 'Headline',
      desc: 'Description',
      target: 'Target Audience',
      topic: 'Main Topic',
      data: 'Data Points',
      summary: 'Summary',
      generate: 'Generate',
      generating: 'Creating...',
      history: 'Session Gallery',
      addRef: 'Add Ref',
      selectKey: 'Select API Key',
      accessRequired: 'Access Required',
      billingText: 'Please select an API key to continue.',
      download: 'Download',
      delete: 'Delete',
      remix: 'Remix',
      upgrade: 'Upgrade',
      optional: '(Optional)',
      required: '(Required)',
      selectOption: 'Select an option...',
      aspectRatio: 'Image Ratio',
      artDirection: 'Art Direction',
    },
    tooltips: {
      story:
        'Describe the plot, characters, and setting for your comic page. Be descriptive!',
      refImages: 'Upload images to control character look or color palette.',
      task: 'Choose how the AI should use your reference images (e.g., continue story, mix style).',
      mangaRef:
        'Select a famous manga style to strongly influence the drawing technique.',
      artStyle: 'Choose a general artistic finish (e.g., Watercolor, Noir).',
      artDirection: 'Select the artistic direction for the design.',
      layout: 'How many panels do you want on this single page?',
      brand: 'The name of the company or product you are advertising.',
      headline: 'The main catchy text that will appear on the ad.',
      desc: 'Details about the product, service, or the visual scene you want.',
      target:
        'Who is this ad for? (e.g., Gamers, Professionals) - Helps AI choose the right tone.',
      topic: 'The main subject of your infographic.',
      data: 'List the key statistics, facts, or steps you want visualized.',
      summary: 'A brief overview or context for the information.',
      aspectRatio: 'Select the shape of the generated image.',
      guideStart: 'Start here! Describe your story idea.',
    },
    placeholders: {
      story: 'Describe your comic page plot...',
      brand: 'e.g., NeonEnergy',
      headline: 'e.g., Unleash Your Power',
      desc: 'Describe the product or visual...',
      target: 'e.g., Gamers, Athletes',
      topic: 'e.g., Lifecycle of a Star',
      data: 'e.g., Nebula, Protostar, Red Giant',
      summary: 'Context for the viewer...',
    },
  },
  vi: {
    modes: {
      [AppMode.COMIC]: 'Tạo Truyện Tranh',
      [AppMode.ADVERTISING]: 'Thiết Kế Quảng Cáo',
      [AppMode.INFOGRAPHIC]: 'Đồ Họa Thông Tin',
    },
    sidebar: {
      [AppMode.COMIC]: 'Truyện',
      [AppMode.ADVERTISING]: 'QCáo',
      [AppMode.INFOGRAPHIC]: 'Info',
    },
    labels: {
      story: 'Ý Tưởng Cốt Truyện',
      refImages: 'Ảnh Tham Khảo',
      mangaRef: 'Phong Cách Manga',
      artStyle: 'Phong Cách Vẽ',
      layout: 'Số Lượng Khung Tranh',
      task: 'Chế Độ Tác Vụ',
      brand: 'Tên Thương Hiệu',
      headline: 'Tiêu Đề Chính',
      desc: 'Mô Tả',
      target: 'Khách Hàng Mục Tiêu',
      topic: 'Chủ Đề Chính',
      data: 'Dữ Liệu Chính',
      summary: 'Tóm Tắt / Bối Cảnh',
      generate: 'Tạo Thiết Kế',
      generating: 'Đang Tạo...',
      history: 'Thư Viện Gần Đây',
      addRef: 'Thêm Ảnh',
      selectKey: 'Chọn API Key',
      accessRequired: 'Yêu Cầu Truy Cập',
      billingText: 'Vui lòng chọn API key để tiếp tục.',
      download: 'Tải Về',
      delete: 'Xóa',
      remix: 'Dùng Lại',
      upgrade: 'Nâng Cấp',
      optional: '(Tuỳ chọn)',
      required: '(Bắt buộc)',
      selectOption: 'Chọn một tùy chọn...',
      aspectRatio: 'Tỉ Lệ Khung Hình',
      artDirection: 'Định Hướng Nghệ Thuật',
    },
    tooltips: {
      story: 'Mô tả cốt truyện, nhân vật và bối cảnh cho trang truyện của bạn.',
      refImages:
        'Tải lên hình ảnh để AI tham khảo thiết kế nhân vật hoặc bảng màu.',
      task: 'Chọn cách AI sử dụng ảnh tham khảo (ví dụ: vẽ tiếp, mix nhân vật).',
      mangaRef: 'Chọn một phong cách manga nổi tiếng để định hình nét vẽ.',
      artStyle: 'Chọn phong cách nghệ thuật tổng thể (ví dụ: Màu nước, Noir).',
      artDirection: 'Chọn phong cách nghệ thuật cho thiết kế.',
      layout: 'Số lượng khung tranh bạn muốn hiển thị trên trang này.',
      brand: 'Tên công ty hoặc sản phẩm bạn đang quảng cáo.',
      headline: 'Câu khẩu hiệu chính hấp dẫn sẽ xuất hiện trên quảng cáo.',
      desc: 'Chi tiết về sản phẩm, dịch vụ hoặc bối cảnh hình ảnh bạn muốn.',
      target:
        'Quảng cáo này dành cho ai? (vd: Game thủ, Dân văn phòng) - Giúp AI chọn giọng điệu phù hợp.',
      topic: 'Chủ đề chính của infographic.',
      data: 'Liệt kê các thống kê, sự kiện hoặc bước chính bạn muốn trực quan hóa.',
      summary: 'Tổng quan ngắn gọn hoặc bối cảnh cho thông tin.',
      aspectRatio: 'Chọn hình dạng của ảnh được tạo ra.',
      guideStart: 'Bắt đầu ở đây! Hãy mô tả ý tưởng của bạn.',
    },
    placeholders: {
      story: 'Mô tả cốt truyện trang truyện của bạn...',
      brand: 'vd: NeonEnergy',
      headline: 'vd: Bùng Nổ Năng Lượng',
      desc: 'Mô tả sản phẩm hoặc hình ảnh mong muốn...',
      target: 'vd: Game thủ, Vận động viên',
      topic: 'vd: Vòng đời của sao',
      data: 'vd: Tinh vân, Sao nguyên thủy, Sao khổng lồ đỏ',
      summary: 'Bối cảnh cho người xem...',
    },
  },
}
