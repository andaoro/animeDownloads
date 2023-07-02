import { useRef,useEffect } from 'react'
import { AppLayout } from '../../components/AppLayout/AppLayout'

export const Reproductor = () => {
    const video = useRef<HTMLVideoElement>(null)

    useEffect(() => {
      if(video.current){
        console.log(video.current)
        video.current.onloadedmetadata = () => {
            const duration = video.current?.duration;
            console.log('Duración del video:', duration, 'segundos');
          };
      }
    }, [])
    
    return (
        <AppLayout>
            <video src='https://animedownloader.jmarango.co/watch/11' controls height={'500px'} width={'1000px'} ref={video} />
        </AppLayout>
    )
}
