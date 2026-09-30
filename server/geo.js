// Mapeamento de Timezone -> País para ambiente local / fallback
const TIMEZONE_TO_COUNTRY = {
  'America/Sao_Paulo': { country: 'Brasil', code: 'BR', flag: '🇧🇷' },
  'America/Fortaleza': { country: 'Brasil', code: 'BR', flag: '🇧🇷' },
  'America/Recife': { country: 'Brasil', code: 'BR', flag: '🇧🇷' },
  'America/Bahia': { country: 'Brasil', code: 'BR', flag: '🇧🇷' },
  'America/Belem': { country: 'Brasil', code: 'BR', flag: '🇧🇷' },
  'America/Manaus': { country: 'Brasil', code: 'BR', flag: '🇧🇷' },
  'America/Cuiaba': { country: 'Brasil', code: 'BR', flag: '🇧🇷' },
  'America/Campo_Grande': { country: 'Brasil', code: 'BR', flag: '🇧🇷' },
  'America/Porto_Velho': { country: 'Brasil', code: 'BR', flag: '🇧🇷' },
  'America/Rio_Branco': { country: 'Brasil', code: 'BR', flag: '🇧🇷' },
  'America/Boa_Vista': { country: 'Brasil', code: 'BR', flag: '🇧🇷' },
  'America/Maceio': { country: 'Brasil', code: 'BR', flag: '🇧🇷' },
  'Europe/Lisbon': { country: 'Portugal', code: 'PT', flag: '🇵🇹' },
  'Atlantic/Madeira': { country: 'Portugal', code: 'PT', flag: '🇵🇹' },
  'Atlantic/Azores': { country: 'Portugal', code: 'PT', flag: '🇵🇹' },
  'America/New_York': { country: 'Estados Unidos', code: 'US', flag: '🇺🇸' },
  'America/Chicago': { country: 'Estados Unidos', code: 'US', flag: '🇺🇸' },
  'America/Los_Angeles': { country: 'Estados Unidos', code: 'US', flag: '🇺🇸' },
  'Europe/Madrid': { country: 'Espanha', code: 'ES', flag: '🇪🇸' },
  'Europe/London': { country: 'Reino Unido', code: 'GB', flag: '🇬🇧' },
  'Europe/Paris': { country: 'França', code: 'FR', flag: '🇫🇷' },
  'Europe/Berlin': { country: 'Alemanha', code: 'DE', flag: '🇩🇪' },
  'Europe/Rome': { country: 'Itália', code: 'IT', flag: '🇮🇹' },
  'America/Buenos_Aires': { country: 'Argentina', code: 'AR', flag: '🇦🇷' },
  'America/Montevideo': { country: 'Uruguai', code: 'UY', flag: '🇺🇾' },
  'America/Santiago': { country: 'Chile', code: 'CL', flag: '🇨🇱' },
};

const COUNTRY_NAMES = {
  'BR': 'Brasil',
  'PT': 'Portugal',
  'US': 'Estados Unidos',
  'ES': 'Espanha',
  'FR': 'França',
  'DE': 'Alemanha',
  'IT': 'Itália',
  'GB': 'Reino Unido',
  'AR': 'Argentina',
  'UY': 'Uruguai',
  'CL': 'Chile',
  'PY': 'Paraguai',
  'CA': 'Canadá',
  'AO': 'Angola',
  'MZ': 'Moçambique',
  'CV': 'Cabo Verde'
};

export function getCountryFlag(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export async function detectLocation(req, clientData = {}) {
  // 1. Verificar cabeçalhos de CDN/Cloudflare
  const cfCountry = req.headers['cf-ipcountry'];
  if (cfCountry && cfCountry.length === 2 && cfCountry !== 'XX') {
    const code = cfCountry.toUpperCase();
    return {
      country: COUNTRY_NAMES[code] || code,
      country_code: code,
      city: req.headers['cf-ipcity'] || '',
      ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || ''
    };
  }

  // 2. Extrair IP
  let ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
           req.headers['x-real-ip'] || 
           req.socket?.remoteAddress || 
           '';
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }

  const isLocal = !ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.');

  // 3. Se for ambiente local ou se o cliente enviou timezone/locale explícito
  if (clientData.timezone && TIMEZONE_TO_COUNTRY[clientData.timezone]) {
    const mapped = TIMEZONE_TO_COUNTRY[clientData.timezone];
    return {
      country: mapped.country,
      country_code: mapped.code,
      city: clientData.city || '',
      ip: isLocal ? 'Localhost (127.0.0.1)' : ip
    };
  }

  // 4. Se o cliente enviou locale (ex: 'pt-BR')
  if (clientData.locale) {
    const parts = clientData.locale.split('-');
    if (parts.length > 1) {
      const code = parts[1].toUpperCase();
      return {
        country: COUNTRY_NAMES[code] || code,
        country_code: code,
        city: clientData.city || '',
        ip: isLocal ? 'Localhost (127.0.0.1)' : ip
      };
    }
  }

  // 5. Se o IP for público na web, tentar resolução rápida via ip-api
  if (!isLocal) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s max

      const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success') {
          return {
            country: COUNTRY_NAMES[data.countryCode] || data.country,
            country_code: data.countryCode,
            city: data.city || '',
            ip
          };
        }
      }
    } catch {
      // Ignora erro de timeout e vai pro fallback
    }
  }

  // Fallback padrão amigável
  return {
    country: 'Brasil',
    country_code: 'BR',
    city: 'São Paulo',
    ip: isLocal ? 'Localhost (127.0.0.1)' : ip
  };
}
