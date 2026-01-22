import {Badge, Avatar} from "@nextui-org/react";
import { useEffect } from "react";
function App() {

 
  // Usamos el puente de Electron para llamar a la funcion que creamos arriba

    const BuscarSonidos = async () => {
      try {
      
        const resultados = await window.electron.ipcRenderer.invoke('search-sounds', 'helltaker');
        console.log("Resultados encontrados:", resultados);
      } catch (error) {
        console.error("Error buscando sonidos:", error);
      }
    }

    useEffect(() => {
      console.log("Objeto window.electron:", window.electron);
      BuscarSonidos()
    }, [])

    return (
      <>
        <p className="text-3xl font-bold underline text-gray-900">Hello World</p>
        <Badge color="primary" content="5">
          <Avatar radius="md" size="lg" src="" />
        </Badge>
        
      </>
    )
  }


export default App
