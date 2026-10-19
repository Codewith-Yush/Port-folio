/**
 * Generative Lo-Fi Ambient Synthesizer powered by native Web Audio API.
 * - 0 KB download, 0 external audio files
 * - Generates evolving warm analog chords & subtle vinyl warmth in real time
 * - Master gain smoothing & auto-fade on visibility change
 */

type ActiveVoice = {
  osc: OscillatorNode;
  gain: GainNode;
};

class AmbientSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private activeVoices: ActiveVoice[] = [];
  private chordTimer: number | null = null;
  private chordIndex = 0;
  private isPlaying = false;

  // Evolving warm Lo-Fi / Synthwave Chord Progressions (in Hz)
  private chords: number[][] = [
    [146.83, 220.0, 261.63, 329.63], // Dm9
    [116.54, 174.61, 220.0, 293.66], // Bbmaj7
    [98.0, 146.83, 174.61, 220.0], // Gm9
    [110.0, 164.81, 196.0, 246.94], // Am7 / Cadd9
  ];

  private initContext(): boolean {
    if (typeof window === "undefined") return false;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();
    }
    return true;
  }

  // Generates 3 seconds of warm pink noise crackle looped seamlessly
  private createVinylNoise(): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0,
      b1 = 0,
      b2 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      data[i] = (b0 + b1 + b2) * 0.05;
    }
    return buffer;
  }

  private playChord(frequencies: number[]): void {
    if (!this.ctx || !this.filter || !this.isPlaying) return;

    const now = this.ctx.currentTime;
    const duration = 4.6;
    const fadeTime = 1.4;

    // Fade out previous voices
    this.activeVoices.forEach(({ osc, gain }) => {
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0.0001, now + fadeTime);
        osc.stop(now + fadeTime + 0.1);
      } catch {
        // Voice might already be stopped
      }
    });
    this.activeVoices = [];

    // Spawn new chord voices with micro-detuning for analog warmth
    frequencies.forEach((freq, idx) => {
      if (!this.ctx || !this.filter) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Alternate triangle & sine for rich acoustic body
      osc.type = idx % 2 === 0 ? "triangle" : "sine";
      const detune = (Math.random() - 0.5) * 6; // +/- 3 cents
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(detune, now);

      // Smooth attack and release envelope - beautifully audible
      const targetGain = 0.55 / frequencies.length;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(targetGain, now + fadeTime);
      gain.gain.setValueAtTime(targetGain, now + duration - fadeTime);
      gain.gain.linearRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.filter);

      osc.start(now);
      osc.stop(now + duration + 0.1);

      this.activeVoices.push({ osc, gain });
    });
  }

  public async start(): Promise<boolean> {
    if (this.isPlaying) return true;
    if (!this.initContext() || !this.ctx) return false;

    if (this.ctx.state === "suspended") {
      try {
        await this.ctx.resume();
      } catch {
        // ignore
      }
    }

    this.isPlaying = true;
    const now = this.ctx.currentTime;

    // Master Gain (warm, comfortable listening volume ~0.32)
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0001, now);
    this.masterGain.gain.linearRampToValueAtTime(0.32, now + 1.2);
    this.masterGain.connect(this.ctx.destination);

    // Warm Lowpass Filter (vintage tape warmth)
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.setValueAtTime(800, now);
    this.filter.Q.setValueAtTime(2.0, now);
    this.filter.connect(this.masterGain);

    // Gentle LFO modulating filter cutoff frequency
    this.lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    this.lfo.frequency.setValueAtTime(0.15, now); // 0.15Hz slow cycle
    lfoGain.gain.setValueAtTime(250, now); // Sweeps +/- 250Hz (550Hz - 1050Hz)
    this.lfo.connect(lfoGain);
    lfoGain.connect(this.filter.frequency);
    this.lfo.start(now);

    // Vinyl Noise Layer
    const noiseBuffer = this.createVinylNoise();
    if (noiseBuffer) {
      this.noiseSource = this.ctx.createBufferSource();
      this.noiseSource.buffer = noiseBuffer;
      this.noiseSource.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(1400, now);
      noiseFilter.Q.setValueAtTime(1.5, now);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0.0001, now);
      this.noiseGain.gain.linearRampToValueAtTime(0.035, now + 1.5);

      this.noiseSource.connect(noiseFilter);
      noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);
      this.noiseSource.start(now);
    }

    // Play initial chord and start cycle
    this.chordIndex = 0;
    this.playChord(this.chords[this.chordIndex]);

    this.chordTimer = window.setInterval(() => {
      if (!this.isPlaying) return;
      this.chordIndex = (this.chordIndex + 1) % this.chords.length;
      this.playChord(this.chords[this.chordIndex]);
    }, 4500);

    return true;
  }

  public stop(): void {
    if (!this.isPlaying || !this.ctx) return;
    this.isPlaying = false;

    if (this.chordTimer) {
      clearInterval(this.chordTimer);
      this.chordTimer = null;
    }

    const now = this.ctx.currentTime;
    if (this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.6);
    }

    setTimeout(() => {
      this.activeVoices.forEach(({ osc }) => {
        try {
          osc.stop();
        } catch {
          // ignore
        }
      });
      this.activeVoices = [];

      try {
        this.lfo?.stop();
        this.noiseSource?.stop();
      } catch {
        // ignore
      }
      this.lfo = null;
      this.noiseSource = null;
      this.noiseGain = null;
      this.filter = null;
      this.masterGain = null;
    }, 700);
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const ambientSynth = new AmbientSynthesizer();
