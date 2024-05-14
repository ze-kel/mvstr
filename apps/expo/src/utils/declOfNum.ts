//https://gist.github.com/realmyst/1262561

export function declOfNum(number: number, titles: [string, string, string]) {
  const cases = [2, 0, 1, 1, 1, 2];

  const i =
    number % 100 > 4 && number % 100 < 20
      ? 2
      : cases[number % 10 < 5 ? number % 10 : 5];

  //@ts-ignore
  return titles[i];
}
