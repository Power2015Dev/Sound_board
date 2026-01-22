const { ipcMain } = require('electron');
const axios = require('axios');
const cheerio = require('cheerio');

// Escuchamos cuando React nos pida buscar sonidos
ipcMain.handle('search-sounds', async (event, query) => {
  try {

    const url = `https://www.myinstants.com/search/?name=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url);


    const $ = cheerio.load(data);
    const sounds = [];


    $('.instant').each((i, element) => {
      const name = $(element).find('.instant-link').text();
      // A veces el mp3 esta en el onclick, hay que limpiarlo
      const onclickAttr = $(element).find('.small-button').attr('onclick');
      // Extraemos solo la url del mp3 usando una expresión regular simple
      const mp3Match = onclickAttr ? onclickAttr.match(/play\('(.+?)'\)/) : null;

      if (name && mp3Match) {
        sounds.push({
          title: name,
          url: "https://www.myinstants.com" + mp3Match[1]
        });
      }
    });

    return sounds; // Devolvemos el array limpio a React
  } catch (error) {
    console.error(error);
    return [];
  }
});