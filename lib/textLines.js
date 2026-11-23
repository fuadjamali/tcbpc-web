// Small helpers for admin fields that hold a list as plain text, one entry per line — easier to
// edit in a textarea than a repeater UI, and still one source of truth in the database.

export function splitLines(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

// "Title | description" per line -> [{ title, text }]. A line without a "|" is all title.
export function parsePairs(text) {
  return splitLines(text).map((line) => {
    const i = line.indexOf("|");
    return i === -1
      ? { title: line, text: "" }
      : { title: line.slice(0, i).trim(), text: line.slice(i + 1).trim() };
  });
}

// "Some text with **highlighted** words" -> [{ text, accent }] parts for rendering.
export function parseAccent(text) {
  return String(text || "")
    .split(/\*\*(.+?)\*\*/g)
    .map((part, i) => ({ text: part, accent: i % 2 === 1 }))
    .filter((part) => part.text);
}
