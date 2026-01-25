import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { useState } from 'react'
import { ShowSearch } from './js_class/show_search'


function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const showSearch = new ShowSearch()
  const BuscarSonidos = async (e) => {
    e.preventDefault()

    if (!searchTerm.trim()) return
    try {
      const resultados = await window.electron.ipcRenderer.invoke('search-sounds', searchTerm)
      console.log('Resultados encontrados:', resultados)
      showSearch.getSearchTerm(resultados)
    } catch (error) {
      console.error('Error buscando sonidos:', error)
    }
  }

  return (
    <>
      <form onSubmit={BuscarSonidos} className="flex flex-col gap-4 p-4">
        <div className="sticky top-0 bg-content1 z-10 flex flex-row gap-2 border-2 border-gray-300 rounded-md">
        <Input
          clearable
          bordered
          label="Buscar Sonidos"
          placeholder="Escribe el nombre del sonido"
          value={searchTerm}
          required
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit" className="h-auto">Buscar</Button>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 w-full" id="results-container">Escribe en la barra de busqueda para buscar sonidos</div>
    </>
  )
}

export default App
