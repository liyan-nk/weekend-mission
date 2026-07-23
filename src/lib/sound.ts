// Web Audio API Sound Synthesizer for Weekend Mission
// Synthesizes clean, high-end minimal sounds with zero network asset downloads.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;

  constructor() {
    // Load setting from localStorage, default to false (muted by default)
    const saved = localStorage.getItem('wm_sound_enabled');
    this.isEnabled = saved === 'true';
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleSound(enabled: boolean) {
    this.isEnabled = enabled;
    localStorage.setItem('wm_sound_enabled', String(enabled));
    if (enabled) {
      this.initContext();
      this.playClick();
    }
  }

  public getSoundEnabled(): boolean {
    return this.isEnabled;
  }

  // 1. Click Sound: A brief subtle digital tick
  public playClick() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      console.warn('Failed to play click sound:', e);
    }
  }

  // 2. Reveal Sound: A soft, warm ambient chime
  public playReveal() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const playTone = (freq: number, delay: number, dur: number, vol: number) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

        gain.gain.setValueAtTime(0, this.ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + delay + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + dur);

        osc.start(this.ctx.currentTime + delay);
        osc.stop(this.ctx.currentTime + delay + dur);
      };

      // Play soft high-pitched major third interval
      playTone(523.25, 0, 0.4, 0.06);     // C5
      playTone(659.25, 0.08, 0.45, 0.05);  // E5
    } catch (e) {
      console.warn('Failed to play reveal sound:', e);
    }
  }

  // 3. Completion Sound: An elegant, warm major chord arpeggio
  public playComplete() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const playTone = (freq: number, delay: number, dur: number, vol: number) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'triangle'; // Warmer, softer tone
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

        gain.gain.setValueAtTime(0, this.ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + delay + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + dur);

        osc.start(this.ctx.currentTime + delay);
        osc.stop(this.ctx.currentTime + delay + dur);
      };

      // Play warm ascending arpeggio chord (C major)
      playTone(261.63, 0, 0.6, 0.06);     // C4
      playTone(329.63, 0.1, 0.6, 0.05);    // E4
      playTone(392.00, 0.2, 0.7, 0.05);    // G4
      playTone(523.25, 0.3, 0.8, 0.04);    // C5
    } catch (e) {
      console.warn('Failed to play complete sound:', e);
    }
  }
}

export const sound = new SoundEngine();
