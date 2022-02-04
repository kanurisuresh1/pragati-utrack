import { NbMenuItem } from '@nebular/theme';
export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Home',
    icon: 'home-outline',
    link: '/web/dashboard',
    home: true,

    children: [
      {
        title: 'Dashboard',
        link: '/web/dashboard',
      },
      {
        title: 'Live Track',
        link: '/web/livetrack',
      },
      {
        title: 'Track History',
        link: '/web/track_history',
      },
      {
        title: 'Summary Report',
        link: '/web/summary_report',
      },
      {
        title: 'Fuel Dashboard',
        link: '/web/fuel_dashboard',
      },
      {
        title: 'Temperature Dashboard',
        link: '/web/temperature_dashboard',
      },

      {
        title: 'Shared Link Management',
        link: '/web/shared-management',
      },

      {
        title: 'Toll Plaza Info',
        link: '/web/toll-plaza-info',
      },

      {
        title: 'Fuel Price Info',
        link: '/web/fuel-price-info',
      },

    ],
  },
  {
    title: 'My Account',
    icon: 'person',
    link: '/web/myaccount',
    children: [
      {
        title: 'My Profile',
        link: '/web/myaccount/myprofile',
      },
      {
        title: 'My Wallet',
        link: '/web/myaccount/mywallet',
      },
      {
        title: 'My Trips',
        link: '/web/myaccount/mytrips',
      },
      {
        title: 'My Geofence',
        link: '/web/myaccount/mygeofence',
      },
      {
        title: 'My Shared Users',
        pathMatch: 'prefix',
        link: '/web/myaccount/mysharedusers',
      },
      {
        title: 'My Drivers',
        pathMatch: 'prefix',
        link: '/web/myaccount/mydrivers',
      },
      {
        title: 'My Groups',
        pathMatch: 'prefix',
        link: '/web/myaccount/mygroups',
      },

      {
        title: 'Fast Tag',
        pathMatch: 'prefix',
        link: '/web/myaccount/fast-tag-info',
      },

      // {
      //   title: 'My Temperature Alerts',
      //   pathMatch: 'prefix',
      //   link: '/web/myaccount/MyTemperatureAlerts',
      // },

    ],

  },

  {
    title: 'Reports & Charts',
    icon: 'browser-outline',
    link: '/web/reports_charts',
  },
  {
    title: 'Fleet Management',
    icon: 'pie-chart-outline',
    link: '/web/fleet-management',
  },


  {
    title: 'Alerts & Notifications',
    icon: 'bell-off-outline',
    link: '/web/alert_notifications',
  },

  {
    title: 'Bus Management',
    icon: 'car-outline',
    link: '/web/bus_management',
    children: [
      {
        title: 'Organisations',
        link: '/web/bus_management/organisations',
      },
      {
        title: 'Branches',
        link: '/web/bus_management/branches',
      },
      {
        title: 'Employees',
        link: '/web/bus_management/employees',
      },
      {
        title: 'Geofences',
        link: '/web/bus_management/geofence',
      },
      {
        title: 'Routes',
        link: '/web/bus_management/bus_routes',
      },

      {
        title: 'Timings',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_timings',
      },
      {
        title: 'Buses',
        pathMatch: 'prefix',
        link: '/web/bus_management/buses',
      },

      {
        title: 'Trips',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_trips',
      },
      {
        title: 'Passengers',
        pathMatch: 'prefix',
        link: '/web/bus_management/passengers',
      },

      {
        title: 'Notifications',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_notifications',
      },




    ],

  },

  {
    title: 'GPS Lock',
    icon: 'message-circle-outline',
    link: '/web/gpslock',
  },
  // {
  //   title: 'Purchases',
  //   icon: 'layout-outline',
  //   link: '/web/purchases',
  //   children: [
  //     {
  //       title: 'Buy Plans',
  //       link: '/web/purchases/buyplans',
  //     },
  //     {
  //       title: 'Buy Products',
  //       link: '/web/purchases/buyproducts',
  //     },
  //     {
  //       title: 'My Orders',
  //       link: '/web/purchases/myorders',
  //     },

  //   ],
  // },



  {
    title: 'Others',
    icon: 'edit-2-outline',
    link: '/web/others',
    children: [
      {
        title: 'Settings',
        link: '/web/others/settings',
      },
      {
        title: 'Contact Us',
        link: '/web/others/contactus',
      },
      {
        title: 'Help',
        link: '/web/others/help',
      },
      {
        title: 'Refer & Earn',
        link: '/web/others/refernearn',
      },
    ],
  },
  // {
  //   title: 'Logout',
  //   icon: 'power-outline',
  //   link: '/login',
  // },
];
export const TE_MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'హోమ్',
    icon: 'home-outline',
    link: '/web/dashboard',
    home: true,

    children: [
      {
        title: 'డాష్బోర్డ్',
        link: '/web/dashboard',
      },
      {
        title: 'లైవ్ ట్రాక్',
        link: '/web/livetrack',
      },
      {
        title: 'ట్రాక్ హిస్టరీ',
        link: '/web/track_history',
      },
      {
        title: 'సమ్మరీ రిపోర్ట్',
        link: '/web/summary_report',
      },
      {
        title: 'ఫ్యూయల్ డాష్బోర్డ్',
        link: '/web/fuel_dashboard',
      },
      {
        title: 'టెంపరేచర్ డాష్బోర్డ్',
        link: '/web/temperature_dashboard',
      },

      {
        title: 'షేర్డ్ లింక్ మానెజ్మెంట్',
        link: '/web/shared-management',
      },

      {
        title: 'టోల్ ప్లాజా ఇన్ఫో',
        link: '/web/toll-plaza-info',
      },

      {
        title: 'ఫ్యూయల్ ప్రైస్ ఇన్ఫో',
        link: '/web/fuel-price-info',
      },

    ],
  },
  {
    title: 'నా అకౌంట్',
    icon: 'person',
    link: '/web/myaccount',
    children: [
      {
        title: 'నా ప్రోఫైల్',
        link: '/web/myaccount/myprofile',
      },
      {
        title: 'నా వాలెట్',
        link: '/web/myaccount/mywallet',
      },
      {
        title: 'నా ట్రిప్స్',
        link: '/web/myaccount/mytrips',
      },
      {
        title: 'నా జియోఫిన్స్',
        link: '/web/myaccount/mygeofence',
      },
      {
        title: 'నా షేర్డ్ యూసర్స్',
        pathMatch: 'prefix',
        link: '/web/myaccount/mysharedusers',
      },
      {
        title: 'నా డ్రైవర్స్',
        pathMatch: 'prefix',
        link: '/web/myaccount/mydrivers',
      },
      {
        title: 'నా గ్రూప్స్',
        pathMatch: 'prefix',
        link: '/web/myaccount/mygroups',
      },

      {
        title: 'ఫాస్ట్ టాగ్',
        pathMatch: 'prefix',
        link: '/web/myaccount/fast-tag-info',
      },

      // {
      //    title: 'నా Temperature Alerts',
      //   pathMatch: 'prefix',
      //   link: '/web/myaccount/MyTemperatureAlerts',
      // },

    ],

  },

  {
    title: 'రిపోర్ట్స్ & ఛార్ట్స్',
    icon: 'browser-outline',
    link: '/web/reports_charts',
  },
  {
    title: ' ఫ్లీట్ మానెజ్మెంట్',
    icon: 'pie-chart-outline',
    link: '/web/fleet-management',
  },


  {
    title: 'అలర్ట్స్ & నోటిఫికెషన్స్',
    icon: 'bell-off-outline',
    link: '/web/alert_notifications',
  },

  {
    title: 'బస్సు మానెజ్మెంట్',
    icon: 'car-outline',
    link: '/web/bus_management',
    children: [
      {
        title: 'ఒరగనిరోషన్స్',
        link: '/web/bus_management/organisations',
      },
      {
        title: 'బ్రాంచెస్',
        link: '/web/bus_management/branches',
      },
      {
        title: 'ఎంప్లాయిస్',
        link: '/web/bus_management/employees',
      },
      {
        title: 'జాఫెన్సెస్',
        link: '/web/bus_management/geofence',
      },
      {
        title: 'రూట్స్',
        link: '/web/bus_management/bus_routes',
      },

      {
        title: 'టైమింగ్స్',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_timings',
      },
      {
        title: 'బస్సెస్',
        pathMatch: 'prefix',
        link: '/web/bus_management/buses',
      },

      {
        title: 'ట్రిప్స్',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_trips',
      },
      {
        title: 'ప్రయాణీకులు',
        pathMatch: 'prefix',
        link: '/web/bus_management/passengers',
      },

      {
        title: 'నోటిఫికేషన్‌లు',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_notifications',
      },




    ],

  },

  {
    title: 'జిప్స్లాక్',
    icon: 'message-circle-outline',
    link: '/web/gpslock',
  },
  // {
  //   title: 'కొనుగోళ్లు',
  //   icon: 'layout-outline',
  //   link: '/web/purchases',
  //   children: [
  //     {
  //       title: 'కొనుగోలు ప్రణాళికలు',
  //       link: '/web/purchases/buyplans',
  //     },
  //     {
  //       title: 'కొనుగోలు ఉత్పత్తి',
  //       link: '/web/purchases/buyproducts',
  //     },
  //     {
  //        title: 'నా ఆదేశాలు',
  //       link: '/web/purchases/myorders',
  //     },

  //   ],
  // },



  {
    title: 'ఇతరులు',
    icon: 'edit-2-outline',
    link: '/web/others',
    children: [
      {
        title: 'సెట్టింగులు',
        link: '/web/others/settings',
      },
      {
        title: 'మమ్మల్ని సంప్రదించండి',
        link: '/web/others/contactus',
      },
      {
        title: 'సహాయం',
        link: '/web/others/help',
      },
      {
        title: 'చూడండి & సంపాదించండి',
        link: '/web/others/refernearn',
      },
    ],
  },
];
export const BN_MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'বাড়ি',
    icon: 'home-outline',
    link: '/web/dashboard',
    home: true,

    children: [
      {
        title: 'ড্যাশবোর্ড',
        link: '/web/dashboard',
      },
      {
        title: 'লাইভ ট্র্যাক',
        link: '/web/livetrack',
      },
      {
        title: 'ট্র্যাক ইতিহাস',
        link: '/web/track_history',
      },
      {
        title: 'সারসংক্ষেপ প্রতিবেদন',
        link: '/web/summary_report',
      },
      {
        title: 'ফুয়েল ড্যাশবোর্ড',
        link: '/web/fuel_dashboard',
      },
      {
        title: 'তাপমাত্রা ড্যাশবোর্ড',
        link: '/web/temperature_dashboard',
      },

      {
        title: 'ভাগ করা লিঙ্ক পরিচালনা',
        link: '/web/shared-management',
      },

      {
        title: 'টোল প্লাজার তথ্য',
        link: '/web/toll-plaza-info',
      },

      {
        title: 'জ্বালানী মূল্য তথ্য',
        link: '/web/fuel-price-info',
      },

    ],
  },
  {
    title: 'আমার অ্যাকাউন্ট',
    icon: 'person',
    link: '/web/myaccount',
    children: [
      {
        title: 'আমার প্রোফাইল',
        link: '/web/myaccount/myprofile',
      },
      {
        title: 'আমার মানিব্যাগ',
        link: '/web/myaccount/mywallet',
      },
      {
        title: 'আমার ট্রিপস',
        link: '/web/myaccount/mytrips',
      },
      {
        title: 'আমার জিওফেন্স',
        link: '/web/myaccount/mygeofence',
      },
      {
        title: 'আমার ভাগ করা ব্যবহারকারীরা',
        pathMatch: 'prefix',
        link: '/web/myaccount/mysharedusers',
      },
      {
        title: 'আমার ড্রাইভার',
        pathMatch: 'prefix',
        link: '/web/myaccount/mydrivers',
      },
      {
        title: 'আমার দলগুলি',
        pathMatch: 'prefix',
        link: '/web/myaccount/mygroups',
      },

      {
        title: 'দ্রুত ট্যাগ',
        pathMatch: 'prefix',
        link: '/web/myaccount/fast-tag-info',
      },

      // {
      //   title: 'আমার তাপমাত্রার সতর্কতা',
      //   pathMatch: 'prefix',
      //   link: '/web/myaccount/MyTemperatureAlerts',
      // },

    ],

  },

  {
    title: 'প্রতিবেদন এবং চার্ট',
    icon: 'browser-outline',
    link: '/web/reports_charts',
  },
  {
    title: 'দ্রুতগামী ব্যবস্থাপনা',
    icon: 'pie-chart-outline',
    link: '/web/fleet-management',
  },


  {
    title: 'সতর্কতা ও বিজ্ঞপ্তিগুলি',
    icon: 'bell-off-outline',
    link: '/web/alert_notifications',
  },

  {
    title: 'বাস ম্যানেজমেন্ট',
    icon: 'car-outline',
    link: '/web/bus_management',
    children: [
      {
        title: 'সংস্থা',
        link: '/web/bus_management/organisations',
      },
      {
        title: 'শাখা',
        link: '/web/bus_management/branches',
      },
      {
        title: 'কর্মচারী',
        link: '/web/bus_management/employees',
      },
      {
        title: 'জিওফেন্সস',
        link: '/web/bus_management/geofence',
      },
      {
        title: 'রুট',
        link: '/web/bus_management/bus_routes',
      },

      {
        title: 'সময়',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_timings',
      },
      {
        title: 'বাস',
        pathMatch: 'prefix',
        link: '/web/bus_management/buses',
      },

      {
        title: 'ট্রিপস',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_trips',
      },
      {
        title: 'যাত্রী',
        pathMatch: 'prefix',
        link: '/web/bus_management/passengers',
      },

      {
        title: 'বিজ্ঞপ্তি',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_notifications',
      },

    ],

  },

  {
    title: 'জিপিএস লক',
    icon: 'message-circle-outline',
    link: '/web/gpslock',
  },
  // {
  //   title: 'ক্রয়',
  //   icon: 'layout-outline',
  //   link: '/web/purchases',
  //   children: [
  //     {
  //       title: 'পরিকল্পনা কিনুন',
  //       link: '/web/purchases/buyplans',
  //     },
  //     {
  //       title: 'পণ্য কিনুন',
  //       link: '/web/purchases/buyproducts',
  //     },
  //     {
  //       title: 'আমার নির্দেশনা',
  //       link: '/web/purchases/myorders',
  //     },

  //   ],
  // },

  {
    title: 'অন্যান্য',
    icon: 'edit-2-outline',
    link: '/web/others',
    children: [
      {
        title: 'অন্যান্য',
        link: '/web/others/settings',
      },
      {
        title: 'যোগাযোগ করুন',
        link: '/web/others/contactus',
      },
      {
        title: 'সহায়তা',
        link: '/web/others/help',
      },
      {
        title: 'পড়ুন এবং উপার্জন করুন',
        link: '/web/others/refernearn',
      },
    ],
  },
  // {
  //   title: 'Logout',
  //   icon: 'power-outline',
  //   link: '/login',
  // },
];
export const GU_MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'ખેર',
    icon: 'home-outline',
    link: '/web/dashboard',
    home: true,

    children: [
      {
        title: 'ડેશબોર્ડ',
        link: '/web/dashboard',
      },
      {
        title: 'લાઇવ ટ્રેક',
        link: '/web/livetrack',
      },
      {
        title: 'ટ્રેક ઇતિહાસ',
        link: '/web/track_history',
      },
      {
        title: 'સારાંશ અહેવાલ',
        link: '/web/summary_report',
      },
      {
        title: 'ફ્યુઅલ ડેશબોર્ડ',
        link: '/web/fuel_dashboard',
      },
      {
        title: 'તાપમાન ડેશબોર્ડ',
        link: '/web/temperature_dashboard',
      },

      {
        title: 'શેર કરેલી લિંક મેનેજમેન્ટ',
        link: '/web/shared-management',
      },

      {
        title: 'ટોલ પ્લાઝા માહિતી',
        link: '/web/toll-plaza-info',
      },

      {
        title: 'બળતણ કિંમત માહિતી',
        link: '/web/fuel-price-info',
      },

    ],
  },
  {
    title: 'મારું ખાતું',
    icon: 'person',
    link: '/web/myaccount',
    children: [
      {
        title: 'મારી પ્રોફાઈલ',
        link: '/web/myaccount/myprofile',
      },
      {
        title: 'મારું પાકીટ',
        link: '/web/myaccount/mywallet',
      },
      {
        title: 'મારી સફરો',
        link: '/web/myaccount/mytrips',
      },
      {
        title: 'મારો જિઓફenceન્સ',
        link: '/web/myaccount/mygeofence',
      },
      {
        title: 'મારા શેર કરેલા વપરાશકર્તાઓ',
        pathMatch: 'prefix',
        link: '/web/myaccount/mysharedusers',
      },
      {
        title: 'મારા ડ્રાઈવરો',
        pathMatch: 'prefix',
        link: '/web/myaccount/mydrivers',
      },
      {
        title: 'મારા જૂથો',
        pathMatch: 'prefix',
        link: '/web/myaccount/mygroups',
      },

      {
        title: 'ફાસ્ટ ટેગ',
        pathMatch: 'prefix',
        link: '/web/myaccount/fast-tag-info',
      },

      // {
      //   title: 'મારી તાપમાન ચેતવણીઓ',
      //   pathMatch: 'prefix',
      //   link: '/web/myaccount/MyTemperatureAlerts',
      // },

    ],

  },

  {
    title: 'અહેવાલો અને ચાર્ટ્સ',
    icon: 'browser-outline',
    link: '/web/reports_charts',
  },
  {
    title: 'કાફલો મેનેજમેન્ટ',
    icon: 'pie-chart-outline',
    link: '/web/fleet-management',
  },


  {
    title: 'ચેતવણીઓ અને સૂચનાઓ',
    icon: 'bell-off-outline',
    link: '/web/alert_notifications',
  },

  {
    title: 'બસ મેનેજમેન્ટ',
    icon: 'car-outline',
    link: '/web/bus_management',
    children: [
      {
        title: 'સંસ્થાઓ',
        link: '/web/bus_management/organisations',
      },
      {
        title: 'શાખાઓ',
        link: '/web/bus_management/branches',
      },
      {
        title: 'કર્મચારી',
        link: '/web/bus_management/employees',
      },
      {
        title: 'જીઓફencesન્સ',
        link: '/web/bus_management/geofence',
      },
      {
        title: 'માર્ગો',
        link: '/web/bus_management/bus_routes',
      },

      {
        title: 'સમય',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_timings',
      },
      {
        title: 'બસો',
        pathMatch: 'prefix',
        link: '/web/bus_management/buses',
      },

      {
        title: 'સફરો',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_trips',
      },
      {
        title: 'મુસાફરો',
        pathMatch: 'prefix',
        link: '/web/bus_management/passengers',
      },

      {
        title: 'સૂચનાઓ',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_notifications',
      },

    ],

  },

  {
    title: 'જીપીએસ લોક',
    icon: 'message-circle-outline',
    link: '/web/gpslock',
  },
  // {
  //   title: 'ખરીદી',
  //   icon: 'layout-outline',
  //   link: '/web/purchases',
  //   children: [
  //     {
  //       title: 'યોજનાઓ ખરીદો',
  //       link: '/web/purchases/buyplans',
  //     },
  //     {
  //       title: 'ઉત્પાદનો ખરીદો',
  //       link: '/web/purchases/buyproducts',
  //     },
  //     {
  //       title: 'મારા ઓર્ડર',
  //       link: '/web/purchases/myorders',
  //     },

  //   ],
  // },

  {
    title: 'અન્ય',
    icon: 'edit-2-outline',
    link: '/web/others',
    children: [
      {
        title: 'સેટિંગ્સ',
        link: '/web/others/settings',
      },
      {
        title: 'અમારો સંપર્ક કરો',
        link: '/web/others/contactus',
      },
      {
        title: 'સહાય કરો',
        link: '/web/others/help',
      },
      {
        title: 'સંદર્ભ લો અને કમાઓ',
        link: '/web/others/refernearn',
      },
    ],
  },
  // {
  //   title: 'Logout',
  //   icon: 'power-outline',
  //   link: '/login',
  // },
];
export const HI_MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'घर',
    icon: 'home-outline',
    link: '/web/dashboard',
    home: true,

    children: [
      {
        title: 'डैशबोर्ड',
        link: '/web/dashboard',
      },
      {
        title: 'लाइव ट्रैक',
        link: '/web/livetrack',
      },
      {
        title: 'ट्रैक इतिहास',
        link: '/web/track_history',
      },
      {
        title: 'संक्षिप्त रिपोर्ट',
        link: '/web/summary_report',
      },
      {
        title: 'ईंधन डैशबोर्ड',
        link: '/web/fuel_dashboard',
      },
      {
        title: 'तापमान डैशबोर्ड',
        link: '/web/temperature_dashboard',
      },

      {
        title: 'लिंक प्रबंधन साझा किया',
        link: '/web/shared-management',
      },

      {
        title: 'टोल प्लाजा की जानकारी',
        link: '/web/toll-plaza-info',
      },

      {
        title: 'ईंधन मूल्य की जानकारी',
        link: '/web/fuel-price-info',
      },

    ],
  },
  {
    title: 'मेरा खाता',
    icon: 'person',
    link: '/web/myaccount',
    children: [
      {
        title: 'मेरी प्रोफाइल',
        link: '/web/myaccount/myprofile',
      },
      {
        title: 'मेरा बटुआ',
        link: '/web/myaccount/mywallet',
      },
      {
        title: 'मेरे सुझाव',
        link: '/web/myaccount/mytrips',
      },
      {
        title: 'माय जिओफेंस',
        link: '/web/myaccount/mygeofence',
      },
      {
        title: 'मेरे साझा उपयोगकर्ता',
        pathMatch: 'prefix',
        link: '/web/myaccount/mysharedusers',
      },
      {
        title: 'मेरे ड्राइवर',
        pathMatch: 'prefix',
        link: '/web/myaccount/mydrivers',
      },
      {
        title: 'मेरे समूह',
        pathMatch: 'prefix',
        link: '/web/myaccount/mygroups',
      },

      {
        title: 'फास्ट टैग',
        pathMatch: 'prefix',
        link: '/web/myaccount/fast-tag-info',
      },

      // {
      //   title: 'मेरा तापमान अलर्ट',
      //   pathMatch: 'prefix',
      //   link: '/web/myaccount/MyTemperatureAlerts',
      // },

    ],

  },

  {
    title: 'रिपोर्ट और चार्ट',
    icon: 'browser-outline',
    link: '/web/reports_charts',
  },
  {
    title: 'बेड़े प्रबंधन',
    icon: 'pie-chart-outline',
    link: '/web/fleet-management',
  },


  {
    title: 'अलर्ट और सूचनाएं',
    icon: 'bell-off-outline',
    link: '/web/alert_notifications',
  },

  {
    title: 'बस प्रबंधन',
    icon: 'car-outline',
    link: '/web/bus_management',
    children: [
      {
        title: 'संगठनों',
        link: '/web/bus_management/organisations',
      },
      {
        title: 'शाखाओं',
        link: '/web/bus_management/branches',
      },
      {
        title: 'कर्मचारियों',
        link: '/web/bus_management/employees',
      },
      {
        title: 'भू-बाड़े',
        link: '/web/bus_management/geofence',
      },
      {
        title: 'मार्गों',
        link: '/web/bus_management/bus_routes',
      },

      {
        title: 'समय',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_timings',
      },
      {
        title: 'बसों',
        pathMatch: 'prefix',
        link: '/web/bus_management/buses',
      },

      {
        title: 'ट्रिप्स',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_trips',
      },
      {
        title: 'यात्रियों',
        pathMatch: 'prefix',
        link: '/web/bus_management/passengers',
      },

      {
        title: 'सूचनाएं',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_notifications',
      },

    ],

  },

  {
    title: 'जीपीएस लॉक',
    icon: 'message-circle-outline',
    link: '/web/gpslock',
  },
  // {
  //   title: 'खरीद',
  //   icon: 'layout-outline',
  //   link: '/web/purchases',
  //   children: [
  //     {
  //       title: 'योजनाएं खरीदें',
  //       link: '/web/purchases/buyplans',
  //     },
  //     {
  //       title: 'उत्पाद खरीदें',
  //       link: '/web/purchases/buyproducts',
  //     },
  //     {
  //       title: 'मेरे आदेश',
  //       link: '/web/purchases/myorders',
  //     },

  //   ],
  // },



  {
    title: 'अन्य',
    icon: 'edit-2-outline',
    link: '/web/others',
    children: [
      {
        title: 'समायोजन',
        link: '/web/others/settings',
      },
      {
        title: 'संपर्क करें',
        link: '/web/others/contactus',
      },
      {
        title: 'हाथ बटाना',
        link: '/web/others/help',
      },
      {
        title: 'देखें और कमाएँ',
        link: '/web/others/refernearn',
      },
    ],
  },
  // {
  //   title: 'Logout',
  //   icon: 'power-outline',
  //   link: '/login',
  // },
];
export const KN_MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'ಮನೆ',
    icon: 'home-outline',
    link: '/web/dashboard',
    home: true,

    children: [
      {
        title: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        link: '/web/dashboard',
      },
      {
        title: 'ಲೈವ್ ಟ್ರ್ಯಾಕ್',
        link: '/web/livetrack',
      },
      {
        title: 'ಟ್ರ್ಯಾಕ್ ಇತಿಹಾಸ',
        link: '/web/track_history',
      },
      {
        title: 'ಸಾರಾಂಶ ವರದಿ',
        link: '/web/summary_report',
      },
      {
        title: 'ಇಂಧನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        link: '/web/fuel_dashboard',
      },
      {
        title: 'ತಾಪಮಾನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        link: '/web/temperature_dashboard',
      },

      {
        title: 'ಹಂಚಿದ ಲಿಂಕ್ ನಿರ್ವಹಣೆ',
        link: '/web/shared-management',
      },

      {
        title: 'ಟೋಲ್ ಪ್ಲಾಜಾ ಮಾಹಿತಿ',
        link: '/web/toll-plaza-info',
      },

      {
        title: 'ಇಂಧನ ಬೆಲೆ ಮಾಹಿತಿ',
        link: '/web/fuel-price-info',
      },

    ],
  },
  {
    title: 'ನನ್ನ ಖಾತೆ',
    icon: 'person',
    link: '/web/myaccount',
    children: [
      {
        title: 'ಸ್ವ ಭೂಮಿಕೆ',
        link: '/web/myaccount/myprofile',
      },
      {
        title: 'ನನ್ನ ಕೈಚೀಲ',
        link: '/web/myaccount/mywallet',
      },
      {
        title: 'ನನ್ನ ಪ್ರವಾಸಗಳು',
        link: '/web/myaccount/mytrips',
      },
      {
        title: 'ನನ್ನ ಜಿಯೋಫೆನ್ಸ್',
        link: '/web/myaccount/mygeofence',
      },
      {
        title: 'ನನ್ನ ಹಂಚಿದ ಬಳಕೆದಾರರು',
        pathMatch: 'prefix',
        link: '/web/myaccount/mysharedusers',
      },
      {
        title: 'ನನ್ನ ಚಾಲಕರು',
        pathMatch: 'prefix',
        link: '/web/myaccount/mydrivers',
      },
      {
        title: 'ನನ್ನ ಗುಂಪುಗಳು',
        pathMatch: 'prefix',
        link: '/web/myaccount/mygroups',
      },

      {
        title: 'ವೇಗದ ಟ್ಯಾಗ್',
        pathMatch: 'prefix',
        link: '/web/myaccount/fast-tag-info',
      },

      // {
      //   title: 'ನನ್ನ ತಾಪಮಾನ ಎಚ್ಚರಿಕೆಗಳು',
      //   pathMatch: 'prefix',
      //   link: '/web/myaccount/MyTemperatureAlerts',
      // },

    ],

  },

  {
    title: 'ವರದಿಗಳು ಮತ್ತು ಪಟ್ಟಿಯಲ್ಲಿ',
    icon: 'browser-outline',
    link: '/web/reports_charts',
  },
  {
    title: 'ಫ್ಲೀಟ್ ನಿರ್ವಹಣೆ',
    icon: 'pie-chart-outline',
    link: '/web/fleet-management',
  },


  {
    title: 'ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಅಧಿಸೂಚನೆಗಳು',
    icon: 'bell-off-outline',
    link: '/web/alert_notifications',
  },

  {
    title: 'ಬಸ್ ನಿರ್ವಹಣೆ',
    icon: 'car-outline',
    link: '/web/bus_management',
    children: [
      {
        title: 'ಸಂಸ್ಥೆಗಳು',
        link: '/web/bus_management/organisations',
      },
      {
        title: 'ಶಾಖೆಗಳು',
        link: '/web/bus_management/branches',
      },
      {
        title: 'ನೌಕರರು',
        link: '/web/bus_management/employees',
      },
      {
        title: 'ಜಿಯೋಫೆನ್ಸಸ್',
        link: '/web/bus_management/geofence',
      },
      {
        title: 'ಮಾರ್ಗಗಳು',
        link: '/web/bus_management/bus_routes',
      },

      {
        title: 'ಸಮಯಗಳು',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_timings',
      },
      {
        title: 'ಬಸ್ಸುಗಳು',
        pathMatch: 'prefix',
        link: '/web/bus_management/buses',
      },

      {
        title: 'ಪ್ರವಾಸಗಳು',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_trips',
      },
      {
        title: 'ಪ್ರಯಾಣಿಕರು',
        pathMatch: 'prefix',
        link: '/web/bus_management/passengers',
      },

      {
        title: 'ಅಧಿಸೂಚನೆಗಳು',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_notifications',
      },

    ],

  },

  {
    title: 'ಜಿಪಿಎಸ್ ಲಾಕ್',
    icon: 'message-circle-outline',
    link: '/web/gpslock',
  },
  // {
  //   title: 'ಖರೀದಿಗಳು',
  //   icon: 'layout-outline',
  //   link: '/web/purchases',
  //   children: [
  //     {
  //       title: 'ಯೋಜನೆಗಳನ್ನು ಖರೀದಿಸಿ',
  //       link: '/web/purchases/buyplans',
  //     },
  //     {
  //       title: 'ಉತ್ಪನ್ನಗಳನ್ನು ಖರೀದಿಸಿ',
  //       link: '/web/purchases/buyproducts',
  //     },
  //     {
  //       title: 'ನನ್ನ ಆಜ್ಞೆಗಳು',
  //       link: '/web/purchases/myorders',
  //     },

  //   ],
  // },

  {
    title: 'ಇತರರು',
    icon: 'edit-2-outline',
    link: '/web/others',
    children: [
      {
        title: 'ಸಂಯೋಜನೆಗಳು',
        link: '/web/others/settings',
      },
      {
        title: 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ',
        link: '/web/others/contactus',
      },
      {
        title: 'ಸಹಾಯ',
        link: '/web/others/help',
      },
      {
        title: 'ನೋಡಿ ಮತ್ತು ಸಂಪಾದಿಸಿ',
        link: '/web/others/refernearn',
      },
    ],
  },
  // {
  //   title: 'Logout',
  //   icon: 'power-outline',
  //   link: '/login',
  // },
];
export const ML_MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'വീട്',
    icon: 'home-outline',
    link: '/web/dashboard',
    home: true,

    children: [
      {
        title: 'ഡാഷ്ബോർഡ്',
        link: '/web/dashboard',
      },
      {
        title: 'തത്സമയ ട്രാക്ക്',
        link: '/web/livetrack',
      },
      {
        title: 'ചരിത്രം ട്രാക്കുചെയ്യുക',
        link: '/web/track_history',
      },
      {
        title: 'സംഗ്രഹ റിപ്പോർട്ട്',
        link: '/web/summary_report',
      },
      {
        title: 'ഇന്ധന ഡാഷ്‌ബോർഡ്',
        link: '/web/fuel_dashboard',
      },
      {
        title: 'താപനില ഡാഷ്‌ബോർഡ്',
        link: '/web/temperature_dashboard',
      },

      {
        title: 'പങ്കിട്ട ലിങ്ക് മാനേജുമെന്റ്',
        link: '/web/shared-management',
      },

      {
        title: 'ടോൾ പ്ലാസ വിവരം',
        link: '/web/toll-plaza-info',
      },

      {
        title: 'ഇന്ധന വില വിവരം',
        link: '/web/fuel-price-info',
      },

    ],
  },
  {
    title: 'എന്റെ അക്കൗണ്ട്',
    icon: 'person',
    link: '/web/myaccount',
    children: [
      {
        title: 'എന്റെ പ്രൊഫൈൽ',
        link: '/web/myaccount/myprofile',
      },
      {
        title: 'എന്റെ പണസഞ്ചി',
        link: '/web/myaccount/mywallet',
      },
      {
        title: 'എന്റെ യാത്രകൾ',
        link: '/web/myaccount/mytrips',
      },
      {
        title: 'എന്റെ ജിയോഫെൻസ്',
        link: '/web/myaccount/mygeofence',
      },
      {
        title: 'എന്റെ പങ്കിട്ട ഉപയോക്താക്കൾ',
        pathMatch: 'prefix',
        link: '/web/myaccount/mysharedusers',
      },
      {
        title: 'എന്റെ ഡ്രൈവറുകൾ',
        pathMatch: 'prefix',
        link: '/web/myaccount/mydrivers',
      },
      {
        title: 'എന്റെ ഗ്രൂപ്പുകൾ',
        pathMatch: 'prefix',
        link: '/web/myaccount/mygroups',
      },

      {
        title: 'ഫാസ്റ്റ് ടാഗ്',
        pathMatch: 'prefix',
        link: '/web/myaccount/fast-tag-info',
      },

      // {
      //   title: 'എന്റെ താപനില അലേർട്ടുകൾ',
      //   pathMatch: 'prefix',
      //   link: '/web/myaccount/MyTemperatureAlerts',
      // },

    ],

  },

  {
    title: 'റിപ്പോർട്ടുകളും ചാർട്ടുകളും',
    icon: 'browser-outline',
    link: '/web/reports_charts',
  },
  {
    title: 'ഫ്ലീറ്റ് മാനേജ്മെന്റ്',
    icon: 'pie-chart-outline',
    link: '/web/fleet-management',
  },


  {
    title: 'അലേർട്ടുകളും അറിയിപ്പുകളും',
    icon: 'bell-off-outline',
    link: '/web/alert_notifications',
  },

  {
    title: 'ബസ് മാനേജ്മെന്റ്',
    icon: 'car-outline',
    link: '/web/bus_management',
    children: [
      {
        title: 'ഓർഗനൈസേഷനുകൾ',
        link: '/web/bus_management/organisations',
      },
      {
        title: 'ശാഖകൾ',
        link: '/web/bus_management/branches',
      },
      {
        title: 'ജീവനക്കാർ',
        link: '/web/bus_management/employees',
      },
      {
        title: 'ജിയോഫെൻസസ്',
        link: '/web/bus_management/geofence',
      },
      {
        title: 'വഴികൾ',
        link: '/web/bus_management/bus_routes',
      },

      {
        title: 'സമയം',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_timings',
      },
      {
        title: 'ബസുകൾ',
        pathMatch: 'prefix',
        link: '/web/bus_management/buses',
      },

      {
        title: 'യാത്രകൾ',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_trips',
      },
      {
        title: 'യാത്രക്കാർ',
        pathMatch: 'prefix',
        link: '/web/bus_management/passengers',
      },

      {
        title: 'അറിയിപ്പുകൾ',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_notifications',
      },

    ],

  },

  {
    title: 'ജിപിഎസ് ലോക്ക്',
    icon: 'message-circle-outline',
    link: '/web/gpslock',
  },
  // {
  //   title: 'വാങ്ങലുകൾ',
  //   icon: 'layout-outline',
  //   link: '/web/purchases',
  //   children: [
  //     {
  //       title: 'പദ്ധതികൾ വാങ്ങുക',
  //       link: '/web/purchases/buyplans',
  //     },
  //     {
  //       title: 'ഉൽപ്പന്നങ്ങൾ വാങ്ങുക',
  //       link: '/web/purchases/buyproducts',
  //     },
  //     {
  //       title: 'എന്റെ ഓർഡറുകൾ',
  //       link: '/web/purchases/myorders',
  //     },

  //   ],
  // },



  {
    title: 'മറ്റുള്ളവർ',
    icon: 'edit-2-outline',
    link: '/web/others',
    children: [
      {
        title: 'ക്രമീകരണങ്ങൾ',
        link: '/web/others/settings',
      },
      {
        title: 'ഞങ്ങളെ സമീപിക്കുക',
        link: '/web/others/contactus',
      },
      {
        title: 'സഹായം',
        link: '/web/others/help',
      },
      {
        title: 'റഫർ & സമ്പാദിക്കുക',
        link: '/web/others/refernearn',
      },
    ],
  },
  // {
  //   title: 'Logout',
  //   icon: 'power-outline',
  //   link: '/login',
  // },
];
export const MR_MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'मुख्यपृष्ठ',
    icon: 'home-outline',
    link: '/web/dashboard',
    home: true,

    children: [
      {
        title: 'डॅशबोर्ड',
        link: '/web/dashboard',
      },
      {
        title: 'थेट ट्रॅक',
        link: '/web/livetrack',
      },
      {
        title: 'ट्रॅक इतिहास',
        link: '/web/track_history',
      },
      {
        title: 'सारांश अहवाल',
        link: '/web/summary_report',
      },
      {
        title: 'इंधन डॅशबोर्ड',
        link: '/web/fuel_dashboard',
      },
      {
        title: 'तापमान डॅशबोर्ड',
        link: '/web/temperature_dashboard',
      },

      {
        title: 'सामायिक दुवा व्यवस्थापन',
        link: '/web/shared-management',
      },

      {
        title: 'टोल प्लाझा माहिती',
        link: '/web/toll-plaza-info',
      },

      {
        title: 'इंधन किंमतीची माहिती',
        link: '/web/fuel-price-info',
      },

    ],
  },
  {
    title: 'माझे खाते',
    icon: 'person',
    link: '/web/myaccount',
    children: [
      {
        title: 'माझे प्रोफाइल',
        link: '/web/myaccount/myprofile',
      },
      {
        title: 'माझे पाकीट',
        link: '/web/myaccount/mywallet',
      },
      {
        title: 'माझ्या ट्रिप्स',
        link: '/web/myaccount/mytrips',
      },
      {
        title: 'माझे जिओफेंस',
        link: '/web/myaccount/mygeofence',
      },
      {
        title: 'माझे सामायिक वापरकर्ते',
        pathMatch: 'prefix',
        link: '/web/myaccount/mysharedusers',
      },
      {
        title: 'माझे ड्रायव्हर्स',
        pathMatch: 'prefix',
        link: '/web/myaccount/mydrivers',
      },
      {
        title: 'माझे गट',
        pathMatch: 'prefix',
        link: '/web/myaccount/mygroups',
      },

      {
        title: 'वेगवान टॅग',
        pathMatch: 'prefix',
        link: '/web/myaccount/fast-tag-info',
      },

      // {
      //   title: 'माझे तापमान अलर्ट',
      //   pathMatch: 'prefix',
      //   link: '/web/myaccount/MyTemperatureAlerts',
      // },

    ],

  },

  {
    title: 'अहवाल आणि चार्ट',
    icon: 'browser-outline',
    link: '/web/reports_charts',
  },
  {
    title: 'ताफा व्यवस्थापन',
    icon: 'pie-chart-outline',
    link: '/web/fleet-management',
  },

  {
    title: 'सूचना आणि सूचना',
    icon: 'bell-off-outline',
    link: '/web/alert_notifications',
  },

  {
    title: 'बस व्यवस्थापन',
    icon: 'car-outline',
    link: '/web/bus_management',
    children: [
      {
        title: 'संस्था',
        link: '/web/bus_management/organisations',
      },
      {
        title: 'शाखा',
        link: '/web/bus_management/branches',
      },
      {
        title: 'कर्मचारी',
        link: '/web/bus_management/employees',
      },
      {
        title: 'जिओफेन्स',
        link: '/web/bus_management/geofence',
      },
      {
        title: 'मार्ग',
        link: '/web/bus_management/bus_routes',
      },

      {
        title: 'वेळ',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_timings',
      },
      {
        title: 'बस',
        pathMatch: 'prefix',
        link: '/web/bus_management/buses',
      },

      {
        title: 'ट्रिप्स',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_trips',
      },
      {
        title: 'प्रवासी',
        pathMatch: 'prefix',
        link: '/web/bus_management/passengers',
      },

      {
        title: 'अधिसूचना',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_notifications',
      },

    ],

  },

  {
    title: 'जीपीएस लॉक',
    icon: 'message-circle-outline',
    link: '/web/gpslock',
  },
  // {
  //   title: 'खरेदी',
  //   icon: 'layout-outline',
  //   link: '/web/purchases',
  //   children: [
  //     {
  //       title: 'योजना खरेदी करा',
  //       link: '/web/purchases/buyplans',
  //     },
  //     {
  //       title: 'उत्पादने खरेदी करा',
  //       link: '/web/purchases/buyproducts',
  //     },
  //     {
  //       title: 'माझे आदेश',
  //       link: '/web/purchases/myorders',
  //     },

  //   ],
  // },



  {
    title: 'इतर',
    icon: 'edit-2-outline',
    link: '/web/others',
    children: [
      {
        title: 'सेटिंग्ज',
        link: '/web/others/settings',
      },
      {
        title: 'आमच्याशी संपर्क साधा',
        link: '/web/others/contactus',
      },
      {
        title: 'मदत करा',
        link: '/web/others/help',
      },
      {
        title: 'पहा आणि कमवा',
        link: '/web/others/refernearn',
      },
    ],
  },
  // {
  //   title: 'Logout',
  //   icon: 'power-outline',
  //   link: '/login',
  // },
];
export const OR_MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'ଘର',
    icon: 'home-outline',
    link: '/web/dashboard',
    home: true,

    children: [
      {
        title: 'ଡ୍ୟାସବୋର୍ଡ |',
        link: '/web/dashboard',
      },
      {
        title: 'ଲାଇଭ୍ ଟ୍ରାକ୍ |',
        link: '/web/livetrack',
      },
      {
        title: 'ଇତିହାସ ଟ୍ରାକ୍ କରନ୍ତୁ |',
        link: '/web/track_history',
      },
      {
        title: 'ସାରାଂଶ ରିପୋର୍ଟ',
        link: '/web/summary_report',
      },
      {
        title: 'ଇନ୍ଧନ ଡ୍ୟାସବୋର୍ଡ |',
        link: '/web/fuel_dashboard',
      },
      {
        title: 'ତାପମାତ୍ରା ଡ୍ୟାସବୋର୍ଡ |',
        link: '/web/temperature_dashboard',
      },

      {
        title: 'ଅଂଶୀଦାର ଲିଙ୍କ୍ ପରିଚାଳନା |',
        link: '/web/shared-management',
      },

      {
        title: 'ଟୋଲ୍ ପ୍ଲାଜା ସୂଚନା |',
        link: '/web/toll-plaza-info',
      },

      {
        title: 'ଇନ୍ଧନ ମୂଲ୍ୟ ସୂଚନା',
        link: '/web/fuel-price-info',
      },

    ],
  },
  {
    title: 'ମୋ ଖାତା',
    icon: 'person',
    link: '/web/myaccount',
    children: [
      {
        title: 'ମୋର ପ୍ରୋଫାଇଲ୍',
        link: '/web/myaccount/myprofile',
      },
      {
        title: 'ମୋର ୱାଲେଟ୍',
        link: '/web/myaccount/mywallet',
      },
      {
        title: 'ମୋର ଯାତ୍ରା',
        link: '/web/myaccount/mytrips',
      },
      {
        title: 'ମୋର ଜିଓଫେନ୍ସ |',
        link: '/web/myaccount/mygeofence',
      },
      {
        title: 'ମୋର ଅଂଶୀଦାର ବ୍ୟବହାରକାରୀ |',
        pathMatch: 'prefix',
        link: '/web/myaccount/mysharedusers',
      },
      {
        title: 'ମୋର ଡ୍ରାଇଭରଗୁଡ଼ିକ',
        pathMatch: 'prefix',
        link: '/web/myaccount/mydrivers',
      },
      {
        title: 'ମୋର ଗୋଷ୍ଠୀ',
        pathMatch: 'prefix',
        link: '/web/myaccount/mygroups',
      },

      {
        title: 'ଫାଷ୍ଟ ଟ୍ୟାଗ୍ |',
        pathMatch: 'prefix',
        link: '/web/myaccount/fast-tag-info',
      },

      // {
      //   title: 'ମୋର ତାପମାତ୍ରା ଆଲର୍ଟ |',
      //   pathMatch: 'prefix',
      //   link: '/web/myaccount/MyTemperatureAlerts',
      // },

    ],

  },

  {
    title: 'ରିପୋର୍ଟ ଏବଂ ଚାର୍ଟ',
    icon: 'browser-outline',
    link: '/web/reports_charts',
  },
  {
    title: 'ଫ୍ଲାଇଟ୍ ପରିଚାଳନା',
    icon: 'pie-chart-outline',
    link: '/web/fleet-management',
  },


  {
    title: 'ସତର୍କତା ଏବଂ ବିଜ୍ଞପ୍ତିଗୁଡିକ |',
    icon: 'bell-off-outline',
    link: '/web/alert_notifications',
  },

  {
    title: 'ବସ୍ ପରିଚାଳନା',
    icon: 'car-outline',
    link: '/web/bus_management',
    children: [
      {
        title: 'ସଂଗଠନଗୁଡିକ',
        link: '/web/bus_management/organisations',
      },
      {
        title: 'ଶାଖା',
        link: '/web/bus_management/branches',
      },
      {
        title: 'କର୍ମଚାରୀ',
        link: '/web/bus_management/employees',
      },
      {
        title: 'ଜିଓଫେନ୍ସ |',
        link: '/web/bus_management/geofence',
      },
      {
        title: 'ମାର୍ଗ',
        link: '/web/bus_management/bus_routes',
      },

      {
        title: 'ସମୟ',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_timings',
      },
      {
        title: 'ବସ୍',
        pathMatch: 'prefix',
        link: '/web/bus_management/buses',
      },

      {
        title: 'ଯାତ୍ରା',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_trips',
      },
      {
        title: 'ଯାତ୍ରୀମାନେ |',
        pathMatch: 'prefix',
        link: '/web/bus_management/passengers',
      },

      {
        title: 'ବିଜ୍ଞପ୍ତିଗୁଡିକ',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_notifications',
      },

    ],

  },

  {
    title: 'ଜିପିଏସ୍ ଲକ୍ |',
    icon: 'message-circle-outline',
    link: '/web/gpslock',
  },
  // {
  //   title: 'କ୍ରୟ',
  //   icon: 'layout-outline',
  //   link: '/web/purchases',
  //   children: [
  //     {
  //       title: 'ଯୋଜନା କିଣନ୍ତୁ |',
  //       link: '/web/purchases/buyplans',
  //     },
  //     {
  //       title: 'ଉତ୍ପାଦ କିଣନ୍ତୁ |',
  //       link: '/web/purchases/buyproducts',
  //     },
  //     {
  //       title: 'ମୋର ଆଦେଶ',
  //       link: '/web/purchases/myorders',
  //     },

  //   ],
  // },

  {
    title: 'ଅନ୍ୟମାନେ |',
    icon: 'edit-2-outline',
    link: '/web/others',
    children: [
      {
        title: 'ସେଟିଂସମୂହ',
        link: '/web/others/settings',
      },
      {
        title: 'ଆମ ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ |',
        link: '/web/others/contactus',
      },
      {
        title: 'ସାହାଯ୍ୟ',
        link: '/web/others/help',
      },
      {
        title: 'ଅନୁସରଣ କରନ୍ତୁ ଏବଂ ରୋଜଗାର କରନ୍ତୁ |',
        link: '/web/others/refernearn',
      },
    ],
  },
  // {
  //   title: 'Logout',
  //   icon: 'power-outline',
  //   link: '/login',
  // },
];
export const TA_MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'வீடு',
    icon: 'home-outline',
    link: '/web/dashboard',
    home: true,

    children: [
      {
        title: 'டாஷ்போர்டு',
        link: '/web/dashboard',
      },
      {
        title: 'லைவ் ட்ராக்',
        link: '/web/livetrack',
      },
      {
        title: 'ட்ராக் வரலாறு',
        link: '/web/track_history',
      },
      {
        title: 'சுருக்கம் அறிக்கை',
        link: '/web/summary_report',
      },
      {
        title: 'எரிபொருள் டாஷ்போர்டு',
        link: '/web/fuel_dashboard',
      },
      {
        title: 'வெப்பநிலை டாஷ்போர்டு',
        link: '/web/temperature_dashboard',
      },

      {
        title: 'பகிரப்பட்ட இணைப்பு மேலாண்மை',
        link: '/web/shared-management',
      },

      {
        title: 'டோல் பிளாசா தகவல்',
        link: '/web/toll-plaza-info',
      },

      {
        title: 'எரிபொருள் விலை தகவல்',
        link: '/web/fuel-price-info',
      },

    ],
  },
  {
    title: 'என் கணக்கு',
    icon: 'person',
    link: '/web/myaccount',
    children: [
      {
        title: 'என் சுயவிவரம்',
        link: '/web/myaccount/myprofile',
      },
      {
        title: 'என் பணப்பை',
        link: '/web/myaccount/mywallet',
      },
      {
        title: 'எனது பயணங்கள்',
        link: '/web/myaccount/mytrips',
      },
      {
        title: 'என் ஜியோஃபென்ஸ்',
        link: '/web/myaccount/mygeofence',
      },
      {
        title: 'எனது பகிரப்பட்ட பயனர்கள்',
        pathMatch: 'prefix',
        link: '/web/myaccount/mysharedusers',
      },
      {
        title: 'எனது இயக்கிகள்',
        pathMatch: 'prefix',
        link: '/web/myaccount/mydrivers',
      },
      {
        title: 'எனது குழுக்கள்',
        pathMatch: 'prefix',
        link: '/web/myaccount/mygroups',
      },

      {
        title: 'வேகமான குறிச்சொல்',
        pathMatch: 'prefix',
        link: '/web/myaccount/fast-tag-info',
      },

      // {
      //   title: 'எனது வெப்பநிலை எச்சரிக்கைகள்',
      //   pathMatch: 'prefix',
      //   link: '/web/myaccount/MyTemperatureAlerts',
      // },

    ],

  },

  {
    title: 'அறிக்கைகள் & விளக்கப்படங்கள்',
    icon: 'browser-outline',
    link: '/web/reports_charts',
  },
  {
    title: 'கப்பற்படை மேலாண்மை',
    icon: 'pie-chart-outline',
    link: '/web/fleet-management',
  },


  {
    title: 'விழிப்பூட்டல்கள் மற்றும் அறிவிப்புகள்',
    icon: 'bell-off-outline',
    link: '/web/alert_notifications',
  },

  {
    title: 'பஸ் மேலாண்மை',
    icon: 'car-outline',
    link: '/web/bus_management',
    children: [
      {
        title: 'நிறுவனங்கள்',
        link: '/web/bus_management/organisations',
      },
      {
        title: 'கிளைகள்',
        link: '/web/bus_management/branches',
      },
      {
        title: 'ஊழியர்கள்',
        link: '/web/bus_management/employees',
      },
      {
        title: 'ஜியோஃபென்ஸ்கள்',
        link: '/web/bus_management/geofence',
      },
      {
        title: 'வழிகள்',
        link: '/web/bus_management/bus_routes',
      },

      {
        title: 'நேரம்',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_timings',
      },
      {
        title: 'பேருந்துகள்',
        pathMatch: 'prefix',
        link: '/web/bus_management/buses',
      },

      {
        title: 'பயணங்கள்',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_trips',
      },
      {
        title: 'பயணிகள்',
        pathMatch: 'prefix',
        link: '/web/bus_management/passengers',
      },

      {
        title: 'அறிவிப்புகள்',
        pathMatch: 'prefix',
        link: '/web/bus_management/bus_notifications',
      },

    ],

  },

  {
    title: 'ஜி.பி.எஸ் பூட்டு',
    icon: 'message-circle-outline',
    link: '/web/gpslock',
  },
  // {
  //   title: 'கொள்முதல்',
  //   icon: 'layout-outline',
  //   link: '/web/purchases',
  //   children: [
  //     {
  //       title: 'திட்டங்களை வாங்கவும்',
  //       link: '/web/purchases/buyplans',
  //     },
  //     {
  //       title: 'தயாரிப்புகளை வாங்கவும்',
  //       link: '/web/purchases/buyproducts',
  //     },
  //     {
  //       title: 'என் கட்டளைகள்',
  //       link: '/web/purchases/myorders',
  //     },

  //   ],
  // },



  {
    title: 'மற்றவைகள்',
    icon: 'edit-2-outline',
    link: '/web/others',
    children: [
      {
        title: 'அமைப்புகள்',
        link: '/web/others/settings',
      },
      {
        title: 'எங்களை தொடர்பு கொள்ள',
        link: '/web/others/contactus',
      },
      {
        title: 'உதவி',
        link: '/web/others/help',
      },
      {
        title: 'பார்க்கவும் சம்பாதிக்கவும்',
        link: '/web/others/refernearn',
      },
    ],
  },
  // {
  //   title: 'Logout',
  //   icon: 'power-outline',
  //   link: '/login',
  // },
];

