const SOUNDS = {
    bgm: '/bg-music.mp3',
    win: '/win.mp3',
};

let bgmAudio = null;
let isMuted = false;
export const soundManager = {
    playEffects(type) {
        if (!SOUNDS[type]) return;

        const sfx = new Audio(SOUNDS[type]);
        sfx.volume = 0.4;
        sfx.play().catch((err) =>
            console.log('Audio play blocked by browser:', err)
        );
    },

    playBGM() {
        if (bgmAudio) return;

        bgmAudio = new Audio(SOUNDS.bgm);
        bgmAudio.volume = 0.2;
        bgmAudio.loop = true;
        if (isMuted) return;

        bgmAudio.play().catch((err) => {
            console.log('BGM autoplay waiting for user interaction...');
            document.addEventListener(
                'click',
                () => {
                    if (!isMuted && bgmAudio) bgmAudio.play();
                },
                {
                    once: true,
                }
            );
        });
    },

    toggleBGM() {
        if (!bgmAudio) return isMuted;
        if (bgmAudio.paused) {
            bgmAudio.play().catch((err) => console.log(err));
            isMuted = false;
        } else {
            bgmAudio.pause();
            isMuted = true;
        }

        return isMuted;
    },

    stopBGM() {
        if (bgmAudio) {
            bgmAudio.pause();
            bgmAudio.currentTime = 0;
            bgmAudio = null;
        }
    },
};
