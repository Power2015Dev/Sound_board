import { Button, Slider, Card, CardBody, Popover, PopoverTrigger, PopoverContent, Tooltip } from "@nextui-org/react";
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Download } from "lucide-react"; 

export function CustomAudioPlayer({ src, title }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // Estado para efecto de carga
  
  const audioRef = useRef(null);

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (value) => {
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const handleVolumeChange = (value) => {
    const newVol = parseFloat(value);
    setVolume(newVol);
    audioRef.current.volume = newVol;
    setIsMuted(newVol === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume || 1;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };


  const handleDownload = async () => {
    setIsDownloading(true);
    try {
        // En lugar de fetch, invocamos al proceso principal
        await window.electron.ipcRenderer.invoke('download-audio', src);
        
        // Opcional: Un pequeño delay para simular feedback visual, 
        // ya que la descarga real la maneja Electron en segundo plano
        setTimeout(() => setIsDownloading(false), 1000);
        
    } catch (error) {
        console.error("Error al solicitar descarga:", error);
        setIsDownloading(false);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  return (
    <Card shadow="sm" className="w-full bg-content1 border border-default-200">
      <CardBody className="flex flex-row items-center gap-3 p-3 overflow-visible">
        
        <audio 
          ref={audioRef} 
          src={src} 
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)} 
        />
        
        {/* Play/Pause */}
        <Button 
          isIconOnly 
          variant="flat" 
          color="primary" 
          onPress={togglePlay}
          radius="full"
          size="sm"
          className="shrink-0"
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
        </Button>

        {/* Info y Barra */}
        <div className="flex flex-col flex-1 gap-1 min-w-0">
          <div className="flex justify-between items-center px-1">
            <p className="text-tiny font-bold truncate pr-2 w-32 sm:w-auto">{title}</p>
            <span className="text-[10px] text-default-500 font-mono shrink-0">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <Slider 
            aria-label="Progreso"
            size="sm"
            step={0.1} 
            maxValue={duration || 100}
            minValue={0} 
            value={currentTime}
            onChange={(val) => handleSeek(val)}
            className="w-full"
            color="foreground"
          />
        </div>
        
        {/* Controles Derecha (Volumen + Descarga) */}
        <div className="flex items-center gap-1 shrink-0">
            {/* Botón Descargar */}
            <Tooltip content="Descargar MP3">
                <Button 
                    isIconOnly 
                    variant="light" 
                    radius="full" 
                    size="sm" 
                    isLoading={isDownloading}
                    onPress={handleDownload}
                    className="text-default-500 hover:text-primary"
                >
                    {!isDownloading && <Download size={18} />}
                </Button>
            </Tooltip>

            {/* Botón Volumen */}
            <Popover placement="top" offset={10}>
            <PopoverTrigger>
                <Button isIconOnly variant="light" radius="full" size="sm" className="text-default-500 hover:text-foreground">
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-3">
                <div className="flex flex-col gap-2 w-8 items-center h-[100px]">
                    <Slider
                        aria-label="Volumen"
                        size="sm"
                        step={0.05}
                        maxValue={1}
                        minValue={0}
                        orientation="vertical"
                        value={isMuted ? 0 : volume}
                        onChange={(val) => handleVolumeChange(val)}
                        color="primary"
                        className="h-full"
                    />
                </div>
            </PopoverContent>
            </Popover>
        </div>

      </CardBody>
    </Card>
  );
}