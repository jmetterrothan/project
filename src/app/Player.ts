import { PROGRESSION_COMMON_STORAGE_KEYS } from './Achievements/constants/progressionCommonStorageKeys.constants';
import * as THREE from 'three';

import 'three/examples/js/controls/PointerLockControls';

import Chunk from '@world/Chunk';
import Terrain from '@world/Terrain';
import VoiceModel from '@voice/VoiceModel';
import Voice from '@voice/Voice';

import PlayerService, { playerSvc } from '@shared/services/player.service';
import MonitoringService, { monitoringSvc } from '@shared/services/monitoring.service';
import ProgressionService, { progressionSvc } from '@services/progression.service';

class Player {
  private controls: THREE.PointerLockControls;
  private moveForward: boolean;
  private moveBackward: boolean;
  private moveLeft: boolean;
  private moveRight: boolean;
  private moveUp: boolean;
  private moveDown: boolean;

  private speed: THREE.Vector3;
  private velocity: THREE.Vector3;

  private world: World;
  private voiceModel: Model;

  private progressionSvc: ProgressionService;
  private monitoringSvc: MonitoringService;
  private playerSvc: PlayerService;

  /**
   * Player constructor
   * @param {THREE.PointerLockControls} controls
   */
  constructor(controls: THREE.PointerLockControls) {
    this.controls = controls;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;

    this.speed = new THREE.Vector3(40000, 40000, 40000);
    this.velocity = new THREE.Vector3(0, 0, 0);

    this.progressionSvc = progressionSvc;
    this.monitoringSvc = monitoringSvc;
    this.playerSvc = playerSvc;
  }

  /**
   * Player init
   * @param {THREE.Vector3} spawn Spawn location
   * @param {THREE.Vector3} target Target used to calculate player orientation
   */
  async init(spawn: THREE.Vector3, target: THREE.Vector3 = new THREE.Vector3()) {
    const angle = -Math.cos(target.dot(spawn) / (target.length() * spawn.length()));

    this.controls.getObject().rotateY(-Math.PI / 4);
    this.controls.getObject().children[0].rotateX(angle);
    this.position = spawn;

    this.playerSvc.setPosition(spawn);

    await this.initVoice();
  }

  private async initVoice() {
    this.voiceModel = new VoiceModel();
    await this.voiceModel.train();

    this.voice = new Voice(this.voiceModel);
    // this.voice.listen();
  }

  /**
   * @param {number} delta
   */
  move(delta: number): THREE.Vector3 {
    // movement
    if (this.moveForward) {
      this.velocity.z = -this.speed.z;
    } else {
      if (this.velocity.z < 0) { this.velocity.z = 0; }
    }

    if (this.moveBackward) {
      this.velocity.z = this.speed.z;
    } else {
      if (this.velocity.z > 0) { this.velocity.z = 0; }
    }

    if (this.moveRight) {
      this.velocity.x = this.speed.x;
    } else {
      if (this.velocity.x > 0) { this.velocity.x = 0; }
    }

    if (this.moveLeft) {
      this.velocity.x = -this.speed.x;
    } else {
      if (this.velocity.x < 0) { this.velocity.x = 0; }
    }

    if (this.moveDown) {
      this.velocity.y = this.speed.y;
    } else {
      if (this.velocity.y > 0) { this.velocity.y = 0; }
    }

    if (this.moveUp) {
      this.velocity.y = -this.speed.y;
    } else {
      if (this.velocity.y < 0) { this.velocity.y = 0; }
    }

    this.translateX(this.velocity.x * delta);
    this.translateY(this.velocity.y * delta);
    this.translateZ(this.velocity.z * delta);

    return this.position;
  }

  /**
   * Update player movements
   * @param {Terrain} terrain
   * @param {number} delta
   */
  update(terrain: Terrain, delta: number) {
    const position = this.move(delta);
    this.playerSvc.setPosition(position);

    const yMin = terrain.getHeightAt(position.x, position.z) + 5000;
    const isWithinWorldBorders = this.isWithinWorldBorders();

    if (isWithinWorldBorders && position.y < yMin) {
      // collision with min ground dist
      this.positionY = yMin;
    }

    // update underwater service
    if (!this.playerSvc.isUnderwater() && position.y <= Chunk.SEA_LEVEL && isWithinWorldBorders) {
      this.progressionSvc.increment(PROGRESSION_COMMON_STORAGE_KEYS.going_underwater);
      this.monitoringSvc.sendEvent(this.monitoringSvc.categories.biome, this.monitoringSvc.actions.visited, PROGRESSION_COMMON_STORAGE_KEYS.going_underwater);
    }

    if (this.playerSvc.isUnderwater() && (position.y > Chunk.SEA_LEVEL || !isWithinWorldBorders)) {
      this.playerSvc.setUnderwater(false);
    }
  }

  /**
   * Handle keyboard input
   * @param {string} key
   * @param {boolean} active
   */
  handleKeyboard(key: string, active: boolean) {
    switch (key) {
      case 'ArrowUp': case 'z': this.moveForward = active; break;
      case 'ArrowDown': case 's': this.moveBackward = active; break;
      case 'ArrowLeft': case 'q': this.moveLeft = active; break ;
      case 'ArrowRight': case 'd': this.moveRight = active; break;
      case '+': case 'a': this.moveUp = active; break;
      case '-': case 'e': this.moveDown = active; break;
      case 'v': !this.voice.predictState ? this.voice.listen() : this.voice.stopListening();
    }
  }

  isWithinWorldBorders(): boolean {
    const position = this.position;
    return !(position.x < 0 || position.x > Terrain.SIZE_X || position.z < 0 || position.z > Terrain.SIZE_Z || position.y < -Terrain.SIZE_Y / 2);
  }

  get position(): THREE.Vector3 {
    return this.controls.getObject().position;
  }

  set position(v: THREE.Vector3) {
    this.controls.getObject().position.x = v.x;
    this.controls.getObject().position.y = v.y;
    this.controls.getObject().position.z = v.z;
  }

  set positionX(x) {
    this.controls.getObject().position.x = x;
  }

  set positionY(y) {
    this.controls.getObject().position.y = y;
  }

  set positionZ(z) {
    this.controls.getObject().position.z = z;
  }

  translateX(tx) {
    this.controls.getObject().translateX(tx);
  }
  translateY(ty) {
    this.controls.getObject().translateY(ty);
  }
  translateZ(tz) {
    this.controls.getObject().translateZ(tz);
  }
}

export default Player;
