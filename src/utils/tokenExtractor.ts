export interface ExtractedTokenData {
  token: string | null;
  telegramId: number | null;
}

export function extractDataFromUrl(): ExtractedTokenData {
  const hash = window.location.hash;

  if (!hash || hash === "#") {
    return { token: null, telegramId: null };
  }

  const hashContent = hash.substring(1);
  const parts = hashContent.split("-");

  if (parts.length === 0) {
    return { token: null, telegramId: null };
  }

  let token: string | null = parts[0];

  if (token && token.includes("%")) {
    token = token.split("%")[0];
  }

  const validTokenRegex = /^[A-Za-z0-9-_.]+$/;
  if (token && !validTokenRegex.test(token)) {
    const match = token.match(/^[A-Za-z0-9-_.]+/);
    token = match ? match[0] : null;
  }

  let telegramId: number | null = null;
  if (parts.length >= 3) {
    const lastPart = parts[parts.length - 1];
    const parsedId = parseInt(lastPart, 10);
    if (!isNaN(parsedId)) {
      telegramId = parsedId;
    }
  }

  return { token, telegramId };
}

export function hasTokenInUrl(): boolean {
  const { token } = extractDataFromUrl();
  return token !== null;
}

export function clearTokenFromUrl(): void {
  if (hasTokenInUrl()) {
    const newUrl = window.location.pathname + window.location.search;
    window.history.replaceState({}, document.title, newUrl);
  }
}
