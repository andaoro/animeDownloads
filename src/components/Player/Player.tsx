import React, { MouseEventHandler, useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import './styles.css'
import { FaPause, FaPlay } from 'react-icons/fa'
import { IoVolumeHighSharp } from "react-icons/io5";
import { IoMdVolumeOff } from "react-icons/io";
import { BiExpand } from "react-icons/bi";
import { FaGear } from "react-icons/fa6";






type PlayerProps = {
    url: string,
    light?: string

}

export const Player: React.FC<PlayerProps> = ({ url }) => {
    const baseURL = import.meta.env.VITE_BASE_URL_MEDIA || ''
    const volumeDefaultValue = 0.6
    //HOOKS

    ///STATES
    const [playingVideo, setplayingVideo] = useState(false)
    const [volume, setVolume] = useState(volumeDefaultValue);
    const [showForwardIcon, setShowForwardIcon] = useState(false);
    const [showBackwardIcon, setShowBackwardIcon] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [visibleControls, setvisibleControls] = useState(false)
    const [isMuted, setisMuted] = useState(false)
    //const timeSpaceRef = useRef<number | null>(null)
    //const [playBackRate, setplayBackRate] = useState(1)


    ///REFS
    const playerRef = useRef<ReactPlayer>(null)
    const progressBarRef = useRef<HTMLInputElement>(null)
    const volumeBarRef = useRef<HTMLInputElement>(null)
    const controlsTimeoutRef = useRef<number | null>(null);


    //KEY FUNCTIONS
    const handlePlayPause = () => {
        setplayingVideo(prevPlaying => !prevPlaying)
    }

    const increaseVolume = () => {
        setVolume(prevVolume => Math.min(prevVolume + 0.1, 1));
        validateMutedVideo()
    };

    const decreaseVolume = () => {
        setVolume(prevVolume => Math.max(prevVolume - 0.1, 0));
        validateMutedVideo()
    };

    const seekForward = () => {
        if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();
            playerRef.current.seekTo(currentTime + 10);
            setShowForwardIcon(true)
            setTimeout(() => {
                setShowForwardIcon(false)
            }, (1000));
        }
    }

    const seekBackForward = () => {
        if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();
            playerRef.current.seekTo(currentTime - 11);
            setShowForwardIcon(true)
            setTimeout(() => {
                setShowBackwardIcon(false)
            }, 1000);
        }
    }

    const toggleFullScreen = () => {
        const playerWrapper = document.querySelector('.player-wrapper');
        if (!playerWrapper) return;

        if (!document.fullscreenElement) {
            const requestFullscreen = playerWrapper.requestFullscreen ||
                (playerWrapper as any).webkitRequestFullscreen ||
                (playerWrapper as any).msRequestFullscreen ||
                (playerWrapper as any).mozRequestFullScreen;

            if (requestFullscreen) {
                requestFullscreen.call(playerWrapper);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };




    //KEY EVENTS
    const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.code) {
            case 'Space':
                handlePlayPause();
                break;
            case 'ArrowUp':
                increaseVolume();
                break;
            case 'ArrowDown':
                decreaseVolume();
                break;
            case 'ArrowRight':
                seekForward();
                break;
            case 'ArrowLeft':
                seekBackForward();
                break;
            case 'KeyF':
                toggleFullScreen();
                break;
            default:
                break;
        }
    };

    /* const handleKeyDownSpace = (event: KeyboardEvent) => {
        if (event.code === 'Space') {
            timeSpaceRef.current = window.setTimeout(handleSpaceHold, 2000);
        }
    };

    const handleSpaceHold = () => {
        setplayBackRate(2)
    };

    const handleKeyUpSpace = (event: KeyboardEvent) => {
        if (event.code === 'Space') {
            if (timeSpaceRef.current) {
                clearTimeout(timeSpaceRef.current);
                timeSpaceRef.current = null;
                setplayBackRate(1)
            }
        }
    }; */


    //CONTROL FUNCTIONS
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setVolume(value);

        if (value == 0) {
            setisMuted(true)
        } else {
            setisMuted(false)
        }

        if (volumeBarRef.current) {
            volumeBarRef.current.style.setProperty('--range-valueV', String((value / 1) + 0.005));
        }

        if (playerRef.current) {
            playerRef.current.getInternalPlayer().volume = value;
        }
    };

    const handleProgress = (state: { played: number; playedSeconds: number; loadedSeconds: number }) => {
        setCurrentTime(state.playedSeconds);
        if (playerRef.current) {
            setDuration(playerRef.current.getDuration())
        }

        if (progressBarRef.current) {
            progressBarRef.current.style.setProperty('--range-value', String(state.played + 0.005));
        }


    };

    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setCurrentTime(value);
        if (playerRef.current) {
            playerRef.current.seekTo(value);
        }

        if (progressBarRef.current) {
            progressBarRef.current.style.setProperty('--range-value', String((value / duration) + 0.005));
        }
    };

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60).toString().padStart(2, '0');
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    //MOUSE EVENTS

    const handleMouseOver = () => {
        setvisibleControls(true);
    };

    const handleMouseLeave = () => {
        setvisibleControls(false);
    };

    const handleMouseMove = () => {
        setvisibleControls(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = window.setTimeout(() => {
            setvisibleControls(false);
        }, 700);
    };

    //VOLUME FUNCTION

    const mutedVideo = () => {
        if (volume == 0) {
            setVolume(volumeDefaultValue)
            setisMuted(false)
            if (volumeBarRef.current) {
                volumeBarRef.current.style.setProperty('--range-valueV', String((volumeDefaultValue / 1) + 0.005));
            }
        } else {
            setVolume(0)
            setisMuted(true)
            if (volumeBarRef.current) {
                volumeBarRef.current.style.setProperty('--range-valueV', String((0 / 1) + 0.005));
            }
        }
    }

    const validateMutedVideo = () => {
        if (volume == 0) {
            setisMuted(true)
        } else {
            setisMuted(false)
        }
    }


    //USEEFFECT
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        if (volumeBarRef.current) {
            volumeBarRef.current.style.setProperty('--range-valueV', String((volumeDefaultValue / 1) + 0.005));
        }

        /* window.addEventListener('keydown', handleKeyDownSpace);
        window.addEventListener('keyup', handleKeyUpSpace); */

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            /* window.removeEventListener('keydown', handleKeyDownSpace);
            window.removeEventListener('keyup', handleKeyUpSpace); */

            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }

        };
    }, []);

    return (
        <div
            className='player-wrapper'
            onMouseMove={handleMouseMove}
        /* onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave} */
        >
            <div onClick={handlePlayPause}>
                <ReactPlayer
                    className='react-player'
                    width='100%'
                    height='100%'
                    ref={playerRef}
                    url={baseURL + url}
                    playing={playingVideo}
                    volume={volume}
                    onProgress={handleProgress}
                //playbackRate={playBackRate}
                />
            </div>

            <div className={`controls duration-300 ${visibleControls ? "opacity-100" : "opacity-0"}`}>
                <div className='flex items-center justify-between w-full'>
                    <section className='flex items-center gap-x-4'>
                        <button onClick={handlePlayPause}>{!playingVideo ? <FaPlay size={12} /> : <FaPause size={12} />}</button>
                        <div className='flex text-sm xl:hidden gap-x-1 time'>
                            <span>{formatTime(currentTime)} </span> / <span> {formatTime(duration)}</span>
                        </div>
                        <div className='flex items-center group'>
                            <span className='cursor-pointer' onClick={mutedVideo}>
                                {
                                    isMuted ? <IoMdVolumeOff size={20} /> : <IoVolumeHighSharp size={20} />
                                }

                            </span>

                            <input
                                type='range'
                                min={0}
                                max={1}
                                step={0.01}
                                value={volume}
                                onChange={handleVolumeChange}
                                className='hidden group-hover:flex volume-slider'
                                ref={volumeBarRef}
                            />
                        </div>
                    </section>

                    <section className='flex mr-4 gap-x-4'>
                        {/* OPCIONES EN CASO DE SER NECESARIAS */}
                        {/* <div className='relative bg-red-500'>
                            <span className='cursor-pointer'><FaGear size={20} /></span>
                            
                            <div className='absolute'>
                                <p>Velocidad</p>
                                <p>Descargar</p>
                            </div>
                        </div> */}
                        <span className='cursor-pointer'>
                            <BiExpand size={20} onClick={toggleFullScreen} />
                        </span>
                    </section>


                </div>

                <div className='flex items-center w-full pr-4'>
                    <input
                        type='range'
                        min={0}
                        max={duration}
                        value={currentTime}
                        onChange={handleSeekChange}
                        className='w-full mr-2 seek-slider'
                        ref={progressBarRef}
                    />

                    <div className='hidden text-sm w-fit xl:flex gap-x-1 time'>
                        <span>{formatTime(currentTime)} </span> / <span> {formatTime(duration)}</span>
                    </div>

                </div>


            </div>
        </div>
    )
}
