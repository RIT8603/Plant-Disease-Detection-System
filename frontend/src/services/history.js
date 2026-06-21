const HISTORY_KEY = "plant-disease-prediction-history";

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function savePrediction(entry) {
  const nextHistory = [entry, ...getHistory()].slice(0, 24);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
  return nextHistory;
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
