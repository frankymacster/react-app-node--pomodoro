import handlePromise from "./handlePromise";

/**
 * Get data.
 *
 * @return {Promise<Data>}
 */
export default async function getData(url) {
  const [data, dataErr] = await handlePromise(fetch(url));

  if (dataErr) {
    const [info, infoErr] = await handlePromise(fetch(`/api/info`));

    if (infoErr) {
      throw new Error('Could not fetch data nor info');
    }

    const [infoJson, infoJsonErr] = await handlePromise(info.json());

    if (infoJsonErr) {
      throw new Error('Could not parse info JSON');
    }

    return infoJson;
  }

  const [dataJson, dataJsonErr] = await handlePromise(data.json());

  if (dataJsonErr) {
    throw new Error('Could not parse data JSON');
  }

  return dataJson;
}
