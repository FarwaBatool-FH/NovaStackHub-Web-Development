/* ==========================================================
   Skyline — Weather App
   Data: Open-Meteo (no API key required)
   ========================================================== */

const els = {
  sky: document.getElementById('sky'),
  skyFx: document.getElementById('skyFx'),
  status: document.getElementById('status'),
  main: document.getElementById('mainContent'),
  errorBox: document.getElementById('errorBox'),
  errorText: document.getElementById('errorText'),
  retryBtn: document.getElementById('retryBtn'),
  locateBtn: document.getElementById('locateBtn'),
  themeBtn: document.getElementById('themeBtn'),
  unitBtn: document.getElementById('unitBtn'),
  favBtn: document.getElementById('favBtn'),
  favorites: document.getElementById('favorites'),
  searchForm: document.getElementById('searchForm'),
  cityInput: document.getElementById('cityInput'),
  suggestions: document.getElementById('suggestions'),

  heroIcon: document.getElementById('heroIcon'),
  temp: document.getElementById('temp'),
  condition: document.getElementById('condition'),
  place: document.getElementById('place'),
  dateTime: document.getElementById('dateTime'),
  tempMax: document.getElementById('tempMax'),
  tempMin: document.getElementById('tempMin'),
  feelsLike: document.getElementById('feelsLike'),

  hourly: document.getElementById('hourly'),
  daily: document.getElementById('daily'),

  humidity: document.getElementById('humidity'),
  wind: document.getElementById('wind'),
  pressure: document.getElementById('pressure'),
  uv: document.getElementById('uv'),
  visibility: document.getElementById('visibility'),
  sunrise: document.getElementById('sunrise'),
  sunset: document.getElementById('sunset'),
  lastUpdated: document.getElementById('lastUpdated'),

  outfitIcon: document.getElementById('outfitIcon'),
  outfitSuggestion: document.getElementById('outfitSuggestion'),
  aqiCard: document.getElementById('aqiCard'),
  aqiValue: document.getElementById('aqiValue'),
  aqiLabel: document.getElementById('aqiLabel'),
};

let lastCoords = null;
let lastData = null;      // most recent raw API response, kept for unit conversion without refetching
let unit = localStorage.getItem('skyline-unit') || 'metric';   // 'metric' (°C, km/h) | 'imperial' (°F, mph)
let theme = localStorage.getItem('skyline-theme') || 'dark';   // 'dark' | 'light' UI overlay
let favorites = JSON.parse(localStorage.getItem('skyline-favorites') || '[]');

/* ---------------- WMO weather code table ---------------- */
const WEATHER_CODES = {
  0:  { text: 'Clear sky',        group: 'clear'   },
  1:  { text: 'Mostly clear',     group: 'clear'   },
  2:  { text: 'Partly cloudy',    group: 'partly'  },
  3:  { text: 'Overcast',         group: 'overcast'},
  45: { text: 'Fog',              group: 'fog'     },
  48: { text: 'Rime fog',         group: 'fog'     },
  51: { text: 'Light drizzle',    group: 'drizzle' },
  53: { text: 'Drizzle',          group: 'drizzle' },
  55: { text: 'Dense drizzle',    group: 'drizzle' },
  56: { text: 'Freezing drizzle', group: 'drizzle' },
  57: { text: 'Freezing drizzle', group: 'drizzle' },
  61: { text: 'Light rain',       group: 'rain'    },
  63: { text: 'Rain',             group: 'rain'    },
  65: { text: 'Heavy rain',       group: 'rain'    },
  66: { text: 'Freezing rain',    group: 'rain'    },
  67: { text: 'Freezing rain',    group: 'rain'    },
  71: { text: 'Light snow',       group: 'snow'    },
  73: { text: 'Snow',             group: 'snow'    },
  75: { text: 'Heavy snow',       group: 'snow'    },
  77: { text: 'Snow grains',      group: 'snow'    },
  80: { text: 'Rain showers',     group: 'rain'    },
  81: { text: 'Rain showers',     group: 'rain'    },
  82: { text: 'Violent showers',  group: 'rain'    },
  85: { text: 'Snow showers',     group: 'snow'    },
  86: { text: 'Snow showers',     group: 'snow'    },
  95: { text: 'Thunderstorm',     group: 'storm'   },
  96: { text: 'Thunderstorm',     group: 'storm'   },
  99: { text: 'Severe storm',     group: 'storm'   },
};

function codeInfo(code) {
  return WEATHER_CODES[code] || { text: 'Unknown', group: 'clear' };
}

/* ---------------- Icon set (line-art SVGs) ---------------- */
function icon(group, isDay) {
  const stroke = `stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"`;
  switch (group) {
    case 'clear':
      return isDay
        ? `<svg viewBox="0 0 48 48" ${stroke}><circle cx="24" cy="24" r="9" fill="currentColor" stroke="none"/>
           <g>${[0,45,90,135,180,225,270,315].map(a=>`<line x1="24" y1="6" x2="24" y2="11" transform="rotate(${a} 24 24)"/>`).join('')}</g></svg>`
        : `<svg viewBox="0 0 48 48" ${stroke}><path d="M30 8a16 16 0 1 0 10 26A13 13 0 0 1 30 8z" fill="currentColor" stroke="none"/></svg>`;
    case 'partly':
      return `<svg viewBox="0 0 48 48" ${stroke}>
        <circle cx="18" cy="16" r="6" fill="currentColor" stroke="none"/>
        <path d="M14 34a8 8 0 0 1 1-16 10 10 0 0 1 19 4 7 7 0 0 1-2 12H14z"/>
      </svg>`;
    case 'overcast':
      return `<svg viewBox="0 0 48 48" ${stroke}>
        <path d="M12 32a8 8 0 0 1 2-15.8A11 11 0 0 1 35 20a7.5 7.5 0 0 1-2 12H12z"/>
        <path d="M14 38h20" opacity="0.5"/>
      </svg>`;
    case 'fog':
      return `<svg viewBox="0 0 48 48" ${stroke}>
        <path d="M9 18h30M6 24h36M9 30h30M13 36h22" />
      </svg>`;
    case 'drizzle':
      return `<svg viewBox="0 0 48 48" ${stroke}>
        <path d="M12 26a8 8 0 0 1 2-15.8A11 11 0 0 1 35 14a7.5 7.5 0 0 1-2 12H12z"/>
        <line x1="16" y1="34" x2="14" y2="39"/><line x1="24" y1="34" x2="22" y2="39"/><line x1="32" y1="34" x2="30" y2="39"/>
      </svg>`;
    case 'rain':
      return `<svg viewBox="0 0 48 48" ${stroke}>
        <path d="M12 24a8 8 0 0 1 2-15.8A11 11 0 0 1 35 12a7.5 7.5 0 0 1-2 12H12z"/>
        <line x1="15" y1="32" x2="12" y2="40"/><line x1="24" y1="32" x2="21" y2="40"/><line x1="33" y1="32" x2="30" y2="40"/>
      </svg>`;
    case 'snow':
      return `<svg viewBox="0 0 48 48" ${stroke}>
        <path d="M12 24a8 8 0 0 1 2-15.8A11 11 0 0 1 35 12a7.5 7.5 0 0 1-2 12H12z"/>
        <g stroke-width="1.4"><line x1="15" y1="33" x2="15" y2="40"/><line x1="11.5" y1="36.5" x2="18.5" y2="36.5"/>
        <line x1="24" y1="33" x2="24" y2="40"/><line x1="20.5" y1="36.5" x2="27.5" y2="36.5"/>
        <line x1="33" y1="33" x2="33" y2="40"/><line x1="29.5" y1="36.5" x2="36.5" y2="36.5"/></g>
      </svg>`;
    case 'storm':
      return `<svg viewBox="0 0 48 48" ${stroke}>
        <path d="M12 22a8 8 0 0 1 2-15.8A11 11 0 0 1 35 10a7.5 7.5 0 0 1-2 12H12z"/>
        <path d="M25 26l-6 10h6l-4 8 10-12h-6l4-6z" fill="currentColor" stroke="none"/>
      </svg>`;
    default:
      return `<svg viewBox="0 0 48 48" ${stroke}><circle cx="24" cy="24" r="9"/></svg>`;
  }
}

/* ---------------- Ambient sky background ---------------- */
function setSky(group, isDay) {
  const themes = {
    clear:    isDay ? ['#2E86FF','#6EC6FF','#BFE8FF'] : ['#050814','#0B1A33','#142A4D'],
    partly:   isDay ? ['#4E8FDB','#8FC3ED','#D3E9F7'] : ['#0B1220','#152238','#243450'],
    overcast: isDay ? ['#5B6472','#8992A0','#B7BEC7'] : ['#0d1015','#1c212b','#2c3340'],
    fog:      isDay ? ['#7d8694','#9aa3ae','#c3cad2'] : ['#14181f','#252b34','#3a414c'],
    drizzle:  isDay ? ['#3f5064','#5f7488','#8fa0af'] : ['#0b0f16','#1a212c','#2b3644'],
    rain:     isDay ? ['#33475c','#4c637a','#7891a3'] : ['#080b12','#141b26','#212c3a'],
    snow:     isDay ? ['#7B8FA6','#A9BBD0','#E4ECF5'] : ['#141a26','#243348','#3a4a63'],
    storm:    isDay ? ['#232733','#39404f','#545e6f'] : ['#07080c','#14161e','#22252f'],
  };
  const c = themes[group] || themes.clear;
  els.sky.style.background = `linear-gradient(180deg, ${c[0]} 0%, ${c[1]} 45%, ${c[2]} 100%)`;

  els.skyFx.innerHTML = '';
  const frag = document.createDocumentFragment();

  if (group === 'clear' || group === 'partly') {
    if (isDay) {
      const sun = document.createElement('div');
      sun.className = 'sun';
      sun.innerHTML = `<div class="rays">${Array.from({length:12}).map((_,i)=>`<span style="transform:rotate(${i*30}deg) translateY(-70px)"></span>`).join('')}</div><div class="core"></div>`;
      frag.appendChild(sun);
    } else {
      const moon = document.createElement('div');
      moon.className = 'moon';
      frag.appendChild(moon);
      const stars = document.createElement('div');
      stars.className = 'stars';
      for (let i = 0; i < 40; i++) {
        const s = document.createElement('span');
        s.style.left = Math.random()*100 + '%';
        s.style.top = Math.random()*60 + '%';
        s.style.animationDelay = (Math.random()*3) + 's';
        stars.appendChild(s);
      }
      frag.appendChild(stars);
    }
  }
  if (group === 'partly' || group === 'overcast' || group === 'drizzle' || group === 'rain' || group === 'storm' || group === 'snow') {
    const cloudCount = group === 'overcast' ? 5 : 3;
    for (let i = 0; i < cloudCount; i++) {
      const cl = document.createElement('div');
      cl.className = 'cloud';
      const w = 90 + Math.random()*70;
      cl.style.width = w + 'px';
      cl.style.height = (w*0.4) + 'px';
      cl.style.top = (10 + Math.random()*30) + '%';
      cl.style.animationDuration = (40 + Math.random()*30) + 's';
      cl.style.animationDelay = (-Math.random()*40) + 's';
      cl.style.opacity = 0.55 + Math.random()*0.35;
      frag.appendChild(cl);
    }
  }
  if (group === 'rain' || group === 'drizzle' || group === 'storm') {
    const count = group === 'drizzle' ? 30 : 60;
    for (let i = 0; i < count; i++) {
      const d = document.createElement('div');
      d.className = 'drop';
      d.style.left = Math.random()*100 + '%';
      d.style.animationDuration = (0.5 + Math.random()*0.5) + 's';
      d.style.animationDelay = (Math.random()*2) + 's';
      frag.appendChild(d);
    }
  }
  if (group === 'snow') {
    for (let i = 0; i < 50; i++) {
      const f = document.createElement('div');
      f.className = 'flake';
      const size = 3 + Math.random()*4;
      f.style.width = size+'px';
      f.style.height = size+'px';
      f.style.left = Math.random()*100 + '%';
      f.style.animationDuration = (5 + Math.random()*6) + 's';
      f.style.animationDelay = (Math.random()*5) + 's';
      frag.appendChild(f);
    }
  }
  if (group === 'storm') {
    const flash = document.createElement('div');
    flash.className = 'flash';
    frag.appendChild(flash);
  }
  if (group === 'fog') {
    for (let i = 0; i < 4; i++) {
      const f = document.createElement('div');
      f.className = 'fog-layer';
      f.style.top = (15 + i*20) + '%';
      f.style.animationDuration = (20 + i*5) + 's';
      frag.appendChild(f);
    }
  }
  els.skyFx.appendChild(frag);
}

/* ---------------- Helpers ---------------- */
function fmtTime(iso, opts) {
  return new Date(iso).toLocaleTimeString([], opts || { hour: 'numeric', minute: '2-digit' });
}
function fmtHour(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric' });
}
function fmtDay(iso) {
  return new Date(iso).toLocaleDateString([], { weekday: 'short' });
}

/* ---------------- Unit conversion (feature: °C/°F, km/h/mph) ---------------- */
function convertTemp(celsius) {
  return unit === 'imperial' ? (celsius * 9/5) + 32 : celsius;
}
function convertSpeed(kmh) {
  return unit === 'imperial' ? kmh * 0.621371 : kmh;
}
function tempUnitLabel() { return unit === 'imperial' ? '°F' : '°C'; }
function speedUnitLabel() { return unit === 'imperial' ? 'mph' : 'km/h'; }

/* ---------------- Feature: "What to wear" suggestion ---------------- */
function outfitAdvice(celsius, group, windKmh) {
  let text = '';
  let iconType = 'shirt';

  if (group === 'storm') {
    text = 'Stay indoors if possible — thunderstorm expected.';
    iconType = 'storm';
  } else if (group === 'snow') {
    text = 'Heavy coat, gloves, and boots — snow on the way.';
    iconType = 'coat';
  } else if (celsius <= 5) {
    text = 'Bundle up — heavy jacket, scarf, and gloves recommended.';
    iconType = 'coat';
  } else if (celsius <= 12) {
    text = 'A warm jacket or sweater is a good idea today.';
    iconType = 'jacket';
  } else if (celsius <= 20) {
    if (group === 'rain' || group === 'drizzle') {
      text = 'Light layers plus a raincoat or umbrella.';
      iconType = 'umbrella';
    } else {
      text = 'Light layers work well — maybe a light jacket for the evening.';
      iconType = 'jacket';
    }
  } else if (celsius <= 30) {
    if (group === 'rain' || group === 'drizzle') {
      text = 'T-shirt weather, but keep an umbrella handy.';
      iconType = 'umbrella';
    } else {
      text = 'Comfortable T-shirt weather — nothing extra needed.';
      iconType = 'shirt';
    }
  } else {
    text = 'Very hot — light clothing, sunscreen, and stay hydrated.';
    iconType = 'sun';
  }

  if (windKmh >= 30 && group !== 'storm') {
    text += ' It\u2019s quite windy, so a windbreaker helps.';
  }

  return { text, iconType };
}

function outfitIconSvg(type) {
  const stroke = `stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"`;
  switch (type) {
    case 'coat':
      return `<svg viewBox="0 0 48 48" ${stroke}><path d="M18 8l6 4 6-4 8 8-5 5v19H15V21l-5-5z"/><line x1="24" y1="12" x2="24" y2="34"/></svg>`;
    case 'jacket':
      return `<svg viewBox="0 0 48 48" ${stroke}><path d="M17 9l7 4 7-4 7 7-4 4v18H14V20l-4-4z"/></svg>`;
    case 'umbrella':
      return `<svg viewBox="0 0 48 48" ${stroke}><path d="M24 6c9 0 16 7 16 15H8c0-8 7-15 16-15z"/><line x1="24" y1="6" x2="24" y2="36"/><path d="M24 36a4 4 0 0 0 8 0"/></svg>`;
    case 'sun':
      return `<svg viewBox="0 0 48 48" ${stroke}><circle cx="24" cy="24" r="9"/><g>${[0,45,90,135,180,225,270,315].map(a=>`<line x1="24" y1="4" x2="24" y2="10" transform="rotate(${a} 12 12)"/>`).join('')}</g></svg>`;
    case 'storm':
      return `<svg viewBox="0 0 48 48" ${stroke}><path d="M25 8l-8 14h6l-5 12 14-16h-7l6-10z" fill="currentColor" stroke="none"/></svg>`;
    default:
      return `<svg viewBox="0 0 48 48" ${stroke}><path d="M16 8l8 3 8-3 6 6-4 4v20H14V18l-4-4z"/></svg>`;
  }
}

/* ---------------- Feature: Air Quality Index ---------------- */
async function fetchAirQuality(lat, lon) {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('AQI unavailable');
    const data = await res.json();
    renderAqi(data.current.us_aqi);
  } catch {
    els.aqiValue.textContent = '--';
    els.aqiLabel.textContent = '';
  }
}

function aqiInfo(value) {
  if (value == null) return { label: '—', color: 'var(--ink-faint)' };
  if (value <= 50)  return { label: 'Good', color: '#4ADE80' };
  if (value <= 100) return { label: 'Moderate', color: '#FACC15' };
  if (value <= 150) return { label: 'Unhealthy (SG)', color: '#FB923C' };
  if (value <= 200) return { label: 'Unhealthy', color: '#F87171' };
  if (value <= 300) return { label: 'Very Unhealthy', color: '#C084FC' };
  return { label: 'Hazardous', color: '#7F1D1D' };
}

function renderAqi(value) {
  const info = aqiInfo(value);
  els.aqiValue.textContent = value != null ? Math.round(value) : '--';
  els.aqiLabel.textContent = info.label;
  els.aqiCard.style.setProperty('--aqi-color', info.color);
}

/* ---------------- Rendering ---------------- */
function render(data, placeName) {
  const cur = data.current;
  const info = codeInfo(cur.weather_code);
  const isDay = cur.is_day === 1;

  setSky(info.group, isDay);

  els.heroIcon.innerHTML = icon(info.group, isDay);
  els.temp.textContent = Math.round(convertTemp(cur.temperature_2m));
  els.condition.textContent = info.text;
  els.place.textContent = placeName;
  els.dateTime.textContent = new Date(cur.time).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  els.tempMax.textContent = Math.round(convertTemp(data.daily.temperature_2m_max[0])) + '°';
  els.tempMin.textContent = Math.round(convertTemp(data.daily.temperature_2m_min[0])) + '°';
  els.feelsLike.textContent = Math.round(convertTemp(cur.apparent_temperature)) + '°';

  els.humidity.textContent = Math.round(cur.relative_humidity_2m);
  els.wind.textContent = Math.round(convertSpeed(cur.wind_speed_10m));
  document.querySelector('#wind').nextElementSibling.textContent = speedUnitLabel();
  els.pressure.textContent = Math.round(cur.surface_pressure);
  els.uv.textContent = Math.round(data.daily.uv_index_max[0]);
  els.visibility.textContent = (cur.visibility / 1000).toFixed(1);
  els.sunrise.textContent = fmtTime(data.daily.sunrise[0]);
  els.sunset.textContent = fmtTime(data.daily.sunset[0]);

  const outfit = outfitAdvice(cur.temperature_2m, info.group, cur.wind_speed_10m);
  els.outfitIcon.innerHTML = outfitIconSvg(outfit.iconType);
  els.outfitSuggestion.textContent = outfit.text;

  // Hourly — next 24h starting from current hour
  const nowIdx = data.hourly.time.findIndex(t => new Date(t) >= new Date(cur.time));
  const startIdx = nowIdx === -1 ? 0 : nowIdx;
  els.hourly.innerHTML = '';
  for (let i = startIdx; i < startIdx + 24 && i < data.hourly.time.length; i++) {
    const hInfo = codeInfo(data.hourly.weather_code[i]);
    const hIsDay = data.hourly.is_day[i] === 1;
    const card = document.createElement('div');
    card.className = 'hour-card';
    card.innerHTML = `
      <div class="h-time">${i === startIdx ? 'Now' : fmtHour(data.hourly.time[i])}</div>
      <div class="h-icon">${icon(hInfo.group, hIsDay)}</div>
      <div class="h-temp">${Math.round(convertTemp(data.hourly.temperature_2m[i]))}°</div>
    `;
    els.hourly.appendChild(card);
  }

  // Daily
  els.daily.innerHTML = '';
  for (let i = 0; i < data.daily.time.length; i++) {
    const dInfo = codeInfo(data.daily.weather_code[i]);
    const row = document.createElement('div');
    row.className = 'day-row';
    row.innerHTML = `
      <div class="day-name">${i === 0 ? 'Today' : fmtDay(data.daily.time[i])}</div>
      <div class="day-icon">${icon(dInfo.group, true)}</div>
      <div class="day-precip">${Math.round(data.daily.precipitation_probability_max[i])}%</div>
      <div class="day-range"><span>${Math.round(convertTemp(data.daily.temperature_2m_min[i]))}°</span><b>${Math.round(convertTemp(data.daily.temperature_2m_max[i]))}°</b></div>
    `;
    els.daily.appendChild(row);
  }

  els.lastUpdated.textContent = 'Updated ' + new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  lastData = data;
  els.unitBtn.textContent = tempUnitLabel();
  updateFavButton();

  els.status.classList.add('hidden');
  els.errorBox.classList.add('hidden');
  els.main.classList.remove('hidden');
}

/* ---------------- API calls ---------------- */
async function fetchWeather(lat, lon, placeName) {
  els.status.textContent = 'Loading weather…';
  els.status.classList.remove('hidden');
  els.main.classList.add('hidden');
  els.errorBox.classList.add('hidden');

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,surface_pressure,visibility` +
    `&hourly=temperature_2m,weather_code,is_day` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,uv_index_max` +
    `&timezone=auto&forecast_days=8`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather service unavailable');
    const data = await res.json();
    lastCoords = { lat, lon, placeName };
    render(data, placeName);
    fetchAirQuality(lat, lon); 
  } catch (err) {
    showError('Could not load weather data. Check your connection and try again.');
  }
}

async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    const data = await res.json();
    return data.city || data.locality || data.principalSubdivision || 'Your location';
  } catch {
    return 'Your location';
  }
}

async function searchCity(query) {
  if (!query || query.length < 2) {
    els.suggestions.classList.remove('show');
    return;
  }
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
    const data = await res.json();
    renderSuggestions(data.results || []);
  } catch {
    els.suggestions.classList.remove('show');
  }
}

function renderSuggestions(results) {
  if (!results.length) {
    els.suggestions.classList.remove('show');
    return;
  }
  els.suggestions.innerHTML = '';
  results.forEach(r => {
    const btn = document.createElement('button');
    btn.type = 'button';
    const region = [r.admin1, r.country].filter(Boolean).join(', ');
    btn.innerHTML = `${r.name}<small>${region}</small>`;
    btn.addEventListener('click', () => {
      els.cityInput.value = r.name;
      els.suggestions.classList.remove('show');
      fetchWeather(r.latitude, r.longitude, r.name);
    });
    els.suggestions.appendChild(btn);
  });
  els.suggestions.classList.add('show');
}

/* ---------------- Geolocation ---------------- */
function locate() {
  els.locateBtn.classList.add('loading');
  if (!navigator.geolocation) {
    els.locateBtn.classList.remove('loading');
    showError('Your browser does not support location detection. Please search for a city instead.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      const name = await reverseGeocode(latitude, longitude);
      await fetchWeather(latitude, longitude, name);
      els.locateBtn.classList.remove('loading');
    },
    () => {
      els.locateBtn.classList.remove('loading');
      showError('Location access was denied. Please search for a city instead.');
    },
    { timeout: 10000 }
  );
}

function showError(msg) {
  els.status.classList.add('hidden');
  els.main.classList.add('hidden');
  els.errorText.textContent = msg;
  els.errorBox.classList.remove('hidden');
}

/* ---------------- Feature: Dark / Light UI toggle ---------------- */
function applyTheme() {
  document.body.setAttribute('data-theme', theme);
  els.themeIcon = document.getElementById('themeIcon');
  els.themeIcon.innerHTML = theme === 'light'
    ? `<circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round">${[0,45,90,135,180,225,270,315].map(a=>`<line x1="12" y1="2" x2="12" y2="4" transform="rotate(${a} 12 12)"/>`).join('')}</g>`
    : `<path d="M21 12.5A9 9 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
}
function toggleTheme() {
  theme = theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('skyline-theme', theme);
  applyTheme();
}

/* ---------------- Feature: Favorite cities (localStorage) ---------------- */
function updateFavButton() {
  if (!lastCoords) return;
  const isSaved = favorites.some(f => f.name === lastCoords.placeName);
  els.favBtn.classList.toggle('saved', isSaved);
}

function toggleFavorite() {
  if (!lastCoords) return;
  const { placeName, lat, lon } = lastCoords;
  const idx = favorites.findIndex(f => f.name === placeName);
  if (idx > -1) {
    favorites.splice(idx, 1);
  } else {
    favorites.push({ name: placeName, lat, lon });
  }
  localStorage.setItem('skyline-favorites', JSON.stringify(favorites));
  updateFavButton();
  renderFavoriteChips();
}

function renderFavoriteChips() {
  els.favorites.innerHTML = '';
  favorites.forEach(f => {
    const chip = document.createElement('div');
    chip.className = 'fav-chip';
    chip.innerHTML = `<span>${f.name}</span><span class="remove">✕</span>`;
    chip.querySelector('span:first-child').addEventListener('click', () => fetchWeather(f.lat, f.lon, f.name));
    chip.querySelector('.remove').addEventListener('click', (e) => {
      e.stopPropagation();
      favorites = favorites.filter(x => x.name !== f.name);
      localStorage.setItem('skyline-favorites', JSON.stringify(favorites));
      renderFavoriteChips();
      updateFavButton();
    });
    els.favorites.appendChild(chip);
  });
}

/* ---------------- Events ---------------- */
let debounceTimer;
els.cityInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => searchCity(els.cityInput.value.trim()), 350);
});

els.searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = els.cityInput.value.trim();
  if (!query) return;
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
  const data = await res.json();
  if (data.results && data.results.length) {
    const r = data.results[0];
    els.suggestions.classList.remove('show');
    fetchWeather(r.latitude, r.longitude, r.name);
  } else {
    showError(`No results found for "${query}".`);
  }
});

document.addEventListener('click', (e) => {
  if (!els.searchForm.contains(e.target)) els.suggestions.classList.remove('show');
});

els.locateBtn.addEventListener('click', locate);
els.retryBtn.addEventListener('click', () => {
  if (lastCoords) fetchWeather(lastCoords.lat, lastCoords.lon, lastCoords.placeName);
  else locate();
});

els.themeBtn.addEventListener('click', toggleTheme);

els.unitBtn.addEventListener('click', () => {
  unit = unit === 'metric' ? 'imperial' : 'metric';
  localStorage.setItem('skyline-unit', unit);
  els.unitBtn.textContent = tempUnitLabel();
  if (lastData && lastCoords) render(lastData, lastCoords.placeName);
});

els.favBtn.addEventListener('click', toggleFavorite);

/* ---------------- Init ---------------- */
applyTheme();
renderFavoriteChips();
locate();