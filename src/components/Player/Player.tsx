import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import './styles.css'
import { FaPause, FaPlay } from 'react-icons/fa'
import { IoVolumeHighSharp } from "react-icons/io5";
import { IoMdVolumeOff } from "react-icons/io";
import { BiExpand } from "react-icons/bi";
import { MdForward10, MdReplay10 } from 'react-icons/md';

type IconsVideo = 'pause' | 'play' | 'forward' | 'backward';

type PlayerProps = {
    url: string,
    light?: string
};

export const Player: React.FC<PlayerProps> = ({ url }) => {
    const baseURL = import.meta.env.VITE_BASE_URL_MEDIA || '';
    const volumeDefaultValue = 0.6;
    const defaultIconType = 'pause';

    // STATES
    const [playingVideo, setplayingVideo] = useState(false);
    const [volume, setVolume] = useState(volumeDefaultValue);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [visibleControls, setvisibleControls] = useState(false);
    const [isMuted, setisMuted] = useState(false);
    const [showEventIcon, setshowEventIcon] = useState(false);
    const [iconType, seticonType] = useState<IconsVideo>(defaultIconType);
    const [timeMouseMomentHover, settimeMouseMomentHover] = useState(0)
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState(0);


    // REFS
    const playerRef = useRef<ReactPlayer>(null);
    const progressBarRef = useRef<HTMLInputElement>(null);
    const volumeBarRef = useRef<HTMLInputElement>(null);
    const controlsTimeoutRef = useRef<number | null>(null);
    const optionIconsTimeoutRef = useRef<number | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null)

    // KEY FUNCTIONS
    const handlePlayPause = () => {
        setplayingVideo(prevPlaying => {
            seticonType(prevPlaying ? 'play' : 'pause');
            return !prevPlaying;
        });
        handleMouseMove();
        setshowEventIcon(true);
        if (optionIconsTimeoutRef.current) {
            clearTimeout(optionIconsTimeoutRef.current);
        }
        optionIconsTimeoutRef.current = window.setTimeout(() => {
            setshowEventIcon(false);
        }, 700);
    };

    const increaseVolume = () => {
        setVolume(prevVolume => Math.min(prevVolume + 0.1, 1));
        validateMutedVideo();
    };

    const decreaseVolume = () => {
        setVolume(prevVolume => Math.max(prevVolume - 0.1, 0));
        validateMutedVideo();
    };

    const seekForward = () => {
        if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();
            playerRef.current.seekTo(currentTime + 10);
            seticonType('forward');
            setshowEventIcon(true);
            if (optionIconsTimeoutRef.current) {
                clearTimeout(optionIconsTimeoutRef.current);
            }
            optionIconsTimeoutRef.current = window.setTimeout(() => {
                setshowEventIcon(false);
            }, 700);
        }
    };

    const seekBackForward = () => {
        if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();
            playerRef.current.seekTo(currentTime - 10);
            seticonType('backward');
            setshowEventIcon(true);
            if (optionIconsTimeoutRef.current) {
                clearTimeout(optionIconsTimeoutRef.current);
            }
            optionIconsTimeoutRef.current = window.setTimeout(() => {
                setshowEventIcon(false);
            }, 700);
        }
    };

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

    // KEY EVENTS
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

    // CONTROL FUNCTIONS
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setVolume(value);

        if (value === 0) {
            setisMuted(true);
        } else {
            setisMuted(false);
        }

        if (volumeBarRef.current) {
            volumeBarRef.current.style.setProperty('--range-valueV', String((value / 1) + 0.005));
        }

        if (playerRef.current) {
            playerRef.current.getInternalPlayer().volume = value;
        }
    };

    const handleProgress = (state: { played: number; playedSeconds: number; loadedSeconds: number; loaded: number }) => {
        setCurrentTime(state.playedSeconds);

        if (playerRef.current) {
            setDuration(playerRef.current.getDuration());
        }

        if (progressBarRef.current) {
            progressBarRef.current.style.setProperty('--range-value', String(state.played + 0.00001));
            progressBarRef.current.style.setProperty('--loaded-value', String(state.loaded + 0.00001)); // Actualiza el estilo del progreso de carga
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

    // MOUSE EVENTS
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

    const handleMouseMoveSeek = (e: React.MouseEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const { left, width } = target.getBoundingClientRect();
        const { clientX } = e;
        const position = clientX - left;
        const value = Math.round((position / width) * parseInt(target.max));

        settimeMouseMomentHover(value);
        if (tooltipRef.current) {
            tooltipRef.current.style.setProperty('--position-tooltip', String(`${position - 8}px`))
        }
        setTooltipPosition(position);
        setTooltipVisible(true);
    };

    const handleMouseLeaveSeek = () => {
        setTooltipVisible(false);
    };

    // VOLUME FUNCTION
    const mutedVideo = () => {
        if (volume === 0) {
            setVolume(volumeDefaultValue);
            setisMuted(false);
            if (volumeBarRef.current) {
                volumeBarRef.current.style.setProperty('--range-valueV', String((volumeDefaultValue / 1) + 0.005));
            }
        } else {
            setVolume(0);
            setisMuted(true);
            if (volumeBarRef.current) {
                volumeBarRef.current.style.setProperty('--range-valueV', String((0 / 1) + 0.005));
            }
        }
    };

    const validateMutedVideo = () => {
        if (volume === 0) {
            setisMuted(true);
        } else {
            setisMuted(false);
        }
    };

    const showIconOption = (icon: IconsVideo = 'pause') => {
        const defaultSize: number = 20;
        const options = {
            'pause': <FaPause size={defaultSize} />,
            'play': <FaPlay size={defaultSize} />,
            'forward': <MdForward10 size={defaultSize} />,
            'backward': <MdReplay10 size={defaultSize} />
        };

        return (
            <div className={`absolute bottom-0 left-0 flex items-center justify-center w-full h-full pointer-events-none ${showEventIcon ? 'opacity-100' : 'opacity-0'} duration-300`}>
                <div className='absolute w-16 h-16 rounded-full bg-gray-200/30'></div>
                <span>{options[icon]}</span>
            </div>
        );
    };

    // USE EFFECT
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        if (volumeBarRef.current) {
            volumeBarRef.current.style.setProperty('--range-valueV', String((volumeDefaultValue / 1) + 0.005));
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);

            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }

            if (optionIconsTimeoutRef.current) {
                clearTimeout(optionIconsTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className='player-wrapper' onMouseMove={handleMouseMove}>
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
                                {isMuted ? <IoMdVolumeOff size={20} /> : <IoVolumeHighSharp size={20} />}
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
                        <span className='cursor-pointer'>
                            <BiExpand size={20} onClick={toggleFullScreen} />
                        </span>
                    </section>
                </div>

                <div className='relative flex items-center w-full pr-4'>
                    <input
                        type='range'
                        min={0}
                        max={duration}
                        value={currentTime}
                        onChange={handleSeekChange}
                        className='w-full mr-2 seek-slider'
                        ref={progressBarRef}
                        onMouseMove={handleMouseMoveSeek}
                        onMouseLeave={handleMouseLeaveSeek}

                    />

                    {tooltipVisible && (
                        <div
                            className='seek-slider-tooltip'
                            ref={tooltipRef}
                        >
                            {formatTime(timeMouseMomentHover)}
                        </div>
                    )}

                    <div className='hidden text-sm w-fit xl:flex gap-x-1 time'>
                        <span>{formatTime(currentTime)} </span> / <span> {formatTime(duration)}</span>
                    </div>
                </div>
            </div>

            {showIconOption(iconType)}
        </div>
    );
};