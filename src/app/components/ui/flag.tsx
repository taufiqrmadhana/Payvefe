interface FlagProps {
  country: 'indonesia' | 'singapore' | 'usa' | 'id' | 'sg' | 'us' | string;
  className?: string;
}

export function Flag({ country, className = 'w-6 h-4' }: FlagProps) {
  const countryCode = country === 'indonesia' || country === 'id' ? 'ID' : 
                      country === 'singapore' || country === 'sg' ? 'SG' : 
                      country === 'usa' || country === 'us' ? 'US' : 
                      country.toUpperCase();
  
  // Use flag emoji with fallback image
  const flagEmoji: Record<string, string> = {
    'ID': '🇮🇩',
    'SG': '🇸🇬',
    'US': '🇺🇸',
    'MY': '🇲🇾',
    'TH': '🇹🇭',
    'PH': '🇵🇭',
    'VN': '🇻🇳',
    'JP': '🇯🇵',
    'KR': '🇰🇷',
    'CN': '🇨🇳',
    'AU': '🇦🇺',
    'GB': '🇬🇧',
    'DE': '🇩🇪',
    'FR': '🇫🇷',
    'IN': '🇮🇳',
  };
  
  const emoji = flagEmoji[countryCode] || '🏳️';
  
  return (
    <span className={`inline-flex items-center justify-center text-lg ${className}`} role="img" aria-label={`${countryCode} flag`}>
      {emoji}
    </span>
  );
}
