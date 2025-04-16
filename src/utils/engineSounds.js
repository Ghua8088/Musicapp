// Engine sound effects
const engineSounds = {
  idle: new Audio('/assets/sounds/car-start-and-driving-away-2-31339.mp3'),
  rev: new Audio('/assets/sounds/lamborghini-urus-racing-sound-effect-163336.mp3'),
  accelerate: new Audio('/assets/sounds/car-engine-start-outside-72279.mp3'),
  decelerate: new Audio('/assets/sounds/car-start-and-driving-away-2-31339.mp3')
};

// Configure audio settings
Object.values(engineSounds).forEach(sound => {
  sound.loop = false;
  sound.volume = 0.4;
});

// Engine sound controller
export const engineSound = {
  playIdle: () => {
    engineSounds.idle.loop = true;
    engineSounds.idle.play().catch(err => console.log('Audio playback failed:', err));
  },
  
  playRev: () => {
    engineSounds.rev.play().catch(err => console.log('Audio playback failed:', err));
  },
  
  playAccelerate: () => {
    engineSounds.accelerate.play().catch(err => console.log('Audio playback failed:', err));
  },
  
  playDecelerate: () => {
    engineSounds.decelerate.play().catch(err => console.log('Audio playback failed:', err));
  },
  
  stopAll: () => {
    Object.values(engineSounds).forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  }
};

// Interactive car controller
export class CarController {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.speed = 0;
    this.maxSpeed = 100;
    this.acceleration = 0.5;
    this.deceleration = 0.3;
    this.turning = 0;
  }

  accelerate() {
    if (this.speed < this.maxSpeed) {
      this.speed += this.acceleration;
      engineSound.playAccelerate();
    }
  }

  brake() {
    if (this.speed > 0) {
      this.speed -= this.deceleration;
      engineSound.playDecelerate();
    }
  }

  turn(direction) {
    // -1 for left, 1 for right
    this.turning = direction;
  }

  update() {
    // Update car position based on speed and turning
    this.position.x += this.speed * this.turning * 0.1;
    return {
      position: this.position,
      speed: this.speed,
      turning: this.turning
    };
  }
}