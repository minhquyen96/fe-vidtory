export enum AppMode {
  COMIC = 'COMIC',
  ADVERTISING = 'ADVERTISING',
  INFOGRAPHIC = 'INFOGRAPHIC'
}

export type Language = 'en' | 'vi';

export interface GenerationState {
  isLoading: boolean;
  resultImage: string | null;
  error: string | null;
}

export interface BaseInputState {
  description: string;
  style: string;
  referenceImages: File[];
}

// Specialized inputs extending base
export interface ComicInputs extends BaseInputState {
  story: string; 
  frameCount: number; 
  selectedManga: string;
  taskAction: string; 
}

export interface AdInputs extends BaseInputState {
  brandName: string;
  headline: string;
  targetAudience: string;
}

export interface InfoInputs extends BaseInputState {
  topic: string;
  dataPoints: string;
}

export type InputUnion = ComicInputs | AdInputs | InfoInputs;

export interface HistoryItem {
  id: string;
  url: string;
  mode: AppMode;
  params: InputUnion;
  timestamp: number;
}

// Localized Data
export const STYLE_PRESETS = {
  en: {
    [AppMode.COMIC]: ['Modern Manga', 'American Superhero', 'Noir', 'Line Art', 'Watercolor', 'Webtoon'],
    [AppMode.ADVERTISING]: ['Minimalist', 'Luxury', 'Pop Art', 'Corporate', 'Cyberpunk'],
    [AppMode.INFOGRAPHIC]: ['Flat Design', 'Isometric', 'Hand Drawn', 'Corporate Clean', 'Neon Data']
  },
  vi: {
    [AppMode.COMIC]: ['Manga Hiện Đại', 'Siêu Anh Hùng Mỹ', 'Phim Noir', 'Nét Vẽ Line Art', 'Màu Nước', 'Webtoon'],
    [AppMode.ADVERTISING]: ['Tối Giản', 'Sang Trọng', 'Pop Art', 'Doanh Nghiệp', 'Cyberpunk'],
    [AppMode.INFOGRAPHIC]: ['Thiết Kế Phẳng', 'Góc Nhìn 3D', 'Vẽ Tay', 'Doanh Nghiệp Sạch', 'Dữ Liệu Neon']
  }
};

export const POPULAR_MANGA_STYLES = [
  'Dragon Ball', 
  'One Piece', 
  'Naruto', 
  'Attack on Titan', 
  'JoJo\'s Bizarre Adventure', 
  'Sailor Moon', 
  'Demon Slayer', 
  'My Hero Academia', 
  'Bleach', 
  'Studio Ghibli',
  'Junji Ito',
  'Berserk'
];

// New Task Actions for Comics
export const TASK_ACTIONS = {
  en: [
    { id: 'story', label: 'New Story', prompt: 'Create a new story based on the description.' },
    { id: 'continue', label: 'Continue Next Page', prompt: 'The reference images are the previous pages. Create the IMMEDIATE NEXT PAGE in the sequence.' },
    { id: 'mix', label: 'Mix Characters', prompt: 'Blend the visual elements and characters from the reference images into a new scenario.' },
    { id: 'remake', label: 'Remake Style', prompt: 'Keep the composition of the reference image but redraw it in the selected art style.' }
  ],
  vi: [
    { id: 'story', label: 'Sáng Tác Mới', prompt: 'Tạo một câu chuyện hoàn toàn mới dựa trên mô tả.' },
    { id: 'continue', label: 'Vẽ Trang Tiếp Theo', prompt: 'Ảnh tham khảo là trang trước đó. Hãy vẽ TRANG TIẾP THEO của câu chuyện này.' },
    { id: 'mix', label: 'Mix Nhân Vật/Bối Cảnh', prompt: 'Kết hợp các yếu tố hình ảnh và nhân vật từ ảnh tham khảo vào một kịch bản mới.' },
    { id: 'remake', label: 'Vẽ Lại Style Khác', prompt: 'Giữ nguyên bố cục của ảnh tham khảo nhưng vẽ lại theo phong cách nghệ thuật đã chọn.' }
  ]
};

export interface StoryIdea {
  short: string;
  full: string;
}

export const STORY_IDEAS = {
  en: [
    { short: "Cyberpunk Detective", full: "A noir cyberpunk detective scene where a rugged investigator examines a glowing holographic clue in a rainy, neon-lit alleyway." },
    { short: "Wizard Library", full: "A wide shot of a magical library with floating books, glowing runes, and a young wizard casting a spell that spirals into light." },
    { short: "Cozy Cat Cafe", full: "A warm, slice-of-life scene inside a sunny cat cafe. Detailed pastries on tables, cats sleeping on shelves, and customers chatting happily." },
    { short: "Space Battle", full: "An intense sci-fi space battle. A small rebel fighter ship dodging laser beams from a massive dreadnought near a collapsing blue star." },
  ],
  vi: [
    { short: "Thám Tử Cyberpunk", full: "Cảnh thám tử cyberpunk đen tối, nơi một điều tra viên gai góc đang kiểm tra manh mối hình ba chiều phát sáng trong con hẻm mưa, ngập tràn ánh đèn neon." },
    { short: "Thư Viện Phù Thủy", full: "Góc rộng của một thư viện phép thuật với những cuốn sách trôi nổi, cổ ngữ phát sáng và một phù thủy trẻ đang niệm chú tạo ra vòng xoáy ánh sáng." },
    { short: "Cà Phê Mèo", full: "Một cảnh đời thường ấm áp bên trong quán cà phê mèo đầy nắng. Bánh ngọt chi tiết trên bàn, mèo ngủ trên kệ và khách hàng trò chuyện vui vẻ." },
    { short: "Chiến Tranh Vũ Trụ", full: "Trận chiến không gian khoa học viễn tưởng dữ dội. Một tàu chiến đấu nhỏ của quân nổi dậy né tránh các chùm tia laser từ một tàu dreadnought khổng lồ gần một ngôi sao xanh đang sụp đổ." },
  ]
};

export const TRANSLATIONS = {
  en: {
    modes: {
      [AppMode.COMIC]: "Comic Creator",
      [AppMode.ADVERTISING]: "Ad Designer",
      [AppMode.INFOGRAPHIC]: "Infographic"
    },
    sidebar: {
      [AppMode.COMIC]: "Comic",
      [AppMode.ADVERTISING]: "Ads",
      [AppMode.INFOGRAPHIC]: "Info"
    },
    labels: {
      story: "Story Idea",
      refImages: "Reference Images",
      mangaRef: "Manga Style",
      artStyle: "Art Style",
      layout: "Frame Count",
      task: "Task Mode",
      brand: "Brand Name",
      headline: "Headline",
      desc: "Description",
      target: "Target Audience",
      topic: "Main Topic",
      data: "Data Points",
      summary: "Summary",
      generate: "Generate",
      generating: "Creating...",
      history: "Session Gallery",
      addRef: "Add Ref",
      selectKey: "Select API Key",
      accessRequired: "Access Required",
      billingText: "Please select an API key to continue.",
      download: "Download",
      delete: "Delete",
      remix: "Remix",
      upgrade: "Upgrade",
      optional: "(Optional)",
      required: "(Required)",
      selectOption: "Select an option..."
    },
    placeholders: {
      story: "Describe your comic page plot...",
      brand: "e.g., NeonEnergy",
      headline: "e.g., Unleash Your Power",
      desc: "Describe the product or visual...",
      target: "e.g., Gamers, Athletes",
      topic: "e.g., Lifecycle of a Star",
      data: "e.g., Nebula, Protostar, Red Giant",
      summary: "Context for the viewer..."
    }
  },
  vi: {
     modes: {
      [AppMode.COMIC]: "Tạo Truyện Tranh",
      [AppMode.ADVERTISING]: "Thiết Kế Quảng Cáo",
      [AppMode.INFOGRAPHIC]: "Đồ Họa Thông Tin"
    },
    sidebar: {
      [AppMode.COMIC]: "Truyện",
      [AppMode.ADVERTISING]: "QCáo",
      [AppMode.INFOGRAPHIC]: "Info"
    },
    labels: {
      story: "Ý Tưởng Cốt Truyện",
      refImages: "Ảnh Tham Khảo",
      mangaRef: "Phong Cách Manga",
      artStyle: "Phong Cách Vẽ",
      layout: "Số Lượng Khung Tranh",
      task: "Chế Độ Tác Vụ",
      brand: "Tên Thương Hiệu",
      headline: "Tiêu Đề Chính",
      desc: "Mô Tả",
      target: "Khách Hàng Mục Tiêu",
      topic: "Chủ Đề Chính",
      data: "Dữ Liệu Chính",
      summary: "Tóm Tắt / Bối Cảnh",
      generate: "Tạo Thiết Kế",
      generating: "Đang Tạo...",
      history: "Thư Viện Gần Đây",
      addRef: "Thêm Ảnh",
      selectKey: "Chọn API Key",
      accessRequired: "Yêu Cầu Truy Cập",
      billingText: "Vui lòng chọn API key để tiếp tục.",
      download: "Tải Về",
      delete: "Xóa",
      remix: "Dùng Lại",
      upgrade: "Nâng Cấp",
      optional: "(Tuỳ chọn)",
      required: "(Bắt buộc)",
      selectOption: "Chọn một tùy chọn..."
    },
    placeholders: {
      story: "Mô tả cốt truyện trang truyện của bạn...",
      brand: "vd: NeonEnergy",
      headline: "vd: Bùng Nổ Năng Lượng",
      desc: "Mô tả sản phẩm hoặc hình ảnh mong muốn...",
      target: "vd: Game thủ, Vận động viên",
      topic: "vd: Vòng đời của sao",
      data: "vd: Tinh vân, Sao nguyên thủy, Sao khổng lồ đỏ",
      summary: "Bối cảnh cho người xem..."
    }
  }
};

