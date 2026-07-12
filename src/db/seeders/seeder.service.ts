import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from '../../modules/apps/brands/entities/brand.entity';
import { Category } from '../../modules/apps/categories/entities/category.entity';
import { Section } from '../../modules/apps/categories/entities/sections.entity';
import {
  MobileBanner,
  MobileBannerImage,
} from '../../modules/apps/shop/banners/entities/mobile-banner.entity';
import {
  WebBanner,
  WebBannerImage,
} from '../../modules/apps/shop/banners/entities/web-banner.entity';
import { SystemWallet } from '../../modules/apps/wallet/entities/system-wallets.entity';
import { SystemWalletType } from '../../modules/apps/wallet/enums/transaction.enum';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(MobileBanner)
    private readonly _landingBannerRepository: Repository<MobileBanner>,
    @InjectRepository(WebBanner)
    private readonly _webLandingBannerRepository: Repository<WebBanner>,
    @InjectRepository(MobileBannerImage)
    private readonly _mobileBannerImageRepository: Repository<MobileBannerImage>,
    @InjectRepository(WebBannerImage)
    private readonly _webBannerImageRepository: Repository<WebBannerImage>,
    @InjectRepository(SystemWallet)
    private readonly systemwalletRepository: Repository<SystemWallet>,
  ) {}

  private readonly shopCategories = {
    'Phones & Tablets': {
      phones: [
        'android phones',
        'ios phones',
        'feature phones',
        'phone accesories',
      ],
      tablets: ['android & ios', 'tablet accesories'],
      Wearables: [
        'Smartwatches',
        'Buds',
        'Other Wearables',
        'Smart Glasses',
        'Smart Rings',
        'Smart Tracking Devices',
        'Virtual Reality Devices',
      ],
    },
    Computing: {
      Laptops: [
        'Notebooks',
        'Ultrabooks',
        'Apple Macbooks',
        'Mini Laptops and Netbooks',
        'Laptops Accessories',
      ],
      Desktops: [
        'All In One Desktop',
        'Monitors',
        'CPUs',
        'Servers',
        'UPS',
        'Desktop Accessories',
      ],
      Softwares: ['Office Suits', 'Operating Systems', 'Securities & others'],
      'Computer Components': [
        'CPU processors',
        'Desktop Casing',
        'Fans & Cooling Systems',
        'Graphic Cards',
        'Memory Cards and Storage',
        'Modems',
        'Motherboards',
        'Network Cards',
        'Cables & Connectors',
        'Switches and KVM Boxes',
      ],
      'Printers & Scanners': [
        'Printers',
        'Scanners',
        'Printers and Copiers',
        'Inks, Toners and Cartridges',
        'Printer & Scanner Accessories',
      ],
      Projectors: [
        'Video Projectors',
        'Projector Screens',
        'Projector Bags & Cases',
        'Projector Lamps',
        'Projector Lenses',
        'Projector Remote Controls',
        'Mounting Equipments',
        'Projector Accessories',
      ],
      'Wifi & Networking': [
        'Antennas & Accessories',
        'Firewalls & Security',
        'Network Adapters',
        'Network Cables',
        'Racks & Eclosures',
        'Access Points',
        'Modems and Wifi',
        'CCTV & IP Cameras',
        'Network Hubs',
        'Switches',
        'Routers',
        'Network Interface Cards',
        'Networking Tools',
        'Starlink',
        'Network Phones & VOIP Devices',
      ],
    },
    Electronics: {
      'Cameras & Lenses': [
        'Pro & DSLR Cameras',
        'Pro Video Cameras',
        'Lenses',
        'Binoculas & Scopes',
        'Point and Shoot Cameras',
        'Camera Accessories',
      ],
      'Players and Recorders': [
        'Mini Recorders',
        'Mini Players',
        'Voice Recorders',
      ],
      'Car Electronics': [
        'Vehicle Diagnostic Tools',
        'Car Lightings',
        'GPS and Navigation',
        'Car Audio and Video Players',
        'Car Safety and Security Systems',
        'Car Accessories',
      ],
      'Portable Audio and Video': [
        'Boom Boxes',
        'Speakers & Speaker Docks',
        'Radios',
        'Portable CD and DVD players',
        'MP3, MP4 Players',
      ],
      'Home Theaters & Audio Systems': [
        'HiFi Systems',
        'Home Theaters',
        'Audio Components',
        'Turntables & Accessories',
      ],
      Televisions: [
        'Curved TVs',
        'LED TVs',
        'OLED TVs',
        'Plasma TVs',
        'Smart TVs',
        'QLED TVs',
        'Projector TVs',
        '4K LED TVs',
        '8K LED TVs',
      ],
    },
    'Home Appliances': {
      'Small home appliances': [
        'Blenders, Juicers, Mixers',
        'Hot Plates & Burners',
        'Irons & Steamers',
        'Processors & Mincers',
        'Toasters & Sandwich Makers',
        'Deep Fryers & Rice Cookers',
        'Electric Kettles',
        'Microwaves',
        'Yam Pounder',
      ],
      'Large Appliances': [
        'Air Conditioners & Coolers',
        'Fans',
        'Freezers',
        'Dishwashers',
        'Washers & Dryers',
        'Refrigerators',
        'Cookers & Ovens',
        'Water Dispensers',
        'Vacuum Cleaners',
      ],
      'Home Furnishings': [
        'Bed & Bathroom Furnishings',
        'Curtains & Blinds',
        'Decor',
        'Light Fixtures',
        'Rugs & Carpets',
        'Bathroom Wares',
        'Housekeeping & Pet Supplies',
      ],
      'Kitchen & Dining': [
        'Cook and Bakeware',
        'Dining',
        'Kitchen Utensils',
        'Cooker Hoods & Ventilators',
      ],
      Furniture: [
        'Living Room Furniture',
        'Bedroom Furniture',
        'Office Furniture',
        'Kitchen & Dining Furniture',
      ],
    },
    Gaming: {
      Playstation: [
        'PS3',
        'PS4',
        'PS5',
        'PS Vita',
        'Sony PSP',
        'Playstation Cards',
        'Playstation Accessories',
      ],
      Nintendo: [
        'Nintendo 3DS',
        'Nintendo DS',
        'Nintendo Switch',
        'Nintendo Wii',
        'Nintendo Wii U',
        'Nintendo Accessories',
      ],
      Xbox: ['Xbox One', 'Xbox 360', 'Xbox Cards'],
      'PC Games': [
        'Gaming Laptops',
        'Gaming Desktops',
        'Gaming Monitors',
        'Gaming Accessories',
      ],
    },
    Musical: [
      'Amplifiers, Mixers & Speakers Keyboards, Pianos & Drums',
      'Musical Accessories',
      'Stage, Studio & Recording Equipment',
      'String Instruments',
      'Wind Instruments',
    ],
    'Office Electronics': {
      'Office Security': ['Access Control', 'Scales', 'Labellers'],
      'Office Operations': [
        'PDAs, Handhelds Scanner',
        'POS Point of Sales Equiptment',
        'Shredders',
        'Telephones',
      ],
      'Office Accessories': [
        'Video & Audio Conferencing',
        'Laminating machine',
        'Projectors & Presentation Equipments',
        'Fax Machines',
      ],
    },
  };
  private readonly shopBrands = [
    { name: 'Samsung', category: 'Phones & Tablets' },
    { name: 'Apple', category: 'Phones & Tablets' },
    { name: 'Oraimo', category: 'Phones & Tablets' },
    { name: 'Baofeng', category: 'Phones & Tablets' },
    { name: 'Xiaomi', category: 'Phones & Tablets' },
    { name: 'A&S', category: 'Phones & Tablets' },
    { name: 'Otter Box', category: 'Phones & Tablets' },
    { name: 'Huawei', category: 'Phones & Tablets' },
    { name: 'Xundd', category: 'Phones & Tablets' },
    { name: 'Baseus', category: 'Phones & Tablets' },
    { name: 'Nokia', category: 'Phones & Tablets' },
    { name: 'Itel', category: 'Phones & Tablets' },
    { name: 'Nillkin', category: 'Phones & Tablets' },
    { name: 'SanDisk', category: 'Phones & Tablets' },
    { name: 'LDNIO', category: 'Phones & Tablets' },
    { name: 'New Age', category: 'Phones & Tablets' },
    { name: 'Tecno', category: 'Phones & Tablets' },
    { name: 'Amazon', category: 'Phones & Tablets' },
    { name: 'Infinix', category: 'Phones & Tablets' },
    { name: 'Panasonic', category: 'Phones & Tablets' },
    { name: 'Anker', category: 'Phones & Tablets' },
    { name: 'Porodo', category: 'Phones & Tablets' },
    { name: 'Remax', category: 'Phones & Tablets' },
    { name: 'Genres', category: 'Phones & Tablets' },
    { name: 'Zealot', category: 'Phones & Tablets' },
    { name: 'Google', category: 'Phones & Tablets' },
    { name: 'Romoss', category: 'Phones & Tablets' },
    { name: 'Green', category: 'Phones & Tablets' },
    { name: 'Sony', category: 'Phones & Tablets' },
    { name: 'Canyon', category: 'Phones & Tablets' },
    { name: 'Fitbit', category: 'Phones & Tablets' },
    { name: 'Havit', category: 'Phones & Tablets' },
    { name: 'Oppo', category: 'Phones & Tablets' },
    { name: 'JBL', category: 'Phones & Tablets' },
    { name: 'Commax', category: 'Phones & Tablets' },
    { name: 'Bontel', category: 'Phones & Tablets' },
    { name: 'Motorola', category: 'Phones & Tablets' },
    { name: 'Vivo', category: 'Phones & Tablets' },
    { name: 'Caleocom', category: 'Phones & Tablets' },
    { name: 'OnePlus', category: 'Phones & Tablets' },
    { name: 'Ikea', category: 'Phones & Tablets' },
    { name: 'Digifon', category: 'Phones & Tablets' },
    { name: 'Garmin', category: 'Phones & Tablets' },
    { name: 'Lenovo', category: 'Phones & Tablets' },
    { name: 'Ugreen', category: 'Phones & Tablets' },
    { name: 'UMIDIGI', category: 'Phones & Tablets' },
    { name: 'Chupez', category: 'Phones & Tablets' },
    { name: 'Atouch', category: 'Phones & Tablets' },
    { name: 'ZTE', category: 'Phones & Tablets' },
    { name: 'Yoobao', category: 'Phones & Tablets' },
    { name: 'Sony', category: 'Electronics' },
    { name: 'Zealot', category: 'Electronics' },
    { name: 'Arduino', category: 'Electronics' },
    { name: 'LG', category: 'Electronics' },
    { name: 'Hisense', category: 'Electronics' },
    { name: 'Amazon', category: 'Electronics' },
    { name: 'Samsung', category: 'Electronics' },
    { name: 'Nintendo', category: 'Electronics' },
    { name: 'JBL', category: 'Electronics' },
    { name: 'Ubisoft', category: 'Electronics' },
    { name: 'HikVision', category: 'Electronics' },
    { name: 'LDNIO', category: 'Electronics' },
    { name: 'Djack', category: 'Electronics' },
    { name: 'DJI', category: 'Electronics' },
    { name: 'Oraimo', category: 'Electronics' },
    { name: 'Electronic Art', category: 'Electronics' },
    { name: 'Activision', category: 'Electronics' },
    { name: 'Anker', category: 'Electronics' },
    { name: 'Havit', category: 'Electronics' },
    { name: 'Caleocom', category: 'Electronics' },
    { name: 'A&S', category: 'Electronics' },
    { name: 'Baofeng', category: 'Electronics' },
    { name: 'Harman Kardon', category: 'Electronics' },
    { name: 'Porodo', category: 'Electronics' },
    { name: 'Xiaomi', category: 'Electronics' },
    { name: 'Logitech', category: 'Electronics' },
    { name: 'Microsoft', category: 'Electronics' },
    { name: 'Fujifilm', category: 'Electronics' },
    { name: 'Apple', category: 'Electronics' },
    { name: 'Capcom', category: 'Electronics' },
    { name: 'Polystar', category: 'Electronics' },
    { name: 'TCL', category: 'Electronics' },
    { name: 'Square Enix', category: 'Electronics' },
    { name: 'Dstv', category: 'Electronics' },
    { name: 'Canon', category: 'Electronics' },
    { name: 'Warner Bro', category: 'Electronics' },
    { name: 'Google', category: 'Electronics' },
    { name: 'HP', category: 'Electronics' },
    { name: 'Beats By Dre', category: 'Electronics' },
    { name: 'Roku', category: 'Electronics' },
    { name: 'Sega', category: 'Electronics' },
    { name: 'Baseus', category: 'Electronics' },
    { name: 'Xbox', category: 'Electronics' },
    { name: 'Bose', category: 'Electronics' },
    { name: 'ABS', category: 'Electronics' },
    { name: 'Nintendo Wii', category: 'Electronics' },
    { name: 'Royal', category: 'Electronics' },
    { name: 'Rockstar', category: 'Electronics' },
    { name: 'Amani', category: 'Electronics' },
    { name: 'Audio-technical', category: 'Electronics' },
    { name: 'HP', category: 'Computer and Accessories' },
    { name: 'Logitech', category: 'Computer and Accessories' },
    { name: 'TP-Link', category: 'Computer and Accessories' },
    { name: 'Dell', category: 'Computer and Accessories' },
    { name: 'Microsoft', category: 'Computer and Accessories' },
    { name: 'Canon', category: 'Computer and Accessories' },
    { name: 'SanDisk', category: 'Computer and Accessories' },
    { name: 'Lenovo', category: 'Computer and Accessories' },
    { name: 'Apple', category: 'Computer and Accessories' },
    { name: 'Seagate', category: 'Computer and Accessories' },
    { name: 'Brother', category: 'Computer and Accessories' },
    { name: 'Asus', category: 'Computer and Accessories' },
    { name: 'Epson', category: 'Computer and Accessories' },
    { name: 'A&S', category: 'Computer and Accessories' },
    { name: 'Samsung', category: 'Computer and Accessories' },
    { name: 'Ubiquiti', category: 'Computer and Accessories' },
    { name: 'Adobe', category: 'Computer and Accessories' },
    { name: 'Acer', category: 'Computer and Accessories' },
    { name: 'Havit', category: 'Computer and Accessories' },
    { name: 'LG', category: 'Computer and Accessories' },
    { name: 'Western Digital', category: 'Computer and Accessories' },
    { name: 'Huawei', category: 'Computer and Accessories' },
    { name: 'Transcend', category: 'Computer and Accessories' },
    { name: 'Toshiba', category: 'Computer and Accessories' },
    { name: 'MTN', category: 'Computer and Accessories' },
    { name: 'McAfee', category: 'Computer and Accessories' },
    { name: 'Porodo', category: 'Computer and Accessories' },
    { name: 'Sharp', category: 'Computer and Accessories' },
    { name: 'BLUE GATE', category: 'Computer and Accessories' },
    { name: 'Autodesk', category: 'Computer and Accessories' },
    { name: 'Best', category: 'Computer and Accessories' },
    { name: 'Norton', category: 'Computer and Accessories' },
    { name: 'Sony', category: 'Computer and Accessories' },
    { name: 'Jabra', category: 'Computer and Accessories' },
    { name: 'Baseus', category: 'Computer and Accessories' },
    { name: 'Lontor', category: 'Computer and Accessories' },
    { name: 'USB', category: 'Computer and Accessories' },
    { name: 'Ugreen', category: 'Computer and Accessories' },
    { name: 'D-Link', category: 'Computer and Accessories' },
    { name: 'Xprinter', category: 'Computer and Accessories' },
    { name: 'Razer', category: 'Computer and Accessories' },
    { name: 'Xiaomi', category: 'Computer and Accessories' },
    { name: 'WD', category: 'Computer and Accessories' },
    { name: 'AVG', category: 'Computer and Accessories' },
    { name: 'MikroTik', category: 'Computer and Accessories' },
    { name: 'Kingston', category: 'Computer and Accessories' },
    { name: 'Grandstream', category: 'Computer and Accessories' },
    { name: 'Armando', category: 'Computer and Accessories' },
    { name: 'Intuit', category: 'Computer and Accessories' },
    { name: 'Plantronics', category: 'Computer and Accessories' },
    { name: 'Ikea', category: 'Home Appliances' },
    { name: 'A&S', category: 'Home Appliances' },
    { name: 'QASA', category: 'Home Appliances' },
    { name: 'Kenwood', category: 'Home Appliances' },
    { name: 'Sokany', category: 'Home Appliances' },
    { name: 'Hisense', category: 'Home Appliances' },
    { name: 'Binatone', category: 'Home Appliances' },
    { name: 'Polystar', category: 'Home Appliances' },
    { name: 'Master Chef', category: 'Home Appliances' },
    { name: 'Century', category: 'Home Appliances' },
    { name: 'Lontor', category: 'Home Appliances' },
    { name: 'SilverCrest', category: 'Home Appliances' },
    { name: 'Russell Hobbs', category: 'Home Appliances' },
    { name: 'LG', category: 'Home Appliances' },
    { name: 'Camry', category: 'Home Appliances' },
    { name: 'Scanfrost', category: 'Home Appliances' },
    { name: 'Eurosonic', category: 'Home Appliances' },
    { name: 'Sonik', category: 'Home Appliances' },
    { name: 'Tower', category: 'Home Appliances' },
    { name: 'Panasonic', category: 'Home Appliances' },
    { name: 'Exclusive', category: 'Home Appliances' },
    { name: 'Maxi', category: 'Home Appliances' },
    { name: 'Bedding Collection', category: 'Home Appliances' },
    { name: 'Vitafoam', category: 'Home Appliances' },
    { name: 'Ox', category: 'Home Appliances' },
    { name: 'Intex', category: 'Home Appliances' },
    { name: 'Philips', category: 'Home Appliances' },
    { name: 'DuraVolt', category: 'Home Appliances' },
    { name: 'AKT', category: 'Home Appliances' },
    { name: 'Royal', category: 'Home Appliances' },
    { name: 'Exact', category: 'Home Appliances' },
    { name: 'Unique', category: 'Home Appliances' },
    { name: 'Rite-tek', category: 'Home Appliances' },
    { name: 'Kinelco', category: 'Home Appliances' },
    { name: 'Saisho', category: 'Home Appliances' },
    { name: 'Nexus', category: 'Home Appliances' },
    { name: 'Dessini', category: 'Home Appliances' },
    { name: 'Crown Star', category: 'Home Appliances' },
    { name: 'Morphy Richards', category: 'Home Appliances' },
    { name: 'LED', category: 'Home Appliances' },
    { name: 'Midea', category: 'Home Appliances' },
    { name: 'Pyramid', category: 'Home Appliances' },
    { name: 'SQ Professional', category: 'Home Appliances' },
    { name: 'Air Wick', category: 'Home Appliances' },
    { name: 'Bruhm', category: 'Home Appliances' },
    { name: 'Samsung', category: 'Home Appliances' },
    { name: 'Akai', category: 'Home Appliances' },
    { name: 'Bosch', category: 'Home Appliances' },
    { name: 'Originals', category: 'Home Appliances' },
    { name: 'Salter', category: 'Home Appliances' },
    { name: 'Sony', category: 'Games' },
    { name: 'Nintendo', category: 'Games' },
    { name: 'Ubisoft', category: 'Games' },
    { name: 'Electronic Art', category: 'Games' },
    { name: 'Activision', category: 'Games' },
    { name: 'Microsoft', category: 'Games' },
    { name: 'Capcom', category: 'Games' },
    { name: 'Square Enix', category: 'Games' },
    { name: 'Warner Bro', category: 'Games' },
    { name: 'Sega', category: 'Games' },
    { name: 'Xbox', category: 'Games' },
    { name: 'Nintendo Wii', category: 'Games' },
    { name: 'Rockstar', category: 'Games' },
    { name: 'Gamesalor', category: 'Games' },
    { name: 'Xbox One', category: 'Games' },
    { name: 'Microsoft Xbox', category: 'Games' },
    { name: 'Logitech', category: 'Games' },
    { name: 'Sony Cyber', category: 'Games' },
    { name: 'Disney', category: 'Games' },
    { name: 'Atari', category: 'Games' },
    { name: 'Havit', category: 'Games' },
    { name: 'Porodo', category: 'Games' },
    { name: 'Poweradd', category: 'Games' },
    { name: 'Razer', category: 'Games' },
    { name: 'A&S', category: 'Games' },
    { name: 'CE', category: 'Games' },
    { name: 'LEGO', category: 'Games' },
    { name: 'Santa', category: 'Games' },
    { name: 'JBL', category: 'Games' },
    { name: 'Seagate', category: 'Games' },
    { name: 'Asus', category: 'Games' },
    { name: 'Nintendo 3DS', category: 'Games' },
    { name: 'Sonny', category: 'Games' },
    { name: 'Ucom', category: 'Games' },
    { name: 'WD', category: 'Games' },
    { name: 'Lenovo', category: 'Games' },
    { name: 'Marvel', category: 'Games' },
    { name: 'QASA', category: 'Games' },
    { name: 'Smart', category: 'Games' },
    { name: 'Spa Life', category: 'Games' },
    { name: 'Xbox Game', category: 'Games' },
    { name: 'American Living', category: 'Games' },
    { name: 'Arduino', category: 'Games' },
    { name: 'Cable & Guage', category: 'Games' },
    { name: 'Corsair', category: 'Games' },
    { name: 'DC Comics', category: 'Games' },
    { name: 'Eagle', category: 'Games' },
    { name: 'F & A', category: 'Games' },
    { name: 'Focus', category: 'Games' },
  ];
  private readonly mobileBanners = [
    {
      name: 'banner-a',
      images: [
        { url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/BannerA1.png' },
        {
          url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/BannerA2.png',
        },
      ],
    },
    {
      name: 'banner-b',
      images: [
        { url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/BannerB1.png' },
        { url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/BannerB2.png' },
        { url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/BannerB3.png' },
      ],
    },
    {
      name: 'banner-c',
      images: [
        { url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/BannerC1.png' },
        { url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/BannerC2.png' },
        { url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/BannerC3.png' },
      ],
    },
    {
      name: 'shop-banner',
      images: [
        { url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/samsung.png' },
        { url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/i-Phone-15-P' },
        { url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/samsung3.png' },
      ],
    },
    {
      name: 'smartphone-banner',
      images: [
        { url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/samsung.png' },
      ],
    },
    {
      name: 'iphone-banner',
      images: [
        { url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/i-Phone-15-P' },
      ],
    },
    {
      name: 'samsung-banner',
      images: [
        { url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/samsung3.png' },
      ],
    },
  ];
  private readonly webBanners = [
    {
      name: 'banner-a',
      images: [
        { url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/L-Banner-A.png' },
      ],
    },
    {
      name: 'banner-b',
      images: [
        {
          url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/L-Banner-B1.png',
        },
        {
          url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/L-Banner-B2.png',
        },
      ],
    },
    {
      name: 'banner-c',
      images: [
        {
          url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/l-Banner-C1.png',
        },
        {
          url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/L-Banner-C2.png',
        },
      ],
    },
    {
      name: 'banner-d',
      images: [
        {
          url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/L-Banner-D1.png',
        },
        {
          url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/L-Banner-D2.png',
        },
      ],
    },
    {
      name: 'banner-e',
      images: [
        { url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/L-Banner-E.png' },
      ],
    },
    {
      name: 'computing-banner',
      images: [
        { url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/Computing.png' },
      ],
    },
    {
      name: 'electronics-banner',
      images: [
        {
          url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/Electronics.png',
        },
      ],
    },
    {
      name: 'gaming-banner',
      images: [
        { url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/Gaming.png' },
      ],
    },
    {
      name: 'office-banner',
      images: [
        { url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/Office.png' },
      ],
    },
    {
      name: 'phones-tablets-banner',
      images: [
        {
          url: 'https://d20dbqvplpyrs7.cloudfront.net/uploads/Phone-Tablet.png',
        },
      ],
    },
  ];
  async runSectionCategoriesBrandsSeeder(): Promise<void> {
    let shopSection = await this.sectionRepository.findOne({ where: { name: 'Shop' } });

    if (!shopSection) {
      console.log('🆕 Creating "Shop" Section...');
      shopSection = this.sectionRepository.create({ name: 'Shop' });
      await this.sectionRepository.save(shopSection);
    }

    console.log('🌱 Seeding Shop Categories...');
    await this.seedCategories(this.shopCategories, null, shopSection);

    console.log('🌱 Seeding Shop Brands...');
    await this.seedBrands();
  }
  async seedCategories(
    data: any,
    parent: Category | null,
    section: Section,
  ): Promise<void> {
    const entries = Object.entries(data);

    for (const [categoryName, subData] of entries) {
      let category = await this.categoryRepository.findOne({
        where: { name: categoryName, section },
      });

      if (!category) {
        category = this.categoryRepository.create({
          name: categoryName,
          slug: this.generateSlug(categoryName),
          image: null,
          parent,
          section,
        });

        await this.categoryRepository.save(category);
      }

      if (typeof subData === 'object' && !Array.isArray(subData)) {
        await this.seedCategories(subData, category, section);
      } else if (Array.isArray(subData)) {
        for (const childName of subData) {
          let childCategory = await this.categoryRepository.findOne({
            where: { name: childName, section },
          });

          if (!childCategory) {
            childCategory = this.categoryRepository.create({
              name: childName,
              slug: this.generateSlug(childName),
              image: null,
              parent: category,
              section,
            });

            await this.categoryRepository.save(childCategory);
          }
        }
      }
    }
  }
  async seedBrands(): Promise<void> {
    for (const { name, category } of this.shopBrands) {
      const slug = this.generateSlug(name);

      let brand = await this.brandRepository.findOne({
        where: [{ name }, { slug }],
      });

      if (brand) {
        brand.category = category;
        await this.brandRepository.save(brand);
      } else {
        brand = this.brandRepository.create({
          name,
          slug,
          category,
          image: null,
        });

        await this.brandRepository.save(brand);
      }
    }
  }
  async seedBanners(): Promise<void> {
    console.log('🌱 Seeding Web and Mobile Page Banners...');

    for (const bannerData of this.mobileBanners) {
      let banner = await this._landingBannerRepository.findOne({
        where: { name: bannerData.name },
      });

      if (!banner) {
        banner = this._landingBannerRepository.create({
          name: bannerData.name,
        });
        banner = await this._landingBannerRepository.save(banner);
      }

      for (const imageData of bannerData.images) {
        let image = await this._mobileBannerImageRepository.findOne({
          where: { imageUrl: imageData.url, banner },
        });

        if (!image) {
          image = this._mobileBannerImageRepository.create({
            imageUrl: imageData.url,
            banner,
          });
          await this._mobileBannerImageRepository.save(image);
        }
      }
    }
    for (const bannerData of this.webBanners) {
      let banner = await this._webLandingBannerRepository.findOne({
        where: { name: bannerData.name },
      });

      if (!banner) {
        banner = this._webLandingBannerRepository.create({
          name: bannerData.name,
        });
        banner = await this._webLandingBannerRepository.save(banner);
      }

      for (const imageData of bannerData.images) {
        let image = await this._webBannerImageRepository.findOne({
          where: { imageUrl: imageData.url, banner },
        });

        if (!image) {
          image = this._webBannerImageRepository.create({
            imageUrl: imageData.url,
            banner,
          });
          await this._webBannerImageRepository.save(image);
        }
      }
    }

    console.log('✅🌱 Web and Mobile Banners seeded successfully!');
  }

  async seedEscrowSystemWallet(): Promise<void> {
    console.log('🌱 Seeding System wallets...');
    let escroWallet = await this.systemwalletRepository.findOne({
      where: { type: SystemWalletType.PLATFORM_ESCROW },
    });

    if (!escroWallet) {
      escroWallet = this.systemwalletRepository.create({
        name: '3XG SYstem wallet',
        type: SystemWalletType.PLATFORM_ESCROW,
      });

      await this.systemwalletRepository.save(escroWallet);
    }
  }

  generateSlug(name: string): string {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
