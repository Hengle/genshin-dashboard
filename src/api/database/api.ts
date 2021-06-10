export async function fetchData(url: string) {
  return await (
    await fetch(
      `https://raw.githubusercontent.com/Dimbreath/GenshinData/master/${url}.json`,
    )
  ).json();
}
