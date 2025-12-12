export function mapWeatherCodeToIcon(code: number): string {
  const weatherCodeToIcon: Record<number, string> = {
    0: 'assets/sunny.png',
    1: 'assets/cloudy_sunny.png',
    2: 'assets/cloudy_sunny.png',
    3: 'assets/cloudy.png',
    45: 'assets/fog.png',
    48: 'assets/fog.png',
    51: 'assets/cloudy_sunny.png',
    53: 'assets/cloudy_sunny.png',
    55: 'assets/cloudy_sunny.png',
    61: 'assets/cloudy.png',
    63: 'assets/cloudy.png',
    65: 'assets/cloudy.png',
    66: 'assets/cloudy.png',
    67: 'assets/cloudy.png',
    71: 'assets/snow.png',
    73: 'assets/snow.png',
    75: 'assets/snow.png',
    77: 'assets/snow.png',
    80: 'assets/cloudy.png',
    81: 'assets/cloudy.png',
    82: 'assets/cloudy.png',
    85: 'assets/snow.png',
    86: 'assets/snow.png',
    95: 'assets/storm.png',
    96: 'assets/storm.png',
    99: 'assets/storm.png',
  };

  return weatherCodeToIcon[code] ?? 'assets/cloudy.png';
}

/**
 * Returns the first hourly entry at or after "now".
 */
export function getClosestHourly(weather: any): number {
  const currentTime = new Date(weather.current.time).getTime();

  for (let i = 0; i < weather.hourly.time.length; i++) {
    const t = new Date(weather.hourly.time[i]).getTime();

    if (t >= currentTime) {
      return weather.hourly.precipitation[i];
    }
  }

  // fallback (if all hours already passed)
  return weather.hourly.precipitation[weather.hourly.precipitation.length - 1];
}

/**
 * Build the hourly forecast grouped by day.
 */
export function buildHourlyStartingNow(weather: any) {
  const hourly = weather.hourly.time.map((t: string, i: number) => ({
    time: t,
    temp: weather.hourly.temperature_2m[i],
    precipitation: weather.hourly.precipitation[i],
    code: weather.hourly.weather_code[i],
    icon: mapWeatherCodeToIcon(weather.hourly.weather_code[i]),
  }));

  const hoursByDay: Record<string, any[]> = {};

  hourly.forEach((h: any) => {
    const dayKey = h.time.split('T')[0];
    if (!hoursByDay[dayKey]) hoursByDay[dayKey] = [];
    hoursByDay[dayKey].push(h);
  });

  const hourlyDays = Object.keys(hoursByDay);

  return { hourly, hoursByDay, hourlyDays };
}

/**
 * Build the daily forecast array.
 */
export function buildDailyForecast(weather: any) {
  return weather.daily.time.map((t: string, i: number) => ({
    date: t,
    max: weather.daily.temperature_2m_max[i],
    min: weather.daily.temperature_2m_min[i],
    precipitation: weather.daily.precipitation_sum[i],
    code: weather.daily.weather_code[i],
    icon: mapWeatherCodeToIcon(weather.daily.weather_code[i]),
  }));
}
