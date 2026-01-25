import { CustomAudioPlayer } from '../components/audioplayer'
import { createRoot } from 'react-dom/client'
export class ShowSearch {
  constructor() {
 
  }

  getSearchTerm(result) {
    const resultsContainer = document.getElementById('results-container')
    resultsContainer.innerHTML = '' // Limpiar resultados anteriores

    if(result.length > 0) {
        result.forEach((sound) => {
            let fix_url = sound.url.split("'")[0]
            const soundDiv = document.createElement('div')
            soundDiv.className = 'flex flex-col gap-2 mb-4 p-2 border border-gray-300 rounded-md'
            resultsContainer.appendChild(soundDiv)
            const root = createRoot(soundDiv)
            root.render(
                <CustomAudioPlayer 
                src={fix_url} 
                title={sound.title} 
                />
            )

        })
    }
    else{
        resultsContainer.innerHTML = '<p>No se encontraron resultados.</p>'
    }
  }
}
